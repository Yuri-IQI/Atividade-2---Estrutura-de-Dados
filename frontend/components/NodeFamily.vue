<template>
    <div class="root-family">
        <div :style="{ left: calculateParentCenter() + '%' }" class="node-group" :class="{'force-right': !left, 'force-left': !right, 'center': left && right}">
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

const calculateParentCenter = () : number => {
    if (!props.parent) return 50;

    const parentElement = document.getElementById(props.parent.nodeId.toString());
    const parentLevelElement = parentElement?.parentElement?.parentElement?.parentElement?.parentElement;

    const parentLevelBoundaries = parentLevelElement?.getBoundingClientRect();
    const parentElementBoundaries = parentElement?.getBoundingClientRect();

    const parentLevelCenter = parentLevelBoundaries?.width ?? 0 / 2;
    const parentElementCenter = parentElementBoundaries?.width ?? 0 / 2;

    return (parentElementCenter / parentLevelCenter) * 100;
}
</script>
  
<style scoped>
.root-family {
    display: flex;
    flex-direction: column;
    align-items: center;
}
  
.node-group {
    display: flex;
    gap: 1em;
    width: 10em;
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