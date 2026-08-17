import fs from 'node:fs'
import path from 'node:path'

const ignore = new Set([
  'node_modules',
  '.nuxt',
  '.output',
  '.git',
  'dist',
  '.cache',
  '.data'
])

const maxDepth = 3

function walk(dir, depth = 0, lines = []) {
  if (depth > maxDepth) {
    return lines
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (ignore.has(entry.name)) {
      continue
    }

    const label = entry.isDirectory() ? `${entry.name}/` : entry.name
    lines.push(`${'  '.repeat(depth)}${label}`)

    if (entry.isDirectory()) {
      walk(path.join(dir, entry.name), depth + 1, lines)
    }
  }

  return lines
}

console.log(walk(process.cwd()).join('\n'))