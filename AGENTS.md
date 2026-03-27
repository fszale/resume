# AGENTS.md

This repository is designed so AI agents can safely update resume artifacts without guessing the build flow.

## Source of Truth
- `README.md` is the canonical full resume.

## Generated Artifacts
- `Brief_Resume.MD` is generated from `README.md`.
- Root PDFs are generated outputs:
  - `filip_szalewicz_resume.pdf`
  - `Brief_Resume_Filip_Szalewicz.pdf`
  - `filip_szalewicz_resume_human.pdf`
  - `Brief_Resume_Filip_Szalewicz_human.pdf`
- Generated Typst sources live in `typst/generated/`.

## Build Command
- Run `node scripts/build_resume.mjs`

## Typst Compiler
- The build script prefers `typst` on `PATH`.
- If `typst` is unavailable locally, set `TYPST_BIN` or rely on the installed Tinymist binary.

## Editing Rules
- Edit `README.md` directly for content changes.
- Do not hand-edit `Brief_Resume.MD`, root PDFs, or files under `typst/generated/` unless debugging the generator.
- Shared Typst styling belongs in `typst/common.typ`.
- Generation logic belongs in `scripts/build_resume.mjs`.

## Repo Layout
- Root: public-facing markdown and PDF artifacts.
- `scripts/`: generation logic.
- `typst/`: shared Typst assets and generated Typst sources.
- `.github/workflows/`: CI automation for sync and verification.
- `docs/`: supplementary repo notes.
