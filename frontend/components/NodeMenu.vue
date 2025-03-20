<template>
    <div class="nodeMenu">
        <span>{{ 'Node ID: ' + nodeId  }}</span>
        <span>{{ 'Node type: ' + nodeType }}</span>
    </div>
</template>

<script setup lang="tsx">
import type { NodeTypeEnum } from '../types/NodeTypeEnum';

defineProps<{ 
    nodeId: number, 
    nodeType: NodeTypeEnum 
}>();
</script>

<style scoped>
.nodeMenu {
    padding: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
}
</style>