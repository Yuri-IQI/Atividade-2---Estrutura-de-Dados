<template>
  <div id="root-family">
    <div id="root-node">
        <ExistingNode
            v-if="parent"
            :key="parent.nodeId"
            :node="parent"
            @click="selectNode(parent)"
        />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import type { TreeNode } from '~/types/TreeNode';
  
const emit = defineEmits(['selectNode']);
const props = defineProps<{
    parent: TreeNode | null;
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