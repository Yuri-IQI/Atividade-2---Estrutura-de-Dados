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
import type { Node } from './types/Node';

const structuredTree = ref<Node[]>([]);
const selectedNode = ref<Node | null>(null);
const treeLevels = ref<Node[][]>([]);

onMounted(async () => {
  const treeData = await useConsumer();
  structuredTree.value = treeData.structuredTree?.value ?? [];
  console.log(structuredTree.value);
  assignTreeLevels();
});

const assignTreeLevels = () => {
  treeLevels.value = [];

  const rootNode = structuredTree.value.find(node => node.nodeId === 0);
  if (!rootNode) return;

  treeLevels.value.push([rootNode]);

  structuredTree.value.forEach(node => {
    if (node.nodeId === 0) return;

    let parentLevelIndex = treeLevels.value.findIndex(level => 
      level.some(parent => parent.nodeId === node.parentId)
    );

    if (parentLevelIndex !== -1) {
      const nextLevelIndex = parentLevelIndex + 1;
      if (!treeLevels.value[nextLevelIndex]) {
        treeLevels.value[nextLevelIndex] = [];
      }
      treeLevels.value[nextLevelIndex].push(node);
    }
  });
}

const getSelectedNode = (node: Node) => {
  if (selectedNode.value?.nodeId === node.nodeId) {
    selectedNode.value = null;
    return;
  }

  selectedNode.value = node;
};

const updateNodeTree = (nodeTree: Node[]) => {
  structuredTree.value = nodeTree;
  console.log(nodeTree);
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