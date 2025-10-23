import path from 'path';
import { promises as fsp } from 'fs';
import type { ParsedCommand, GenieConfig, ConfigPaths } from '../lib/types';
import { emitView } from '../lib/view-helpers';
import { buildErrorView, buildInfoView, buildWarningView } from '../views/common';
import { pathExists } from '../lib/fs-utils';
import { getPackageVersion } from '../lib/package';
import {
  checkForUpdates,
  generateFrameworkDiff,
  applyUpgrade,
  type UpgradeContext
} from '../lib/upgrade';

interface UpdateFlags {
  preview?: boolean;
  rollback?: boolean;
  force?: boolean;
}

export async function runUpdate(
  parsed: ParsedCommand,
  _config: GenieConfig,
  _paths: Required<ConfigPaths>
): Promise<void> {
  try {
    const flags = parseFlags(parsed.commandArgs);
    const cwd = process.cwd();

    // Check if .genie exists
    const genieDir = path.join(cwd, '.genie');
    if (!await pathExists(genieDir)) {
      await emitView(
        buildErrorView(
          'Not initialized',
          'No .genie directory found. Run `genie init` first.'
        ),
        parsed.options,
        { stream: process.stderr }
      );
      process.exitCode = 1;
      return;
    }

    // Check for .framework-version
    const versionPath = path.join(genieDir, '.framework-version');
    let installedVersion: string;
    let installedCommit: string;

    if (await pathExists(versionPath)) {
      const versionData = JSON.parse(await fsp.readFile(versionPath, 'utf8'));
      installedVersion = versionData.installed_version;
      installedCommit = versionData.installed_commit;
    } else {
      // Legacy installation without .framework-version
      // Use current package version as baseline
      installedVersion = getPackageVersion();
      installedCommit = 'unknown';

      await emitView(
        buildWarningView(
          'Legacy installation detected',
          [
            'No .framework-version file found.',
            'Assuming current package version as baseline.',
            `Version: ${installedVersion}`
          ]
        ),
        parsed.options
      );
    }

    // Check for updates
    const updateCheck = await checkForUpdates(installedVersion, installedCommit);

    if (!updateCheck.available) {
      await emitView(
        buildInfoView(
          'Already up to date',
          [
            `Current version: ${installedVersion}`,
            `Latest version: ${updateCheck.latestVersion}`,
            '✅ No updates available'
          ]
        ),
        parsed.options
      );
      return;
    }

    // Show update info
    await emitView(
      buildInfoView(
        'Update available',
        [
          `Current: ${installedVersion}`,
          `Available: ${updateCheck.latestVersion}`,
          '',
          'Changes:',
          ...updateCheck.changes.map(c => `  ${c}`)
        ]
      ),
      parsed.options
    );

    // Preview mode - just show what would change
    if (flags.preview) {
      await emitView(
        buildInfoView(
          'Preview mode',
          ['Run `genie update` without --preview to apply changes']
        ),
        parsed.options
      );
      return;
    }

    // Prompt for confirmation (unless --force)
    if (!flags.force) {
      const { default: prompts } = await import('prompts');
      const response = await prompts({
        type: 'confirm',
        name: 'proceed',
        message: 'Would you like to upgrade now?',
        initial: true
      });

      if (!response.proceed) {
        console.log('Update cancelled.');
        return;
      }
    }

    // Generate upgrade diff
    await emitView(
      buildInfoView('Preparing upgrade', ['📦 Fetching framework diff...']),
      parsed.options
    );

    const upgradeContext: UpgradeContext = {
      oldVersion: installedVersion,
      newVersion: updateCheck.latestVersion,
      oldCommit: installedCommit,
      newCommit: updateCheck.latestCommit,
      workspacePath: cwd
    };

    const diff = await generateFrameworkDiff(upgradeContext);

    if (!diff.hasChanges) {
      await emitView(
        buildInfoView('No framework changes', ['All files are up to date']),
        parsed.options
      );
      return;
    }

    // Test merge
    await emitView(
      buildInfoView('Testing merge', ['🧪 Checking for conflicts...']),
      parsed.options
    );

    const result = await applyUpgrade(diff, upgradeContext);

    if (result.success) {
      // Clean merge succeeded
      await emitView(
        buildInfoView(
          'Upgrade complete',
          [
            `✅ Successfully upgraded to ${updateCheck.latestVersion}`,
            `Files updated: ${result.filesUpdated}`,
            `User files preserved: ${result.filesPreserved}`
          ]
        ),
        parsed.options
      );
    } else {
      // Conflicts detected - needs Update Agent
      await emitView(
        buildWarningView(
          'Conflicts detected',
          [
            `⚠️  ${result.conflicts.length} file(s) have conflicts:`,
            ...result.conflicts.map(c => `   - ${c.file}`),
            '',
            '🤖 Update Agent required for conflict resolution.',
            'This feature is coming soon.',
            '',
            'For now, please:',
            '1. Review conflicts manually',
            '2. Or wait for Update Agent integration'
          ]
        ),
        parsed.options
      );
      process.exitCode = 1;
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await emitView(
      buildErrorView('Update failed', message),
      parsed.options,
      { stream: process.stderr }
    );
    process.exitCode = 1;
  }
}

function parseFlags(args: string[]): UpdateFlags {
  const flags: UpdateFlags = {};

  for (let i = 0; i < args.length; i++) {
    const token = args[i];

    if (token === '--preview' || token === '-p') {
      flags.preview = true;
    } else if (token === '--rollback') {
      flags.rollback = true;
    } else if (token === '--force' || token === '-f') {
      flags.force = true;
    }
  }

  return flags;
}
