<template>
  <div id="tree-menu" v-if="treeInfo">
    <h3>Informações da Árvore</h3>
    <div class="info">
      <span>Grau: {{ treeInfo.treeDegree }}</span>
      <span>Altura: {{ treeInfo.treeHeight }}</span>
      <span>Folhas: 
        <p v-for="leaf in treeInfo.treeLeaves" :key="leaf.nodeId">
          {{ leaf.nodeId.toString() }}
        </p>
      </span>
      <span>Nível: {{ treeInfo.treeLevel }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useConsumer } from '~/composables/useConsumer';
import type { TreeInfo } from '~/types/TreeInfo';

const treeInfo = ref<TreeInfo>();

onMounted(async () => {
    const tree = await useConsumer();
    if (tree.treeInfo.value) {
      treeInfo.value = tree.treeInfo.value;
      console.log(treeInfo.value)
    }
});
</script>

<style scoped>
#tree-menu {
  padding: 0.4em;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2em;
}

.info {
  display: flex;
  flex-direction: column;
}
</style>