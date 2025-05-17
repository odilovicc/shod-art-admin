<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterPaths } from '~/types/router';
import { useAuthStore } from '~/stores/auth';
import { CubeIcon, UsersIcon, Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const sidebarOpen = ref(false);

const navigation = computed(() => {
  const items = [
    {
      name: 'Товары',
      href: RouterPaths.PRODUCTS,
      icon: CubeIcon,
      show: true,
    },
  ];
  if (authStore.user?.role === 'root') {
    items.push({
      name: 'Пользователи',
      href: RouterPaths.USERS,
      icon: UsersIcon,
      show: true,
    });
  }
  return items;
});

const handleLogout = () => {
  authStore.logout();
  router.push(RouterPaths.LOGIN);
};

const roleColor = computed(() =>
  authStore.user?.role === 'root' ? 'text-[#B91C1C] font-bold' : 'text-[#697386]'
);

onMounted(() => {
  if(localStorage.getItem('token')) {
    authStore.fetchMe()
  }
});
</script>

<template>
  <div v-if="['/login', '/register'].includes(route.path)">
    <slot />
  </div>
  <div v-else class="min-h-screen bg-[#F7F9FC] font-jakarta">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed z-30 top-0 left-0 h-full flex flex-col items-center bg-white shadow-[0_0_40px_0_rgba(94,92,154,0.06)] transition-all duration-300',
        'w-20 md:w-20',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <div class="flex flex-col items-center w-full py-8">
        <span class="text-2xl font-extrabold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent select-none">
          S
        </span>
      </div>
      <nav class="flex-1 flex flex-col gap-4 items-center w-full mt-8">
        <NuxtLink
          v-for="item in navigation"
          :key="item.href"
          :to="item.href"
          class="group flex flex-col items-center justify-center w-14 h-14 mx-auto rounded-xl transition-all duration-200 relative"
          :class="route.path === item.href ? 'bg-[#F0F4FF] text-[#4F46E5] shadow-sm' : 'hover:bg-[#F7F9FC] text-[#697386]'"
        >
          <component :is="item.icon" class="w-7 h-7" />w
          <span
            class="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-white shadow text-xs font-medium text-[#4F46E5] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-200 whitespace-nowrap"
          >
            {{ item.name }}
          </span>
        </NuxtLink>
      </nav>
      <div class="mt-auto mb-8 flex flex-col items-center w-full">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-bold text-lg mb-2">
          {{ authStore.user?.login?.[0]?.toUpperCase() }}
        </div>
        <span class="text-xs text-[#1A1F36] text-center w-20 truncate font-semibold">{{ authStore.user?.login }}</span>
        <span :class="'text-xs mt-1 ' + roleColor">{{ authStore.user?.role === 'root' ? 'Владелец' : authStore.user?.role }}</span>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-20 bg-black bg-opacity-30 md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Header -->
    <header class="sticky top-0 z-10 flex items-center h-16 bg-white shadow-sm pl-24 md:pl-24 pr-4 md:pr-8">
      <button
        class="md:hidden mr-4 text-2xl text-[#4F46E5] focus:outline-none"
        @click="sidebarOpen = !sidebarOpen"
      >
        <Bars3Icon class="w-7 h-7" />
      </button>
      <span class="text-xl font-bold text-[#4F46E5] tracking-tight mr-8 select-none">Shod Art Admin</span>
      <nav class="hidden md:flex gap-6">
        <NuxtLink
          v-for="item in navigation"
          :key="item.href"
          :to="item.href"
          class="text-sm font-medium px-2 py-1 rounded transition-colors flex items-center"
          :class="route.path === item.href ? 'text-[#4F46E5] bg-[#F0F4FF]' : 'text-[#697386] hover:text-[#4F46E5]'"
        >
          <component :is="item.icon" class="w-5 h-5 mr-1" />
          {{ item.name }}
        </NuxtLink>
      </nav>
      <div class="ml-auto flex items-center gap-4">
        <span class="hidden md:block text-sm text-[#697386]">{{ authStore.user?.login }}</span>
        <button
          class="p-2 text-[#697386] hover:text-[#4F46E5] hover:bg-[#F0F4FF] rounded-lg transition-all"
          @click="handleLogout"
        >
          <ArrowRightOnRectangleIcon class="w-6 h-6" />
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="md:ml-24 ml-0 pt-8 px-4 md:px-12 transition-all duration-300">
      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-jakarta {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Скрыть подписи в сайдбаре на мобильных */
@media (max-width: 767px) {
  aside .group span:not([class*='icon']) {
    display: none !important;
  }
}
</style> 