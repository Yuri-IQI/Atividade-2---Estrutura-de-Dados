<template>
    <div @click="insertNewNode" class="blank-node" tabindex="0">
    </div>
</template>

<script setup lang="tsx">
import type { Node } from '~/types/Node';


const props = defineProps<{ 
  nodeId: number,
  parentId: number | null,
  position: string | null
}>();
const emit = defineEmits(['selectNode']);
console.log(props.parentId);

const insertNewNode = () => {
  const node: Node = {
    nodeId: props.nodeId, 
    parentId: props.parentId,
    nodeValue: undefined,
    leftId: null,
    rightId: null,
    degree: null,
    position: props.position
  }

  emit('selectNode', node);
};
</script>

<style scoped>
.blank-node {
  cursor: pointer;
  width: 4em;
  height: 4em;
  border: 0.4em dashed black;
  border-radius: 50%;

  animation-name: spin;
  animation-duration: 30000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>