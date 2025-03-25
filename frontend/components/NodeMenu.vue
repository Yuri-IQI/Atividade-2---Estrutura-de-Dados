<template>
  <div class="nodeMenu">
    <span>{{ `Node ID: ${node.nodeId}` }}</span>
    <div>
      <label for="node-value">Valor do Nó:</label>
      <input id="node-value" v-model="nodeValue" placeholder="Valor do Nó" />
      <button @click="createNode" :disabled="!nodeValue.trim()">Create Node</button>
    </div>
  </div>
</template>

<script setup lang="tsx">
import axios from 'axios';
import type { NodeRequest } from '~/types/NodeRequest';
import { NodeTypeEnum } from '~/types/NodeTypeEnum';
import type { Node } from "~/types/Node";

const props = defineProps<{ node: Node; nodeType: NodeTypeEnum }>();
const emit = defineEmits(['updateNodeTree']);

const nodeValue = ref('');

watch(() => props.nodeType,
  (newType) => {
    nodeValue.value = newType === NodeTypeEnum.BLANK ? '' : props.node.nodeValue;
  },{ immediate: true }
);

const createNode = async () => {
  if (!nodeValue.value.trim()) return;

  try {
    const nodeRequest: NodeRequest = {
      nodeId: props.node.nodeId,
      nodeValue: nodeValue.value.trim(),
      parentId: props.node.parentId ?? null,
      position: props.node.position
    };

    const { data } = await axios.post('http://localhost:4500/insert', nodeRequest);
    emit('updateNodeTree', data.tree);
    nodeValue.value = '';
  } catch (error) {
    console.error('Error creating node:', error);
  }
};
</script>

<style scoped>
.nodeMenu {
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>