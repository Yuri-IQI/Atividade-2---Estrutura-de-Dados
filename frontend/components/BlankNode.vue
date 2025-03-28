<template>
  <div class="tooltip-container">
    <div 
      @click="insertNewNode" 
      class="blank-node" 
      tabindex="0"
      @mouseover="showTooltip = true"
      @mouseleave="showTooltip = false"
    ></div>
    <div v-if="showTooltip" class="tooltip">Insira o nó raíz</div>
  </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
import type { TreeNode } from "~/types/TreeNode";

const props = defineProps<{ 
  nodeId: number,
  parentId: number | null,
  position: string | null
}>();
const emit = defineEmits(["selectNode"]);
const showTooltip = ref(false);

const insertNewNode = () => {
  const node: TreeNode = {
    nodeId: props.nodeId,
    parentId: props.parentId,
    nodeValue: undefined,
    leftId: null,
    rightId: null,
    degree: null,
    position: props.position
  };
  emit("selectNode", node);
};
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 6px;
  border-radius: 4px;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  white-space: nowrap;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s;
}

.blank-node {
  cursor: pointer;
  width: 4em;
  height: 4em;
  border: 0.4em dashed black;
  border-radius: 50%;
  animation: spin 30000ms infinite linear;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
