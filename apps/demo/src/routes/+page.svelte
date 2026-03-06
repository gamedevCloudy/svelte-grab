<script lang="ts">
  import Counter from '$lib/Counter.svelte'
  import Card from '$lib/Card.svelte'
</script>

<main>
  <header>
    <div class="logo">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="2" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <circle cx="12" cy="12" r="3" fill="#2ecc71" stroke="none"/>
      </svg>
      <span class="logo-text">svelte<span class="logo-accent">grab</span></span>
    </div>
    <p class="tagline">
      Hover any element · press <kbd>⌘C</kbd> to copy · or <kbd>⌘C</kbd> with nothing hovered to enter inspect mode
    </p>
  </header>

  <section class="grid">
    <Card title="Buttons">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-secondary">Secondary</button>
      <button class="btn btn-ghost">Ghost</button>
      <button class="btn btn-danger">Danger</button>
    </Card>

    <Card title="Counter">
      <Counter />
    </Card>

    <Card title="Form">
      <label>
        <span>Name</span>
        <input type="text" placeholder="Enter name" />
      </label>
      <label>
        <span>Email</span>
        <input type="email" placeholder="you@example.com" />
      </label>
      <label class="checkbox-row">
        <input type="checkbox" />
        <span>Subscribe to updates</span>
      </label>
    </Card>

    <Card title="Typography">
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <p>Regular paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      <a href="/">A link element</a>
    </Card>

    <Card title="Badges">
      <div class="badge-row">
        <span class="badge badge-green">Active</span>
        <span class="badge badge-yellow">Pending</span>
        <span class="badge badge-red">Error</span>
        <span class="badge badge-gray">Draft</span>
      </div>
    </Card>

    <Card title="Code">
      <pre class="code-block"><code>{`import { init } from 'svelte-grab'

const destroy = init({
  onCopy: (ctx) => {
    console.log(ctx.componentName)
  }
})`}</code></pre>
    </Card>
  </section>
</main>

<style>
  :global(body) {
    background: #0d1117;
    color: #e6edf3;
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
  }

  main {
    max-width: 960px;
    margin: 0 auto;
    padding: 2.5rem 2rem 4rem;
  }

  header {
    margin-bottom: 2.5rem;
    border-bottom: 1px solid #21262d;
    padding-bottom: 2rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 0.75rem;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #e6edf3;
    font-family: ui-monospace, 'Cascadia Code', Menlo, monospace;
    letter-spacing: -0.02em;
  }

  .logo-accent {
    color: #2ecc71;
  }

  .tagline {
    color: #484f58;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.6;
  }

  kbd {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 4px;
    padding: 1px 6px;
    font-family: ui-monospace, Menlo, monospace;
    font-size: 0.8em;
    color: #2ecc71;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  /* Buttons */
  .btn {
    padding: 7px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    font-family: inherit;
    transition: opacity 0.15s;
  }

  .btn:hover { opacity: 0.85; }

  .btn-primary  { background: #2ecc71; color: #0d1117; }
  .btn-secondary { background: #21262d; color: #e6edf3; border: 1px solid #30363d; }
  .btn-ghost    { background: transparent; color: #2ecc71; border: 1px solid #2ecc71; }
  .btn-danger   { background: #da3633; color: #fff; }

  /* Form */
  label {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 13px;
    color: #8b949e;
  }

  label span { font-weight: 500; }

  input[type="text"],
  input[type="email"] {
    padding: 7px 10px;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 6px;
    color: #e6edf3;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
  }

  input[type="text"]:focus,
  input[type="email"]:focus {
    border-color: #2ecc71;
  }

  .checkbox-row {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    color: #e6edf3;
  }

  input[type="checkbox"] {
    accent-color: #2ecc71;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  /* Typography */
  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #e6edf3;
    margin: 0 0 0.25rem;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #8b949e;
    margin: 0 0 0.25rem;
  }

  p {
    color: #8b949e;
    font-size: 0.875rem;
    margin: 0 0 0.25rem;
    line-height: 1.6;
  }

  strong { color: #e6edf3; }
  em { color: #2ecc71; font-style: italic; }

  a {
    color: #2ecc71;
    font-size: 0.875rem;
    text-decoration: none;
  }

  a:hover { text-decoration: underline; }

  /* Badges */
  .badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 20px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .badge-green  { background: rgba(46, 204, 113, 0.15); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.3); }
  .badge-yellow { background: rgba(210, 153, 34, 0.15); color: #e3b341; border: 1px solid rgba(210, 153, 34, 0.3); }
  .badge-red    { background: rgba(218, 54, 51, 0.15); color: #f85149; border: 1px solid rgba(218, 54, 51, 0.3); }
  .badge-gray   { background: rgba(110, 118, 129, 0.15); color: #6e7681; border: 1px solid rgba(110, 118, 129, 0.3); }

  /* Code block */
  .code-block {
    background: #010409;
    border: 1px solid #21262d;
    border-radius: 6px;
    padding: 12px 14px;
    margin: 0;
    overflow-x: auto;
    font-family: ui-monospace, 'Cascadia Code', Menlo, monospace;
    font-size: 12px;
    line-height: 1.7;
    color: #8b949e;
  }

  .code-block code { color: inherit; }
</style>
