---
title: Deploy changes and updates to Azure App Service on Linux from Visual Studio Code
description: Tutorial part 6 for deploying Python apps to Azure App Service on Linux
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/02/2019
ms.author: kraigb
---

# Make changes and redeploy

[Previous step: deploy your app using Git](tutorial-deploy-app-service-on-linux-05.md)

With your App Service connected to a repository, you have a simple code-test-deploy process:

1. Make changes and test the app locally.

1. Commit changes to your Git repository. Always remember this step, because the App Service extension pulls your code from the repository and won't pick up uncommitted changes!

1. Deploy the code:

    1. **LocalGit**: open the **Azure: App Service** explorer, right-click the App Service, and select **Deploy to Web App**.
    1. **GitHub**: push your changes to GitHub; App Service automatically deploys the code and restarts.

1. Once deployment is complete, wait a few seconds for the App Service to restart, then browse the website and verify your changes.

With any deployment option, you can observe status on the Azure portal under the App Service's **Deployment** > **Deployment options** page:

![Azure portal showing deployment status for an App Service](media/deploy-azure/deployment-options-status.png)

## Changing the GitHub branch

When you use the App Service extension in VS Code to set GitHub as the deployment source, you're prompted for a specific branch. This branch is then directly wired into the App Service configuration. To use a different branch, you must first disconnect the existing branch, then create a new connection:

1. In the **App Service** explorer in VS Code, right-click the App Service and select **Open in portal**.
1. On the portal, select **Deployment** > **Deployment options**, then select **Disconnect**.

    ![Disconnecting a deployment source](media/deploy-azure/deployment-options-disconnect.png)

1. Once disconnected, you can configure a new connection directly on the portal, or you can use the App Service extension in VS Code to set the deployment source to GitHub again, selecting the desired branch.

## Clean up resources

The App Service you created includes a backing App Service Plan that can incur costs. To clean up the resources, right-click the App Service in the **Azure: App Service** explorer and select **Delete**. You can also visit the [Azure portal](https://portal.azure.com), select **Resource groups** from the left-side navigation pane, select the resource group that was created in the process of this tutorial, and then use the **Delete resource group** command.

## Next steps

Congratulations on completing this walkthrough of deploying Python code to App Service on Linux!

As noted earlier, you can learn more about the App Service extension by visiting its GitHub repository, [vscode-azureappservice](https://github.com/Microsoft/vscode-azureappservice). Issues and contributions are also welcome.

To learn more about Azure services that you can use from Python, including data storage along with AI and Machine Learning services, visit [Azure Python Developer Center](https://docs.microsoft.com/python/azure/?view=azure-python).

There are also other Azure extensions for VS Code that you may find helpful. Just search on "Azure" in the Extensions explorer:

![Azure extensions for VS Code](media/deploy-containers/azure-extensions.png)

Some popular extensions are:

- [Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
- [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
- [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
- [Azure Resource Manager (ARM) Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
