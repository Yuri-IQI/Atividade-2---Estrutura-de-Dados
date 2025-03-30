<template>
  <div id="tree-menu" class="menu" v-if="treeInfo">
    <h3>Informações da Árvore</h3>
    <div class="info">
      <span>Grau: {{ treeInfo.treeDegree }}</span>
      <span>Altura: {{ treeInfo.treeHeight }}</span>
      <span id="leaves">Folhas: 
        <p v-for="leaf in treeInfo.treeLeaves" :key="leaf.nodeId">
          {{ leaf.nodeId.toString() }}
        </p>
      </span>
      <span>Nível: {{ treeInfo.treeLevel }}</span>
    </div>
  </div>
  <div id="node-menu" class="menu" v-if="selectedNode?.nodeValue">
    <h3>Informações do Nó: {{ selectedNode.nodeId }}</h3>

  </div>
</template>

<script lang="ts" setup>
import { useConsumer } from '~/composables/useConsumer';
import type { TreeInfo } from '~/types/TreeInfo';
import type { TreeNode } from '~/types/TreeNode';

const treeInfo = ref<TreeInfo>();
const props = defineProps<{
  selectedNode: TreeNode | null
}>()

onMounted(async () => {
  const tree = await useConsumer(props.selectedNode?.nodeId);
  if (tree.treeInfo.value) {
    treeInfo.value = tree.treeInfo.value;
  }

  if (tree.nodeInfo.value) {
    console.log(tree.nodeInfo)
  }
});
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