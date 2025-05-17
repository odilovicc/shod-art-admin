<template>
  <span :class="['app-badge', `app-badge--${type}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  type: { type: String, default: 'default' }, // default, success, warning, danger, info
});
</script>

<style scoped>
@import '~/assets/css/components/badge.css';
</style> 