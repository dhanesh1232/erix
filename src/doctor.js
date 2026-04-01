import chalk from 'chalk';
import { execa } from 'execa';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

export async function doctor() {
  console.log(chalk.bold.blue('\n🏥 ERIX DOCTOR — System Diagnostics\n'));
  const results = [];

  // Check 1: Node.js Version
  const nodeSpinner = ora('Checking Node.js version...').start();
  const nodeVersion = process.versions.node;
  if (parseInt(nodeVersion.split('.')[0]) >= 18) {
    nodeSpinner.succeed(chalk.green(`Node.js v${nodeVersion} — OK`));
    results.push({ check: 'Node.js', status: 'pass' });
  } else {
    nodeSpinner.fail(chalk.red(`Node.js v${nodeVersion} — OUTDATED (Min v18 recommended)`));
    results.push({ check: 'Node.js', status: 'fail' });
  }

  // Check 2: Git Repository
  const gitSpinner = ora('Checking Git repository...').start();
  try {
    const { stdout: gitRoot } = await execa('git', ['rev-parse', '--show-toplevel']);
    gitSpinner.succeed(chalk.green(`Git repository detected at: ${gitRoot}`));
    results.push({ check: 'Git', status: 'pass' });
  } catch (err) {
    gitSpinner.warn(chalk.yellow('Git repository not detected. Some commands may not work.'));
    results.push({ check: 'Git', status: 'warn' });
  }

  // Check 3: PNPM Workspace
  const pnpmSpinner = ora('Checking pnpm workspace...').start();
  if (fs.existsSync(path.join(process.cwd(), 'pnpm-workspace.yaml'))) {
    pnpmSpinner.succeed(chalk.green('pnpm-workspace.yaml found — Workspace mode active.'));
    results.push({ check: 'pnpm Workspace', status: 'pass' });
  } else {
    pnpmSpinner.info(chalk.blue('No pnpm-workspace.yaml in current directory.'));
    results.push({ check: 'pnpm Workspace', status: 'info' });
  }

  // Check 4: Package.json integrity
  const pkgSpinner = ora('Checking package.json...').start();
  if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
      pkgSpinner.succeed(chalk.green(`package.json found: ${pkg.name || 'unnamed'}@${pkg.version || '0.0.0'}`));
      results.push({ check: 'package.json', status: 'pass' });
    } catch (err) {
      pkgSpinner.fail(chalk.red('package.json exists but is invalid JSON.'));
      results.push({ check: 'package.json', status: 'fail' });
    }
  } else {
    pkgSpinner.warn(chalk.yellow('No package.json found in current directory.'));
    results.push({ check: 'package.json', status: 'warn' });
  }

  // Check 5: Lockfile Health
  const lockSpinner = ora('Checking lockfile...').start();
  const hasPnpmLock = fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'));
  const hasNpmLock = fs.existsSync(path.join(process.cwd(), 'package-lock.json'));
  const hasYarnLock = fs.existsSync(path.join(process.cwd(), 'yarn.lock'));

  if (hasPnpmLock) {
    lockSpinner.succeed(chalk.green('pnpm-lock.yaml found — Using pnpm (Recommended)'));
    results.push({ check: 'Lockfile', status: 'pass' });
  } else if (hasNpmLock || hasYarnLock) {
    lockSpinner.warn(chalk.yellow('Alternative lockfile found (npm/yarn). User rules prefer pnpm.'));
    results.push({ check: 'Lockfile', status: 'warn' });
  } else {
    lockSpinner.info(chalk.blue('No lockfile found. Run pnpm install to generate one.'));
    results.push({ check: 'Lockfile', status: 'info' });
  }

  // Summary
  console.log(chalk.bold('\n📊 Diagnostic Summary\n'));
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warned = results.filter(r => r.status === 'warn').length;

  console.log(`${chalk.green('✔ Passed:')} ${passed}`);
  console.log(`${chalk.yellow('⚠ Warnings:')} ${warned}`);
  console.log(`${chalk.red('✖ Failures:')} ${failed}`);

  if (failed > 0) {
    console.log(chalk.red.bold('\n❌ Critical issues found. Please address them for optimal performance.'));
  } else if (warned > 0) {
    console.log(chalk.yellow.bold('\n✨ Everything is looking good, but consider fixing the warnings above.'));
  } else {
    console.log(chalk.green.bold('\n🚀 All systems green! Your environment is perfectly optimized.'));
  }
}
