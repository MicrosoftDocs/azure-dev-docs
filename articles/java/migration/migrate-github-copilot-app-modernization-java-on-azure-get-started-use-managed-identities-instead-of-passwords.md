# Get Started: Use Managed Identities Instead of Passwords

## Prerequisites
- [VSCode](https://code.visualstudio.com/): The latest version is recommended.
- [A GitHub account with GitHub Copilot enabled](https://github.com/features/copilot): All plans are supported, including the Free plan.
- [GitHub Copilot extension in VSCode](https://code.visualstudio.com/docs/copilot/overview): The latest version is recommended.
- [AppCAT](https://aka.ms/appcat-install): Required for the app assessment feature.

## Sign in to use Copilot
To use GitHub Copilot, please sign in to your GitHub account in VSCode. Click the Copilot icon at the top of VSCode to access the GitHub Copilot pane. For more information about setting up GitHub Copilot, refer to [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup).

## Installation
In VSCode, open the Extensions view from Activity Bar, search **GitHub Copilot App Modernization - Java on Azure** extension in marketplace. Select the **Install** button on the extension. For more information about installing a VSCode extension, refer to [Install a VS Code extension](https://code.visualstudio.com/docs/getstarted/extensions#_install-a-vs-code-extension). After installation completes, you should see a notification in the bottom-right corner of VSCode confirming success.

## Configuration
In VSCode, configure runtime arguments to enable the proposed API:
```json
  "enable-proposed-api": ["Microsoft.migrate-java-to-azure"],
```
1. Press **Ctrl+Shift+P** and select **Preferences: Configure Runtime Arguments**.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/configure-runtime-arguments" border="false" alt-text="Configure Runtime Arguments in VSCode" :::

2. Add the above JSON snippet into the editor and save.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/config-api-for-extension.jpg" border="false" alt-text="Configure proposed API in VSCode runtime arguments" :::

3. Restart VSCode.

## Assess cloud readiness
Start your migration process with solution assessment, to understand what your cloud readiness challenges are, how impactful they are and get recommended solutions. A solution can be references to set up Azure resources, adding configurations or making code changes.
1. Clone the [Java migration copilot samples](https://github.com/Azure-Samples/java-migration-copilot-samples) repository and open the `mi-sql-public-demo` project folder.
2. Click **GitHub Copilot App Modernization - Java on Azure** blade on the sidebar, and then click **Assess** button in Assessment section.  

:::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/assess-button-of-assessment.png" border="false" alt-text="Click Assess Button for Assessment" :::

3. Now Github Copilot chat window with agent mode will be opened to call the modernization assessor to execute app modernization assessment. Please click **Continue** button to confirm.
4. The modernization assessor now opens assessment.md as the configuration for running AppCAT to do app assessment and asks for your confirmation to continue. You can examine its content and make changes if necessary there. 
5. The modernization assessor will verify your local environment first. If the AppCAT and its dependencies are not installed, then they need to be installed first - more details to visit https://aka.ms/appcat-install. After that, it will call AppCAT to assess the current project. This step could take several minutes to complete. 
6. Upon completion of the analysis, the modernization assessor produces a categorized view of cloud readiness issues in an opened summary report.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/assessment-summary-report.png" border="false" alt-text="Summary Report of Assessment" :::

7. With reviewing the summary report, you can click on the **Propose Solution** button at the bottom and move to the next step: choose your desired solution per category/sub category. 
8. After deciding on the solutions, you can click on the **Confirm solution** button to get into the migration step. You can click on the **Migrate** button for the **Use Azure SQL Database** solution to enter into the code remediation stage.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/confirm-sql-solution.png" border="false" alt-text="Confirm Azure SQL Solution" :::

:::image type="content" source="./media/migrate-github-copilot-app-modernization-java-on-azure/migrate-sql-solution.png" border="false" alt-text="Migrate Azure SQL Solution" :::

## Apply a predefined formula
The migration Copilot provides predefined formulas for common migration scenarios that you may face when migrating to Azure. In this example you'll use the Managed Identity formulas to change your Azure SQL database connection from username and password to Azure Managed Identity.
1. After clicking the Migrate button in the Solution Report, Copilot chat window will be opened with Agent Mode.
1. Click **Continue** repeatedly to confirm each tool action in the Copilot Chat window. The Copilot Agent uses various tools to facilitate application modernization. Each tool's usage requires confirmation by clicking the `Continue` button.
1. After each step, please manually input **continue** to confirm and proceed.
1. Wait the changed codes to be generated.
## Apply Build-fix
1. When the **Java Application Build-Fix** tool is suggested to run, click **Continue** to build the project and fix errors. This tool will attempt to resolve any build errors, in up to 10 iterations.
1. After the Build-Fix tool begins, click **Continue** to proceed and show progress.
1. After all done, please review code changes and confirm by click **Keep** button.


## Next steps
[Create and apply your own migration formula](/azure/developer/java/migration/migrate-github-copilot-app-modernization-java-on-azure-get-started-create-and-apply-your-own-formula)