<script setup lang="ts">
import {ref} from "vue";
import Node from "@/components/Node.vue";

const currentNode = ref(Node);
</script>

<template>
  <div id="node-menu">
    <span id="node-value">
      <input v-model="nodeValue" placeholder="Node Value" />
      <button type="submit" @click="" ></button>
    </span>
  </div>
</template>

<style scoped>

</style>