---
name: ship
description: "Finalize changes in luminality-ui (npm design-system package), create a signed commit, open a PR, then babysit it to a mergeable state and hand the merge off. Runs typecheck, lint, format, knip, tests, build, and a dts emission guard before pushing; after opening the PR it addresses review findings, fixes CI, and rebases until ready-to-merge, then hands off (never merges — that's a human decision). Invoke when the user says 'ship', 'create a PR', 'open a pull request', 'push changes', 'finalize', 'ready for review', 'babysit', 'get this merged', or '/ship'."
model: sonnet
---

# Ship Skill (luminality-ui)

Finalize changes in the `@luminalityai/ui` design-system package, create a signed commit, and open a GitHub PR.

`luminality-ui` is an npm package published to npm (registry.npmjs.org) via a tag-driven release workflow — it builds with Vite library mode and emits rolled-up `.d.ts` via `vite-plugin-dts`. The dts plugin has historically shipped a near-empty `export {}` when something silently broke, so this skill explicitly guards against that on every PR.

## Scope

This skill creates and updates PRs, then babysits them to a mergeable state and hands the merge off (see "Babysit to merge" below). It does **NOT**:

- Merge PRs to main. After opening the PR it drives it toward ready-to-merge — addressing review findings, fixing CI, rebasing — but the final merge is a human decision (workspace Critical Rule #7), so it stops at "ready to merge, awaiting you" and hands off.
- Cut a release / bump the package version / push a tag — that flow is documented in `RELEASING.md` (release branch -> release PR -> tag push -> `release.yml` -> `publish.yml`). `/ship` is for the regular PR loop only. If the user asks to "ship a release" or "publish a new version", point them at `RELEASING.md` and stop.
- Bypass commit signing, lefthook validation, or the worktree-only hook under any circumstance.

## Branch Naming

Use the Linear issue identifier when present:

```
<identifier>/<short-description>   # e.g. lmt-92/button-focus-ring
```

Otherwise use a task slug (`fix-tooltip-arrow`) or today's date (`2026-05-27`). Match whatever the worktree name is so the two stay in sync.

## Workflow

### 0. Pre-flight (fail fast)

Run these **before any commit or push work**. Each models a real failure mode from prior sessions; bailing here is cheaper than failing after pushing.

```bash
# (a) We must be inside a worktree, not the main checkout. The worktree hook
# blocks Edit/Write but not Bash, so verify defensively.
GITDIR=$(git rev-parse --git-dir)
case "$GITDIR" in
  *.git/worktrees/*) ;;
  *) echo "ABORT: not in a worktree — workspace rule requires .worktrees/<name>"; exit 1 ;;
esac

# (b) Commit signing key is configured. If unset, surface and STOP — do not
# bypass with --no-gpg-sign, -c commit.gpgsign=false, or SKIP_SIGNED_COMMITS_HOOK=1.
# (Workspace CLAUDE.md Critical Rule #5.)
SIGNKEY=$(git config --get user.signingkey)
[ -z "$SIGNKEY" ] && echo "ABORT: user.signingkey unset — signing will fail" && exit 1

# (c) Do NOT probe the SSH agent with `ssh-add -l`. Git's signing path may
# use the 1Password agent socket (via IdentityAgent in ~/.ssh/config),
# op-ssh-sign set as gpg.ssh.program, a custom socket, or the default
# $SSH_AUTH_SOCK. `ssh-add -l` checks only the last one and produces false-
# positive aborts in the others. Trust git: if signing fails at commit
# time, the enforce-signed-commits hook will surface a clear error and
# halt — never bypass it.

# (d) Tree is clean of unintended noise (untracked build output, etc).
git status --porcelain

# (e) Rebased on origin/main so the PR diff is clean.
git fetch origin main
BEHIND=$(git rev-list --count HEAD..origin/main)
[ "$BEHIND" -gt 0 ] && echo "WARN: branch is $BEHIND commits behind origin/main — rebase before push"

# (f) node_modules present in this worktree. Worktrees do NOT share node_modules
# with the main checkout; lefthook will use the wrong tree otherwise.
[ -d node_modules ] || echo "WARN: node_modules missing — run 'npm ci' before push"
```

If any **ABORT** fired, stop and surface to the user. Never work around signing failures or unlock 1Password on the user's behalf — wait for them.

### 1. Gather Context

```bash
git branch --show-current
BASE=$(git merge-base HEAD origin/main)
git log $BASE..HEAD --oneline
git diff $BASE..HEAD --stat
gh pr view --json url,state 2>/dev/null || echo "No PR exists"
```

Extract the Linear identifier from the branch name (e.g. `lmt-92/...` -> `LMT-92`). If no identifier, ask the user once or proceed without linking.

**If a PR already exists and is OPEN**, skip PR creation; update the existing PR body if relevant and return its URL.

### 2. Fetch Linear Issue Details (optional)

If the Linear MCP is available:

```
mcp__linear__get_issue(id: "<IDENTIFIER>")
```

If unavailable, warn and continue without linking.

### 3. Validate Before Commit

Run the same checks `lefthook.yml` enforces on pre-push, **in this order**, so problems surface before the squashed commit lands. **Never skip validation.** If a check cannot run (tool missing, network issue), stop and ask the user — never push unvalidated code.

Skip section 3 entirely **only** if the diff is exclusively `*.md` / docs (no `src/`, no `package.json`, no config).

#### 3a. Format and lint — auto-fix first, then verify

```bash
npm run format
npm run format:check

npm run lint:fix
npm run lint
```

#### 3b. Typecheck

```bash
npm run check     # tsc --noEmit, strict mode
```

#### 3c. Knip (unused exports / files / dependencies)

```bash
npm run knip
```

If knip complains about a newly-orphaned export or a dev dep that's no longer referenced, fix it now — lefthook will block the push otherwise.

#### 3d. Unit + axe tests

```bash
npm test
```

If a test fails:

- Related to your change -> fix the code or the test
- Pre-existing and unrelated -> note in PR description and proceed

#### 3e. Build + dts emission guard

This is the load-bearing check that distinguishes this skill from a generic JS-package `/ship`. `vite-plugin-dts` with `rollupTypes: true` can silently emit a near-empty `dist/index.d.ts` (essentially `export {}`) if rollup fails to resolve internal types — the build still "succeeds", but consumers (luminality-web) lose every type. We catch that here.

```bash
npm run build

# (1) Required artifacts exist
test -f dist/index.js     || { echo "ABORT: dist/index.js not emitted"; exit 1; }
test -f dist/index.d.ts   || { echo "ABORT: dist/index.d.ts not emitted"; exit 1; }
test -f dist/styles/index.css || echo "WARN: dist/styles/index.css missing — CSS export may break"

# (2) dts is not an empty stub
DTS_BYTES=$(wc -c < dist/index.d.ts | tr -d ' ')
DTS_EXPORTS=$(grep -cE '^export ' dist/index.d.ts || true)
if [ "$DTS_BYTES" -lt 500 ] || [ "$DTS_EXPORTS" -lt 5 ]; then
  echo "ABORT: dist/index.d.ts looks like an empty stub ($DTS_BYTES bytes, $DTS_EXPORTS exports)."
  echo "  vite-plugin-dts probably failed silently. Check the build output for 'rollupTypes' warnings."
  echo "  Re-run with: rm -rf dist && npm run build"
  exit 1
fi

# (3) Public surface is reachable from the entry. Grep for a handful of
# top-level component names that should always be exported. Update this
# list as the public API evolves — but it should never shrink to zero.
for sym in Button Card Dialog; do
  grep -q "export.*\\b${sym}\\b" dist/index.d.ts \
    || echo "WARN: '${sym}' not found in dist/index.d.ts — confirm intentional"
done
```

If the dts guard fires an **ABORT**, do not push. Investigate the vite-plugin-dts output, fix the underlying re-export / type-resolution issue, and rebuild. Do not lower the byte/export thresholds to "make it green" — they exist because we shipped a broken `export {}` to consumers before.

#### 3f. Whitespace check

`lefthook.yml`'s pre-push runs `.lefthook/whitespace-check.sh` (and `.lefthook/verify-signatures.sh`). `verify-signatures` is already covered by the `-S` signed commit; whitespace is not, and `LEFTHOOK=0` on push (Step 5) suppresses it. Mirror it here so trailing-whitespace / missing-newline issues surface before the push, not only when someone runs with lefthook active:

```bash
.lefthook/whitespace-check.sh
```

#### 3g. Validation Complete

Any auto-fix output is still in the working tree and will be picked up when staged.

### 4. Create a Single Signed Commit

```bash
git add -A
BASE=$(git merge-base HEAD origin/main)
git log $BASE..HEAD --oneline
```

Unless `--no-squash` was passed (see Flags Reference), **squash multiple commits on the branch into one**:

```bash
git reset --soft "$BASE"
```

With `--no-squash`, skip the reset and keep the existing commits as-is.

Then commit. The `enforce-signed-commits` PreToolUse hook auto-injects `-S`; pass it explicitly anyway for clarity.

```bash
git commit -S -m "$(cat <<'EOF'
<type>(<scope>): <imperative summary, lowercase, no period>

<Optional body. Explain WHY, not WHAT — the diff shows what.>

Resolves <IDENTIFIER>

Co-Authored-By: Claude <MODEL> <noreply@anthropic.com>
EOF
)"
```

Replace `<MODEL>` with the model actually running this skill (e.g. `Sonnet 4.6`, `Opus 4.7`) — do not hard-code a version, since the harness chooses the model at run time.

Conventional Commits is the established style for this repo (recent merged PRs are all `chore(ci): ...`, `chore(deps): ...`, etc.). Use `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `build`, `ci`, `perf`, `style` as appropriate. Keep the subject under ~70 chars.

**If signing fails**, surface the exact error from git and stop. Do not retry with `--no-gpg-sign`, `-c commit.gpgsign=false`, `--no-verify`, or `SKIP_SIGNED_COMMITS_HOOK=1`. 1Password agent transients can be retried **once** unchanged; persistent failures wait for the user.

### 5. Push

```bash
LEFTHOOK=0 git push -u origin HEAD
```

`LEFTHOOK=0` is required workspace-wide (Critical Rule #4) because lefthook's pre-push runs the full suite (lint, format, knip, typecheck, test, build) — we already ran those in step 3. **Do not** set any other bypass flags (`--no-verify`, `SKIP_SIGNED_COMMITS_HOOK`, etc).

If a force-push is genuinely needed (rebase landed during the session), use `--force-with-lease`, never `--force`.

### 6. Open the PR

Add `--draft` to the `gh pr create` call if the `--draft` flag was passed (see Flags Reference).

```bash
gh pr create --title "<type>(<scope>): <summary matching commit>" --body "$(cat <<'EOF'
## Summary

<1-3 sentences explaining the change and why.>

- <Key change>
- <Key change>

## Linear Issue

Closes <IDENTIFIER>

## Test Plan

- [ ] `npm run check` clean
- [ ] `npm test` passes
- [ ] `npm run build` emits non-empty `dist/index.d.ts` with the expected public exports
- [ ] Storybook renders new/changed components (if applicable)
- [ ] Verified in `luminality-web` against a local `npm link` (if visual regression risk)
EOF
)"
```

The `Closes <IDENTIFIER>` syntax auto-links the PR to Linear and transitions the issue on merge. Drop it if no identifier is available.

**Do not** add `--reviewer` flags or assign anyone unless the user asks — review routing is owned by humans.

#### Release-PR special case

If this PR is a release prep (version bump + CHANGELOG move), follow `RELEASING.md` instead of this skill — title is `chore: release vX.Y.Z`, no `Closes`, body is the release notes. `/ship` will still work for the PR mechanics, but **do not** push a tag or trigger `release.yml` from this skill. Tagging is a deliberate human step.

## Babysit to merge (always-on)

Opening the PR is not the end of `/ship`. After the PR exists, **drive it to a
mergeable state and then hand the merge off** — don't stop at "PR created," and
don't merge it yourself (merging is a human decision — workspace CLAUDE.md
Critical Rule #7).

**Skip this phase entirely if the PR is a draft** — report the URL and stop. A
draft signals the work isn't ready for the merge path yet.

Otherwise loop until the **ready gate** passes or a **stop condition** trips:

1. **Read PR state.**

   ```bash
   gh pr view <n> --json number,headRefName,baseRefName,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup,isDraft
   ```

   plus review threads and comments (`gh pr view <n> --comments`,
   `gh api repos/<owner>/<repo>/pulls/<n>/reviews`, and `.../pulls/<n>/comments`
   for inline threads).

2. **Address review findings.** For each unresolved, actionable comment or
   requested change, make the fix **in this worktree** following the repo's
   conventions, then re-run this skill's own validation / pre-flight steps
   before pushing. Reply to or resolve the thread so it's clear it was handled.
   A comment that needs a product/owner decision → stop and ask (see stop
   conditions).

3. **Fix failing CI.** Pull the failing job's log (`gh pr checks <n>`,
   `gh run view <id> --log-failed`), reproduce locally where feasible, and fix
   the root cause. Never disable, skip, or weaken a check to go green.

4. **Rebase if behind.** If the branch is behind its base or conflicted, rebase
   on the base branch and resolve conflicts honestly. Re-push the same way this
   skill's push step does (so the same pre-push checks run) — with
   `--force-with-lease`, **never** `--force`. Never bypass signing and never
   reach for `LEFTHOOK=0` or other push bypasses.

5. **Re-check.** Push fixes, let CI re-run, re-read state. Iterate.

**Ready gate (all must hold):**

- every required check has **actually run and is green** (`statusCheckRollup` —
  no required failures). An empty/absent rollup means CI hasn't started yet —
  wait and re-read; never treat "no checks reported" as a pass;
- `reviewDecision == APPROVED`, or the repo genuinely requires no review. An
  empty `reviewDecision` with a requested reviewer still pending is **not** a
  pass — that's "awaiting review," so hand off and say so. No unresolved
  blocking change-requests remain;
- `mergeable == MERGEABLE` — not behind, no conflicts;
- not a draft.

When the gate holds, **stop and hand off**: report the PR URL and state plainly
that it is ready to merge and awaiting the user. **Do not merge** — that's the
user's call (Critical Rule #7).

**Stop conditions — pause, summarize, and ask the user:**

- a comment needs a **product/owner decision** (scope, a trade-off, "is this
  what you actually want") rather than a mechanical fix;
- the **same required check keeps failing after ~3 fix attempts**, or it's
  environmental/flaky-but-required and you can't resolve it;
- you've gone **~3 full loops without converging** on the ready gate (e.g. a
  base that keeps moving, oscillating fixes) — stop and report rather than
  looping indefinitely;
- a fix would be **destructive or out of scope** (rewriting shared history,
  touching unrelated code, force-pushing over others' commits, disabling a
  check, relaxing branch protection);
- a finding raises a **security or privacy concern**;
- merge conflicts you can't resolve with confidence;
- branch protection needs an approval you **cannot** satisfy (a required human
  reviewer / CODEOWNERS).

## Output

After completing the workflow, report:

1. Commit hash and one-line subject
2. PR URL
3. Whether the dts guard fired any warnings
4. Note: Linear transitions happen automatically on merge
5. **Babysit outcome**, one of:
   - **Ready to merge (handed off)** — the ready gate holds (required checks
     green, approved or no review required, `mergeable == MERGEABLE`, not a
     draft); state the PR is awaiting the user's merge. **Not merged** —
     Critical Rule #7.
   - **Blocked / awaiting user** — a stop condition tripped or the PR is
     awaiting review/CI; summarize what's outstanding and what the user needs to
     decide or do next.
   - **Draft** — babysit skipped; PR opened as draft, URL reported.

## Error Handling

| Error                                     | Action                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| Not in a worktree                         | Abort. Ask user to `/worktree` first.                                                  |
| `user.signingkey` unset / signing fails   | Surface error, stop. Never bypass.                                                     |
| `node_modules` missing                    | Run `npm ci` (allowed) before retrying validation.                                     |
| Branch behind `origin/main`               | Rebase (`git rebase origin/main`), re-run pre-flight.                                  |
| Knip flags new dead code                  | Fix it in the same commit.                                                             |
| dts guard ABORT                           | Investigate `vite-plugin-dts` output, fix re-exports, rebuild. Never lower thresholds. |
| Lefthook still fires despite `LEFTHOOK=0` | Stop — env may not be propagating; surface to user.                                    |
| PR already exists (OPEN)                  | Update its body if needed, return URL.                                                 |
| `gh pr create` fails                      | Run `gh pr view` to check if a PR exists; otherwise surface error.                     |

## Flags Reference

| Flag          | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| `--no-squash` | Skip squashing, push existing commits as-is                                |
| `--draft`     | Create PR as draft                                                         |
| `--no-link`   | Skip Linear identifier extraction (use when branch name has no identifier) |
