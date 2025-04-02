<template>
  <div id="all">
    <aside id="info-menu">
      <InformationMenu 
        :key="structuredTree.length"
        :selectedNode="selectedNode"
        @displayTraversal="displayTraversal"
      />
    </aside>
    <BinaryTree
      :key="structuredTree.length"
      :structuredTree="structuredTree"
      :treeLevels="treeLevels"
      @selectNode="getSelectedNode"
    />
    <aside id="insertion-menu">
      <button id="clean-tree" @click="cleanTree">Apagar Árvore</button>
      <NodeMenu
        v-if="selectedNode !== null"
        :node="selectedNode"
        :nodeType="checkNodeInsertion(selectedNode.nodeId)"
        :structured-tree="structuredTree"
        @updateNodeTree="updateNodeTree"
      />
    </aside>
  </div>
  <TraversalDisplay v-if="displayType !== TraversalTypes.DEFAULT"
    :traversalTreeNodes="traversalTree"
    @closeDisplay="closeDisplay"
    :treeLength="structuredTree.length"
    :traversalType="displayType"
  />
</template>

<script setup lang="tsx">
import BinaryTree from './components/BinaryTree.vue';
import { useConsumer } from '~/composables/useConsumer';
import NodeMenu from "~/components/NodeMenu.vue";
import {ref} from "vue";
import {NodeTypeEnum} from "~/types/NodeTypeEnum";
import type { TreeNode } from './types/TreeNode';
import type { NodeFamily } from './types/NodeFamily';
import { TraversalTypes } from './types/TraversalTypes';
import axios from 'axios';

const structuredTree = ref<TreeNode[]>([]);
const selectedNode = ref<TreeNode | null>(null);
const treeLevels = ref<NodeFamily[][]>([]);
const displayType = ref<TraversalTypes>(TraversalTypes.DEFAULT);

const traversalTree = ref<TreeNode[]>([]);

onMounted(async () => {
  const treeData = await useConsumer(null, null);
  structuredTree.value = treeData.structuredTree?.value ?? [];
  assignTreeLevels();
});

const assignTreeLevels = () => {
  treeLevels.value = [];

  const rootNode = structuredTree.value.find(node => node.nodeId === 0);
  if (!rootNode) return;

  const rootFamily = createRootFamily(rootNode);
  treeLevels.value.push([rootFamily]);

  structuredTree.value.forEach(node => {
    if (node.nodeId === 0) return;

    const parentLevelIndex = treeLevels.value.findIndex(level =>
      level.some(family => {
        const parent = family.parentNode;

        if (!parent && node.parentId === 0) {
          return family.leftNode?.nodeId === node.nodeId || family.rightNode?.nodeId === node.nodeId;
        }

        return (family.leftNode?.nodeId === node.parentId || family.rightNode?.nodeId === node.parentId) && family.parentNode !== null;
      })
    );

    if (parentLevelIndex !== -1) {
      const nextLevelIndex = parentLevelIndex + 1;

      if (!treeLevels.value[nextLevelIndex]) {
        treeLevels.value[nextLevelIndex] = [];
      }

      let existingFamily = treeLevels.value[nextLevelIndex].find(family =>
        family.parentNode?.nodeId === node.parentId
      );
      if (existingFamily) {
        if (node.position === 'L') {
          existingFamily.leftNode = node;
        } else {
          existingFamily.rightNode = node;
        }
      } else {
        const newFamily = createNodeFamily(node);
        treeLevels.value[nextLevelIndex].push(newFamily);
      }
    }
  });
};

const cleanTree = async () => {
  await axios.delete('https://cinco-backend-byr2.onrender.com/clean-tree')
    .then(response => {
      structuredTree.value = [];
      selectedNode.value = null;
      treeLevels.value = [];
      displayType.value = TraversalTypes.DEFAULT;
      traversalTree.value = [];
    });
}

const createRootFamily = (root: TreeNode): NodeFamily => {
  return {
    parentNode: null,
    leftNode: structuredTree.value.find(n => n.nodeId === root.leftId) || null,
    rightNode: structuredTree.value.find(n => n.nodeId === root.rightId) || null,
  };
};

const createNodeFamily = (node: TreeNode): NodeFamily => {
  return {
    parentNode: structuredTree.value.find(n => n.nodeId === node.parentId) || null,
    leftNode: node.position === 'L' ? node : null,
    rightNode: node.position === 'R' ? node : null,
  };
};

const getSelectedNode = (node: TreeNode) => {
  if (selectedNode.value?.nodeId === node.nodeId) {
    selectedNode.value = null;
    return;
  }

  selectedNode.value = node;
};

const updateNodeTree = (nodeTree: TreeNode[]) => {
  structuredTree.value = nodeTree;
  assignTreeLevels();
}

const checkNodeInsertion = (nodeId: number): NodeTypeEnum => {
  return structuredTree.value.some(node => node.nodeId === nodeId)
    ? NodeTypeEnum.ACTIVE
    : NodeTypeEnum.BLANK;
};

const closeDisplay = (traversalType: TraversalTypes) => {
  displayType.value = traversalType;
}

const fetchTraversalTree = async (traversalType: TraversalTypes): Promise<TreeNode[]> => {
  try {
    const { traversalTree } = await useConsumer(null, traversalType);
    return traversalTree?.value ?? [];
  } catch (error) {
    console.error('Error fetching traversal tree:', error);
    return [];
  }
};

const displayTraversal = async (traversalType: TraversalTypes) => {
  if (traversalType.match(TraversalTypes.DEFAULT)) return null;
  traversalTree.value = await fetchTraversalTree(traversalType);
  displayType.value = traversalType;
}
</script>

<style>
#all {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#info-menu {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
}

#insertion-menu {
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	flex-direction: column;
}

h1, h2, h3, h4, p, span, div, input, button {
  text-shadow: 1px 2px 4px rgba(22, 22, 22, 0.473);
}

button {
  background-color: rgba(214, 214, 214, 0.884);
}

.menu {
  box-shadow: 2px 1px 4px rgba(22, 22, 22, 0.548);
}
</style>