<template>
  <div class="nodeMenu">
    <span>{{ `${node.nodeId}` }}</span>
    <div id="value">
      <label for="node-value">Valor do Nó:</label>
      <input id="node-value" v-model="nodeValue" placeholder="Valor do Nó" />
    </div>
    <button @click="setNodeValue(node)" :disabled="!nodeValue.trim()">{{ nodeType === NodeTypeEnum.BLANK ? 'Criar Nó' : 'Atualizar Nó' }}</button>
  </div>
  <div class="nodeMenu" v-if="nodeType === NodeTypeEnum.ACTIVE">
    <span>{{ `Filhos: ${node.rightId && node.leftId ? node.leftId + ', ' + node.rightId : (node.rightId ? node.rightId : (node.leftId ? node.leftId : '')) }` }}</span>
    <div id="child-inputs" v-if="!node.rightId || !node.leftId">
      <label for="child">Valor do Filho: </label>
      <input id="child" v-model="childValue" placeholder="Valor do Filho" />
      <div id="buttons">
        <span>
          <button v-if="!node.leftId" @click="setPosition('L')">Esquerda</button>
          <button v-if="!node.rightId" @click="setPosition('R')">Direita</button>
        </span>
        <button @click="createChild" :disabled="childValue === '' || childPosition === ''">Criar Filho</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import axios from 'axios';
import type { NodeRequest } from '~/types/NodeRequest';
import { NodeTypeEnum } from '~/types/NodeTypeEnum';
import type { TreeNode } from "~/types/TreeNode";

const props = defineProps<{ 
  node: TreeNode; 
  nodeType: NodeTypeEnum;
  structuredTree: TreeNode[] 
}>();
const emit = defineEmits(['updateNodeTree']);

const nodeValue = ref('');

const childValue = ref('');
const childPosition = ref('')

watch(() => props.nodeType,
  (newType) => {
    nodeValue.value = newType === NodeTypeEnum.BLANK ? '' : props.node.nodeValue;
  },{ immediate: true }
);

const setPosition = (position: string) => {
  childPosition.value = position;
}

const getChildId = () => {
  return props.structuredTree.length ? Math.max(...props.structuredTree.map(n => n.nodeId)) + 1 : 0;
};

const createChild = () => {
  console.log(childPosition.value)
  const node: TreeNode = {
    nodeId: getChildId(),
    nodeValue: childValue.value,
    parentId: props.node.nodeId,
    leftId: null,
    rightId: null,
    position: childPosition.value,
    degree: 0
  }

  createNode(node);
}

const setNodeValue = (node: TreeNode) => {
  node.nodeValue = nodeValue.value;
  createNode(node);
}

const createNode = async (node: TreeNode) => {
  try {
    const nodeRequest: NodeRequest = {
      nodeId: node.nodeId,
      nodeValue: node.nodeValue.trim(),
      parentId: node.parentId ?? null,
      position: node.position
    };

    console.log(nodeRequest);
    const { data } = await axios.post('http://localhost:4500/insert', nodeRequest);
    emit('updateNodeTree', data.tree);
  } catch (error) {
    console.error('Error creating node:', error);
  }
};

watch(() => props.node, (newNode) => {
  nodeValue.value = newNode.nodeValue;
  childValue.value = '';
  childPosition.value = newNode.leftId ? 'L' : 'R';
});
</script>

<style scoped>
.nodeMenu {
  padding: 0.4em;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4em;
}

#value {
  display: flex;
  gap: 0.4em;
}

#buttons {
  display: flex;
  justify-content: space-between;
  margin: 0.2em;
}
</style>