<template>
  <div id="all">
    <aside id="info-menu">
      <InformationMenu 
        :key="structuredTree.length"
        :selectedNode="selectedNode"
      />
    </aside>
    <BinaryTree
      :key="structuredTree.length"
      :structuredTree="structuredTree"
      :treeLevels="treeLevels"
      @selectNode="getSelectedNode"
    />
    <aside id="insertion-menu">
      <NodeMenu
        v-if="selectedNode !== null"
        :node="selectedNode"
        :nodeType="checkNodeInsertion(selectedNode.nodeId)"
        :structured-tree="structuredTree"
        @updateNodeTree="updateNodeTree"
      />
    </aside>
  </div>
</template>

<script setup lang="tsx">
import BinaryTree from './components/BinaryTree.vue';
import { useConsumer } from '~/composables/useConsumer';
import NodeMenu from "~/components/NodeMenu.vue";
import {ref} from "vue";
import {NodeTypeEnum} from "~/types/NodeTypeEnum";
import type { TreeNode } from './types/TreeNode';
import type { NodeFamily } from './types/NodeFamily';

const structuredTree = ref<TreeNode[]>([]);
const selectedNode = ref<TreeNode | null>(null);
const treeLevels = ref<NodeFamily[][]>([]);

onMounted(async () => {
  const treeData = await useConsumer(null);
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
}

#insertion-menu {
  position: absolute;
  top: 0;
  right: 0;
}
</style>