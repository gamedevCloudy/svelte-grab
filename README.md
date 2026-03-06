# svelte-grab

> Hover any element → press `Cmd+C` → instantly copy its component name, source file, and HTML snippet to your clipboard.

A developer productivity tool for SvelteKit projects. Stop manually hunting for component files — let `svelte-grab` tell you exactly where any DOM element comes from.

## Install

```bash
bun add -d svelte-grab
```

## Usage

Add `<SvelteGrab />` to your root layout (only in dev mode):

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { dev } from '$app/environment'
  import SvelteGrab from 'svelte-grab'
</script>

{#if dev}
  <SvelteGrab />
{/if}

{@render children?.()}
```

That's it. In dev mode, hover any element and press `Cmd+C` (Mac) or `Ctrl+C` (Windows/Linux). The clipboard will contain:

```
Button @ src/lib/Button.svelte:42

<button class="btn btn-primary">
  Click me
</button>
```

## Options

```svelte
<SvelteGrab options={{
  activationKey: 'c',         // key to press with Cmd/Ctrl (default: 'c')
  freezeOnGrab: false,        // pause CSS animations while inspecting
  onCopy: (ctx) => {},        // callback after copy
  onError: (err) => {},       // callback on error
}} />
```

## Programmatic API

```ts
import { init, freeze, unfreeze, getElementContext } from 'svelte-grab'

// Manual initialization
const cleanup = init({ activationKey: 'g' })

// Freeze/unfreeze page animations
freeze()
unfreeze()

// Get element info programmatically
const ctx = await getElementContext(document.querySelector('button')!)
console.log(ctx.componentName, ctx.sourceFile, ctx.htmlSnippet)
```

## Plugin System

```ts
import { registerPlugin } from 'svelte-grab'
import { copyHtmlPlugin, copyStylesPlugin } from 'svelte-grab'

// Copy raw HTML only
registerPlugin(copyHtmlPlugin)

// Copy computed CSS
registerPlugin(copyStylesPlugin)

// Custom plugin
registerPlugin({
  name: 'my-plugin',
  onCopy(ctx) {
    return `[${ctx.componentName}] ${ctx.cssSelector}`
  },
})
```

## How it works

In Svelte dev mode, component instances expose `__svelte_meta` on DOM nodes with source file location info. `svelte-grab` reads this metadata to display the component name and file path in the overlay label, and includes it in the copied snippet.

## License

MIT
