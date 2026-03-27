export function buildInviteLink(token: string): string {
  const base = window.location.origin + import.meta.env.BASE_URL;
  return `${base}register?token=${token}`.replace(/\/+/g, '/');
}
