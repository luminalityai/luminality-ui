# CLAUDE.md

## Worktree-Only Workflow (Enforced)

**All file modifications are blocked in the main checkout.** A PreToolUse hook (`enforce-worktree.sh`) rejects Edit, Write, and NotebookEdit operations targeting files outside a worktree. There are no opt-outs. Do not use Bash to write files in the main checkout either (e.g., `echo >`, `sed -i`, `tee`, `cp`) — the hook cannot intercept shell commands, so this rule is instruction-enforced.

Before writing any code, create a worktree:

```bash
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@refs/remotes/origin/@@')
DEFAULT_BRANCH=${DEFAULT_BRANCH:-main}
git fetch origin "$DEFAULT_BRANCH"
git worktree add .worktrees/<name> -b <branch-name> "origin/$DEFAULT_BRANCH"
```

Then work inside `.worktrees/<name>/` for the rest of the session.

**Naming:** Use the Linear issue identifier if available (e.g., `.worktrees/<identifier>`), a task slug (e.g., `.worktrees/fix-auth-timeout`), or today's date (e.g., `.worktrees/2026-04-01`) as fallback.

**The hook allows modifications only when:**

1. The file is inside a git worktree (detected via `git rev-parse --git-dir` returning a path under `.git/worktrees/`)
2. Running in a CI/automated context where the checkout is already isolated

**Why this matters:** Working directly on the main checkout causes cross-contamination between sessions — uncommitted changes, wrong branches, and dirty state leak into unrelated work. Worktrees eliminate this entirely.

See the `/worktree` and `/start` skills for full conventions and flags.

## Consumers

Currently consumed by `luminality-web` (sibling repo in the rarebit-one workspace), via the `@rarebit-one/luminality-ui` npm package published to GitHub Packages.

`fundbright-web` and `nutripod-web` do not consume this package — they have their own design systems.

This package is published to GitHub Packages, not RubyGems — the workspace-level `/rollout-gem` skill (which targets rubygems consumers) does NOT apply here. To roll out a new version, bump the `@rarebit-one/luminality-ui` version in `luminality-web/package.json` and run `npm install`.
