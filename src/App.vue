<script setup lang="ts">
import BinaryTree from "@/components/BinaryTree.vue";
import {ref} from "vue";
import Menu from "@/components/AssetsMenu/Menu.vue";

const nodes = ref<Node[]>([])
</script>

<template>
  <main id="literally-everything">
    <BinaryTree :listOfNodes="nodes" />
    <Menu />
  </main>
</template>

<style scoped>
</style>
