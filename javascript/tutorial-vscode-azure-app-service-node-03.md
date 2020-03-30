---
title: Deploy Node.js apps to Azure App Service from Visual Studio Code
description: Tutorial part 3, deploy the website
ms.topic: conceptual
ms.date: 03/04/2020
---

# Deploy the app to Azure

[Previous step: Create the app](tutorial-vscode-azure-app-service-node-02.md)

In this step, you deploy your Node.js app to Azure using git deploy through the VS Code and the Azure App Service extension. To accomplish this goal, you first initialize a local git repository, then create a web app on Azure, then configure VS Code to use git deploy.

1. In the terminal, make sure you're in the *myexpressapp* folder, then start Visual Studio Code with the following command:

    ```bash
    code .
    ```

1. In VS Code, select the source control icon to open the **Source Control** explorer, then select **Initialize Repository**:

1. After the repository is initialized, enter the message "Initial commit" and select the checkmark to create the initial commit of your source files.

    ![Complete an initial commit to the repository](media/deploy-azure/initial-commit.png)

1. From the command palette (**F1**), type "create web" and select **Azure App Service: Create New Web App...Advanced**. You use the advanced command to have full control over the deployment including resource group, App Service Plan, and operating system rather than use Linux defaults.

1. Respond to the prompts as follows:

    - Select your **Subscription** account (if prompted).
    - For **Enter a globally unique name**, enter a name that's unique across all of Azure. Use only alphanumeric characters ('A-Z', 'a-z', and '0-9') and hyphens ('-')
    - Select **Linux** as the operating system.
    - Select **Node LTS** as the Node version.
    
1. After a short time, VS Code notifies you that creation is complete. Close the notification with the **X** button:

    ![Notification on completion of web app creation](media/deploy-azure/creation-complete.png)

1. With the web app in place, you next instruct VS Code to deploy your code from the local git repo. Select the Azure icon to open the **Azure App Service** explorer, expand your subscription node, right-click the name of the web app you just created, and select **Configure Deployment Source**.

    ![COnfigure deployment source command on a web app](media/deploy-azure/configure-deployment-source.png)

1. When prompted, select **LocalGit**.

1. Select the blue up arrow icon to deploy your code to Azure:

    ![Deploy to Web App icon](media/deploy-azure/deploy.png)

1. At the prompts, select the *myexpressapp* folder, select your **subscription** account again and then select the name of the web app created earlier.

1. Select **Yes** when prompted to update your configuration to run `npm install` on the target server.

    ![Prompt to update configuration on the target Linux server](media/deploy-azure/server-build.png)

1. Select **Yes** when prompted with **Always deploy the workspace "nodejs-docs-hello-world" to (app name)"**. Selecting **Yes** tells VS Code to automatically target the same App Service web app with subsequent deployments.

1. Once deployment is complete, select **Browse Website** in the prompt to view your freshly deployed web app. The browser should display "Hello World!"

1. (Optional): You can make changes to your code files, then use the deploy button again to update the web app.

> [!div class="nextstepaction"]
> [My site is on Azure](tutorial-vscode-azure-app-service-node-04.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azureappservice&step=deploy-app)
