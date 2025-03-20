<template>
  <div class="nodeMenu">
    <span>{{ `Node ID: ${nodeId}` }}</span>
    <div>
      <label for="node-value">Valor do Nó:</label>
      <input id="node-value" v-model="nodeValue" placeholder="Valor do Nó" />
      <button @click="createNode">Create Node</button>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import axios from 'axios';
import type { NodeRequest } from '~/types/NodeRequest';
import type { NodeTypeEnum } from '~/types/NodeTypeEnum';

const props = defineProps<{
  nodeId: number;
  nodeType: NodeTypeEnum;
  parentId?: number;
}>();

const nodeValue = ref<string>('');

const createNode = async () => {
  try {
    const nodeRequest: NodeRequest = {
      id: props.nodeId,
      value: nodeValue.value,
      parent: props.parentId ?? 0,
    };

    const response = await axios.post('http://localhost:4000/insert', nodeRequest);
    console.log('Node created:', response);
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
}
</style>