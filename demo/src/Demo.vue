<template>
    <div id="menu">
        <button @click="addSquare">Add Square</button>
        <button @click="addCircle">Add Circle</button>
        <button @click="deleteNode">删除第一个</button>
    </div>
    <div id="toolbar" ref="toolbar">
        <button @click="deleteShape">Delete</button>
    </div>
    <canvas id="canvas" width="800" height="600" ref="container"></canvas>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Graph, render, Rect, Circle} from "@sketch-flow/core"
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

const container = ref<HTMLCanvasElement>();
const toolbar = ref<HTMLDivElement>();
onMounted(() => {
    graph = render(container.value as HTMLCanvasElement, {
        toolbar: toolbar.value as HTMLDivElement,
        engine: "canvas",
        width: "800px",
        height: "600px"
    })
    addSquare()
    addCircle()
})
</script>

