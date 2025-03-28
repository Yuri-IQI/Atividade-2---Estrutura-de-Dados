<template>
  <div id="tree">
    <BlankNode v-if="structuredTree.length === 0"
        :node-id="0"
        :parentId="null"
        :position="null"
        @selectNode="selectNode"
        />
  </div>
</template>

<script setup lang="ts">
import type {Connection} from "~/types/Connection";
import type {Coordinates} from "~/types/Coordinates";
import type {Node} from "~/types/Node"

const props = defineProps<{
  structuredTree: Node[],
  treeLevels: Node[][]
}>();

const emit = defineEmits(['selectNode']);
const connections = ref<Connection[]>([]);
const nodePositions = new Map<number, Coordinates>();

const selectNode = (node: Node) => {
  if (!node) return;
  emit('selectNode', node);
}

watchEffect(async () => {
  if (props.structuredTree.length > 0) {
    await nextTick();
    connectNodes(props.structuredTree);
  }
})

const connectNodes = (tree: Node[]) => {
  document.querySelectorAll('.connection-line').forEach(el => el.remove())
  tree.forEach(node => {
    if (node.parentId !== null) {
      connect(node.parentId, node.nodeId);
    }
  })
}
</script>

<style scoped>

</style>