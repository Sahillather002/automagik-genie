# 🧞 GENIE Framework

**The Universal Agent Orchestration Framework**

GENIE is a self-contained framework for managing AI agent conversations, wishes, and orchestration. It works with any AI system (Claude, Cursor, etc.) and provides consistent tooling for agent management.

## Structure

```
.genie/
├── agents/          # Agent personalities (forge-coder, forge-tests, etc.)
├── wishes/          # Structured development wishes
├── reports/         # Death Testaments and execution reports
├── cli/            # Command-line tools
│   └── agent.js    # Universal agent conversation manager
├── templates/      # Wish and report templates
└── knowledge/      # Shared knowledge base
```

## Quick Start

### Using the Agent CLI

Start a conversation with any agent:
```bash
./.genie/cli/agent.js chat forge-coder "implement authentication"
```

Continue the conversation:
```bash
./.genie/cli/agent.js continue forge-coder "add OAuth support"
```

List active sessions:
```bash
./.genie/cli/agent.js list
```

### Available Agents

- **forge-coder** - Feature implementation specialist
- **forge-tests** - Test writing expert
- **forge-master** - Task creation and orchestration
- **forge-quality** - Code quality enforcement
- **forge-hooks** - Hook configuration specialist
- **forge-qa-tester** - QA and testing coordinator
- **forge-self-learn** - Behavioral learning and improvement

#### Local agents in this repo
- **evaluator** – Voice evaluation rubric and scoring prompt (`.genie/agents/evaluator.md`)
- **refactorer** – Prompt refactoring specialist (`.genie/agents/refactorer.md`)
- **rules-integrator** – Minimal, non-destructive rules updater (`.genie/agents/rules-integrator.md`)

### For AI Agents (Claude, etc.)

Instead of using one-shot Task tools, use the CLI for full conversations:

```bash
# Start implementing a wish
./.genie/cli/agent.js chat forge-coder "@.genie/wishes/auth-wish.md implement Group A"

# Continue with error handling
./.genie/cli/agent.js continue forge-coder "tests failing, debug the issue"
```

## Conventions

### Wishes
- Stored in `.genie/wishes/`
- Named as `<feature>-wish.md`
- Contain structured implementation plans

### Reports
- Death Testaments in `.genie/reports/`
- Named as `<agent>-<slug>-<YYYYMMDDHHmm>.md`
- Document execution evidence and risks

### Agents
- Defined in `.genie/agents/`
- Markdown files with structured prompts
- Loaded as Codex base instructions

## Configuration

The agent CLI uses presets for different scenarios:
- **default** - Standard execution mode
- **careful** - Read-only, careful execution
- **fast** - Quick execution mode
- **debug** - Debug mode with search enabled

### Agent Front Matter Reference

Each file in `.genie/agents/` can override executor behaviour by adding a YAML
front matter block. The CLI loads that block, merges it with `config.yaml`, and
translates it to `codex exec` flags. The structure is:

```yaml
---
name: my-agent
description: Optional prompt summary
genie:
  executor: codex            # Which executor profile to use (defaults to `codex`)
  background: false          # Force foreground (otherwise inherits CLI default)
  binary: codex              # Override executable name if needed
  sessionsDir: .genie/state/agents/codex-sessions
  sessionExtractionDelayMs: 2000
  exec:
    fullAuto: true           # --full-auto
    model: gpt-5-codex       # -m
    sandbox: workspace-write # -s
    profile: null            # -p
    includePlanTool: true    # --include-plan-tool
    search: true             # --search
    skipGitRepoCheck: true   # --skip-git-repo-check
    json: false              # --json
    experimentalJson: true   # --experimental-json
    color: never             # --color
    cd: null                 # -C <path>
    outputSchema: null       # --output-schema
    outputLastMessage: null  # --output-last-message
    reasoningEffort: high    # -c reasoning.effort="high"
    images: []               # -i <path> for each entry
    additionalArgs: []       # Raw flags appended verbatim
  resume:
    includePlanTool: true
    search: true
    last: false              # --last when resuming
    additionalArgs: []
---
```

Supported keys are derived from the codex executor defaults
(`.genie/cli/src/executors/codex.ts`). Any value omitted in front matter keeps
the executor default. Unknown keys under `genie.exec` become additional `codex
exec` overrides, so the safest pattern is to use the fields above. Put extra
flags in `additionalArgs` to avoid accidentally shadowing future options.

## Integration

### With Claude
Claude continues to use its specific configuration in `.claude/` but leverages GENIE for agent orchestration.

### With Other Systems
Copy the `.genie/` directory to any project to enable GENIE orchestration.

## Future Extensions

- Session history and search
- Background execution monitoring
- Multi-session per agent support
- Conversation export and analysis

---

*GENIE: Making agent orchestration magical* 🧞✨
