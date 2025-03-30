<template>
    <div class="node-group" :class="{'force-right': !left, 'force-left': !right, 'center': left && right}">
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
</template>
  
<script setup lang="ts">
import type { TreeNode } from '~/types/TreeNode';
  
const emit = defineEmits(['selectNode']);
const props = defineProps<{
    parent: TreeNode | null;
    left: TreeNode | null;
    right: TreeNode | null;
}>();
const familyPosition = ref();

const selectNode = (node: TreeNode | null) => {
    if (node) emit('selectNode', node);
};
</script>
  
<style scoped>
.node-group {
    display: flex;
    gap: 1em;
    width: 10em;
    padding: 0.4em;
    position: relative;
}
  
.left-node, .right-node {
    display: flex;
}

.force-left {
    justify-content: flex-start;
}

.force-right {
    justify-content: flex-end;
}

.center {
    justify-content: center;
}
</style>  