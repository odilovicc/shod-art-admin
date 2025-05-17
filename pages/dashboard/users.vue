<template>
  <div class="users-page">
    <div class="users-header">
      <h1 class="users-title">Пользователи</h1>
      <AppButton
        v-if="authStore.user?.role === 'root'"
        @click="showAddModal = true"
        class="users-add-btn"
      >
        Добавить пользователя
      </AppButton>
    </div>
    <div v-if="usersStore.loading" class="users-loading">
      <div class="users-spinner"></div>
    </div>
    <div v-else-if="usersStore.error" class="users-error">
      {{ usersStore.error }}
    </div>
    <div v-else class="products-table-wrapper">
      <table class="products-table">
        <thead>
          <tr>
            <th>login</th>
            <th>Роль</th>
            <th>Права</th>
            <th class="text-right">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersStore.users" :key="user.id">
            <td>
              <div>{{ user.login }}</div>
            </td>
            <td>
              <div>{{ user.role }}</div>
            </td>
            <td>
              <span v-if="user.canEditProducts" class="users-badge users-badge--green">
                Редактирование товаров
              </span>
              <span v-if="user.canManageLogistics" class="users-badge users-badge--blue">
                Управление логистикой
              </span>
            </td>
            <td class="users-actions">
              <button
                v-if="authStore.user?.role === 'root'"
                @click="editUser(user)"
                class="users-edit-btn"
              >
                Редактировать
              </button>
              <button
                v-if="authStore.user?.role === 'root'"
                @click="deleteUser(user.id)"
                class="users-delete-btn"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Модальное окно добавления пользователя -->
    <div v-if="showAddModal" class="users-modal-overlay">
      <div class="users-modal">
        <h2 class="users-modal-title">Добавить пользователя</h2>
        <form @submit.prevent="handleAddUser">
          <div class="users-modal-fields">
            <div>
              <label class="users-modal-label">login</label>
              <input v-model="userForm.login" type="login" required class="users-modal-input" />
            </div>
            <div>
              <label class="users-modal-label">Пароль</label>
              <input v-model="userForm.password" type="password" required class="users-modal-input" />
            </div>
            <div>
              <label class="users-modal-label">Роль</label>
              <select v-model="userForm.role" required class="users-modal-input">
                <option value="worker">Работник</option>
                <option value="manager">Менеджер</option>
                <option value="logistics">Логист</option>
                <option value="smm">SMM</option>
              </select>
            </div>
            <div>
              <label class="users-modal-label">
                <input v-model="userForm.canEditProducts" type="checkbox" class="users-modal-checkbox" />
                <span class="ml-2">Может редактировать товары</span>
              </label>
              <label class="users-modal-label">
                <input v-model="userForm.canManageLogistics" type="checkbox" class="users-modal-checkbox" />
                <span class="ml-2">Может управлять логистикой</span>
              </label>
            </div>
          </div>
          <div class="users-modal-actions">
            <button type="button" @click="showAddModal = false" class="users-modal-cancel">Отмена</button>
            <button type="submit" class="users-modal-save" :disabled="usersStore.loading">
              {{ usersStore.loading ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Модальное окно редактирования пользователя -->
    <div v-if="showEditModal" class="users-modal-overlay">
      <div class="users-modal">
        <h2 class="users-modal-title">Редактировать пользователя</h2>
        <form @submit.prevent="handleEditUser">
          <div class="users-modal-fields">
            <div>
              <label class="users-modal-label">Логин</label>
              <input v-model="userForm.login" type="name" required class="users-modal-input" />
            </div>
            <div>
              <label class="users-modal-label">Пароль</label>
              <input v-model="userForm.password" type="password" placeholder="Оставьте пустым, чтобы не менять" class="users-modal-input" />
            </div>
            <div>
              <label class="users-modal-label">Роль</label>
              <select v-model="userForm.role" required class="users-modal-input">
                <option value="worker">Работник</option>
                <option value="manager">Менеджер</option>
                <option value="logistics">Логист</option>
                <option value="smm">SMM</option>
              </select>
            </div>
            <div>
              <label class="users-modal-label">
                <input v-model="userForm.canEditProducts" type="checkbox" class="users-modal-checkbox" />
                <span class="ml-2">Может редактировать товары</span>
              </label>
              <label class="users-modal-label">
                <input v-model="userForm.canManageLogistics" type="checkbox" class="users-modal-checkbox" />
                <span class="ml-2">Может управлять логистикой</span>
              </label>
            </div>
          </div>
          <div class="users-modal-actions">
            <button type="button" @click="showEditModal = false" class="users-modal-cancel">Отмена</button>
            <button type="submit" class="users-modal-save" :disabled="usersStore.loading">
              {{ usersStore.loading ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsersStore } from '~/stores/users';
import { useAuthStore } from '~/stores/auth';
import type { User, UserForm } from '~/types';

const usersStore = useUsersStore();
const authStore = useAuthStore();

const showAddModal = ref(false);
const showEditModal = ref(false);
const editingUserId = ref<string | null>(null);

const userForm = ref<UserForm>({
  login: '',
  password: '',
  role: 'worker',
  canEditProducts: false,
  canManageLogistics: false,
});

onMounted(() => {
  usersStore.fetchUsers();
});

function resetForm() {
  userForm.value = {
    login: '',
    password: '',
    role: 'worker',
    canEditProducts: false,
    canManageLogistics: false,
  };
}

async function handleAddUser() {
  await usersStore.addUser(userForm.value);
  showAddModal.value = false;
  resetForm();
}

function editUser(user: User) {
  editingUserId.value = user.id;
  userForm.value = {
    login: user.login,
    password: '',
    role: user.role,
    canEditProducts: user.canEditProducts,
    canManageLogistics: user.canManageLogistics,
  };
  showEditModal.value = true;
}

async function handleEditUser() {
  if (editingUserId.value) {
    const updates = { ...userForm.value };
    if (!updates.password) {
      delete updates.password;
    }
    await usersStore.updateUser(editingUserId.value, updates);
    showEditModal.value = false;
    resetForm();
    editingUserId.value = null;
  }
}

async function deleteUser(id: string) {
  if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
    await usersStore.deleteUser(id);
  }
}
</script> 
<style src="~/assets/css/pages/users.css"></style>