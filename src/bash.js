import chalk from 'chalk';
import { execa } from 'execa';
import ora from 'ora';

export async function run(args) {
  const command = args.slice(1).join(' ');
  if (!command) {
    console.log(chalk.red('❌ Please provide a command to run (e.g. erix run "ls -la")'));
    return;
  }

  // Claude-style Security Check: Alert for destructive patterns
  const destructivePatterns = ['rm -rf', 'sudo', 'mv /', 'dd if=', 'chmod -R 777'];
  const isDestructive = destructivePatterns.some(p => command.includes(p));

  if (isDestructive) {
    console.log(chalk.bold.red('\n⚠️  DESTRUCTIVE COMMAND DETECTED\n'));
    console.log(chalk.gray(`The command "${chalk.white(command)}" is potentially dangerous.`));
    console.log(chalk.gray('Executing such commands directly via CLI agents requires extreme caution.\n'));
  }

  const spinner = ora(chalk.cyan(`Executing: ${command}`)).start();
  const startTime = Date.now();

  try {
    const { stdout, stderr } = await execa(command, { 
      shell: true, 
      timeout: 30000, // 30s timeout
      all: true 
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    spinner.succeed(chalk.green(`Execution completed in ${duration}s`));

    if (stdout) {
      console.log(chalk.gray('━━━━━━━━ Output ━━━━━━━━'));
      console.log(stdout);
    }

    if (stderr) {
      console.log(chalk.red('━━━━━━━━ Errors ━━━━━━━━'));
      console.log(stderr);
    }
    
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  } catch (err) {
    spinner.fail(chalk.red(`Failed after ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
    console.error(chalk.red('\n❌ Command failed with error:'));
    console.error(chalk.gray(err.message));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }
}
