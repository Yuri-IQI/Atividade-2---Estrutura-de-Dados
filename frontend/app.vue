<template>
  <div id="all">
    <BinaryTree
        :structuredTree="structuredTree"
        @selectNode="getSelectedNode"
    />
    <aside>
      <NodeMenu
          v-if="selectedNode !== null"
          :nodeId="selectedNode"
          :nodeType="checkNodeInsertion(selectedNode)"
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

onMounted(async () => {
  const treeData = await useConsumer();
  structuredTree.value = treeData.structuredTree?.value ?? [];
});

const selectedNode = ref<number | null>(null);

const getSelectedNode = (nodeId: number) => {
  selectedNode.value = selectedNode.value === nodeId ? null : nodeId;
};

const updateNodeTree = (nodeTree: Node[]) => {
  structuredTree.value = nodeTree;
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