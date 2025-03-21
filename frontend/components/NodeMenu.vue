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
import type {Node} from "~/types/Node";

const props = defineProps<{
  nodeId: number;
  nodeType: NodeTypeEnum;
  parentId?: number;
}>();

const emit = defineEmits(['updateNodeTree']);

const nodeValue = ref<string>('');

const createNode = async () => {
  try {
    const nodeRequest: NodeRequest = {
      nodeId: props.nodeId,
      nodeValue: nodeValue.value,
      parentId: props.parentId ?? 0,
    };

    const response = await axios.post('http://localhost:4500/insert', nodeRequest);
    updateNodeTree(response.data.tree)
  } catch (error) {
    console.error('Error creating node:', error);
  }
};

const updateNodeTree = (nodeTree: Node[]) => {
  console.log(nodeTree);
  emit('updateNodeTree', nodeTree);
}
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