<template>
  <main id="tree">
    <div id="blank-root" v-if="structuredTree.length === 0">
      <BlankNode :nodeId="0" :parentId="null" :position="null" @selectNode="handleNodeSelection" />
    </div>

    <div id="tree-composition" v-if="structuredTree.length">
      <div class="tree-level" v-for="(level, index) in treeLevels" :key="`${index}`">
        <ExistingNode v-for="node in level" 
          :key="`${node.nodeId}`" 
          :node="node" 
          @click="handleNodeSelection(node)" 
          :style="{
            left: `${placeNode(node.nodeId)}%`
          }"
        />
      </div>
    </div>

    <VisualConnection
      v-for="connection in connections"
      :key="`${connection.parentId}-${connection.childId}`"
      :connection="connection"
    />
  </main>
</template>

<script setup lang="ts">
import {BlankNode, ExistingNode, VisualConnection} from '#components';
import type {Node} from '~/types/Node';
import type {Connection} from '~/types/Connection';

const props = defineProps<{ 
  structuredTree: Node[],
  treeLevels: Node[][]
}>();

const emit = defineEmits(['selectNode']);
const connections = ref<Connection[]>([]);

const nodeMapping = new Map<number, number>([]);

let resizeObserver: ResizeObserver;
let mutationObserver:  MutationObserver;

const handleNodeSelection = (node?: Node) => {
  if (!node) {
    console.error("handleNodeSelection: Received undefined node");
    return;
  }
  emit('selectNode', node);
};

onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    recalculateNodeCoordinates();
  });

  mutationObserver = new MutationObserver(() => {
    recalculateNodeCoordinates();
  });

  props.structuredTree.forEach(node => {
    const element = document.getElementById(node.nodeId.toString());
    if (element) {
      resizeObserver.observe(element);
      mutationObserver.observe(element, { attributes: true, childList: true, subtree: true });
    }
  });
  window.addEventListener('resize', recalculateNodeCoordinates);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  window.removeEventListener('resize', recalculateNodeCoordinates);
});

watch(props.structuredTree, (updatedTree) => {
  connectNodes(updatedTree);
});

watchEffect(async () => {
  if (props.structuredTree.length > 0) {
    await nextTick();
    connectNodes(props.structuredTree);
  }
});

const connectNodes = (tree: Node[]) => {
  document.querySelectorAll('.connection-line').forEach(el => el.remove())
  tree.forEach(node => {
    if (node.parentId !== null) {
      connect(node.parentId, node.nodeId);
    }
  });
};

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

const recalculateNodeCoordinates = () => {
  connections.value = connections.value?.map(connection => ({
    ...connection,
    parentCoordinates: getNodeCoordinates(connection.parentId),
    childCoordinates: getNodeCoordinates(connection.childId),
  }));
};

const placeNode = (nodeId: number) => {
  let node = props.structuredTree.find(n => n.nodeId === nodeId);

  if (node) {
    console.log(node);
    if (node.parentId === null) {
      let rootPosition = 50;

      nodeMapping.set(nodeId, rootPosition);
      return rootPosition;
    }

    let parentPoint = nodeMapping.get(node.parentId);
    console.log(parentPoint);
    let nodePoint = (parentPoint !== undefined) ? (node.position === 'L' ? parentPoint - (parentPoint/2) : parentPoint + (parentPoint/2)) : 0;
    nodeMapping.set(nodeId, nodePoint);

    console.log(nodePoint);
    return nodePoint;
  }
}
</script>

<style scoped>
#tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: max-content;
  justify-content: center;
}

#tree-composition {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  width: 100%;
}

.tree-level {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 1em;
}
</style>