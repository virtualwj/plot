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
import {Graph, render} from "@sketch-flow/core"
let graph: Graph
function addSquare(){
    const newSquare = {
        type: 'square',
        x: 100,
        y: 100,
        size: 100,
        dragging: false,
        resizing: false,
        anchors: [],
        controlPoints: []
    };
    graph.addNode(newSquare)
}
function addCircle() {
    const newCircle = {
        type: 'circle',
        x: 300,
        y: 100,
        radius: 50,
        dragging: false,
        resizing: false,
        anchors: [],
        controlPoints: []
    };
    graph.addNode(newCircle)
}

function deleteShape() {
    graph.deleteNode()
}

const container = ref<SVGSVGElement>();
const toolbar = ref<HTMLDivElement>();
onMounted(() => {
    graph = render(container.value as HTMLCanvasElement, {
        toolbar: toolbar.value as HTMLDivElement,
        engine: "svg"
    })
})
</script>

<style scoped>
#svg {
    border: 1px solid #999;
}
</style>

