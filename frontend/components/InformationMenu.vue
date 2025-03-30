<template>
  <div id="tree-menu" class="menu" v-if="treeInfo">
    <h3>Informações da Árvore</h3>
    <div class="info">
      <span>Grau: {{ treeInfo.treeDegree }}</span>
      <span>Altura: {{ treeInfo.treeHeight }}</span>
      <span id="leaves">Folhas: 
        <p>{{ treeInfo.treeLeaves.map(l => l.nodeId).toString().replaceAll(',', ', ') }}</p>
      </span>
      <span>Nível: {{ treeInfo.treeLevel }}</span>
    </div>
  </div>
  <div id="node-menu" class="menu" v-if="nodeInfo && selectedNode">
    <h3>Informações do Nó {{ selectedNode.nodeId }}</h3>
    <span>Nível: {{ nodeInfo.nodeLevel }}</span>
    <span>Profundidade: {{ nodeInfo.nodeDepth }}</span>
    <span>Altura: {{ nodeInfo.nodeHeight }}</span>
    <span>Grau: {{ nodeInfo.nodeDegree }}</span>
  </div>
  <div id="family-menu" class="menu" v-if="nodeFamily && selectedNode">
    <h3>Informações da Familia</h3>

  </div>
</template>

<script lang="ts" setup>
import { useConsumer } from '~/composables/useConsumer';
import type { NodeFamilyInfo } from '~/types/NodeFamilyInfo';
import type { NodeInfo } from '~/types/NodeInfo';
import type { TreeInfo } from '~/types/TreeInfo';
import type { TreeNode } from '~/types/TreeNode';

const treeInfo = ref<TreeInfo>();
const nodeInfo = ref<NodeInfo | null>(null);
const nodeFamily = ref<NodeFamilyInfo | null>(null);
const props = defineProps<{
  selectedNode: TreeNode | null
}>()

onMounted(async () => {
  try {
    const treeInfoResponse = await $fetch<TreeInfo>('http://localhost:4500/tree-info');
    treeInfo.value = treeInfoResponse;
  } catch (error) {
    console.error('Error fetching tree info:', error);
  }
});

watch(() => props.selectedNode, async (newSelectedNode) => {
  if (newSelectedNode?.nodeId || (newSelectedNode?.nodeId === 0 && newSelectedNode.nodeValue)) {
    try {
      const { nodeInfo: newNodeInfo, nodeFamilyInfoError: newNodeFamily } = await useConsumer(newSelectedNode.nodeId);
      nodeInfo.value = newNodeInfo.value;
      nodeFamily.value = newNodeFamily.value.;

    } catch (error) {
      nodeInfo.value = null;
    }
  } else {
    nodeInfo.value = null
  }
})
</script>

<style scoped>
.menu {
  padding: 0.4em;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2em;
}

h3 {
  margin: 0.2em;
}

.info {
  display: flex;
  flex-direction: column;
}

#leaves {
  display: flex;
  flex-direction: row;
  gap: 0.2em;
}

#leaves p {
  margin: 0;
}
</style>