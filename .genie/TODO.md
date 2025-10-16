# 🎯 Genie Development TODO
**Last Updated:** !`date -u +"%Y-%m-%d %H:%M:%S UTC"`
**Context:** Prioritized work queue for Genie framework

---

## 🔥 CRITICAL Priority (Do First)

*All critical tasks complete!*

---

## ⚠️ HIGH Priority (Do After Critical)

### 3. Agent Deduplication Rollout ⏸️ IN PROGRESS (3/14 done, 21%)
**Files:** 14 remaining agents (18 total - 4 already done)
**Solution Proven:** Extract framework to AGENTS.md §Prompting Standards, agents reference WITHOUT @
**Progress:**
- ✅ Proof-of-concept: 3 agents done (implementor, tests, polish)
- ✅ Pattern corrected: NO @ (prevents context overload)
- ✅ Applied to 3 more: roadmap, orchestrator, install
- ❌ MCP delegation failed (infrastructure bug)
- ⚠️ 1 violation: commit.md has @ (needs fix)
- ⏸️ Paused at 168K/200K tokens for session reset

**Correct Pattern (NO @):**
```markdown
## Framework Reference

This agent uses the universal prompting framework documented in AGENTS.md §Prompting Standards Framework:
- Task Breakdown Structure (Discovery → Implementation → Verification)
- Context Gathering Protocol (when to explore vs escalate)
- Blocker Report Protocol (when to halt and document)
- Done Report Template (standard evidence format)
```

**Why NO @:** Using @ loads entire AGENTS.md into context automatically. Multiple agents with @ = context overload. Reference-only = model looks up ONLY if needed.

**Remaining (11 agents):**
- Neurons: git, learn, prompt, release-old-backup, release
- Workflows: forge, plan, qa, review, vibe, wish
- Fix: commit.md (remove @)
- Check: implementor, polish, tests (verify no @)

**Status:** PAUSED (session reset needed)
**Evidence:** `.genie/qa/evidence/agent-deduplication-progress-202510162230.md`
**Effort:** ~2 hours remaining

### 4. wish.md Template Duplication
**File:** `.genie/agents/workflows/wish.md`
**Problem:** Template embedded in wish.md, copied to EVERY wish instance
**Root Cause:** Wish creation duplicates entire template
**Action:** Fix at source (wish.md workflow), prevent future duplication
**Status:** ARCHITECTURAL REVIEW NEEDED
**Effort:** 2 hours

---

## 🔍 INVESTIGATION Queue

### 5. MCP Session Creation Bugs
**Evidence:**
- Prompt agent session `c69a45b1` - failed to start (no run found)
- Orchestrator agent session `337b5125` - failed to start (no run found)

**Question:** Why did `mcp__genie__run` return session IDs that don't exist?
**Action:** Debug MCP session creation flow
**Status:** NEEDS INVESTIGATION
**Effort:** 1-2 hours

---

## 📋 MEDIUM Priority (Backlog)

### 6. Close Wish #40 as Complete
**Status:** 95% COMPLETE (per analysis)
**Action:**
1. Update wish to 100/100
2. Document what exists
3. Close issue #40
4. Archive wish

**Status:** READY (analysis complete)
**Effort:** 15 minutes

### 7. Multi-Template Architecture Analysis
**Wish:** #37
**Status:** 50% complete (partial migration done Oct 12)
**Action:** Continue analysis, prepare for execution
**Status:** DEFER until higher priority work complete
**Effort:** See wish analysis

### 8. Create Wish #49 (Telemetry)
**Issue:** #49 - Telemetry system
**Action:** Create wish document from issue
**Status:** DEFER until higher priority work complete
**Effort:** 1 hour

### 9. Create Wish #53 (ChatGPT Integration)
**Issue:** #53 - Bring Genie to ChatGPT
**Action:** Create wish document from issue
**Status:** DEFER - needs triage first
**Effort:** TBD

---

## ⏸️ PAUSED / BLOCKED

### core-template-separation (#41)
**Status:** 25/100 since Oct 7 - STALLED
**Blocker:** Conflicts with multi-template (#37)
**Decision:** Wait for #37 to complete, then re-evaluate if still needed
**Resume:** After #37 complete

### backup-update-system (#38)
**Status:** 0/100 - NOT STARTED
**Priority:** LOW (current system works)
**Decision:** Defer indefinitely
**Resume:** Only if user requests

---

## 🎉 COMPLETED (This Session)

- ✅ Backlog audit complete
- ✅ Closed 3 duplicate/obsolete issues
- ✅ Updated 2 wishes to 100/100
- ✅ Archived 2 completed wishes
- ✅ Investigation wish #44 complete (NOT a bug - version issue)
- ✅ Issue #44 closed
- ✅ Wish analysis: #40, #37, #41, #38
- ✅ **Knowledge graph audit complete** (132 files, 6.5/10 health)
  - Report: `.genie/qa/evidence/knowledge-graph-audit-20251016123107.md`
  - Visual graph: `.genie/qa/evidence/knowledge-graph-visual.mermaid`
- ✅ **Agent deduplication proof-of-concept** (3 agents done)
  - Added §Prompting Standards Framework to AGENTS.md
  - Simplified implementor, tests, polish agents
  - Projected -3,700 lines when rolled out to all 21 agents
- ✅ **Learn agent fixes** (./genie → mcp__genie__ pattern documented)
- ✅ **UPDATE.md optimization** (CRITICAL #1)
  - Removed 19 excessive @ references (0 @ refs now)
  - Fixed 48 hardcoded `.genie.backup/` → `{{BACKUP_PATH}}` placeholder
  - Impact: Clean context, correct path substitution, on-demand loading
- ✅ **core-template-separation wish complete** (CRITICAL #2, 2025-10-16 22:00Z)
  - All 4 phases complete (Phase 0-3)
  - Documentation verified (AGENTS.md §Universal Workflow Architecture exists)
  - Wish updated to 100/100
  - Archived at `.genie/wishes/_archive/core-template-separation/`
  - GitHub issue #41 closed

---

## 🔄 Priority Rules

**1. CRITICAL > HIGH > MEDIUM > INVESTIGATION**

**2. System health > New features**
- Fix excessive @ usage before adding new wishes
- Investigate redundancy before creating new agents
- Clean up templates before creating new templates

**3. Complete before starting**
- Finish CRITICAL #1 before CRITICAL #2
- One task deeply, not many shallowly
- Document completion evidence

**4. Evidence-based decisions**
- Always analyze before implementing
- Read existing code before editing
- Check for partial implementations

---

## 📊 Effort Tracking

**Total estimated work:**
- CRITICAL: 1.5 hours
- HIGH: 4 hours
- MEDIUM: TBD (deferred)
- INVESTIGATION: 3-4 hours

**Current capacity:** Full focus available

**Next action:** Start CRITICAL #1 (UPDATE.md)
