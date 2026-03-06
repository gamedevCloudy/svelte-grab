<div align="center">

<img src="https://raw.githubusercontent.com/gamedevCloudy/sveltekit-grab/main/packages/svelte-grab/assets/svelte-grab.webp" alt="sveltekit-grab logo" width="300" />

# sveltekit-grab

**Stop manually hunting for component files — let `sveltekit-grab` tell you exactly where any DOM element comes from.**

[![npm version](https://img.shields.io/npm/v/sveltekit-grab?style=flat-square&color=black)](https://www.npmjs.com/package/sveltekit-grab)
[![npm downloads](https://img.shields.io/npm/dm/sveltekit-grab?style=flat-square&color=black)](https://www.npmjs.com/package/sveltekit-grab)
[![GitHub stars](https://img.shields.io/github/stars/gamedevCloudy/sveltekit-grab?style=flat-square&color=black)](https://github.com/gamedevCloudy/sveltekit-grab)
[![license](https://img.shields.io/npm/l/sveltekit-grab?style=flat-square&color=black)](https://github.com/gamedevCloudy/sveltekit-grab/blob/main/LICENSE)

<br/>

![demo](https://raw.githubusercontent.com/gamedevCloudy/sveltekit-grab/main/.github/assets/demo.mp4)

<br/>

> Hover any element → press `Cmd+C` → instantly copy its component name, source file, and HTML snippet to your clipboard.

</div>

## Install

```bash
bun add -d sveltekit-grab
```

## Usage

Add `<SvelteGrab />` to your root layout (only in dev mode):

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { dev } from '$app/environment'
  import SvelteGrab from 'sveltekit-grab'
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
import { init, freeze, unfreeze, getElementContext } from 'sveltekit-grab'

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
import { registerPlugin } from 'sveltekit-grab'
import { copyHtmlPlugin, copyStylesPlugin } from 'sveltekit-grab'

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

In Svelte dev mode, component instances expose `__svelte_meta` on DOM nodes with source file location info. `sveltekit-grab` reads this metadata to display the component name and file path in the overlay label, and includes it in the copied snippet.

## License

MIT
