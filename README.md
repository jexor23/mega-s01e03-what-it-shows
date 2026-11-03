# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## Added in this repo (MEGA S01E03)

- `src/routes/kb/incidents/4471-split/+page.svx`: signed page, "#4471 · three problems, not one".
- `src/lib/kb/problems.ts`, `src/lib/kb/ProblemTable.svelte`: the logic and table behind it.
- `rendered/4471-split.html`: that page as the desk sees it (prerendered, CSS inlined, no scripts).
- `package.json`, `vite.config.js`, `src/app.html`, `src/routes/+layout.ts`, `scripts/standalone.mjs`:
  the build frame. `npm install && npm run build` renders every kb page to `build/`, then
  `node scripts/standalone.mjs kb/incidents/4471-split rendered/4471-split.html`.

Existing pages, decisions and components are unchanged.
