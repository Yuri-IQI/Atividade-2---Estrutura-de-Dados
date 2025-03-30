<template>
    <div class="tooltip-container">
        <div class="node-seq" :id="'seq-' + nodeId" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
            {{ nodeId }}
        </div>
        <div v-if="showTooltip" class="tooltip">{{ nodeValue }}</div>
    </div>
</template>

<script setup lang="ts">
const showTooltip = ref(false);
const props = defineProps<{
    nodeId: number,
    nodeValue: string
}>();
</script>

<style scoped>
.node-seq {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20pt;
	padding: 0.8em;
	border: 1px solid;
}

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
  z-index: 100;
}
</style>