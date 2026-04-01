import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * FileEditTool implementation ported from Claude Code.
 * Provides atomic string replacement with safety checks.
 */
export async function run(args) {
    const filePathInput = args[1];
    const oldStringInput = args[2];
    const newStringInput = args[3];

    if (!filePathInput || !oldStringInput || !newStringInput) {
        console.log(chalk.red('❌ Missing arguments.'));
        console.log(chalk.gray('Usage: erix edit <file_path> <old_string> <new_string>'));
        return;
    }

    const fullPath = path.resolve(process.cwd(), filePathInput);

    if (!fs.existsSync(fullPath)) {
        console.log(chalk.red(`❌ File not found: ${filePathInput}`));
        return;
    }

    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Safety Check: Count matches
        const matches = content.split(oldStringInput).length - 1;
        
        if (matches === 0) {
            console.log(chalk.red('❌ String to replace not found in file.'));
            return;
        }

        if (matches > 1) {
            const { confirm } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: chalk.yellow(`⚠️  Found ${matches} occurrences. Replace ALL?`),
                default: false,
            }]);
            
            if (!confirm) {
                console.log(chalk.gray('🚫 Edit cancelled. Provide more context to target a specific line.'));
                return;
            }
        }

        // Atomic write logic from Claude Code
        const updatedContent = matches > 1 
            ? content.replaceAll(oldStringInput, newStringInput)
            : content.replace(oldStringInput, newStringInput);

        // Atomic swap (optional: backup first)
        const tempPath = `${fullPath}.tmp-${Date.now()}`;
        fs.writeFileSync(tempPath, updatedContent, 'utf8');
        fs.renameSync(tempPath, fullPath);

        console.log(chalk.green(`✅ Done! ${matches} replacement(s) in ${filePathInput}.`));

    } catch (err) {
        console.error(chalk.red('❌ Edit failed:'), err.message);
    }
}
