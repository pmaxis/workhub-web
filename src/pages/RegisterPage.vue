<template>
  <div class="flex min-h-screen items-center justify-center bg-white p-4">
    <div class="w-full max-w-sm rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-lg">
      <h1 class="mb-1 text-xl font-semibold text-zinc-900">WorkHub</h1>
      <p class="mb-6 text-sm text-zinc-600">Реєстрація нового акаунта</p>
      <RegisterForm />
      <p class="mt-4 text-center text-sm text-zinc-500">
        Вже є акаунт?
        <router-link :to="{ name: 'login' }" class="font-medium text-zinc-900 underline">
          Увійти
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RegisterForm } from '@/features/auth';
</script>
