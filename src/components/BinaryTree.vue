<script setup lang="ts">
import Node from "@/components/Node.vue";

const props = defineProps<{
  listOfNodes: Node[];
}>();
</script>

<template>
  <div id="binary-tree">
    <div v-for="(node, index) in listOfNodes" :key="index">
      <Node />
    </div>
  </div>
</template>

<style scoped>
</style>
