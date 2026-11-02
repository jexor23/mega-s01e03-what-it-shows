<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket } from '#lib/kb/problems';

  let { ticket, repo }: { ticket: number; repo: string } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const list = (n: Record<string, number>) =>
    Object.entries(n)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ×${v}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{split.unique}</strong> reports in #{ticket} ·
  <strong>{split.groups.length}</strong> {split.groups.length === 1 ? 'problem' : 'problems'} ·
  {split.rows - split.unique} export rows were repeats ·
  intake tagged {split.mistagged} as something they are not
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>channels</th><th>tagged as</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code><br /><span class="muted">{g.title}</span></td>
        <td><strong>{g.ids.length}</strong></td>
        <td>{g.tenants.length}</td>
        <td class="muted">{list(g.channels)}</td>
        <td class="muted">{list(g.taggedAs)}</td>
        <td class="muted">{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if g.issue}<a href="{repo}/issues/{g.issue}">#{g.issue}</a>{:else}none{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each split.groups as g (g.problem)}
  <details>
    <summary><code>{g.problem}</code>: {g.ids.length} reports from {g.tenants.join(', ')}</summary>
    <p class="ids">{g.ids.join(' ')}</p>
  </details>
{/each}

<style>
  .sum { font-size: 1.05rem; }
  .muted { color: var(--muted); font-size: 0.85em; }
  details { margin: 0.4rem 0; }
  summary { cursor: pointer; }
  .ids { font: 0.78rem var(--mono); color: var(--muted); word-spacing: 0.3em; }
</style>
