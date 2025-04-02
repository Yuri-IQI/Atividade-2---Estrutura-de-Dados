<template>
    <div id="connections">
        <svg class="connection-line" :key="`${connection.parentId}-${connection.childId}`" :style="lineStyle" >
            <line
                :x1="start.x"
                :y1="start.y"
                :x2="end.x"
                :y2="end.y"
                stroke="black"
                
                stroke-width="2"
            />
        </svg>
    </div>
</template>
  
<script setup lang="ts">
import type { Connection } from '~/types/Connection';
import { computed, type CSSProperties } from 'vue';

const props = defineProps<{ connection: Connection }>();

const start = computed(() => props.connection.parentCoordinates);
const end = computed(() => props.connection.childCoordinates);

const lineStyle = computed(() => ({
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
} as CSSProperties));
</script>
  
<style scoped>
.connection-line {
    position: absolute;
    z-index: -1;
}
</style>  