<template>
    <div class="tr-node">
        <div class="tooltip-container">
            <div :id="traversalNode.nodeId.toString()" class="actual-node" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
                {{ traversalNode.nodeId }}
                <div v-if="showTooltip" class="tooltip">{{ traversalNode.nodeValue }}</div>
            </div>
        </div>

        <div :id="traversalNode.nodeId + '-offspring'" class="offspring">
            <div v-if="traversalNode.leftChild">
                <TraversalNode :traversalNode="traversalNode.leftChild"/>
            </div>

            <div v-if="traversalNode.rightChild">
                <TraversalNode :traversalNode="traversalNode.rightChild"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TraversalTreeNode } from '~/types/TraversalTreeNode';

const showTooltip = ref(false);
const props = defineProps<{
    traversalNode: TraversalTreeNode
}>();
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    background-color: black;
    color: white;
    padding: 6px;
    border-radius: 4px;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
    white-space: nowrap;
    visibility: visible;
    opacity: 1;
    transition: opacity 0.2s;
    z-index: 100;
}

.existing-node {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;

    width: 4em;
    height: 4em;
    border: 0.4em solid black;
    border-radius: 50%;
    background-color: rgb(175, 171, 171);
}

.offspring {
    display: flex;
    flex-direction: row;
}
</style>