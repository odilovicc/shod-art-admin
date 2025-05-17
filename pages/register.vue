<template>
  <div class="register-page">
    <div class="register-form">
      <h1 class="register-form__title">Регистрация</h1>
      <form @submit.prevent="handleRegister" class="register-form__fields">
        <AppInput
          v-model="login"
          type="login"
          label="login"
          required
        />
        <AppInput
          v-model="password"
          type="password"
          label="Пароль"
          required
        />
        <AppInput
          v-model="repeat"
          type="password"
          label="Повторите пароль"
          required
        />
        <div>
          <label class="app-input__label">Роль</label>
          <select v-model="role" class="app-input__field">
            <option value="worker">Работник</option>
            <option value="manager">Менеджер</option>
            <option value="logistics">Логист</option>
            <option value="smm">SMM</option>
            <option value="it">IT</option>
            <option value="root">Владелец</option>
          </select>
        </div>
        <div v-if="error" class="register-form__error">{{ error }}</div>
        <div class="register-form__actions">
          <AppButton type="submit" class="register-form__submit">Зарегистрироваться</AppButton>
        </div>
      </form>
      <div class="register-form__footer">
        Уже есть аккаунт?
        <NuxtLink to="/login" class="register-form__link">Войти</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import AppInput from '~/components/AppInput.vue';
import AppButton from '~/components/AppButton.vue';

const authStore = useAuthStore();
const router = useRouter();

const login = ref('');
const password = ref('');
const repeat = ref('');
const role = ref('worker');
const error = ref('');

async function handleRegister() {
  error.value = '';
  if (password.value !== repeat.value) {
    error.value = 'Пароли не совпадают';
    return;
  }
  const ok = await authStore.register(login.value, password.value, role.value);
  if (ok) {
    router.push('/');
  } else {
    error.value = 'Ошибка регистрации или такой login уже существует';
  }
}
</script>

<style src="~/assets/css/pages/register.css"></style> 