<template>
    <div id="menu">
        <button @click="addSquare">Add Square</button>
        <button @click="addCircle">Add Circle</button>
        <button @click="addPolygon">Add Polygon</button>
        <button @click="addPolygon">Add Star</button>

        <button @click="mode('drag')">Drag</button>
        <button @click="mode('painter')">Painter</button>
        <button @click="mode('text')">Text</button>
        <button @click="mode('pencil')">Pencil</button>

        <button @click="zoomIn">Zoom In</button>
        <button @click="zoomOut">Zoom Out</button>
        <button @click="resetZoom">Reset Zoom</button>
    </div>
    <div id="toolbar" ref="toolbar">
        <button @click="deleteShape">Delete</button>
    </div>
    <canvas id="canvas" width="800" height="600" ref="container"></canvas>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Stage, render, Rect, Circle, Polygon} from "@plot/core"
import {GuideLine} from "@plot/plugin-guide-line";

let stage: Stage

function addSquare() {
  stage.addNode(new Rect({
    x: 100,
    y: 100,
    w: 100,
    h: 100,
    zIndex: 10,
    drawOptions: {
      fill: "red"
    }
  }, stage))
}

function addCircle() {
  stage.addNode(new Circle({
    x: 300,
    y: 100,
    r: 50,
    anchor: false,
    drawOptions: {
      fill: "green",
      stroke: "orange"
    }
  }, stage))
}

function deleteShape() {
  stage.deleteNode()
}

function deleteNode() {
  stage.deleteNode()
}

function mode(m) {
  stage.mode = m
}

function addPolygon() {
  stage.addNode(new Polygon([
    [400, 150],
    [500, 50],
    [600, 150],
    [550, 250],
    [450, 250]
  ], stage))
}

function addStar() {
  stage.addNode(new Polygon([
    [400, 150],
    [500, 50],
    [600, 150],
    [550, 250],
    [450, 250]
  ], stage))
}

const scaleFactor = 1.1; // 每次放大或缩小的倍数

function zoomIn() {
  stage.zoom *= scaleFactor;
}

function zoomOut() {
  stage.zoom /= scaleFactor;
}

function resetZoom() {
  stage.zoom /= scaleFactor;
}

const container = ref<HTMLCanvasElement>();
const toolbar = ref<HTMLDivElement>();
onMounted(() => {
  stage = render(container.value as HTMLCanvasElement, {
    toolbar: toolbar.value as HTMLDivElement,
    engine: "canvas",
    plugin: [GuideLine]
  })
  stage.on("animationEnd", () => {
    console.log("end")
  })
  addSquare()
  addCircle()
  addPolygon()
})
</script>


<style scoped>
#canvas {
    margin: 10px;
}
</style>
