<template>
  <div id="root-family">
    <div id="root-node">
        <ExistingNode
            v-if="root"
            :key="root.nodeId"
            :node="root"
            @click="selectNode(root)"
        />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import type { NodeFamily } from '~/types/NodeFamily';
import type { TreeNode } from '~/types/TreeNode';
  
const emit = defineEmits(['selectNode']);
const props = defineProps<{
    family: NodeFamily | null;
    root: TreeNode | null
}>();

const selectNode = (node: TreeNode | null) => {
    if (node) emit('selectNode', node);
};
</script>
  
<style scoped>
#root-family {
    display: flex;
    flex-direction: column;
    align-items: center;
}
  
.node-group {
    display: flex;
    gap: 1em;
}
  
.left-node, .right-node {
    display: flex;
}
</style>  