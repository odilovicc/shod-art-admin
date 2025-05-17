<script setup lang="ts">
// Глобальный middleware для проверки аутентификации
definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <NuxtLayout :name="$route.path === '/login' ? 'blank' : 'default'">
    <NuxtPage />
  </NuxtLayout>
</template>
