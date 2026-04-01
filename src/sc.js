import { execa } from 'execa';
import chalk from 'chalk';
import path from 'path';

/**
 * Smart Commit (sc) implementation ported from Claude Code.
 * Gathers context and generates high-quality commit messages focuses on "why".
 */
export async function run(args) {
    console.log(chalk.cyan('🧠 Gathering Git context for smart commit...'));

    try {
        // Gathers context as per Claude's source
        const [status, diff, branch, recent] = await Promise.all([
            execa('git', ['status']),
            execa('git', ['diff', '--staged']).catch(() => ({ stdout: '(No staged changes)' })),
            execa('git', ['branch', '--show-current']),
            execa('git', ['log', '--oneline', '-5']),
        ]);

        if (!diff.stdout || diff.stdout.trim() === '(No staged changes)' || diff.stdout.trim().length === 0) {
            console.log(chalk.yellow('⚠️  No staged changes found. Use "git add" first.'));
            return;
        }

        console.log(chalk.green('✅ Git context gathered.'));
        console.log(chalk.gray('-'.repeat(40)));
        console.log(chalk.bold('CURRENT BRANCH:'), branch.stdout.trim());
        console.log(chalk.bold('STAGED DIFF:'), `(${diff.stdout.length} chars)`);
        console.log(chalk.gray('-'.repeat(40)));

        // Output instructions for the LLM (us)
        console.log(chalk.cyan.bold('\n💡 Copy the staged diff above or provide it to your AI agent with:'));
        console.log(chalk.white('   "Draft a smart commit message for these changes."\n'));

        // Implementation of commit prompt execution
        const { confirm } = await import('inquirer').then(m => m.default.prompt([{
            type: 'input',
            name: 'message',
            message: chalk.magenta('Enter the commit message (or press Enter to skip):'),
        }]));

        if (confirm) {
            await execa('git', ['commit', '-m', confirm]);
            console.log(chalk.green(`🚀 Committed successfully!`));
        }

    } catch (err) {
        console.error(chalk.red('❌ Smart Commit failed:'), err.message);
    }
}
