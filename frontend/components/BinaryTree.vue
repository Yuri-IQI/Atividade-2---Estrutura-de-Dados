<template>
  <div id="tree">
    <BlankNode v-if="structuredTree.length === 0"
      :node-id="0"
      :parentId="null"
      :position="null"
      @selectNode="selectNode"
    />

    <div id="tree-composition" v-if="structuredTree.length">
      <div class="tree-level" v-for="(level, index) in treeLevels" :key="index">
        <RootTreeFamily
          v-if="index === 0"
          :parent="treeLevels[0][0].parentNode"
          @selectNode="selectNode"
        />

        <NodeFamily
          v-for="family in level"
          :key="family.parentNode?.nodeId"
          :parent="family.parentNode"
          :left="family.leftNode"
          :right="family.rightNode"
          @selectNode="selectNode"
        />
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

let resizeObserver: ResizeObserver;
let mutationObserver: MutationObserver;

const selectNode = (node: TreeNode) => {
  if (!node) return;
  emit('selectNode', node);
}

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
  console.log(props.treeLevels);
});

watchEffect(async () => {
  if (props.structuredTree.length > 0) {
    await nextTick();
    connectNodes(props.structuredTree);
  }
})

const connectNodes = (tree: TreeNode[]) => {
  document.querySelectorAll('.connection-line').forEach(el => el.remove())
  tree.forEach(node => {
    if (node.parentId !== null) {
      connect(node.parentId, node.nodeId);
    }
  })
}

const connect = (parentId: number, childId: number) => {
  let connection: Connection = {
    parentId: parentId,
    childId: childId,
    parentCoordinates: getComputedNodeCoordinates(parentId),
    childCoordinates: getComputedNodeCoordinates(childId),
    connectionSide: props.structuredTree.find(n => n.nodeId === parentId)?.leftId === childId ? 'L' : 'R'
  }

  connections.value.push(connection);
}

const getComputedNodeCoordinates = (nodeId: number) => {
  const rect = document.getElementById(nodeId.toString())?.getBoundingClientRect();
  return {
    x: (rect?.left ?? 0) + (rect?.width ?? 0) / 2,
    y: (rect?.top ?? 0) + (rect?.height ?? 0) / 2
  }
}

const recalculateNodeCoordinates = () => {
  connections.value = connections.value?.map(connection => ({
    ...connection,
    parentCoordinates: getComputedNodeCoordinates(connection.parentId),
    childCoordinates: getComputedNodeCoordinates(connection.childId),
  }));
};
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