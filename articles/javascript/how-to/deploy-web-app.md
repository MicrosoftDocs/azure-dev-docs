---
title: Deployment options for Azure hosting
description: Deploying your apps to Azure hosting services means moving a file or set of files to Azure to be served via an HTTP endpoint. 
ms.topic: how-to
ms.date: 08/19/2021
ms.custom: seo-javascript-september2019, seo-javascript-october2019, devx-track-js, contperf-fy21q2
---

## Deployment choices for your web app to Azure

Deploying your apps to Azure hosting services means moving a file or set of files to Azure to be served via an HTTP endpoint. 

Common methods of moving files to the Azure cloud include:

| Method | Details |
|--|--|
|[GitHub Actions](/azure/app-service/deploy-github-actions?tabs=applevel)|Use this for automated or triggered continuous deployments.|
|[Visual Studio Code Extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=All%20categories&sortBy=Relevance)|Use this for manual, testing, or seldom deployments. Requires that you have the extension for the service installed locally.|
|[Azure CLI](../tutorial/tutorial-vscode-azure-cli-node/tutorial-vscode-azure-cli-node-04.md)|Use this for manual or seldom deployments. Requires that you have the extension for the service installed locally.|

Other deployment methods may exist, based on the specific service. For example, Azure app service supports a wide variety of deployment methods:
* [From ZIP file](/azure/app-service/deploy-zip)
* [With FTP](/azure/app-service/deploy-ftp)
* [Dropbox or OneDrive](/azure/app-service/deploy-content-sync)
* [Local Git](/azure/app-service/deploy-local-git)
* [cURL](/azure/app-service/deploy-zip#with-curl)
* [SSH](/azure/app-service/configure-linux-open-ssh-session)

You can redeploy to your App service using any of the [provided methods](#deploy-your-web-app-to-azure) even if you didn't use that method to originally deploy. You may have some configuration before redeploying if you are switching methods. 

<a name="deploy-or-redeploy-to-app-service-with-visual-studio-code"></a>

## Deployment slots

Use [deployment slots](/azure/app-service/deploy-staging-slots) to deploy your source code to a staging environment and warm up the environment before deploying to your production slot. 

Do not use deployment slots to mix deployment purposes. All deployment slots share the app service so you need to make sure the traffic patterns and intended use of all slots are the same. If you need to have a hosted test or stage environment, that should be a separate app service. 

## Deploy with Visual Studio Code

To deploy or redeploy your App service app with Visual Studio Code, right-click your app service from the list of service in the App service extension, then select **Deploy to Web App...**. 

:::image type="content" source="../media/azure-app-service-vscode-extensions/deploy-or-redeploy-app-service.png" alt-text="Deploy or redeploy to App service with Visual Studio Code":::

## Connect to your Azure hosted environment

* For **manual or occasional access** to your hosted environments, refer to how to [view files in your Azure hosted environment](#view-files-in-azure-hosted-environment).
* For **automated or consistent access**, consider taking the steps to set up one of the [deployment methods](#deploy-your-web-app-to-azure).


## View files in Azure hosted environment 

There are several ways to immediately see the files in your hosted Azure Web app or Function app. If you are using slots in your hosted resource, you need to make sure you are on the correct slot before viewing files. 

* View files in [Azure portal](https://portal.azure.com) - select **Console** under Development tools for your hosting resource. 

    :::image type="content" source="../media/deployment-methods/deploy-to-azure-web-app-view-files-in-portal-console-window.png" alt-text="In the Azure portal for your web app or function app, select `Console` from the `Development tools` menu.":::

* View files in VS Code extension - select the Azure icon in the Activity bar then select your hosting resource under the service tree. The **Files** node provides a view of your remote files. 

    * [Azure App service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) and [Azure Functions app](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) extensions both provide a view of the remote files.

    :::image type="content" source="../media/deployment-methods/deploy-to-azure-web-app-view-files-in-visual-studio-code-extension.png" alt-text="[Azure App service and Azure Functions app extensions both provide a view of the remote files.":::

## View HTTP endpoint in Azure portal

View your HTTP endpoint from the service's Overview page on the Azure portal. 

:::image type="content" source="../media/howto-deploy/azure-portal-hosting-url.png" alt-text="View your HTTP endpoint from the service's Overview page on the Azure portal.":::

## Next steps

* [Deploy with containers]()
* [More deployment tutorials using Visual Studio Code](https://code.visualstudio.com/docs/azure/deployment)