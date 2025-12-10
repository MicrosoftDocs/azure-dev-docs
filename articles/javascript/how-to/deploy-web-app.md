---
title: Deploy JavaScript apps on Azure
description: Deploying your JavaScript applications to Azure allows you to use the power of cloud computing, ensuring scalability, reliability, and global reach. This guide walks you through various methods to deploy your JavaScript apps to Azure, from manual deployments to automated CI/CD pipelines.
ms.topic: concept-article
ms.date: 12/10/2025
ms.custom:
  - vscode-azure-extension-update-completed
  - sfi-image-nochange
#customer intent: As a JavaScript developer new to Azure, I want know all the ways to deploy code to Azure so that I can choose the best process for my application and situation.
---

# Deployment JavaScript app to Azure overview

To deploy your JavaScript-based app to Azure, you move a file or set of files to Azure to be served via an HTTP endpoint. The process of moving the files is called deployment. 

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
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
|[Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines)|Ideal for enterprise teams using Azure DevOps for CI/CD workflows with advanced deployment strategies.|

Other deployment methods exist, based on the specific service. For example, Azure app service supports a wide variety of deployment methods:
* [From ZIP file](/azure/app-service/deploy-zip)
* [With FTP](/azure/app-service/deploy-ftp)
* [Dropbox or OneDrive](/azure/app-service/deploy-content-sync)
* [Local Git](/azure/app-service/deploy-local-git)
* [cURL](/azure/app-service/deploy-zip#with-curl)
* [SSH](/azure/app-service/configure-linux-open-ssh-session)

You can redeploy to your App service using any of the provided methods even if you didn't use that method to originally deploy. You may have some configuration before redeploying if you're switching methods. 

<a name="deploy-or-redeploy-to-app-service-with-visual-studio-code"></a>

## Azure hosting services for JavaScript apps

Azure provides multiple hosting services optimized for different JavaScript application scenarios:

| Service | Best For | Key Features |
|--|--|--|
|[Azure Static Web Apps](/azure/static-web-apps/overview)|Modern web apps with static frontends (React, Vue, Angular) and optional serverless APIs|Free SSL, global CDN, staging environments on pull requests, integrated authentication|
|[Azure App Service](/azure/app-service/overview)|Full-featured web applications and REST APIs|Built-in autoscaling, deployment slots, easy integration with Azure services|
|[Azure Functions](/azure/azure-functions/functions-overview)|Event-driven serverless applications and microservices|Pay-per-execution pricing, automatic scaling, multiple triggers and bindings|
|[Azure Container Apps](/azure/container-apps/overview)|Containerized applications and microservices|Kubernetes-powered serverless containers, Dapr integration, event-driven scaling|

For more information on choosing the right hosting service, see [Hosting applications on Azure](/azure/developer/intro/hosting-apps-on-azure).

## Build steps

Depending on your application's complexity and deployment needs, you can choose to build your JavaScript app either before or during deployment:

* **Build before deployment**: For complex or lengthy builds, package your application into a zip file and deploy it. A deployment package allows you to control and test the build before deployment.
* **Build during deployment**: For simpler builds, use the Azure-provided environment variable SCM_DO_BUILD_DURING_DEPLOYMENT=true to build your app during deployment. 

## Deployment slots

[Deployment slots](/azure/app-service/deploy-staging-slots) in Azure App Service allow you to create separate environments for staging and production. The use of slots enables you to test your app in a staging environment before swapping it with the production slot, ensuring a smooth and error-free deployment. Learn more about deployment slots.

Don't use deployment slots to mix deployment purposes. All deployment slots share the app service so you need to make sure the traffic patterns and intended use of all slots are the same. If you need to have a hosted test or stage environment that should be a separate app service. 

## Deploy with Azure Developer CLI

The Azure Developer CLI (azd) simplifies the process of deploying your app to Azure. Follow these steps:

1. [Install](/azure/developer/azure-developer-cli/install-azd) the Azure Developer CLI.
1. [Find an existing project](https://azure.github.io/awesome-azd/) which uses many of the same resources your project uses.
1. Initialize a local version of the project for use as an infrastructure template for your own project.

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

## Deploy to Azure Static Web Apps

Azure Static Web Apps is ideal for modern web applications built with JavaScript frameworks. To deploy:

1. Install the [Azure Static Web Apps extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) for Visual Studio Code.
1. Build your application locally to ensure it works as expected.
1. In Visual Studio Code, open the Azure explorer and find Azure Static Web Apps.
1. Right-click on your subscription and select **Create Static Web App**.
1. Follow the prompts to connect your GitHub repository. Azure automatically creates a GitHub Actions workflow.
1. Push changes to your repository to trigger automatic deployments.

For more details, see [Deploy your web app to Azure Static Web Apps](/azure/static-web-apps/deploy-web-framework).

## Deploy to Azure Container Apps

Azure Container Apps provides serverless container hosting for JavaScript applications. To deploy:

1. Containerize your application using Docker. Create a Dockerfile in your project root.
1. Build and test your container locally.
1. Push your container image to [Azure Container Registry](/azure/container-registry/container-registry-get-started-docker-cli).
1. Use the [Azure Container Apps extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps) or Azure CLI to create and deploy your container app.

For a complete guide, see [JavaScript on Azure Container Apps overview](/azure/container-apps/javascript-overview).

## Connect to your Azure hosted environment

* For **manual or occasional access** to your hosted environments, refer to how to [view files in your Azure hosted environment](#view-files-in-azure-hosted-environment).
* For **automated or consistent access**, consider taking the steps to set up one of the deployment methods.

## View files in Azure hosted environment 

There are several ways to immediately see the files in your hosted Azure Web app or Function app. If you're using slots in your hosted resource, you need to make sure you are on the correct slot before viewing files. 

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
* [Azure Static Web Apps documentation](/azure/static-web-apps/)
* [Azure Container Apps documentation](/azure/container-apps/)
* [Azure App Service documentation](/azure/app-service/)
* [Azure Functions documentation](/azure/azure-functions/)
