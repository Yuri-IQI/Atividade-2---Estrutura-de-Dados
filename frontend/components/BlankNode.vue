<template>
    <div @click="insertNewNode" class="blank-node" tabindex="0">
        <BlankNodeIcon width="60" height="60" class="icon" />
    </div>
</template>

<script setup lang="tsx">
import BlankNodeIcon from '@/assets/icons/blank-node.svg';

const props = defineProps<{ nodeId: number }>();
const emit = defineEmits(['selectNode']);
console.log(props.nodeId);

const insertNewNode = () => {
  emit('selectNode', props.nodeId);
};
</script>

<style scoped>
.blank-node {
  cursor: pointer;
}
</style>