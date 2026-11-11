# Superpowers Framework & Agent Instructions

This project has **Superpowers** installed (`obra/superpowers`). All coding and reasoning workflows follow the Superpowers skills framework.

## Skills Location
The active Superpowers skills library is located at `./.agents/skills/` (and `.gemini/skills/`):
- `brainstorming` - Interactive design brainstorming before plan mode or major changes.
- `writing-plans` - Structured implementation planning with clear tasks and verification checkpoints.
- `executing-plans` - Disciplined step-by-step plan execution.
- `systematic-debugging` - 4-phase root cause analysis before making code fixes.
- `test-driven-development` - Writing tests before implementation.
- `verification-before-completion` - Mandatory verification before claiming success.
- `requesting-code-review` / `receiving-code-review` - Quality review workflows.
- `subagent-driven-development` / `dispatching-parallel-agents` - Subagent workflows.
- `using-superpowers` - Core meta-rule for skill activation.

## The Core Superpowers Rule
**Invoke relevant or requested skills BEFORE any response or action.**
- If there is any chance a skill applies to what you are doing, invoke the skill first.
- Process skills come first:
  - "Let's build X / improve X" → `brainstorming` or `writing-plans` first.
  - "Fix this bug / error" → `systematic-debugging` first.
- Always verify your work before concluding any task using `lint_applet` and `compile_applet`.

## Environment & Tool Mapping (Antigravity & Gemini)
- Task tracking: maintain task lists and checklists as structured plans during multi-step tasks.
- Verifications: run `lint_applet` and `compile_applet` after changes to verify build stability.
- Dev server: ensure all ports remain at 3000 and the server compiles cleanly.
