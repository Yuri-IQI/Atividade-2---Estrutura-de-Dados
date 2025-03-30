<template>
  <div id="tree">
    <BlankNode v-if="structuredTree.length === 0"
      :node-id="0"
      :parentId="null"
      :position="null"
      @selectNode="selectNode"
    />

  <div id="tree-composition" v-if="structuredTree.length">
    <div class="tree-level" :id="'level-' + index" v-for="(level, index) in treeLevels" :key="index">
      <template v-if="level[0].parentNode === null">
        <RootTreeFamily
          :family="level[0]"
          :root="structuredTree.find(n => n.nodeId === 0) ?? null"
          @selectNode="selectNode"
        />
      </template>

      <template v-else>
        <NodeFamily
          v-for="family in level"
          :key="family.parentNode?.nodeId || `family-${index}`"
          :parent="family.parentNode"
          :left="family.leftNode"
          :right="family.rightNode"
          @selectNode="selectNode"
        />
      </template>

    </div>
  </div>

    <VisualConnection
      v-for="connection in connections"
      :key="`${connection.parentId}-${connection.childId}`"
      :connection="connection"
    />
  </div>
</template>

<script setup lang="ts">
import type {Connection} from "~/types/Connection";
import type {TreeNode} from "~/types/TreeNode"
import type { NodeFamily } from "~/types/NodeFamily";

const props = defineProps<{
  structuredTree: TreeNode[],
  treeLevels: NodeFamily[][]
}>();

const emit = defineEmits(['selectNode']);
const connections = ref<Connection[]>([]);

const selectNode = (node: TreeNode) => {
  if (!node) return;
  emit('selectNode', node);
}

let resizeObserver: ResizeObserver | null = null;

watchEffect(async () => {
  if (props.structuredTree.length > 0) {
    await nextTick();
    if (connections.value.length === 0) {
      recalculateNodeCoordinates();
      connectNodes(props.structuredTree);
    }
  }
});

watch(props.structuredTree, (updatedTree) => {
  connectNodes(updatedTree);
})

const connectNodes = (tree: TreeNode[]) => {
  if (connections.value.length === 0) { 
    tree.forEach(node => {
      if (node.parentId !== null) {
        connect(node.parentId, node.nodeId);
      }
    });
  }
};

const connect = (parentId: number, childId: number) => {
  let connection: Connection = {
    parentId: parentId,
    childId: childId,
    parentCoordinates: getComputedNodeCoordinates(parentId),
    childCoordinates: getComputedNodeCoordinates(childId),
    connectionSide: props.structuredTree.find(n => n.nodeId === parentId)?.leftId === childId ? 'L' : 'R'
  };

  connections.value.push(connection);
};

const getComputedNodeCoordinates = (nodeId: number) => {
  const element = document.getElementById(nodeId.toString());
  if (!element) return { x: 0, y: 0 };
  
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX + rect.width / 2,
    y: rect.top + window.scrollY + rect.height / 2
  };
};

const recalculateNodeCoordinates = () => {
  connections.value = connections.value.map(connection => ({
    ...connection,
    parentCoordinates: getComputedNodeCoordinates(connection.parentId),
    childCoordinates: getComputedNodeCoordinates(connection.childId),
  }));
};

onMounted(() => {
  const treeContainer = document.getElementById('tree-composition');
  if (treeContainer) {
    resizeObserver = new ResizeObserver(() => {
      recalculateNodeCoordinates();
    });
    resizeObserver.observe(treeContainer);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>
#tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
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
  justify-content: center;
  gap: 1em;
}
</style>