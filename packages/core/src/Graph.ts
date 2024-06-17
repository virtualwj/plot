import {Edge, GraphOptions, Node} from "../index";
import {CanvasDrawer} from "./canvas";
import {SVGDrawer} from "./svg";

const squareSize = 100;
const circleRadius = 50;
const anchorSize = 5;
const controlPointSize = 10;


let isDrawingLine = false;
let currentAnchor: any = null;
let offsetX, offsetY, dragIndex, resizeIndex;
let selectedShapeIndex = null;
let isDraggingShape = false;

let canvas = null;
let context = null;
let toolbar = null;

/**
 * Graph 类
 */
export class Graph {
  nodes: Array<Node>
  edges: Array<Edge>
  drawerEngine: CanvasDrawer | SVGDrawer
  options: GraphOptions
  toolbar: HTMLDivElement

  constructor(public element: HTMLCanvasElement | SVGSVGElement, public options: GraphOptions) {
    this.nodes = [];
    this.edges = [];
    this.options = Object.assign({
      engine: "canvas"
    }, options)

    this.toolbar = options.toolbar;
    if (this.options.engine === 'svg') {
      this.drawerEngine = new SVGDrawer(element as SVGSVGElement);
      this.element.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
          return; // Skip right-click for drag functionality
        }
        const mousePos = this.getMousePos(e);
        let anchorSelected = false;

        this.nodes.forEach((node, shapeIndex) => {
          node.anchors.forEach((anchor, anchorIndex) => {
            if (mousePos.x > anchor.x - anchorSize && mousePos.x < anchor.x + anchorSize &&
              mousePos.y > anchor.y - anchorSize && mousePos.y < anchor.y + anchorSize) {
              isDrawingLine = true;
              currentAnchor = {shapeIndex, anchorIndex, x: anchor.x, y: anchor.y};
              anchorSelected = true;
            }
          });

          if (!anchorSelected) {
            if (node.type === 'square') {
              if (mousePos.x > node.x && mousePos.x < node.x + node.size &&
                mousePos.y > node.y && mousePos.y < node.y + node.size) {
                selectedShapeIndex = shapeIndex;
                node.dragging = true;
                isDraggingShape = true;
                offsetX = mousePos.x - node.x;
                offsetY = mousePos.y - node.y;
              }
            } else if (node.type === 'circle') {
              if (Math.sqrt((mousePos.x - node.x) ** 2 + (mousePos.y - node.y) ** 2) < node.radius) {
                selectedShapeIndex = shapeIndex;
                node.dragging = true;
                isDraggingShape = true;
                offsetX = mousePos.x - node.x;
                offsetY = mousePos.y - node.y;
              }
            }
          }
        });

        if (!anchorSelected && !isDraggingShape) {
          this.hideToolbar();
        }
      });
      this.element.addEventListener('mousemove', (e) => {
        const mousePos = this.getMousePos(e);

        if (isDraggingShape && selectedShapeIndex !== null) {
          const shape = this.nodes[selectedShapeIndex];
          shape.x = mousePos.x - offsetX;
          shape.y = mousePos.y - offsetY;

          // Update line positions based on the new anchor positions
          this.edges.forEach(line => {
            const startShape = this.nodes[line.start.shapeIndex];
            const endShape =  this.nodes[line.end.shapeIndex];
            line.start.x = startShape.anchors[line.start.anchorIndex].x;
            line.start.y = startShape.anchors[line.start.anchorIndex].y;
            line.end.x = endShape.anchors[line.end.anchorIndex].x;
            line.end.y = endShape.anchors[line.end.anchorIndex].y;
          });

          this.draw(e);
        }
        console.log(isDrawingLine, currentAnchor)
        if (isDrawingLine && currentAnchor) {
          this.draw(e);
        }

      });
      this.element.addEventListener('mouseup', (e) => {
        if (isDraggingShape) {
          isDraggingShape = false;
          this.nodes[selectedShapeIndex].dragging = false;
        } else if (isDrawingLine && currentAnchor) {
          const mousePos = this.getMousePos(e);

          let anchorFound = false;
          this.nodes.forEach((shape, shapeIndex) => {
            shape.anchors.forEach((anchor, anchorIndex) => {
              if (mousePos.x > anchor.x - anchorSize && mousePos.x < anchor.x + anchorSize &&
                mousePos.y > anchor.y - anchorSize && mousePos.y < anchor.y + anchorSize) {
                this.edges.push({
                  start: {
                    shapeIndex: currentAnchor.shapeIndex,
                    anchorIndex: currentAnchor.anchorIndex,
                    x: currentAnchor.x,
                    y: currentAnchor.y
                  },
                  end: {shapeIndex, anchorIndex, x: anchor.x, y: anchor.y}
                });
                anchorFound = true;
              }
            });
          });

          if (!anchorFound) {
            // If no anchor found, draw line to current mouse position
            this.edges.push({
              start: {
                shapeIndex: currentAnchor.shapeIndex,
                anchorIndex: currentAnchor.anchorIndex,
                x: currentAnchor.x,
                y: currentAnchor.y
              },
              end: {x: mousePos.x, y: mousePos.y}
            });
          }
          isDrawingLine = false;
          currentAnchor = null;
          this.draw(e);
        }
      });

    } else {
      this.element = element as HTMLCanvasElement;
      const context = this.element.getContext('2d') as CanvasRenderingContext2D;
      this.drawerEngine = new CanvasDrawer(element as HTMLCanvasElement, context);
      const canvas = element;
      canvas.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
          return; // Skip right-click for drag functionality
        }
        const mousePos = this.getMousePos(e);
        let anchorSelected = false;

        this.nodes.forEach((node, shapeIndex) => {
          node.anchors.forEach((anchor, anchorIndex) => {
            if (mousePos.x > anchor.x - anchorSize && mousePos.x < anchor.x + anchorSize &&
              mousePos.y > anchor.y - anchorSize && mousePos.y < anchor.y + anchorSize) {
              isDrawingLine = true;
              currentAnchor = {shapeIndex, anchorIndex, x: anchor.x, y: anchor.y};
              anchorSelected = true;
            }
          });

          if (!anchorSelected) {
            if (node.type === 'square') {
              if (mousePos.x > node.x && mousePos.x < node.x + node.size &&
                mousePos.y > node.y && mousePos.y < node.y + node.size) {
                selectedShapeIndex = shapeIndex;
                node.dragging = true;
                isDraggingShape = true;
                offsetX = mousePos.x - node.x;
                offsetY = mousePos.y - node.y;
              }
            } else if (node.type === 'circle') {
              if (Math.sqrt((mousePos.x - node.x) ** 2 + (mousePos.y - node.y) ** 2) < node.radius) {
                selectedShapeIndex = shapeIndex;
                node.dragging = true;
                isDraggingShape = true;
                offsetX = mousePos.x - node.x;
                offsetY = mousePos.y - node.y;
              }
            }
          }
        });

        if (!anchorSelected && !isDraggingShape) {
          this.hideToolbar();
        }
      });
      canvas.addEventListener('mousemove', (e) => {
        const mousePos = this.getMousePos(e);

        if (isDraggingShape && selectedShapeIndex !== null) {
          const shape = this.nodes[selectedShapeIndex];
          shape.x = mousePos.x - offsetX;
          shape.y = mousePos.y - offsetY;

          // Update line positions based on the new anchor positions
          this.edges.forEach(edge => {
            const startShape = this.nodes[edge.start.shapeIndex];
            const endShape = this.nodes[edge.end.shapeIndex];
            edge.start.x = startShape.anchors[edge.start.anchorIndex].x;
            edge.start.y = startShape.anchors[edge.start.anchorIndex].y;
            edge.end.x = endShape.anchors[edge.end.anchorIndex].x;
            edge.end.y = endShape.anchors[edge.end.anchorIndex].y;
          });
          this.draw(e);
        }

        if (this.nodes[resizeIndex]?.resizing) {
          const shape = this.nodes[resizeIndex];
          if (shape.type === 'square') {
            shape.size = mousePos.x - shape.x - offsetX;
          } else if (shape.type === 'circle') {
            shape.radius = mousePos.x - shape.x - offsetX;
          }

          // Update line positions based on the new anchor positions
          this.edges.forEach(edge => {
            const startShape = this.nodes[edge.start.shapeIndex];
            const endShape = this.nodes[edge.end.shapeIndex];
            edge.start.x = startShape.anchors[edge.start.anchorIndex].x;
            edge.start.y = startShape.anchors[edge.start.anchorIndex].y;
            edge.end.x = endShape.anchors[edge.end.anchorIndex].x;
            edge.end.y = endShape.anchors[edge.end.anchorIndex].y;
          });
          this.draw(e);
        }

        if (isDrawingLine && currentAnchor) {
          this.draw(e);
        }
      });
      canvas.addEventListener('mouseup', (e) => {
        if (isDrawingLine && currentAnchor) {
          const mousePos = this.getMousePos(e);
          this.nodes.forEach((node, shapeIndex) => {
            node.anchors.forEach((anchor, anchorIndex) => {
              if (mousePos.x > anchor.x - anchorSize && mousePos.x < anchor.x + anchorSize &&
                mousePos.y > anchor.y - anchorSize && mousePos.y < anchor.y + anchorSize &&
                (shapeIndex !== currentAnchor.shapeIndex || anchorIndex !== currentAnchor.anchorIndex)) {
                this.edges.push({
                  start: currentAnchor,
                  end: {shapeIndex, anchorIndex, x: anchor.x, y: anchor.y}
                });
              }
            });
          });
        }

        this.nodes.forEach(shape => {
          shape.dragging = false;
          shape.resizing = false;
        });

        isDrawingLine = false;
        currentAnchor = null;
        dragIndex = undefined;
        resizeIndex = undefined;
        isDraggingShape = false;
        this.draw(e);
      });
      canvas.addEventListener('mouseleave', (e) => {
        this.nodes.forEach(node => {
          node.dragging = false;
          node.resizing = false;
        });

        isDrawingLine = false;
        currentAnchor = null;
        dragIndex = undefined;
        resizeIndex = undefined;
        isDraggingShape = false;
        this.draw(e);
      });
      canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Prevent the context menu from appearing

        const mousePos = this.getMousePos(e);

        this.nodes.forEach((node, shapeIndex) => {
          if (node.type === 'square') {
            if (mousePos.x > node.x && mousePos.x < node.x + node.size &&
              mousePos.y > node.y && mousePos.y < node.y + node.size) {
              selectedShapeIndex = shapeIndex;
              this.showToolbar(e);
            }
          } else if (node.type === 'circle') {
            if (Math.sqrt((mousePos.x - node.x) ** 2 + (mousePos.y - node.y) ** 2) < node.radius) {
              selectedShapeIndex = shapeIndex;
              this.showToolbar(e);
            }
          }
        });
      });
    }
    this.draw();


  }

  /**
   * 添加一个节点
   * @param {Node} node
   */
  addNode(node: Node) {
    this.nodes.push(node);
    this.draw();
  }

  deleteNode() {
    if (selectedShapeIndex !== null) {
      this.nodes.splice(selectedShapeIndex, 1);
      this.edges = this.edges.filter(edge => edge.start.shapeIndex !== selectedShapeIndex && edge.end.shapeIndex !== selectedShapeIndex);
      this.hideToolbar();
      selectedShapeIndex = null;
      this.draw();
    }
  }

  /**
   * 添加一条边
   * @param {Edge} edge
   */
  addEdge(edge: Edge) {
    this.edges.push(edge);
  }

  /**
   * 获取所有节点
   * @returns {Node[]}
   */
  getNodes() {
    return this.nodes;
  }

  /**
   * 获取所有边
   * @returns {Edge[]}
   */
  getEdges() {
    return this.edges;
  }

  showToolbar(e: any) {
    const mousePos = this.getMousePos(e);
    this.toolbar.style.display = 'block';
    this.toolbar.style.left = `${mousePos.x + 10}px`;
    this.toolbar.style.top = `${mousePos.y + 10}px`;
  }

  hideToolbar() {
    this.toolbar.style.display = 'none';
  }


  getMousePos(e: any) {
    const rect = this.element.getBoundingClientRect();
    let width, height;
    if (this.options.engine === 'svg') {
      width = this.element.width.baseVal.value;
      height = this.element.height.baseVal.value;
    } else {
      width = this.element.width;
      height = this.element.height;
    }
    return {
      x: (e.clientX - rect.left) / (rect.right - rect.left) * width,
      y: (e.clientY - rect.top) / (rect.bottom - rect.top) * height
    };
  }

  getAnchors(node: Node) {
    if (node.type === 'square') {
      const {x, y, size} = node;
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
    } else if (node.type === 'circle') {
      const {x, y, radius} = node;
      return [
        {x: x - radius, y: y}, // Left
        {x: x + radius, y: y}, // Right
        {x: x, y: y - radius}, // Top
        {x: x, y: y + radius}, // Bottom
      ];
    }
  }

  draw(e?: any) {
    if (this.options.engine === 'svg') {
      this.drawSvg(e);
    } else {
      this.drawCanvas(e)
    }
  }

  drawSvg(e?: any) {
    this.element.innerHTML = ''; // Clear previous SVG content

    // Update anchors and control points for each shape
    this.nodes.forEach(shape => {
      shape.anchors = this.getAnchors(shape);
    });

    // Draw shapes
    this.nodes.forEach(shape => {
      if (shape.type === 'square') {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', shape.x);
        rect.setAttribute('y', shape.y);
        rect.setAttribute('width', shape.size);
        rect.setAttribute('height', shape.size);
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke', 'black');
        this.element.appendChild(rect);
      } else if (shape.type === 'circle') {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', shape.x);
        circle.setAttribute('cy', shape.y);
        circle.setAttribute('r', shape.radius);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'black');
        this.element.appendChild(circle);
      }
    });

    // Draw anchors
    this.nodes.forEach(shape => {
      shape.anchors.forEach(anchor => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', anchor.x);
        circle.setAttribute('cy', anchor.y);
        circle.setAttribute('r', anchorSize);
        circle.setAttribute('fill', 'blue');
        this.element.appendChild(circle);
      });
    });


    // Draw lines
    this.edges.forEach(line => {
      const lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      lineElement.setAttribute('x1', line.start.x);
      lineElement.setAttribute('y1', line.start.y);
      lineElement.setAttribute('x2', line.end.x);
      lineElement.setAttribute('y2', line.end.y);
      lineElement.setAttribute('stroke', 'black');
      this.element.appendChild(lineElement);
    });

    // Draw the line being drawn
    if (isDrawingLine && currentAnchor && e) {
      const mousePos = this.getMousePos(e);
      this.drawerEngine.line(currentAnchor.x, currentAnchor.y, mousePos.x, mousePos.y);
    }
  }

  drawCanvas(e?: any) {
    this.drawerEngine = this.drawerEngine as CanvasDrawer;

    this.drawerEngine.ctx.clearRect(0, 0, this.drawerEngine.canvas.width, this.drawerEngine.canvas.height);

    this.nodes.forEach(node => {
      node.anchors = this.getAnchors(node) as Array<any>;
    });

    // Draw shapes
    this.nodes.forEach(node => {
      if (node.type === 'square') {
        this.drawerEngine.rectangle(node.x, node.y, node.size, node.size);
      } else if (node.type === 'circle') {
        this.drawerEngine.circle(node.x, node.y, node.radius);
      }
    });

    // Draw anchors
    this.nodes.forEach(node => {
      node.anchors.forEach(anchor => {
        this.drawerEngine.ctx.beginPath();
        this.drawerEngine.ctx.arc(anchor.x, anchor.y, anchorSize, 0, Math.PI * 2);
        this.drawerEngine.ctx.fillStyle = 'blue';
        this.drawerEngine.ctx.fill();
      });
    });

    // Draw lines
    this.edges.forEach(edge => {
      this.drawerEngine.line(edge.start.x, edge.start.y, edge.end.x, edge.end.y);
    });

    // Draw the line being drawn
    if (isDrawingLine && currentAnchor && e) {
      const mousePos = this.getMousePos(e);
      this.drawerEngine.line(currentAnchor.x, currentAnchor.y, mousePos.x, mousePos.y);
    }
  }

}
