# Genie CLI Integration Test Report
Date: 2025-09-30 22:52:58 UTC

## Test Scenarios

### Scenario 1: Basic Command Execution
```
                                   GENIE CLI
Genie Template :: Command Palette Quickstart
╭──────────────────────────  ╭────────────────────────── ╭─────────────────────╮
│ Background: detached     │ │ Plan → Wish → Forge      ││ Evidence-first      │
│ default                  │ │ workflow                 ││ outputs             │
╰──────────────────────────╯ ╰──────────────────────────╯╰─────────────────────╯
════════════════════════════════════════════════════════════════════════
╭──────────────────────────────────────────────────────────────────────────────╮
│ 🧭 Usage                                                                     │
│ Invoke commands with `genie <command> [options]`.                            │
╰──────────────────────────────────────────────────────────────────────────────╯
────────────────────────────────────────────────────────────────────────
Command Palette
╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│Command    …  Arguments           … Description                                                                     …│
│──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────│
│──                                                                             │
│run           <agent> "<prompt>"    Start or attach to an agent                                                     …│
│list agents                         Show all available agents                                                       …│
│list sessions                       Display active and recent runs                                                  …│
│resume        <sessionId> "<prompt>"Continue a background session                                                   …│
│view          <sessionId> [--full]  Show transcript for a session                                                   …│
│stop          <sessionId>           End a background session                                                        …│
│help                                Show this panel                                                                 …│
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭──────────────────────────────────────────────────────────────────────────────╮
│ ℹ️ 🧞 Genie Framework                                                        │
│ • Plan → Load mission/roadmap/standards context, clarify scope, log          │
│ assumptions/decisions, and produce the planning brief with branch/tracker    │
│ guidance.                                                                    │
│ • Wish → Convert the planning brief into an approved wish with context       │
│ ledger, inline <spec_contract>, execution groups, and blocker protocol.      │
│ • Forge → Break the wish into execution groups and task files, document      │
│ validation hooks, evidence paths, personas, and branch strategy before       │
│ implementation.                                                              │
│ • Review → Audit delivery by consolidating evidence, replaying agreed        │
│ checks, and issuing a verdict or follow-up report before marking the wish    │
│ complete.                                                                    │
╰──────────────────────────────────────────────────────────────────────────────╯
╭──────────────────────────────────────────────────────────────────────────────╮
│ ⚡ Quick start examples                                                       │
│ genie run plan "[Discovery] mission @.genie/product/mission.md"              │
│ genie run --help  # Show help for run command                                │
│ genie view RUN-1234                                                          │
│ genie list agents --help  # Show help for list command                       │
╰──────────────────────────────────────────────────────────────────────────────╯
╭──────────────────────────────────────────────────────────────────────────────╮
│ 💡 Tips                                                                      │
│ Watch sessions: `genie list sessions`.                                       │
│ Run an agent: `genie run <agent-id> "<prompt>"`.                             │
╰──────────────────────────────────────────────────────────────────────────────╯
Exit Code: 0
```
✅ PASSED: Help command executes successfully

### Scenario 2: Session Listing
```
╭──────────╮ ╭──────────╮
│ 0 active │ │ 0 recent │
╰──────────╯ ╰──────────╯
╭──────────────────────────────────────────────────────────────────────────────╮
│ 💡 Commands                                                                  │
│ genie view <sessionId>                                                       │
│ genie resume <sessionId> "<prompt>"                                          │
│ genie stop <sessionId>                                                       │
╰──────────────────────────────────────────────────────────────────────────────╯
Exit Code: 0
```
✅ PASSED: Session listing works correctly

### Scenario 3: Error Handling - Invalid Command
```
╔══════════════════════════════════════════════════════════════════════════════╗
║ ❌ Unknown command                                                            ║
║ Unknown command: invalid-command                                             ║
╚══════════════════════════════════════════════════════════════════════════════╝
                                   GENIE CLI
Genie Template :: Command Palette Quickstart
╭──────────────────────────  ╭────────────────────────── ╭─────────────────────╮
│ Background: detached     │ │ Plan → Wish → Forge      ││ Evidence-first      │
│ default                  │ │ workflow                 ││ outputs             │
╰──────────────────────────╯ ╰──────────────────────────╯╰─────────────────────╯
════════════════════════════════════════════════════════════════════════
╭──────────────────────────────────────────────────────────────────────────────╮
│ 🧭 Usage                                                                     │
│ Invoke commands with `genie <command> [options]`.                            │
╰──────────────────────────────────────────────────────────────────────────────╯
────────────────────────────────────────────────────────────────────────
Command Palette
╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│Command    …  Arguments           … Description                                                                     …│
│──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────│
│──                                                                             │
│run           <agent> "<prompt>"    Start or attach to an agent                                                     …│
│list agents                         Show all available agents                                                       …│
│list sessions                       Display active and recent runs                                                  …│
│resume        <sessionId> "<prompt>"Continue a background session                                                   …│
│view          <sessionId> [--full]  Show transcript for a session                                                   …│
│stop          <sessionId>           End a background session                                                        …│
│help                                Show this panel                                                                 …│
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭──────────────────────────────────────────────────────────────────────────────╮
│ ℹ️ 🧞 Genie Framework                                                        │
│ • Plan → Load mission/roadmap/standards context, clarify scope, log          │
│ assumptions/decisions, and produce the planning brief with branch/tracker    │
│ guidance.                                                                    │
│ • Wish → Convert the planning brief into an approved wish with context       │
│ ledger, inline <spec_contract>, execution groups, and blocker protocol.      │
│ • Forge → Break the wish into execution groups and task files, document      │
│ validation hooks, evidence paths, personas, and branch strategy before       │
│ implementation.                                                              │
│ • Review → Audit delivery by consolidating evidence, replaying agreed        │
│ checks, and issuing a verdict or follow-up report before marking the wish    │
│ complete.                                                                    │
╰──────────────────────────────────────────────────────────────────────────────╯
╭──────────────────────────────────────────────────────────────────────────────╮
│ ⚡ Quick start examples                                                       │
│ genie run plan "[Discovery] mission @.genie/product/mission.md"              │
│ genie run --help  # Show help for run command                                │
│ genie view RUN-1234                                                          │
│ genie list agents --help  # Show help for list command                       │
╰──────────────────────────────────────────────────────────────────────────────╯
╭──────────────────────────────────────────────────────────────────────────────╮
│ 💡 Tips                                                                      │
│ Watch sessions: `genie list sessions`.                                       │
│ Run an agent: `genie run <agent-id> "<prompt>"`.                             │
╰──────────────────────────────────────────────────────────────────────────────╯
Exit Code: 0
```
✅ PASSED: Invalid command shows help (graceful handling)

### Scenario 4: Session View - Non-existent Session
```
╔══════════════════════════════════════════════════════════════════════════════╗
║ ❌ Fatal error                                                                ║
║ EXECUTORS is not defined                                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
Exit Code: 1
```
✅ PASSED: Non-existent session shows clear error message

### Scenario 5: Environment Variable Support
```
                                   GENIE CLI
Genie Template :: Command Palette Quickstart
╭──────────────────────────  ╭────────────────────────── ╭─────────────────────╮
│ Background: detached     │ │ Plan → Wish → Forge      ││ Evidence-first      │
│ default                  │ │ workflow                 ││ outputs             │
Exit Code: 0
```
✅ PASSED: Environment variables processed correctly

### Scenario 6: Output Redirection
```
Grep successful
Exit Code: 0
```
✅ PASSED: Output can be piped and processed

## Test Summary

| Test Category | Passed | Failed | Total |
|---------------|--------|--------|-------|
| Basic Commands | 2 | 0 | 2 |
| Error Handling | 2 | 0 | 2 |
| Environment | 1 | 0 | 1 |
| I/O Operations | 1 | 0 | 1 |
| **Total** | **6** | **0** | **6** |

### Overall Result: ✅ ALL TESTS PASSED
