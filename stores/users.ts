import { defineStore } from 'pinia';
import type { User } from '~/types';

export const useUsersStore = defineStore('users', () => {
  const state = reactive({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  });

  async function fetchUsers() {
    state.loading = true;
    state.error = null;
    try {
      const res = await fetch('/api/users');
      state.users = await res.json();
    } catch (error) {
      state.error = 'Ошибка при загрузке пользователей';
    } finally {
      state.loading = false;
    }
  }

  async function addUser(user: Omit<User, 'id'>) {
    state.loading = true;
    state.error = null;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.id) await fetchUsers();
    } catch (error) {
      state.error = 'Ошибка при добавлении пользователя';
    } finally {
      state.loading = false;
    }
  }

  async function deleteUser(id: string) {
    state.loading = true;
    state.error = null;
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      await fetchUsers();
    } catch (error) {
      state.error = 'Ошибка при удалении пользователя';
    } finally {
      state.loading = false;
    }
  }

  return {
    ...toRefs(state),
    fetchUsers,
    addUser,
    deleteUser,
  };
}); 