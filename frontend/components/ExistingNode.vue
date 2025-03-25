<template>
    <div class="a">
        <div class="existing-node">
            <span>
                {{ props.node.nodeId }}
            </span>
        </div>
        <span class="b">
            <p>a</p>
            <p>b</p>
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
}

span {
    z-index: -1;
}
</style>