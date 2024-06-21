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
import {Stage, render, Rect, Circle} from "@plot/core"
import {GuideLine} from "@plot/plugin-guide-line";
let stage: Stage
function addSquare(){
    stage.addNode(new Rect({
        x: 100,
        y: 100,
        w: 100,
        h: 100,
    }, stage))
}
function addCircle() {
    stage.addNode(new Circle({
        x: 300,
        y: 100,
        r: 50,
    }, stage))
}

function deleteShape() {
    stage.deleteNode()
}

function deleteNode() {
    stage.deleteNode()
}

const container = ref<HTMLCanvasElement>();
const toolbar = ref<HTMLDivElement>();
onMounted(() => {
    stage = render(container.value as HTMLCanvasElement, {
        toolbar: toolbar.value as HTMLDivElement,
        engine: "svg",
        plugin: [GuideLine]
    })
    addSquare()
    addCircle()
})
</script>



