# Workspace template

How to scaffold a new workspace from this template:

1. Decide a slug (`kebab-case`).
2. Copy this directory to `workspaces/<slug>/`, renaming `*.template` files (drop the `.template` suffix).
3. Replace placeholders: `{{WORKSPACE_NAME}}`, `{{ONE_LINE_PURPOSE}}`, `{{TODAY_ISO}}`.
4. Decide which lifecycle folders to create. Phase 0 Second Brain uses `inbox/ sources/ notes/ decisions/ archive/`. Workspaces with operational work add `tasks/`; trackers add `data/`; codegen workspaces add `outputs/` and `scripts/`.
5. Add an entry to `workspaces.json` at the root.
6. Insert a row into the `workspaces` table:
   `insert into workspaces (slug, name, path, description) values ('<slug>', '<name>', 'workspaces/<slug>', '<desc>');`
7. Add the workspace to the top-level `CLAUDE.md` workspace map.
