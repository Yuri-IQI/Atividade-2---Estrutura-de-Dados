<template>
  <main id="tree">
    <div id="blank-root">
      <BlankNode v-if="structuredTree.length === 0" :nodeId="0" :parentId="null" :position="null" @selectNode="handleNodeSelection" />
    </div>

    <div class="tree-level" v-for="(level, index) in treeLevels" :key="index">
      <ExistingNode v-for="node in level" :key="node.nodeId" :node="node" @click="handleNodeSelection(node)" />
    </div>

    <div class="blank-spots" v-for="(spot, index) in availableNodeInsertions" :key="index">
      <BlankNode
        v-if="spot.leftId === null"
        :nodeId="getNewNodeId()"
        :parentId="spot.nodeId"
        :position="'L'"
        @selectNode="handleNodeSelection"
      />
      <BlankNode
        v-if="spot.rightId === null"
        :nodeId="getNewNodeId()"
        :parentId="spot.nodeId"
        :position="'R'"
        @selectNode="handleNodeSelection"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { BlankNode, ExistingNode } from '#components';
import type { Node } from '~/types/Node';

const props = defineProps<{ 
  structuredTree: Node[],
  treeLevels: Node[][]
}>();
const emit = defineEmits(['selectNode']);

const getNewNodeId = () => {
  if (props.structuredTree.length === 0) return 0;

  const maxId = Math.max(...props.structuredTree.map(node => node.nodeId), 0);
  return maxId + 1;
};

const handleNodeSelection = (node?: Node) => {
  if (!node) {
    console.error("handleNodeSelection: Received undefined node");
    return;
  }
  emit('selectNode', node);
};

const availableNodeInsertions = computed(() => {
  return props.structuredTree
    .filter(node => node.leftId === null || node.rightId === null);
});
</script>

<style scoped>
#tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

.tree-level {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.blank-spots {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
</style>