<template>
    <main id="tree">
        <div class="node-field">
            <BlankNode
                v-if="structuredTree.length === 0"
                :nodeId="structuredTree.length"
                @selectNode="handleNodeSelection"
            />
<!--            <NodeMenu  v-if="selectedNode !== null" :nodeId="selectedNode" :nodeType="checkNodeInsertion(selectedNode)" />-->
        </div>

        <div v-for="node in structuredTree" :key="node.nodeId" @click="handleNodeSelection(node.nodeId)">
            {{ node.nodeValue }}
        </div>
    </main>
</template>

<script setup lang="tsx">
import { BlankNode } from '#components';
import type { Node } from '../types/Node';

const props = defineProps<{ structuredTree: Node[] }>();
const emit = defineEmits(['selectNode']);

const handleNodeSelection = (nodeId: number) => {
  emit('selectNode', nodeId);
};
</script>

<style scoped>
#tree {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}

.node-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
</style>