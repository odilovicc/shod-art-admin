<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import AppInput from '~/components/AppInput.vue';
import AppButton from '~/components/AppButton.vue';

const router = useRouter();
const authStore = useAuthStore();

const login = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleLogin() {
  loading.value = true;
  error.value = '';

  try {
    const success = await authStore.login(login.value, password.value);
    if (success) {
      router.push('/dashboard');
    } else {
      error.value = 'Неверный login или пароль';
    }
  } catch (err) {
    error.value = 'Произошла ошибка при входе';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-form">
      <h1 class="login-form__title">Вход</h1>
      <form @submit.prevent="handleLogin" class="login-form__fields">
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
        <div v-if="error" class="login-form__error">{{ error }}</div>
        <div class="login-form__actions">
          <AppButton :loading="loading" type="submit" class="login-form__submit">Войти</AppButton>
        </div>
      </form>
      <div class="login-form__footer">
        Нет аккаунта?
        <NuxtLink to="/register" class="login-form__link">Зарегистрироваться</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style src="~/assets/css/pages/login.css"></style> 