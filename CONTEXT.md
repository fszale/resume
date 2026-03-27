# CONTEXT.md

## Purpose
This repository publishes a full resume, a generated brief resume, and four PDF variants derived from those markdown sources.

## Build Graph
`README.md` -> `scripts/build_resume.mjs` -> `Brief_Resume.MD`

`README.md` + generated brief data -> `typst/generated/*.typ` -> root PDF outputs

## Output Modes
- ATS-oriented PDFs:
  - `filip_szalewicz_resume.pdf`
  - `Brief_Resume_Filip_Szalewicz.pdf`
- Human-oriented PDFs:
  - `filip_szalewicz_resume_human.pdf`
  - `Brief_Resume_Filip_Szalewicz_human.pdf`

## Key Design Decision
The full resume remains manually authored in markdown. Everything else is derived from it so that updates propagate through a single entry point.

## Expected Maintenance Flow
1. Edit `README.md`
2. Run `node scripts/build_resume.mjs`
3. Review the regenerated markdown, Typst, and PDFs
4. Commit all changed artifacts together

## CI Behavior
- Pull requests validate that generated files are in sync.
- Pushes can auto-regenerate and commit derived outputs back to the branch.
