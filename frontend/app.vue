<script setup lang="tsx">
import BinaryTree from './components/BinaryTree.vue';
import { useConsumer } from '~/composables/useConsumer';

const structuredTree = await useConsumer();
</script>

<template>
  <div>
    <BinaryTree :structuredTree="structuredTree" />
  </div>
</template>