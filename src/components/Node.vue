<script setup>
import { ref } from 'vue'

const predecessor = ref(null)
const value = ref(null)
const successor = ref(null)
</script>

<template>
  <div>
    <span>
      {{ value }}
    </span>
  </div>
</template>

<style scoped>

</style>