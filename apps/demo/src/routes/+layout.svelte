<script lang="ts">
  import { dev } from '$app/environment'
  import { SvelteGrab } from 'svelte-grab'
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

{#if dev}
  <SvelteGrab />
{/if}

{@render children()}
