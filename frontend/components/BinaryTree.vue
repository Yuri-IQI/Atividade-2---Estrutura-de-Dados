<template>
  <main id="tree">
    <div id="blank-root" v-if="structuredTree.length === 0">
      <BlankNode :nodeId="0" :parentId="null" :position="null" @selectNode="handleNodeSelection" />
    </div>

    <div class="tree-level" v-for="(level, index) in treeLevels" :key="index">
      <ExistingNode v-for="node in level" :key="node.nodeId" :node="node" @click="handleNodeSelection(node)" />
    </div>

    <VisualConnection
      v-for="connection in connections"
      :key="`${connection.parentId}-${connection.childId}`"
      :connection="connection"
    />
  </main>
</template>

<script setup lang="ts">
import { BlankNode, ExistingNode, VisualConnection } from '#components';
import type { Node } from '~/types/Node';
import type { Connection } from '~/types/Connection';

const props = defineProps<{ 
  structuredTree: Node[],
  treeLevels: Node[][]
}>();
const emit = defineEmits(['selectNode']);
const connections = ref<Connection[]>([]);

const handleNodeSelection = (node?: Node) => {
  if (!node) {
    console.error("handleNodeSelection: Received undefined node");
    return;
  }
  emit('selectNode', node);
};

onMounted(() => {
  props.structuredTree.forEach(node => {
    if (node.parentId !== null) {
      connect(node.parentId, node.nodeId);
      console.log('hfsd')
    }
  });

  console.log(props.structuredTree);
});

const connect = (parentId: number, childId: number) => {
  let connection: Connection = {
    parentId: parentId,
    childId: childId,
    parentCoordinates: getNodeCoordinates(parentId),
    childCoordinates: getNodeCoordinates(childId),
    connectionSide: props.structuredTree.find(n => n.nodeId === parentId)?.leftId === childId ? 'L' : 'R'
  }

  connections.value.push(connection);
}

const getNodeCoordinates = (nodeId: number) => {
  const rect = document.getElementById(nodeId.toString())?.getBoundingClientRect();
  return { 
    x: (rect?.left ?? 0) + (rect?.width ?? 0) / 2,
    y: (rect?.top ?? 0) + (rect?.height ?? 0) / 2
  }
}
</script>

<style scoped>
#tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.tree-level {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 24em;
}

.blank-spots {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
</style>