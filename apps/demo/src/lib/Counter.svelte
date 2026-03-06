<script lang="ts">
  let count = $state(42)
</script>

<div class="counter">
  <button onclick={() => count--}>−</button>
  <span class="count">{count}</span>
  <button onclick={() => count++}>+</button>
</div>

<style>
  .counter {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  button {
    width: 34px;
    height: 34px;
    border: 1px solid #30363d;
    border-radius: 6px;
    background: #0d1117;
    color: #2ecc71;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transition: border-color 0.15s, background 0.15s;
  }

  button:hover {
    border-color: #2ecc71;
    background: rgba(46, 204, 113, 0.08);
  }

  .count {
    font-size: 2rem;
    font-weight: 700;
    min-width: 3rem;
    text-align: center;
    color: #e6edf3;
    font-family: ui-monospace, Menlo, monospace;
  }
</style>
