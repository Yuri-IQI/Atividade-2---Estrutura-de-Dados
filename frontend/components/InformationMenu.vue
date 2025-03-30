<template>
  <div id="information">
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
      <span>Posição: {{ nodeFamily.isLeftChild ? 'Esquerda' : 'Direita' }}</span>
      <span>Nó Pai: {{ nodeFamily.parent.nodeId }}</span>
      <span v-if="nodeFamily.sibling">Nó Irmão: {{ nodeFamily.sibling.nodeId }}</span>
      <span v-if="nodeFamily.uncle">Nó Tio: {{ nodeFamily.uncle?.nodeId }}</span>
    </div>
  </div>
  <div id="search-and-traversal" class="menu">
    <h3>Percursos</h3>
    <div id="traversal-buttons">
      <button @click="displayTraversal(TraversalTypes.PREORDER)" class="traversal-bt">Pré Ordem</button>
      <button @click="displayTraversal(TraversalTypes.INORDER)" class="traversal-bt">Em Ordem</button>
      <button @click="displayTraversal(TraversalTypes.POSTORDER)" class="traversal-bt">Pós Ordem</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useConsumer } from '~/composables/useConsumer';
import type { NodeFamilyInfo } from '~/types/NodeFamilyInfo';
import type { NodeInfo } from '~/types/NodeInfo';
import { TraversalTypes } from '~/types/TraversalTypes';
import type { TreeInfo } from '~/types/TreeInfo';
import type { TreeNode } from '~/types/TreeNode';

const treeInfo = ref<TreeInfo>();
const nodeInfo = ref<NodeInfo | null>(null);
const nodeFamily = ref<NodeFamilyInfo | null>(null);
const props = defineProps<{
  selectedNode: TreeNode | null
}>()
const emit = defineEmits(['displayTraversal']);

const displayTraversal = (traversalType: TraversalTypes) => {
  emit('displayTraversal', traversalType);
}

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
      const { nodeInfo: newNodeInfo, nodeFamilyInfo: newNodeFamily } = await useConsumer(newSelectedNode.nodeId, null);
      nodeInfo.value = newNodeInfo?.value || null;
      nodeFamily.value = newNodeFamily?.value || null;
      console.log(nodeFamily.value);

    } catch (error) {
      nodeInfo.value = null;
    }
  } else {
    nodeInfo.value = null
  }
})
</script>

<style scoped>
#information {
  max-width: 60%;
}

.menu {
  padding: 0.4em;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
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