<template>
    <main id="tree">
        <div class="node-field">
            <BlankNode
                v-if="props.structuredTree.length === 0"
                :nodeId="props.structuredTree.length"
                @selectNode="handleNodeSelection"
            />
<!--            <NodeMenu  v-if="selectedNode !== null" :nodeId="selectedNode" :nodeType="checkNodeInsertion(selectedNode)" />-->
        </div>

        <div v-if="props.structuredTree.length > 0" v-for="node of props.structuredTree" :key="node.nodeId" @click="handleNodeSelection(node.nodeId)">
          <ExistingNode :node="node" />
        </div>
    </main>
</template>

<script setup lang="tsx">
import { BlankNode } from '#components';
import { ExistingNode } from '#components';
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