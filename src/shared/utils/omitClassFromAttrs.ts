export function omitClassFromAttrs(attrs: object): Record<string, unknown> {
  const rest = { ...(attrs as Record<string, unknown>) };
  delete rest.class;
  return rest;
}
