import { execa } from 'execa';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

/**
 * GrepTool implementation ported from Claude Code.
 * Provides high-performance code search with context.
 */
export async function run(args) {
    const query = args[1];
    if (!query) {
        console.log(chalk.red('❌ Please provide a search query.'));
        console.log(chalk.gray('Example: erix search "TODO"'));
        return;
    }

    const options = {
        cwd: process.cwd(),
        caseSensitive: args.includes('--case-sensitive'),
        contextLines: 2, // Default context
    };

    try {
        console.log(chalk.cyan(`🔍 Searching for: "${query}"...\n`));

        // Basic ripgrep command structure
        const rgArgs = [
            query,
            '--json',
            '--max-columns=500',
            '--hidden',
            '--glob', '!**/node_modules/**',
            '--glob', '!.git/**',
        ];

        if (!options.caseSensitive) rgArgs.push('--ignore-case');
        
        const { stdout } = await execa('rg', rgArgs, { reject: false });
        
        if (!stdout) {
            console.log(chalk.yellow('📭 No matches found.'));
            return;
        }

        const lines = stdout.trim().split('\n');
        const results = lines.map(line => JSON.parse(line)).filter(item => item.type === 'match');

        if (results.length === 0) {
            console.log(chalk.yellow('📭 No matches found.'));
            return;
        }

        // Group by file
        const grouped = results.reduce((acc, match) => {
            const file = match.data.path.text;
            if (!acc[file]) acc[file] = [];
            acc[file].push(match.data);
            return acc;
        }, {});

        Object.entries(grouped).forEach(([file, matches]) => {
            console.log(chalk.green.bold(`📄 ${file}`));
            matches.forEach(match => {
                const lineNum = chalk.gray(match.line_number.toString().padStart(4) + ':');
                const content = match.lines.text.trim();
                console.log(`${lineNum} ${content}`);
            });
            console.log('');
        });

        console.log(chalk.cyan(`✅ Found ${results.length} matches in ${Object.keys(grouped).length} files.`));

    } catch (err) {
        console.error(chalk.red('❌ Search failed:'), err.message);
    }
}
