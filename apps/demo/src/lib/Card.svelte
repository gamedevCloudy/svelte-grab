<script lang="ts">
  import type { Snippet } from 'svelte'

  let { title, children }: { title: string; children: Snippet } = $props()
</script>

<div class="card">
  <h3 class="card-title">{title}</h3>
  <div class="card-body">
    {@render children()}
  </div>
</div>

<style>
  .card {
    border: 1px solid #21262d;
    border-radius: 8px;
    padding: 1.25rem;
    background: #161b22;
  }

  .card-title {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #484f58;
    margin: 0 0 1rem;
    font-family: ui-monospace, Menlo, monospace;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
</style>
