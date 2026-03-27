# Automation

## Local
- Primary build command: `node scripts/build_resume.mjs`
- Optional Typst override: `TYPST_BIN=/path/to/typst node scripts/build_resume.mjs`

## GitHub Actions
- `resume-check.yml` verifies generated artifacts are current on pull requests.
- `resume-sync.yml` rebuilds outputs on push and commits generated changes when needed.

## Generated Typst Files
- `typst/generated/resume_full_ats.typ`
- `typst/generated/resume_brief_ats.typ`
- `typst/generated/resume_full_human.typ`
- `typst/generated/resume_brief_human.typ`

These files are rebuildable and should not be treated as hand-maintained sources.
