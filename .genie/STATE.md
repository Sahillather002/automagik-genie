<!--
Triad Validation Metadata
last_updated: !`date -u +"%Y-%m-%dT%H:%M:%SZ"`
last_commit: !`git log -1 --format=%h`
last_version: 2.4.0-rc.9
validation_commands:
  version_exists: test -f package.json && jq -e .version package.json >/dev/null
  state_updated_recently: test $(git log --oneline .genie/STATE.md..HEAD 2>/dev/null | wc -l) -lt 5
  has_version_line: grep -q "Version:" .genie/STATE.md
-->

# 🗂️ Genie System State
**Last Updated:** !`date -u +"%Y-%m-%d %H:%M:%S UTC"`
**Purpose:** System state snapshot (read-only reference)

---

## 📊 Current Session

**Date:** 2025-10-17
**Focus:** Triad redesign (RC6 release preparation)
**Branch:** !`git branch --show-current`

**Active Work:**
- Triad context system redesign (USERCONTEXT, STATE, TODO separation)
- Agent generalization (removing Felipe-specific refs)
- Template preparation for general audience

---

## 📦 Production Status

**Version:** !`node -p "require('./package.json').version"`
**Published:** v2.4.0-rc.9 on npm@next (2025-10-17)
**Latest:** MCP bug fixes (4 critical bugs patched)

**Latest Commit:** !`git log --oneline -1`

**Critical Improvements in rc.9:**
- ✅ Bug #102: Session ID collision fixed (v1→v2 schema migration)
- ✅ Bug #90: full=true truncation fixed (complete transcript)
- ✅ Bug #92: Zombie session cleanup (>24h auto-abandonment)
- ✅ Enhancement: Version metadata in all log files

---

## 🔧 Working Tree

**Status:**
!`git status --short | head -10`

**Recent Commits:**
!`git log --oneline -5`

---

## 📊 Repository Health

**Issues:** !`gh issue list --state open | wc -l` open
**Wishes:** 5 active + 2 archived
**Technical Debt:** Medium (systematic fixes queued)

**Archived Wishes:**
- token-efficient-output (100/100)
- natural-routing-skills (100/100)
- core-template-separation (100/100)

**Active Wishes:**
1. triad-redesign (0/100) - in progress
2. provider-runtime-override (#40) - 95% complete
3. multi-template-architecture (#37) - 50% complete
4. backup-update-system (#38) - 0% (DEFERRED)

---

## 📁 Key File Locations

**Configuration:**
- `.genie/cli/config.yaml` - Framework config
- `.genie/state/provider.json` - Runtime provider selection
- `.genie/state/version.json` - Framework version
- `package.json` - npm package metadata

**Evidence:**
- `.genie/qa/evidence/` - Knowledge graph audit data
- `.genie/state/` - Analysis reports, audit findings
- `.genie/wishes/*/qa/` - Per-wish validation data
- `.genie/wishes/*/reports/` - Per-wish done reports

**Active Work:**
- `.genie/TODO.md` - Prioritized work queue (drives development)
- `.genie/STATE.md` - This file (current session snapshot)
- `.genie/USERCONTEXT.md` - User-specific preferences

---

## 🧰 Tooling Status

**MCP Integration:**
- ✅ mcp__genie__run - Launch neuron sessions
- ✅ mcp__genie__resume - Continue sessions
- ✅ mcp__genie__view - Inspect output
- ✅ mcp__genie__list_sessions - Discover sessions

**CLI Commands:**
- ✅ `npx automagik-genie init [template]` - Initialize workspace
- ✅ `npx automagik-genie update` - Framework upgrade
- ✅ `npx automagik-genie rollback` - Restore backup
- ✅ `npx automagik-genie model` - Executor configuration

---

## 📖 Documentation

**Core Docs:**
- `AGENTS.md` - Agent documentation (23KB)
- `CLAUDE.md` - Claude Code patterns (4KB)
- `.claude/README.md` - Routing & architecture
- `.genie/agents/README.md` - Agent structure

---

**Note:** This file is READ-ONLY reference. Active work tracked in TODO.md
