# Get started: create and apply your own formula

In code development, enterprises often have different processes and controls to adhere to their organizational policies and business needs. This is where **custom formula** comes in. The **custom formula** is enerated by analyzing code commits from already-migrated codes and guides Copilot to remediate code, following the pattern established by the already-migrated codes.

## Prerequisites

- [VSCode](https://code.visualstudio.com/): The latest version is recommended.
- [A GitHub account with GitHub Copilot enabled](https://github.com/features/copilot): All plans are supported, including the Free plan.
- [GitHub Copilot extension in VSCode](https://code.visualstudio.com/docs/copilot/overview): The latest version is recommended.
- [AppCAT](https://aka.ms/appcat-install): Required for the app assessment feature.
- [GitHub Copilot App Modernization for Java (Preview)](migrate-github-copilot-app-modernization-java-on-azure-get-started-use-managed-identities-instead-of-passwords#installation): Please install it and add the required configuration.

## Create a custom formula

1. Clone the [Java migration copilot samples](https://github.com/Azure-Samples/java-migration-copilot-samples) repository and open the `rabbitmq-sender` project folder. Then, check out the project to the `expected` branch.

1. Open **App Modernization for Java** extension blade from the Activity sidebar, and then click **Create formula from source control** button in Formulas section.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/create-formula-from-source-control.png" border="false" alt-text="Create formula from source control" :::

1. Type "update expected changes for rabbitmq" to search for the commit that migrates RabbitMQ. Then select the corresponding commit and click `OK`.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/commit-for-custom-formula.png" border="false" alt-text="Select the commit for custom formula" :::

1. Click **Create New** to create a new custom formula.

1. Default formula name will be generated. Give it a new name: "custom formula migrate rabbitmq". Press Enter to confirm. Then, formula description, and search patterns will be generated in order. Press Enter repeatedly to confirm.

1. Now, the custom formula for migrating rabbitmq is generated and shows in the Formulas section of `App Modernization for Java` blade.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/custom-formula-rabbitmq.png" border="false" alt-text="Custom formula created" :::

## Apply the custom formula

1. Check out the project to the `main` branch. Find the custom formula just created in the Formulas section of `App Modernization for Java` blade. Run this formula by clicking **Run Formula** button.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/run-formula.png" border="false" alt-text="Run formula" :::

1. After triggering to run the formula, Copilot chat window will be opened with Agent Mode automatically.

1. Click **Continue** repeatedly to confirm each tool action in the Copilot Chat window. The Copilot Agent uses various tools to facilitate application modernization. Each tool's usage requires confirmation by clicking the `Continue` button.

1. After each step, please manually input **continue** to confirm and proceed.

1. Wait the changed codes to be generated.

1. When the **Java Application Build-Fix** tool is suggested to run, click **Continue** to build the project and fix errors. This tool will attempt to resolve any build errors, in up to 10 iterations.

1. After the Build-Fix tool begins, click **Continue** to proceed and show progress.

1. After all done, please review code changes and confirm by click **Keep** button.
