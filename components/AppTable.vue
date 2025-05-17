<template>
  <table class="app-table">
    <thead>
      <tr>
        <slot name="head" />
      </tr>
    </thead>
    <tbody>
      <slot />
    </tbody>
  </table>
</template>

<script setup lang="ts">
// Простой компонент таблицы с поддержкой слотов для гибкости
</script>

<style scoped>
@import '~/assets/css/components/table.css';
</style> 