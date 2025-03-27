<template>
    <div class="existing-node" :id="node.nodeId.toString()">
        <span>
            {{ props.node.nodeId }}
        </span>
    </div>
</template>

<script setup lang="tsx">
import type { Node } from '~/types/Node';

const props = defineProps<{
    node: Node
}>();
</script>

<style scoped>
.existing-node {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 4em;
    height: 4em;
    border: 0.4em solid black;
    border-radius: 50%;
    background-color: rgb(175, 171, 171);
}

span {
    z-index: 1;
}
</style>