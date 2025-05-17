export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Если пользователь не аутентифицирован и пытается получить доступ к защищенным маршрутам
  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login');
  }

  // Если пользователь аутентифицирован и пытается получить доступ к странице логина
  if (isAuthenticated && to.path === '/login') {
    return navigateTo('/dashboard');
  }

  // Если пользователь не аутентифицирован и пытается получить доступ к дашборду
  if (!isAuthenticated && to.path.startsWith('/dashboard')) {
    return navigateTo('/login');
  }
}); 