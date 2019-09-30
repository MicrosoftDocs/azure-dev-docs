---
title: Deploy the app code to Azure App Service using the Azure CLI
description: Tutorial part 4, deploy the website
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: kraigb
---

# Deploy the app to App Service

[Previous step: Create the App Service](tutorial-vscode-azure-cli-node-03.md)

In this step, you deploy your Node.js app code to Azure App Service using a basic process of pushing your local Git repository to Azure.

1. At a terminal or command prompt, run the following commands to initialize a local Git repository and make an initial commit. (The *node_modules* folder is ignored because it's specified in the *.gitignore* file created when you ran the Express Generator earlier.)

    ```bash
    git init
    git add -A
    git commit -m "Initial Commit"
    ```

1. Run the following commands to set up deployment credentials in Azure, replacing `username` and `pPassword` with your credentials. The command displays JSON output upon success.

    ```bash
    az webapp deployment user set --user-name <username> --password <password>
    ```

1. Run the following command to retrieve the Git endpoint to which we want to push the app code, replacing `<your_app_name>` with the name you used when creating the App Service in the previous step:

    ```bash
    az webapp deployment source config-local-git --name <your_app_name>
    ```

    The output from the command is similar to the following:

    ```output
    {
      "url": "https://username@msdocs-node-cli.scm.azurewebsites.net/msdocs-node-cli.git"
    }
    ```

1. Run the following command to set a new remote in Git named `azure`, using the URL from the previous step *omitting the username*. Using the example in the previous step, the command would be as follows:

    ```bash
    git remote add azure https://msdocs-node-cli.scm.azurewebsites.net/msdocs-node-cli.git
    ```

1. Run the following command to deploy the app code from the Git repository to the App Service. The command prompts you for your credentials:

    ```bash
    git push azure master
    ```

1. As the command runs, it displays a series of message from the remote host. When the process is complete, refresh the browser in which you have the app's URL open to see the running code:

    ![App code running on Azure](media/azure-cli/remote-app.png)

> [!TIP]
> If you encounter the error `Object #<eventemitter> has no method 'hrtime'`, you probably need to set the node runtime version on the site. The command below tells the site to use node version `6.9.1`. If your site requires a different or later version of node, specify the full semantic version `major.minor.patch`.
>
> ```bash
> az webapp config appsettings set --name <your_app_name> --settings
> ```

> [!div class="nextstepaction"]
> [I deployed the app](tutorial-vscode-azure-cli-node-05.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment&step=deploy-website)
