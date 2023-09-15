import { executableExists } from "../../utils";
import inquirer from "inquirer";
import { Spinner } from "cli-spinner";

export const generateWebAppSshCommand = async () => {
  try {
    /** Check if the Azure CLI is installed */
    if (!executableExists("az")) {
      console.error("The Azure CLI is not installed.");
      console.log(
        "\nInstall instructions: https://learn.microsoft.com/en-us/cli/azure/get-started-with-azure-cli#install-or-run-in-azure-cloud-shell",
      );
      return;
    }

    /** Start the loading spinner */
    const spinner = new Spinner("%s Sit tight...");

    /** Fetch resource groups */
    spinner.start();
    const resourceGroupProcess = Bun.spawnSync([
      "az",
      "group",
      "list",
      "--query",
      "[].name",
    ]);
    spinner.stop(true);

    /** Prompt to select a resource group */
    const { resourceGroup: selectedResourceGroup } = await inquirer.prompt([
      {
        type: "list",
        name: "resourceGroup",
        message: "Select a resource group",
        choices: JSON.parse(resourceGroupProcess.stdout.toString()),
      },
    ]);

    /** Fetch scoped web apps */
    spinner.start();
    const webappProcess = Bun.spawnSync([
      "az",
      "webapp",
      "list",
      "--query",
      `[?contains(resourceGroup, '${selectedResourceGroup}')].name`,
    ]);
    spinner.stop(true);

    /** Prompt to select a resource group */
    const { webapp: selectedWebapp } = await inquirer.prompt([
      {
        type: "list",
        name: "webapp",
        message: "Select a webapp",
        choices: JSON.parse(webappProcess.stdout.toString()),
      },
    ]);

    console.log(
      `\nRun: az webapp create-remote-connection -g ${selectedResourceGroup} -n ${selectedWebapp}`,
    );
    console.log(`Then: ssh root@127.0.0.1 -p <port>`);
  } catch (err: any) {
    console.error("An unknown error occurred.");
  }
};
