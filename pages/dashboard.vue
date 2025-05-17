<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();

const navigation = computed(() => {
  const items = [
    {
      name: 'Товары',
      href: '/dashboard/products',
      icon: 'i-heroicons-cube',
      show: true,
    },
  ];

  if (authStore.user?.role === 'root') {
    items.push({
      name: 'Пользователи',
      href: '/dashboard/users',
      icon: 'i-heroicons-users',
      show: true,
    });
  }

  return items;
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <slot />
</template> 