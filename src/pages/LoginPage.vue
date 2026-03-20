<template>
  <div class="flex min-h-screen items-center justify-center bg-white p-4">
    <div class="w-full max-w-sm rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-lg">
      <h1 class="mb-1 text-xl font-semibold text-zinc-900">WorkHub</h1>
      <p class="mb-6 text-sm text-zinc-600">Увійдіть до свого акаунта</p>
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LoginForm } from '@/features/auth';
</script>
