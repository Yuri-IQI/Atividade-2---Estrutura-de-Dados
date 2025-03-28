<template>
    <div class="existing-node" :id="node.nodeId.toString()">
        <h2>
            {{ props.node.nodeId }}
        </h2>
    </div>
</template>

<script setup lang="tsx">
import type { TreeNode } from '~/types/TreeNode';

const props = defineProps<{
    node: TreeNode
}>();
</script>

<style scoped>
.existing-node {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    width: 4em;
    height: 4em;
    border: 0.4em solid black;
    border-radius: 50%;
    background-color: rgb(175, 171, 171);
}
</style>