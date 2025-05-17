import { defineStore } from 'pinia';
import type { User, AuthState } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null as string | null,
  });

  async function login(login: string, password: string) {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    const data = await res.json();
    if (data.token) {
      state.token = data.token;
      localStorage.setItem('token', data.token);
      await fetchMe();
      state.isAuthenticated = true;
      return true;
    }
    return false;
  }

  async function register(login: string, password: string, role = 'worker') {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password, role }),
    });
    const data = await res.json();
    if (data.token) {
      state.token = data.token;
      localStorage.setItem('token', data.token);
      await fetchMe();
      state.isAuthenticated = true;
      return true;
    }
    return false;
  }

  async function fetchMe() {
    const token = state.token || localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data && !data.error) {
      state.user = data;
      state.isAuthenticated = true;
    } else {
      state.user = null;
      state.isAuthenticated = false;
    }
  }

  function logout() {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
    localStorage.removeItem('token');
  }

  function hasPermission(permission: 'canEditProducts' | 'canManageLogistics'): boolean {
    if (state.user?.role === 'root') return true;
    return state.user?.[permission] === true;
  }

  return {
    ...toRefs(state),
    login,
    register,
    fetchMe,
    logout,
    hasPermission,
  };
}); 