<template>
    <div>
        <CircleIcon width="60" height="60" class="icon" />
        <span>
            {{ props.node.nodeId }}
        </span>
    </div>
</template>

<script setup lang="tsx">
import type { Node } from '~/types/Node';
import CircleIcon from "@/assets/icons/circle.svg";

const props = defineProps<{
    node: Node
}>();
</script>