<template>
    <div class="tooltip-wrapper">
        <slot @mouseover="showTooltip" @mouseleave="hideTooltip"></slot>
        <div v-if="visible" class="tooltip-box" :style="tooltipStyle">
            {{ text }}
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    text: string,
    position?: string
}>();
const visible = ref(false);

const showTooltip = () => {
    visible.value = true;
};

const hideTooltip = () => {
    visible.value = false;
};

const tooltipStyle = computed(() => {
    return props.position === "top" ? { bottom: "100%" } :
        props.position === "right" ? { left: "100%" } :
        props.position === "left" ? { right: "100%" } :
        { top: "100%" };
});
</script>

<style scoped>
.tooltip-wrapper {
    position: relative;
    display: inline-block;
}

.tooltip-box {
    position: absolute;
    background-color: black;
    color: white;
    padding: 6px;
    border-radius: 4px;
    white-space: nowrap;
    font-size: 14px;
    z-index: 100;
    transform: translateX(-50%);
}
</style>