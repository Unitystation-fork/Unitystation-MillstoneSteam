export function apiUrl(path) {
  return `${useRuntimeConfig().public.apiBase}${path}`;
}
