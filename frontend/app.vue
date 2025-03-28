<template>
  <div id="all">
    <BinaryTree
      :structuredTree="structuredTree"
      :treeLevels="treeLevels"
      @selectNode="getSelectedNode"
    />
    <aside>
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
  const treeData = await useConsumer();
  structuredTree.value = treeData.structuredTree?.value ?? [];
  assignTreeLevels();
});


const assignTreeLevels = () => {
  treeLevels.value = [];

  const rootNode = structuredTree.value.find(node => node.nodeId === 0);
  if (!rootNode) return;

  const rootFamily: NodeFamily = createNodeFamily(rootNode);
  treeLevels.value.push([rootFamily]);

  structuredTree.value.forEach(node => {
    let parentLevelIndex = treeLevels.value.findIndex(level =>
      level.some(fam =>
        fam.leftNode?.nodeId === node.nodeId || fam.rightNode?.nodeId === node.nodeId
      )
    );

    if (parentLevelIndex !== -1) {
      const nextLevelIndex = parentLevelIndex + 1;

      if (!treeLevels.value[nextLevelIndex]) {
        treeLevels.value[nextLevelIndex] = [];
      }

      let existingNodeFamily = treeLevels.value[nextLevelIndex].find(fam => {
  if (node.position === 'L') {
    return fam.rightNode?.parentId === node.parentId;
  }
  if (node.position === 'R') {
    return fam.leftNode?.parentId === node.parentId;
  }
  return false;
});
      console.log('nivel', nextLevelIndex, treeLevels.value[nextLevelIndex])

      console.log(existingNodeFamily);

      if (existingNodeFamily) {
        if (node.position === 'L') {
          existingNodeFamily.leftNode = node;
        } else {
          existingNodeFamily.rightNode = node;
        }
      } else {
        const newFamily = createNodeFamily(node);
        treeLevels.value[nextLevelIndex].push(newFamily);
      }
    }
  });
};

const createNodeFamily = (parentNode: TreeNode): NodeFamily => {
  let leftNode = structuredTree.value.find(n => n.nodeId === parentNode.leftId) || null;
  let rightNode = structuredTree.value.find(n => n.nodeId === parentNode.rightId) || null;
  let parent = parentNode.nodeId === 0 ? null : parentNode;

  return {
    parentNode: parent,
    leftNode,
    rightNode
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

aside {
  position: absolute;
  top: 0;
  right: 0;
}
</style>