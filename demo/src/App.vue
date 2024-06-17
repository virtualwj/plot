<template>
    <div id="menu">
        <button @click="addSquare">Add Square</button>
        <button @click="addCircle">Add Circle</button>
    </div>
    <div id="toolbar">
        <button @click="deleteShape">Delete</button>
    </div>
    <canvas id="canvas" width="800" height="600"></canvas>
</template>

<script setup>
import {onMounted} from 'vue'

function addSquare() {
    const newSquare = {
        type: 'square',
        x: 100,
        y: 100,
        size: squareSize,
        dragging: false,
        resizing: false,
        anchors: [],
        controlPoints: []
    };
    shapes.push(newSquare);
    draw();
}

function addCircle() {
    const newCircle = {
        type: 'circle',
        x: 300,
        y: 100,
        radius: circleRadius,
        dragging: false,
        resizing: false,
        anchors: [],
        controlPoints: []
    };
    shapes.push(newCircle);
    draw();
}

function deleteShape() {
    if (selectedShapeIndex !== null) {
        shapes.splice(selectedShapeIndex, 1);
        lines = lines.filter(line => line.start.shapeIndex !== selectedShapeIndex && line.end.shapeIndex !== selectedShapeIndex);
        hideToolbar();
        selectedShapeIndex = null;
        draw();
    }
}

const squareSize = 100;
const circleRadius = 50;
const anchorSize = 5;
const controlPointSize = 10;

const shapes = [];

let lines = [];
let isDrawingLine = false;
let currentAnchor = null;
let offsetX, offsetY, dragIndex, resizeIndex;
let selectedShapeIndex = null;
let isDraggingShape = false;

let canvas = null;
let context = null;
let roughCanvas = null;
let toolbar = null;

function draw(e) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Update anchors and control points for each shape
    shapes.forEach(shape => {
        shape.anchors = getAnchors(shape);
        shape.controlPoints = getControlPoints(shape);
    });

    // Draw shapes
    shapes.forEach(shape => {
        if (shape.type === 'square') {
            roughCanvas.rectangle(shape.x, shape.y, shape.size, shape.size);
        } else if (shape.type === 'circle') {
            roughCanvas.circle(shape.x, shape.y, shape.radius * 2);
        }
    });

    // Draw anchors
    shapes.forEach(shape => {
        shape.anchors.forEach(anchor => {
            context.beginPath();
            context.arc(anchor.x, anchor.y, anchorSize, 0, Math.PI * 2);
            context.fillStyle = 'blue';
            context.fill();
        });
    });

    // Draw control points
    shapes.forEach(shape => {
        shape.controlPoints.forEach(controlPoint => {
            context.beginPath();
            context.rect(controlPoint.x - controlPointSize / 2, controlPoint.y - controlPointSize / 2, controlPointSize, controlPointSize);
            context.fillStyle = 'red';
            context.fill();
        });
    });

    // Draw lines
    lines.forEach(line => {
        roughCanvas.line(line.start.x, line.start.y, line.end.x, line.end.y);
    });

    // Draw the line being drawn
    if (isDrawingLine && currentAnchor && e) {
        const mousePos = getMousePos(e);
        roughCanvas.line(currentAnchor.x, currentAnchor.y, mousePos.x, mousePos.y);
    }
}

function getAnchors(shape) {
    if (shape.type === 'square') {
        const {x, y, size} = shape;
        return [
            {x: x, y: y}, // Top-left
            {x: x + size / 2, y: y}, // Top-center
            {x: x + size, y: y}, // Top-right
            {x: x, y: y + size / 2}, // Middle-left
            {x: x + size, y: y + size / 2}, // Middle-right
            {x: x, y: y + size}, // Bottom-left
            {x: x + size / 2, y: y + size}, // Bottom-center
            {x: x + size, y: y + size} // Bottom-right
        ];
    } else if (shape.type === 'circle') {
        const {x, y, radius} = shape;
        return [
            {x: x - radius, y: y}, // Left
            {x: x + radius, y: y}, // Right
            {x: x, y: y - radius}, // Top
            {x: x, y: y + radius}, // Bottom
        ];
    }
}

function getControlPoints(shape) {
    if (shape.type === 'square') {
        const {x, y, size} = shape;
        return [
            {x: x + size, y: y + size} // Bottom-right
        ];
    } else if (shape.type === 'circle') {
        const {x, y, radius} = shape;
        return [
            {x: x + radius, y: y} // Right
        ];
    }
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function showToolbar(e) {
    const mousePos = getMousePos(e);
    toolbar.style.display = 'block';
    toolbar.style.left = `${mousePos.x + 10}px`;
    toolbar.style.top = `${mousePos.y + 10}px`;
}

function hideToolbar() {
    toolbar.style.display = 'none';
}
onMounted(() => {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
     roughCanvas = rough.canvas(canvas);
     toolbar = document.getElementById('toolbar');

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
            return; // Skip right-click for drag functionality
        }
        const mousePos = getMousePos(e);
        let anchorSelected = false;

        shapes.forEach((shape, shapeIndex) => {
            shape.anchors.forEach((anchor, anchorIndex) => {
                if (mousePos.x > anchor.x - anchorSize && mousePos.x < anchor.x + anchorSize &&
                    mousePos.y > anchor.y - anchorSize && mousePos.y < anchor.y + anchorSize) {
                    isDrawingLine = true;
                    currentAnchor = {shapeIndex, anchorIndex, x: anchor.x, y: anchor.y};
                    anchorSelected = true;
                }
            });

            if (!anchorSelected) {
                if (shape.type === 'square') {
                    if (mousePos.x > shape.x && mousePos.x < shape.x + shape.size &&
                        mousePos.y > shape.y && mousePos.y < shape.y + shape.size) {
                        selectedShapeIndex = shapeIndex;
                        shape.dragging = true;
                        isDraggingShape = true;
                        offsetX = mousePos.x - shape.x;
                        offsetY = mousePos.y - shape.y;
                    }
                } else if (shape.type === 'circle') {
                    if (Math.sqrt((mousePos.x - shape.x) ** 2 + (mousePos.y - shape.y) ** 2) < shape.radius) {
                        selectedShapeIndex = shapeIndex;
                        shape.dragging = true;
                        isDraggingShape = true;
                        offsetX = mousePos.x - shape.x;
                        offsetY = mousePos.y - shape.y;
                    }
                }
            }
        });

        if (!anchorSelected && !isDraggingShape) {
            hideToolbar();
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        const mousePos = getMousePos(e);

        if (isDraggingShape && selectedShapeIndex !== null) {
            const shape = shapes[selectedShapeIndex];
            shape.x = mousePos.x - offsetX;
            shape.y = mousePos.y - offsetY;

            // Update line positions based on the new anchor positions
            lines.forEach(line => {
                const startShape = shapes[line.start.shapeIndex];
                const endShape = shapes[line.end.shapeIndex];
                line.start.x = startShape.anchors[line.start.anchorIndex].x;
                line.start.y = startShape.anchors[line.start.anchorIndex].y;
                line.end.x = endShape.anchors[line.end.anchorIndex].x;
                line.end.y = endShape.anchors[line.end.anchorIndex].y;
            });

            draw(e);
        }

        if (shapes[resizeIndex]?.resizing) {
            const shape = shapes[resizeIndex];
            if (shape.type === 'square') {
                shape.size = mousePos.x - shape.x - offsetX;
            } else if (shape.type === 'circle') {
                shape.radius = mousePos.x - shape.x - offsetX;
            }

            // Update line positions based on the new anchor positions
            lines.forEach(line => {
                const startShape = shapes[line.start.shapeIndex];
                const endShape = shapes[line.end.shapeIndex];
                line.start.x = startShape.anchors[line.start.anchorIndex].x;
                line.start.y = startShape.anchors[line.start.anchorIndex].y;
                line.end.x = endShape.anchors[line.end.anchorIndex].x;
                line.end.y = endShape.anchors[line.end.anchorIndex].y;
            });

            draw(e);
        }

        if (isDrawingLine && currentAnchor) {
            draw(e);
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (isDrawingLine && currentAnchor) {
            const mousePos = getMousePos(e);
            shapes.forEach((shape, shapeIndex) => {
                shape.anchors.forEach((anchor, anchorIndex) => {
                    if (mousePos.x > anchor.x - anchorSize && mousePos.x < anchor.x + anchorSize &&
                        mousePos.y > anchor.y - anchorSize && mousePos.y < anchor.y + anchorSize &&
                        (shapeIndex !== currentAnchor.shapeIndex || anchorIndex !== currentAnchor.anchorIndex)) {
                        lines.push({
                            start: currentAnchor,
                            end: {shapeIndex, anchorIndex, x: anchor.x, y: anchor.y}
                        });
                    }
                });
            });
        }

        shapes.forEach(shape => {
            shape.dragging = false;
            shape.resizing = false;
        });

        isDrawingLine = false;
        currentAnchor = null;
        dragIndex = undefined;
        resizeIndex = undefined;
        isDraggingShape = false;
        draw();
    });

    canvas.addEventListener('mouseleave', () => {
        shapes.forEach(shape => {
            shape.dragging = false;
            shape.resizing = false;
        });

        isDrawingLine = false;
        currentAnchor = null;
        dragIndex = undefined;
        resizeIndex = undefined;
        isDraggingShape = false;
        draw();
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Prevent the context menu from appearing

        const mousePos = getMousePos(e);

        shapes.forEach((shape, shapeIndex) => {
            if (shape.type === 'square') {
                if (mousePos.x > shape.x && mousePos.x < shape.x + shape.size &&
                    mousePos.y > shape.y && mousePos.y < shape.y + shape.size) {
                    selectedShapeIndex = shapeIndex;
                    showToolbar(e);
                }
            } else if (shape.type === 'circle') {
                if (Math.sqrt((mousePos.x - shape.x) ** 2 + (mousePos.y - shape.y) ** 2) < shape.radius) {
                    selectedShapeIndex = shapeIndex;
                    showToolbar(e);
                }
            }
        });
    });



    draw();
})

</script>

