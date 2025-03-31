<template>
    <svg id="traversal-svg">
        <g class="umbilical-cord">
            <line
                :x1="nodeMap[traversalNode.parentNode?.nodeId || 0].x + '%'" 
                :y1="nodeMap[traversalNode.parentNode?.nodeId || 0].y + '%'" 
                :x2="nodeMap[traversalNode.nodeId].x + '%'" 
                :y2="nodeMap[traversalNode.nodeId].y + '%'"
                stroke="black" stroke-width="2" 
            />
        </g>

        <g class="node-content" v-if="nodeMap[traversalNode.nodeId]">
            <circle 
                :cx="nodeMap[traversalNode.nodeId]?.x + '%'" 
                :cy="nodeMap[traversalNode.nodeId]?.y + '%'" 
                r="20" stroke="black" stroke-width="4" fill="grey" 
            />

            <text 
                :x="nodeMap[traversalNode.nodeId]?.x + '%'" 
                :y="nodeMap[traversalNode.nodeId]?.y + '%'"
                text-anchor="middle"
                dominant-baseline="central"
            >{{ traversalNode.nodeId }}</text>

            <text class="position-text"
                :x="nodeMap[traversalNode.nodeId]?.x + '%'" 
                :y="nodeMap[traversalNode.nodeId]?.y + '%'"
                text-anchor="middle"
                dominant-baseline="hanging"
            >{{ traversalSequence.indexOf(traversalNode.nodeId) + 'P' }}</text>
        </g>

        <g class="node-children">
            <TraversalNode v-if="traversalNode.leftChild"
                :traversalNode="traversalNode.leftChild"
                :nodeMap="nodeMap"
                :treeLength="treeLength"
                :traversalSequence="traversalSequence"
            />

            <TraversalNode v-if="traversalNode.rightChild"
                :traversalNode="traversalNode.rightChild"
                :nodeMap="nodeMap"
                :treeLength="treeLength"
                :traversalSequence="traversalSequence"
            />
        </g>
    </svg>
</template>

<script setup lang="ts">
import TraversalNode from '~/components/TraversalNode.vue';
import type { Coordinates } from '~/types/Coordinates';
import type { TraversalTreeNode } from '~/types/TraversalTreeNode';

const props = defineProps<{
    traversalNode: TraversalTreeNode
    nodeMap: Record<number, Coordinates>
    treeLength: number
    traversalSequence: number[]
}>();

const setNodePosition = (node: TraversalTreeNode) => {
    if (!node.parentNode) {
        props.nodeMap[node.nodeId] = { x: 50, y: 10 };
        return;
    }

    const parentCoords = props.nodeMap[node.parentNode.nodeId];
    if (!parentCoords) return;

    const offsetX = 8;
    const offsetY = 18;

    props.nodeMap[node.nodeId] = {
        x: parentCoords.x + (node.parentNode.leftChild === node ? -offsetX : offsetX),
        y: parentCoords.y + offsetY
    };

    solveOverlap();
}


const solveOverlap = () => {
    
}

const prepareConnections = () => {
    const umbilicalCords = Array.from(document.querySelectorAll('g.umbilical-cord'));
    const traversalSvg = document.getElementById('traversal-svg');

    if (!traversalSvg || umbilicalCords.length === 0) return;

    const firstNode = traversalSvg.querySelector('g.node-content');

    umbilicalCords.forEach(uc => {
        traversalSvg.insertBefore(uc, firstNode);
    });
};

onBeforeMount(() => {
    setNodePosition(props.traversalNode);
});

watch(props.nodeMap, async (newNodeMap) => {
    if (Object.entries(newNodeMap).length === props.treeLength) {
        await nextTick();
        prepareConnections();
    }
})
</script>

<style scoped>
svg {
    flex: 1;
}

.position-text {
    transform: translate(0, 28px);
}
</style>