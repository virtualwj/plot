<template>
    <div id="menu">
        <button @click="addSquare">Add Square</button>
        <button @click="addCircle">Add Circle</button>
    </div>
    <div id="toolbar" ref="toolbar">
        <button @click="deleteShape">Delete</button>
    </div>
    <svg id="svg" width="800" height="600" ref="container"></svg>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Graph, render, Rect, Circle} from "@plot/core"
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
        engine: "svg"
    })
    addSquare()
    addCircle()
})
</script>



