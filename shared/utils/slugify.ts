export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function makeUniqueSlug(title: string, id: string, existingSlugs: Set<string>): string {
  const base = slugify(title)
  if (!existingSlugs.has(base)) {
    existingSlugs.add(base)
    return base
  }
  const suffix = id.slice(-4)
  const unique = `${base}-${suffix}`
  existingSlugs.add(unique)
  return unique
}