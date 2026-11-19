# 0002. Changelog-driven workflow

Status: accepted

## Context
Changes were not traceable and the scope of each task was unclear for agents and developers.

## Decision
`CHANGELOG.md` is the entry point for every change. Entries are created as `[planned]` under `[Unreleased]` before implementation, then marked `[done]` after the affected docs in `docs/` are updated. Releases follow SemVer. Rules are recorded in `AGENTS.md`.

## Consequences
- Nothing is implemented without a prior changelog entry.
- Docs are updated as part of closing each change.
- Slightly more upfront writing per change.
