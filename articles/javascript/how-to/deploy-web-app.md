---
title: Deploy JavaScript apps to Azure
description: Hosting options and deployment scenarios include several services and tools for Azure. Publish your app and serve it on Azure.  
ms.topic: how-to
ms.date: 05/19/2021
ms.custom: seo-javascript-september2019, seo-javascript-october2019, devx-track-js, contperf-fy21q2
---

# Deploy and host your Node.js apps on Azure

Hosting options and deployment scenarios include several services and tools for Azure. Azure has many options for hosting and many tools to help you move your app from a local or cloud repository to Azure. 

## Choose a recommended Azure host provider

Use the following table to select a hosting service for most common app needs. 

For a complete overview of different hosting options, see [Decision tree for Azure compute services](/azure/architecture/guide/technology-choices/compute-decision-tree) and the [Core Cloud Services - Azure compute options](/learn/modules/intro-to-azure-compute) module on Microsoft Learn.


 Service |App type supported| Suggested for |
|--|--|--|
|[*App service](/azure/app-service/overview) - **recommended**|Client, Server, Client/Server, API, Server-render|Host your app from code or a container. This allows you to **fully configure and manage the web server** without needing to manage the underlying environment.<br><br>[**Quickstart**: Create a Node.js web app in Azure](/azure/app-service/quickstart-nodejs?pivots=platform-linux)|
|[Static Web apps](/azure/static-web-apps/)|Static front-end, Pre-render, JAM-stack, Static front end with serverless APIs|Deploy and dynamically scale your **static client app and serverless APIs**.<br><br>[**Quickstart**: Building your first static site with Azure Static Web Apps](/azure/static-web-apps/getting-started?tabs=vanilla-javascript) |
|[Functions](/azure/azure-functions/)|Serverless APIs, triggered background processes|Host your **serverless API endpoints**. Azure provides many templates known as triggers to bootstrap common scenarios.<br><br>[**Quickstart**: Create a JavaScript function in Azure using Visual Studio Code](/azure/azure-functions/create-first-function-vs-code-node)|


## Host web apps with more control and flexibility

The following choices give you more control of your application environment. 

| Service | Suggested for |
|--|--|
|[Virtual Machines](/azure/virtual-machines) (VMs)|Full control of a Windows or Linux VM. [Find an endorsed Linux Distribution](/azure/virtual-machines/linux/endorsed-distros?toc=/azure/virtual-machines/linux/toc.json) or [learn how to find](/azure/virtual-machines/linux/cli-ps-findimage) Linux VM images in the Azure Marketplace.|
|[Container Instances](/azure/container-instances/)|Quickly set up a single container.|
|Multiple apps|Use an [App Service plan](/azure/app-service/overview-hosting-plans) running multiple [app services](/azure/app-service/). |  

## Ultimate control with microservices on Azure

For enterprise scale systems, use one of the following microservice platforms. 

| Service | Suggested for |
|--|--|
|[Kubernetes Service](/azure/aks/)|Deploy a production ready Kubernetes cluster in Azure.|
|[Service Fabric](/azure/service-fabric/)| A distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and containers|

## Alternative web app hosting choices on Azure

These choices are tailored to specific use cases. 

| Service | Suggested for |
|--|--|
|[Storage](/azure/storage/blobs/storage-blob-static-website-how-to?tabs=azure-portal)|Azure Storage can also host a static web app. This is helpful if you need tight integration between robust Storage and your client application.|
|[Content Delivery Network ](/azure/cdn/) (CDN)|Deliver pre-rendered websites. Cache static objects loaded from Azure Blob storage, a web application, or any publicly accessible web server, by using the closest point of presence (POP) server. Azure CDN can also accelerate dynamic content, which cannot be cached, by using various network and routing optimizations.|

## Deploy your web app to Azure

Once you have selected a service to host your application, select a deployment process and tool. Deploying your client and server apps to Azure services means moving a file or set of files to Azure to be served via an HTTP endpoint. 

Use [deployment slots](/azure/app-service/deploy-staging-slots) to deploy your source code to a staging environment and warm up the environment before deploying to your production slot. 

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

* [Deploy with containers](deploy-containers.md)
* [More deployment tutorials using Visual Studio Code](https://code.visualstudio.com/docs/azure/deployment)
