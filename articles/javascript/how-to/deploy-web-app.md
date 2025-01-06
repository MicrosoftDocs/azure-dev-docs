---
title: Deploy JavaScript apps on Azure
description: Deploying your JavaScript applications to Azure allows you to leverage the power of cloud computing, ensuring scalability, reliability, and global reach. This guide will walk you through various methods to deploy your JavaScript apps to Azure, from manual deployments to automated CI/CD pipelines.
ms.topic: concept-article
ms.date: 01/06/2025
ms.custom: vscode-azure-extension-update-completed
#customer intent: As a JavaScript developer new to Azure, I want know all the ways to deploy code to Azure so that I can choose the best process for my application and situation.
---

# Deployment JavaScript app to Azure overview

To deploy your JavaScript-based app to Azure, you move a file or set of files to Azure to be served via an HTTP endpoint. The process of moving the files is called deployment. 

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).
* [Node.js LTS](https://nodejs.org/).
* A GitHub account if you plan to deploy from a GitHub repository.

## Deployment methods

Azure offers various deployment methods to suit different needs. Here are some common methods:

| Method | Details |
|--|--|
|[Azure Developer CLI](/azure/developer/azure-developer-cli)|Ideal for developers who prefer command-line tools and need to automate the provisioning and deployment of resources.|
|[Visual Studio Code Extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=All%20categories&sortBy=Relevance)|Suitable for manual, testing, or infrequent deployments. Requires the relevant Azure extensions installed locally.|
|[Azure CLI](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli)|Useful for manual or occasional deployments. Requires the Azure CLI installed locally.|
|[GitHub Actions](/azure/app-service/deploy-github-actions?tabs=applevel)|Best for automated or continuous deployments triggered by changes in your GitHub repository.|

Other deployment methods may exist, based on the specific service. For example, Azure app service supports a wide variety of deployment methods:
* [From ZIP file](/azure/app-service/deploy-zip)
* [With FTP](/azure/app-service/deploy-ftp)
* [Dropbox or OneDrive](/azure/app-service/deploy-content-sync)
* [Local Git](/azure/app-service/deploy-local-git)
* [cURL](/azure/app-service/deploy-zip#with-curl)
* [SSH](/azure/app-service/configure-linux-open-ssh-session)

You can redeploy to your App service using any of the provided methods even if you didn't use that method to originally deploy. You may have some configuration before redeploying if you are switching methods. 

<a name="deploy-or-redeploy-to-app-service-with-visual-studio-code"></a>

## Build steps

Depending on your application's complexity and deployment needs, you can choose to build your JavaScript app either before or during deployment:

* **Build before deployment**: For complex or lengthy builds, package your application into a zip file and deploy it. This allows you to control and test the build before deployment.
* **Build during deployment**: For simpler builds, use the Azure-provided environment variable SCM_DO_BUILD_DURING_DEPLOYMENT=true to build your app during deployment. This is useful for quick iterations and testing."

## Deployment slots

[Deployment slots](/azure/app-service/deploy-staging-slots) in Azure App Service allow you to create separate environments for staging and production. This enables you to test your app in a staging environment before swapping it with the production slot, ensuring a smooth and error-free deployment. Learn more about deployment slots.

Do not use deployment slots to mix deployment purposes. All deployment slots share the app service so you need to make sure the traffic patterns and intended use of all slots are the same. If you need to have a hosted test or stage environment, that should be a separate app service. 

## Deploy with Azure Developer CLI

The Azure Developer CLI (azd) simplifies the process of deploying your app to Azure. Follow these steps:

1. [Install](/azure/developer/azure-developer-cli/install-azd) the Azure Developer CLI.
1. [Find an existing project](https://azure.github.io/awesome-azd/) which uses many of the same resources your project uses.
1. Initialize a local version of the project to use as an infrastructure template for your own project.

    ```bash
    azd init --template <template-name>
    ```
1. Create the resources and deploy the code to Azure.
    ```bash
    azd up
    ```

## Deploy with Visual Studio Code

To deploy or redeploy your App service app with Visual Studio Code, complete the following steps:

1. Install the related Azure extensions, for example [AzureApp Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) or [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).
1. Open the Azure explorer. Select the Azure icon in the primary side bar or use the keyboard shortcut (<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>).
1. In the Resources group, select your subscription and service.
1. Right-click your service then select **Deploy to Web App...**. 

:::image type="content" source="../media/azure-app-service-vscode-extensions/deploy-or-redeploy-app-service.png" alt-text="Deploy or redeploy to App service with Visual Studio Code":::

## Connect to your Azure hosted environment

* For **manual or occasional access** to your hosted environments, refer to how to [view files in your Azure hosted environment](#view-files-in-azure-hosted-environment).
* For **automated or consistent access**, consider taking the steps to set up one of the deployment methods.

## View files in Azure hosted environment 

There are several ways to immediately see the files in your hosted Azure Web app or Function app. If you are using slots in your hosted resource, you need to make sure you are on the correct slot before viewing files. 

* View files in [Azure portal](https://portal.azure.com) - select **Console** under Development tools for your hosting resource. 

    :::image type="content" source="../media/deployment-methods/deploy-to-azure-web-app-view-files-in-portal-console-window.png" alt-text="In the Azure portal for your web app or function app, select `Console` from the `Development tools` menu.":::

* View files in VS Code extension: - select the Azure icon in the Activity bar. In the Resources section, select your subscription and service. The **Files** node provides a view of your remote files. 

    * [Azure App service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) and [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) extensions both provide a view of the remote files.

    :::image type="content" source="../media/deployment-methods/deploy-to-azure-web-app-view-files-in-visual-studio-code-extension.png" alt-text="[Azure App service and Azure Functions app extensions both provide a view of the remote files.":::

## View HTTP endpoint in Azure portal

View your HTTP endpoint from the service's Overview page on the Azure portal. 

:::image type="content" source="../media/howto-deploy/azure-portal-hosting-url.png" alt-text="View your HTTP endpoint from the service's Overview page on the Azure portal.":::

## Related content

* [Deployment tutorials using Visual Studio Code](https://code.visualstudio.com/docs/azure/deployment)
* [Hosting apps on Azure](/azure/developer/intro/hosting-apps-on-azure)
