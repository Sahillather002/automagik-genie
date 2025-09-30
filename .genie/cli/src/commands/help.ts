import type { ParsedCommand, GenieConfig, ConfigPaths } from '../lib/types';
import { emitView } from '../lib/view-helpers';
import { buildHelpView } from '../views/help';

export async function runHelp(
  parsed: ParsedCommand,
  config: GenieConfig,
  _paths: Required<ConfigPaths>
): Promise<void> {
  const backgroundDefault = Boolean(config.defaults && config.defaults.background);
  const commandRows = [
    { command: 'run', args: '<agent> "<prompt>"', description: 'Start or attach to an agent' },
    { command: 'list agents', args: '', description: 'Show all available agents' },
    { command: 'list sessions', args: '', description: 'Display active and recent runs' },
    { command: 'resume', args: '<sessionId> "<prompt>"', description: 'Continue a background session' },
    { command: 'view', args: '<sessionId> [--full]', description: 'Show transcript for a session' },
    { command: 'stop', args: '<sessionId>', description: 'End a background session' },
    { command: 'help', args: '', description: 'Show this panel' }
  ];

  const envelope = buildHelpView({
    backgroundDefault,
    commandRows,
    promptFramework: {
      title: '🧞 Genie Framework',
      bulletPoints: [
        'Plan → Load mission/roadmap/standards context, clarify scope, log assumptions/decisions, and produce the planning brief with branch/tracker guidance.',
        'Wish → Convert the planning brief into an approved wish with context ledger, inline <spec_contract>, execution groups, and blocker protocol.',
        'Forge → Break the wish into execution groups and task files, document validation hooks, evidence paths, personas, and branch strategy before implementation.',
        'Review → Audit delivery by consolidating evidence, replaying agreed checks, and issuing a verdict or follow-up report before marking the wish complete.'
      ]
    },
    examples: [
      'genie run plan "[Discovery] mission @.genie/product/mission.md"',
      'genie run --help  # Show help for run command',
      'genie view RUN-1234',
      'genie list agents --help  # Show help for list command'
    ]
  });

  await emitView(envelope, parsed.options);
}
