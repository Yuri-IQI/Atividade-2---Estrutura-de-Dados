<template>
    <main id="tree">
        <div class="node-field">
            <BlankNode 
                v-if="structuredTree.length === 0"
                :nodeId="structuredTree.length"
                @selectNode="selectNode"
            />
            <NodeMenu  v-if="selectedNode !== null" :nodeId="selectedNode" :nodeType="checkNodeInsertion(selectedNode)" />
        </div>

        <div v-for="node in structuredTree" :key="node.nodeId" @click="selectNode(node.nodeId)">
            {{ node.nodeValue }}
        </div>
    </main>
</template>

<script setup lang="tsx">
import { ref, defineProps } from 'vue';
import { BlankNode } from '#components';
import NodeMenu from './NodeMenu.vue';
import type { Node } from '../types/Node';
import { NodeTypeEnum } from '~/types/NodeTypeEnum';

const props = defineProps<{ structuredTree: Node[] }>();

const selectedNode = ref<number | null>(null);

const selectNode = (nodeId: number) => {
    selectedNode.value = nodeId;
};

const checkNodeInsertion = (nodeId: number): NodeTypeEnum => {
    return props.structuredTree.some(node => node.nodeId === nodeId) 
        ? NodeTypeEnum.ACTIVE 
        : NodeTypeEnum.BLANK;
};
</script>

<style scoped>
#tree {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>