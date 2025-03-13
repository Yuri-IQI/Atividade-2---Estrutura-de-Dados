<script setup lang="ts">
import { ref } from 'vue'
import Node from "@/components/Node.vue";

const props = defineProps<{
  value?: string,
  predecessor?: Node,
  Successors?: Node[]
}>()
</script>

<template>
  <div>
    <span>
      {{ value }}
    </span>
  </div>
</template>

<style scoped>

</style>