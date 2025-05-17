<template>
  <div class="app-input">
    <label v-if="label" class="app-input__label">{{ label }}</label>
    <input
      :type="type"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="['app-input__field', { 'app-input__field--error': error }]"
    />
    <div v-if="error" class="app-input__error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: String,
  error: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number],
});
</script>

<style scoped>
@import '~/assets/css/components/input.css';
</style> 