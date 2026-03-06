#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { execSync } from 'node:child_process'

const [, , command] = process.argv

if (command === 'init') {
  runInit()
} else {
  console.log(`
svelte-grab CLI

Usage:
  npx svelte-grab init    Add <SvelteGrab /> to your SvelteKit layout
`)
}

function runInit() {
  const cwd = process.cwd()

  // Verify this is a SvelteKit project
  const pkgPath = join(cwd, 'package.json')
  if (!existsSync(pkgPath)) {
    console.error('Error: No package.json found. Run this in a SvelteKit project root.')
    process.exit(1)
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  if (!deps['@sveltejs/kit']) {
    console.error('Error: @sveltejs/kit not found. This tool is for SvelteKit projects.')
    process.exit(1)
  }

  // Find or create layout file
  const layoutPath = resolve(cwd, 'src/routes/+layout.svelte')
  let layoutContent = ''

  if (existsSync(layoutPath)) {
    layoutContent = readFileSync(layoutPath, 'utf-8')
    if (layoutContent.includes('SvelteGrab')) {
      console.log('✓ SvelteGrab is already installed in your layout.')
      return
    }
  }

  // Build new layout content
  const scriptBlock = `<script lang="ts">
  import { dev } from '$app/environment'
  import SvelteGrab from 'svelte-grab'
</script>

`

  const grabComponent = `{#if dev}
  <SvelteGrab />
{/if}

`

  if (!layoutContent) {
    // Create minimal layout
    writeFileSync(
      layoutPath,
      scriptBlock + grabComponent + `<slot />\n`,
      'utf-8'
    )
    console.log('✓ Created src/routes/+layout.svelte with SvelteGrab.')
  } else {
    // Inject into existing layout
    let updated = layoutContent

    // Add script imports
    if (updated.includes('<script')) {
      // Inject imports at top of existing script
      updated = updated.replace(
        /(<script[^>]*>)/,
        `$1\n  import { dev } from '$app/environment'\n  import SvelteGrab from 'svelte-grab'`
      )
    } else {
      updated = scriptBlock + updated
    }

    // Inject grab component before first slot/snippet
    if (updated.includes('<slot')) {
      updated = updated.replace('<slot', grabComponent + '<slot')
    } else {
      updated = updated + '\n' + grabComponent
    }

    writeFileSync(layoutPath, updated, 'utf-8')
    console.log('✓ Updated src/routes/+layout.svelte with SvelteGrab.')
  }

  // Install svelte-grab as devDependency
  console.log('Installing svelte-grab...')
  try {
    const pm = detectPackageManager(cwd)
    const installCmd =
      pm === 'bun' ? 'bun add -d svelte-grab' :
      pm === 'pnpm' ? 'pnpm add -D svelte-grab' :
      pm === 'yarn' ? 'yarn add -D svelte-grab' :
      'npm install -D svelte-grab'
    execSync(installCmd, { cwd, stdio: 'inherit' })
    console.log(`✓ Installed svelte-grab using ${pm}.`)
  } catch {
    console.log('⚠ Could not auto-install. Run: npm install -D svelte-grab')
  }

  console.log('\nDone! svelte-grab is active in dev mode.')
  console.log('Hover any element and press Cmd+C (Mac) or Ctrl+C (Win/Linux) to copy its location.')
}

function detectPackageManager(cwd: string): string {
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) return 'bun'
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn'
  return 'npm'
}
