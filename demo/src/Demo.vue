<template>
    <div id="menu">
        <button @click="addSquare">Add Square</button>
        <button @click="addCircle">Add Circle</button>
        <button @click="addPolygon">Add Polygon</button>
        <button @click="deleteNode">删除第一个</button>
    </div>
    <div id="toolbar" ref="toolbar">
        <button @click="deleteShape">Delete</button>
    </div>
    <canvas id="canvas" width="800" height="600" ref="container"></canvas>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Graph, render, Rect, Circle, Polygon} from "@plot/core"
import {GuideLine} from "@plot/plugin-guide-line";
import {Mesh} from "@plot/plugin-mesh";
let graph: Graph
function addSquare(){
    graph.addNode(new Rect({
        x: 100,
        y: 100,
        w: 100,
        h: 100,
    }, graph))
}
function addCircle() {
    graph.addNode(new Circle({
        x: 300,
        y: 100,
        r: 50,
    }, graph))
}

function deleteShape() {
    graph.deleteNode()
}

function deleteNode() {
    graph.deleteNode()
}

function addPolygon(){
    graph.addNode(new Polygon([
        [400, 150],
        [500, 50],
        [600, 150],
        [550, 250],
        [450, 250]
    ], graph))
}

const container = ref<HTMLCanvasElement>();
const toolbar = ref<HTMLDivElement>();
onMounted(() => {
    graph = render(container.value as HTMLCanvasElement, {
        toolbar: toolbar.value as HTMLDivElement,
        engine: "canvas",
        plugin: [GuideLine]
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
