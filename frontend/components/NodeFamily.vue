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

        <div class="node-group">
            <div class="left-node" v-if="left">
                <ExistingNode
                    :key="left.nodeId"
                    :node="left"
                    @click="selectNode(left)"
                 />
            </div>
            <div class="right-node" v-if="right">
                <ExistingNode
                    :key="right.nodeId"
                    :node="right"
                    @click="selectNode(right)"
                />
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import type { TreeNode } from '~/types/TreeNode';
  
const emit = defineEmits(['selectNode']);
const props = defineProps<{
    parent: TreeNode | null;
    left: TreeNode | null;
    right: TreeNode | null;
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