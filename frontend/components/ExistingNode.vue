<template>
    <div class="tooltip-container">
        <div class="existing-node" :id="node.nodeId.toString()" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
            <h2>
                {{ props.node.nodeId }}
            </h2>
        </div>
        <div v-if="showTooltip" class="tooltip">{{ node.nodeValue }}</div>
    </div>
</template>

<script setup lang="tsx">
import type { TreeNode } from '~/types/TreeNode';

const showTooltip = ref(false);
const props = defineProps<{
    node: TreeNode
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
    font-size: 10pt;
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

    width: 3em;
    height: 3em;
    border: 0.2em solid black;
    border-radius: 50%;
    background-color: rgb(175, 171, 171);
    filter: drop-shadow(2px 3px 4px #1313139c);
}
</style>