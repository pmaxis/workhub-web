<template>
  <div class="relative flex shrink-0">
    <aside class="flex w-64 shrink-0 flex-col bg-white shadow-[4px_0_6px_-1px_rgb(0_0_0_/0.08)]">
      <SidebarHeader />
      <SidebarMain />
      <div class="relative z-20 shrink-0">
        <SidebarUserMenu
          ref="userMenuRef"
          :user="auth.user"
          :user-pib="userPib"
          :user-initials="userInitials"
          :is-open="isUserMenuOpen"
          @logout="handleLogout"
        />
        <SidebarFooter
          ref="footerRef"
          :user-initials="userInitials"
          :is-user-menu-open="isUserMenuOpen"
          :has-notifications="hasNotifications"
          @toggle-menu="isUserMenuOpen = !isUserMenuOpen"
          @notifications="handleNotifications"
        />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/features/auth';
import SidebarHeader from '@/widgets/sidebar/ui/SidebarHeader.vue';
import SidebarMain from '@/widgets/sidebar/ui/SidebarMain.vue';
import SidebarFooter from '@/widgets/sidebar/ui/SidebarFooter.vue';
import SidebarUserMenu from '@/widgets/sidebar/ui/SidebarUserMenu.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuth();

const footerRef = ref<InstanceType<typeof SidebarFooter> | null>(null);
const userMenuRef = ref<InstanceType<typeof SidebarUserMenu> | null>(null);
const isUserMenuOpen = ref(false);
const hasNotifications = ref(true);

const userPib = computed(() => {
  const u = auth.user;
  if (!u) return '';
  const parts = [u.lastName, u.firstName, u.thirdName].filter(Boolean);
  return parts.length ? parts.join(' ') : '';
});

const userInitials = computed(() => {
  const u = auth.user;
  if (!u) return 'U';
  const initials = `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.trim();
  if (initials) return initials.toUpperCase();
  return u.email.slice(0, 1).toUpperCase();
});

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node;
  if (footerRef.value?.buttonRef?.contains(target)) return;
  if (userMenuRef.value?.panelRef?.contains(target)) return;
  if (isUserMenuOpen.value) isUserMenuOpen.value = false;
}

async function handleLogout() {
  isUserMenuOpen.value = false;
  await auth.logout();
  router.replace({ name: 'login' });
}

function handleNotifications() {
  router.push({ name: 'notifications' });
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true);
});

watch(
  () => route.name,
  (name) => {
    if (name === 'myAccount' || name === 'myAccountEdit' || name === 'companySettings') {
      isUserMenuOpen.value = false;
    }
  },
);

</script>
