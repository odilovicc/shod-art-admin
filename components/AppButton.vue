<template>
  <button
    :type="type"
    :class="[
      'app-btn',
      variantClass,
      sizeClass,
      { 'opacity-60 pointer-events-none': loading || disabled }
    ]"
    :disabled="loading || disabled"
    v-bind="$attrs"
  >
    <span v-if="loading" class="loader mr-2"></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // primary, secondary, danger
  size: { type: String, default: 'md' }, // sm, md, lg
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const variantClass = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'app-btn--secondary';
    case 'secondary-purple':
      return 'app-btn--secondary-purple';
    case 'danger':
      return 'app-btn--danger';
    case 'outline':
      return 'app-btn--outline'; 
    default:
      return 'app-btn--primary';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'app-btn--sm';
    case 'lg':
      return 'app-btn--lg';
    default:
      return 'app-btn--md';
  }
});
</script>

<style scoped>
@import '~/assets/css/components/button.css';
</style> 