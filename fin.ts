import figlet from "figlet";
import { Command, CommanderError } from "commander";
import { jsonActions } from "./actions/json";
import { azureActions } from "./actions/az";
import { Spinner } from "cli-spinner";

Spinner.setDefaultSpinnerString("◢◣◤◥");

/** Console log figlet text only if no arguments/options are supplied */
if (
  process.argv.length === 2 ||
  (process.argv[2] && ["--help", "-h"].includes(process.argv[2]))
) {
  console.log(figlet.textSync("Fin"));
}

/** Exit override for commander */
const exitOverride = (err: any) => {
  const acceptableErrorCodes = [
    "commander.help",
    "commander.helpDisplayed",
    "commander.version",
    "commander.unknownOption",
  ];

  if (acceptableErrorCodes.includes(err.code)) {
    process.exit(0);
  }

  if (err instanceof CommanderError) {
    const { exitCode, code, message } = err;
    console.log({
      code,
      exitCode,
      message,
    });
  } else {
    console.log(err);
  }

  process.exit(0);
};

const program = new Command();
program.showHelpAfterError("run fin --help for additional information");

program
  .name("fin")
  .exitOverride(exitOverride)
  .description("Fin is a CLI for being productive with finesse")
  .version("0.0.1")
  .addHelpCommand(false);

/**
 * fin json:users
 * fin json:users --limit 5
 * fin json:users --limit 5 --output ./users.json
 * fin json:users --limit 5 --output ./users.json --force
 */
program
  .command("json:users")
  .description("Fetches users data from jsonplaceholder")
  .option(
    "--limit <number>",
    "Limit the number of fetched users, min 1, max 10",
    "10",
  )
  .option("--output <path>", "Output path for the file", "./users.json")
  .option("--force", "Force overwrite of existing file", false)
  .action(jsonActions.fetchJsonUsers);

/**
 * fin az:ssh
 */
program
  .command("az:ssh")
  .description("Generate ssh command for Azure webapp")
  .action(azureActions.generateWebAppSshCommand);

program.parse(process.argv);
