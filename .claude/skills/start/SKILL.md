---
name: start
description: "Start working on GitHub issues. Use when the user says 'start working on', 'pick up issue', 'work on #123', or wants to begin development on GitHub issues. Handles assignment, branch creation, and context gathering."
---

# Start Skill

Begin working on GitHub issues with proper setup: assign the issue, create branches, gather context, and track progress.

Issues live in the **`luminalityai/delivery-ops`** repo (issues are disabled on `luminality-ui` itself). All `gh issue` calls target `--repo luminalityai/delivery-ops`.

## Prerequisites

This skill uses the `gh` CLI to read and assign issues. If `gh` is unavailable or unauthenticated, the skill will warn and offer to proceed with git-only setup (branch creation without assignment).

## Scope

This skill sets up local development for GitHub issues. It does **NOT**:

- Merge PRs to main (merging is a human decision)
- Delete branches or worktrees automatically
- Close or complete GitHub issues

## Usage

```
/start <issue-numbers...>   # Start specific issues (e.g., /start 123 124)
/start --mine                # Show my assigned open issues
/start --backlog             # Show open issues (the backlog)
```

## Workflow

### 1. Parse Input and Fetch Issues

**If specific issue numbers provided:**

Fetch each issue with the `gh` CLI:

```bash
gh issue view <num> --repo luminalityai/delivery-ops --json title,body,labels,assignees,url
```

**If `--mine` flag:**

```bash
gh issue list --repo luminalityai/delivery-ops --assignee @me --state open
```

**If `--backlog` flag (with an optional `--label` filter):**

```bash
gh issue list --repo luminalityai/delivery-ops --state open --limit 10 [--label "<from --label flag>"]
```

Present the issues and let the user select which to work on.

### 2. Pre-Work Checks

Before starting, verify:

**Check for blockers:**

```
# From the issue body / labels, look for referenced blocking issues
# (e.g. "blocked by #120", a "blocked" label, or a task-list dependency).
```

If blocked:

```
Warning: #123 appears blocked by:
  - #120: "Set up middleware" (still open)

Options:
1. Start anyway (work may be blocked)
2. Start the blocking issue instead
3. Cancel
```

**Check issue readiness:**

- Has a description / acceptance criteria?
- Has the relevant labels?

If missing context, warn but allow proceeding.

### 3. Assign the Issue

**Skip this step if `--no-status` flag is provided.**

GitHub Issues has no built-in workflow states, so "starting" an issue means assigning it to yourself (optionally leaving a comment that work has begun):

```bash
gh issue edit <num> --repo luminalityai/delivery-ops --add-assignee @me
# optional:
gh issue comment <num> --repo luminalityai/delivery-ops --body "Starting work on this."
```

The workflow should not block on `gh` failures — local development can proceed.

### 4. Set Up Worktree

**Always create a worktree** to isolate this work from any other state in the repo. This prevents changes from different sessions bleeding into unrelated PRs.

```bash
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@refs/remotes/origin/@@')
DEFAULT_BRANCH=${DEFAULT_BRANCH:-main}
git fetch origin "$DEFAULT_BRANCH"
git worktree add .worktrees/<issue-number>-<slug> -b <branch-name> "origin/$DEFAULT_BRANCH"
```

**`--no-worktree` flag:** If the user explicitly passes `--no-worktree`, check the current state:

- On the default branch with a clean working tree → fall back to a simple branch:
  ```bash
  DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@refs/remotes/origin/@@')
  DEFAULT_BRANCH=${DEFAULT_BRANCH:-main}
  git fetch origin "$DEFAULT_BRANCH"
  git checkout -b <branch-name> "origin/$DEFAULT_BRANCH"
  ```
- Otherwise → **stop and report why**:
  _"Cannot skip worktree: working tree has uncommitted changes (or is on a feature branch). Stash or commit your changes first, switch to the default branch, then re-run with `--no-worktree`."_

> **Note:** The previous version of this skill offered stash and branch-switch workflows. Those paths have been removed in favor of always using worktrees. If you prefer to stash instead, run `git stash push -m "WIP"` manually before `/start`.

See `/worktree` skill for full worktree conventions.

**Branch name format:**

`<issue-number>-<short-slug>` (e.g., `123-add-feature-name`), or a plain task slug when there's no issue.

**Worktree naming:** `.worktrees/<issue-number>-<slug>` (e.g., `.worktrees/123-add-feature-name`)

### 5. Display Issue Context

```
Starting: #123
Issue: <title>
URL: https://github.com/luminalityai/delivery-ops/issues/123

Description:
<full description>

Acceptance Criteria:
- [ ] ...

Branch: <branch-name>
```

### 6. Create Initial Todo List

Based on the issue description, create a todo list to track progress.

## Flags Reference

| Flag             | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| `--mine`         | List my assigned open issues                                               |
| `--backlog`      | List open issues (the backlog)                                             |
| `--no-worktree`  | Skip worktree if on the default branch + clean; stops with error otherwise |
| `--no-status`    | Skip self-assignment (just create branch)                                  |
| `--label <name>` | Filter the backlog by label                                                |

## Error Handling

| Error                     | Solution                                                       |
| ------------------------- | -------------------------------------------------------------- |
| `gh` unavailable/unauth'd | Warn and offer to proceed with just git setup                  |
| Issue not found           | Verify the number; confirm it's in `luminalityai/delivery-ops` |
| Issue already assigned    | Ask if user wants to continue anyway                           |
| Issue is closed           | Warn and suggest reopening or selecting a different issue      |
| Assignment fails          | Offer to continue with local setup, retry, or cancel           |
| Branch already exists     | Offer to checkout existing or create with suffix               |
| Worktree already exists   | Offer to use existing worktree or create with suffix           |

## Integration with Other Skills

- After completing work, create a PR with `gh pr create`
- The branch naming convention (`<issue-number>-<slug>`) lets the issue number be auto-detected from the branch for cross-repo PR linking
