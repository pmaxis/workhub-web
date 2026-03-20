import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

export type NavLink = {
  type: 'link';
  name: string;
  label: string;
  to: RouteLocationRaw;
};

const navStructure: NavLink[] = [
  { type: 'link', name: 'home', label: 'Головна', to: { name: 'home' } },
];

export function useSidebarNav() {
  const route = useRoute();

  const navItems = computed(() => navStructure);

  function isActive(item: NavLink): boolean {
    return route.name === item.name;
  }

  return {
    navItems,
    isActive,
  };
}
