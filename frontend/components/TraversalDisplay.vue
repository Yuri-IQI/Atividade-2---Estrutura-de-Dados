<template>
    <div id="block" @click="closeDisplay">
        <div id="display" @click.stop>
            <div id="sequence">
                <h2>Sequência {{ traversalMap.get(traversalType) }}</h2>
                <span>
                    <NodeSeq v-for="node in traversalTreeNodes"
                        :nodeId="node.nodeId"
                        :nodeValue="node.nodeValue"
                    />
                </span>
            </div>
            <div ref="treeSpan" id="traversal-tree">
                <svg id="traversal-svg"  overflow="visible" :viewBox="`0 0 ${treeWidth} ${treeHeight}`">
                    <TraversalNode v-if="traversalTree" 
                        :traversalNode="traversalTree"
                        :nodeMap="nodeMap"
                        :treeLength="treeLength"
                        :traversalSequence="traversalSequence"
                    />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TraversalTreeNode } from '~/types/TraversalTreeNode';
import { TraversalTypes } from '~/types/TraversalTypes';
import type { TreeNode } from '~/types/TreeNode';
import TraversalNode from './TraversalNode.vue';
import type { Coordinates } from '~/types/Coordinates';

const treeSpan = ref();
const treeWidth = ref(0);
const treeHeight = ref(0);

const traversalTree = ref<TraversalTreeNode | null>();
const emit = defineEmits(['closeDisplay']);
const props = defineProps<{
    traversalTreeNodes: TreeNode[]
    treeLength: number
    traversalType: TraversalTypes
}>();

const traversalMap: Map<TraversalTypes, string> = new Map([
    [TraversalTypes.PREORDER, 'Pré Ordem'],
    [TraversalTypes.INORDER, 'Em Ordem'],
    [TraversalTypes.POSTORDER, 'Pós Ordem']
]);

const nodeMap = reactive<Record<number, Coordinates>>({});
const closeDisplay = () => {
    emit('closeDisplay', TraversalTypes.DEFAULT);
}

const traversalSequence = ref<number[]>([]);

const convertTree = () => {
    const nodeMap = new Map<number, TraversalTreeNode>();
    traversalSequence.value = props.traversalTreeNodes.map(n => n.nodeId);

    props.traversalTreeNodes.forEach(node => {
        nodeMap.set(node.nodeId, {
            nodeId: node.nodeId,
            nodeValue: node.nodeValue,
            parentNode: null,
            leftChild: null,
            rightChild: null
        });
    });

    let rootNode: TraversalTreeNode | null = null;

    props.traversalTreeNodes.forEach(node => {
        const traversalNode = nodeMap.get(node.nodeId)!;

        if (node.parentId !== null) {
            traversalNode.parentNode = nodeMap.get(node.parentId) || null;
        } else {
            rootNode = traversalNode;
        }

        traversalNode.leftChild = node.leftId !== null ? nodeMap.get(node.leftId) || null : null;
        traversalNode.rightChild = node.rightId !== null ? nodeMap.get(node.rightId) || null : null;
    });

    traversalTree.value = rootNode;
};

const calculateTreeSpan = () => {
    if (treeSpan.value) {
        const { width, height } = treeSpan.value.getBoundingClientRect();
        treeWidth.value = width;
        treeHeight.value = height;
    }
}

onMounted(() => {
    calculateTreeSpan();
    convertTree();
});
</script>

<style scoped>
#block {
    width: 100vw;
    height: 100vh;
    background-color: rgba(58, 58, 58, 0.664);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

#display {
    width: 80%;
    height: 80%;
    padding: 0.2em;
    background-color: #f0f0f0;
    border: 2px solid #ccc;

    display: flex;
    flex-direction: column;
}

#sequence {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

#sequence h2 {
    padding: 0.2em;
    margin: 0;
}

#sequence span {
    display: flex;
    justify-content: center;
    align-items: center;
}

#traversal-tree {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
}
</style>