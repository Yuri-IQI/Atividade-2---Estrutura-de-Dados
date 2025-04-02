<template>
  <div class="nodeMenu">
    <span>Nó: {{ `${node.nodeId}` }}</span>
    <div id="value">
      <label for="node-value">Valor do Nó:</label>
      <input id="node-value" class="value-input" v-model="nodeValue" placeholder="Valor do Nó" />
    </div>
    <button @click="setNodeValue(node)" :disabled="!nodeValue.trim()">{{ nodeType === NodeTypeEnum.BLANK ? 'Criar Nó' : 'Atualizar Nó' }}</button>
  </div>
  <div class="nodeMenu" v-if="nodeType === NodeTypeEnum.ACTIVE">
    <span>
      <p v-if="node.leftId">{{ 'Esquerda: ' + node.leftId }}</p>
      <p v-if="node.rightId">{{ 'Direita: ' + node.rightId }}</p>
    </span>
    <div id="child-inputs" v-if="!node.rightId || !node.leftId">
      <label for="child">Valor do Filho: </label>
      <input id="child" class="value-input" v-model="childValue" placeholder="Valor do Filho" />
      <div id="buttons">
        <span id="position">Posição: 
          <span>
            <button v-if="!node.leftId" @click="setPosition('L')">Esquerda</button>
            <button v-if="!node.rightId" @click="setPosition('R')">Direita</button>
          </span>
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

    const { data } = await axios.post('https://cinco-backend-byr2.onrender.com/insert', nodeRequest);
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
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

#buttons {
  display: flex;
  justify-content: space-between;
  margin: 0.4em 0.2em 0.2em 0.2em;
  flex-direction: column;
  gap: 0.4em;
}

.value-input {
  width: 6em;
}

#child-inputs {
  width: 100%;
}

#position {
  display: flex;
  flex: 1;
}

#position span {
  display: flex;
  justify-content: space-around;
  flex: 1;
}
p {
  margin: 0;
}
</style>