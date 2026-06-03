# Team Training app

In-house FOH training built from the Andiamo Operations binder. Lives inside the
website app; routes are **not** linked from the public site nav.

## Routes
- `/training` — sign in (name + role + restaurant) and the employee module list
- `/training/module/:id` — lessons + quiz for one module
- `/training/admin` — manager dashboard (sign in with role **Manager** to access)

## Editing the content (the main thing you'll do)
All lessons and quiz questions live in **`content.ts`** — one `MODULES` array.
Each module has:
- `lessons[]` — `heading`, optional `intro`, and `points[]` (the teaching bullets)
- `quiz[]` — each question has `options[]`, `answer` (index of the correct one),
  and an `explanation` shown after answering

To add a module: copy an existing entry, give it a unique `id`, set `order`, and
fill in lessons + quiz. To change the pass mark, edit `PASS_THRESHOLD`.

## Where things are
- `content.ts` — all training content (single source of truth)
- `../../contexts/TrainingContext.tsx` — progress store (localStorage today; the
  marked STORAGE LAYER is what gets swapped for a database in Phase 2)
- `../../pages/Training.tsx` / `TrainingModuleView.tsx` / `TrainingAdmin.tsx`
- `../../components/training/TrainingShell.tsx` — the internal page frame

## Run it locally
`pnpm run dev`, then open http://localhost:5173/training

## Phase 2 (not done yet)
Progress is per-device and content ships in the browser bundle. Real cross-device
manager tracking + securing the confidential content behind login requires a
database + auth. See memory note `project_training_app.md`.
