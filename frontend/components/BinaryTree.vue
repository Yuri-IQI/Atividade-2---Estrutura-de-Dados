<template>
  <main id="tree">
    <div id="blank-root">
      <BlankNode
        v-if="structuredTree.length === 0"
        :nodeId="0"
        @selectNode="handleNodeSelection"
      />
    </div>

    <div v-if="structuredTree.length > 0">
      <ExistingNode
        v-for="node in structuredTree"
        :key="node.nodeId"
        :node="node"
        @click="handleNodeSelection(node.nodeId)"
      />
    </div>

    <div id="blank-spots" v-for="spot of availableNodeInsertions">
      <BlankNode
        v-if="spot.leftId == null"
        :nodeId="structuredTree.length++"
        @selectNode="handleNodeSelection"
      />
      <BlankNode
        v-if="spot.rightId == null"
        :nodeId="structuredTree.length++"
        @selectNode="handleNodeSelection"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { BlankNode, ExistingNode } from '#components';
import type { TreeInfo } from '~/types/TreeInfo';
import type { Node } from '~/types/Node';
import { useConsumer } from '~/composables/useConsumer';

const props = defineProps<{ structuredTree: Node[] }>();
const emit = defineEmits(['selectNode']);
const availableNodeInsertions: Node[] = [];

const handleNodeSelection = (nodeId: number) => {
  emit('selectNode', nodeId);
};

const findAvailableInsertionSpots = () => {
  for (let node of props.structuredTree) {
    if (node.leftId === null || node.rightId === null) availableNodeInsertions.push(node);
  }
}

watch(() => props.structuredTree, async (newTree) => {
  findAvailableInsertionSpots();
  console.log(availableNodeInsertions);
}, { deep: true });
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
