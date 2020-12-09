---
title: Deploy JavaScript apps to Azure
description: Hosting options and deployment scenarios include several services and tools for Azure. Publish your app and serve it on Azure.  
ms.topic: how-to
ms.date: 12/09/2020
ms.custom: seo-javascript-september2019, seo-javascript-october2019, devx-track-js, contperfq2
---

# Deploy and host your Node.js apps on Azure

Hosting options and deployment scenarios include several services and tools for Azure. Azure has many options for hosting and many tools to help you move your app from a local or cloud repository to Azure. 

## Choose a recommended Azure host provider

Hosting your client, server, or background task app on Azure comes in a variety of solutions for you to choose from. Use the following table to make a selection. The recommended solution for most use cases is [Azure App service](/azure/app-service/overview). 

For a complete overview of different hosting options, see [Decision tree for Azure compute services](/azure/architecture/guide/technology-choices/compute-decision-tree) as well as the [Core Cloud Services - Azure compute options](/learn/modules/intro-to-azure-compute) module on Microsoft Learn.


 Service |App type supported| Suggested for |
|--|--|--|
|[*App service](/azure/app-service/overview) - **recommended**|Client<Br>Server<Br>Client/Server<Br>API<Br>Server-render|Host your app from code or a container. This allows you to manage the web server without needing to manage the underlying environment.|
|[Static Web apps](/azure/static-web-apps/)|Static front-end<Br>Pre-render<br>Static front-end with server APIs|Host your static client app (such as Angular, Vue, React). Optionally add serverless functions endpoints to host a full-stack app. This simple service abstracts away much of the web server, allowing you to focus on the features that matter to a client application. |
|[Functions](/azure/azure-functions/)|Server API|Host your serverless application endpoints.|

## Hosting with more control

The following choices give you more control of you application environment. 

| Service | Suggested for |
|--|--|
|[Virtual Machines](/azure/virtual-machines) (VMs)|Full control of a Windows or Linux VM. [Find an endorsed Linux Distribution](/azure/virtual-machines/linux/endorsed-distros?toc=/azure/virtual-machines/linux/toc.json) or [learn how to find](/azure/virtual-machines/linux/cli-ps-findimage) Linux VM images in the Azure Marketplace.|
|[Container Instances](/azure/container-instances/)|Quickly set up a single container.|
|[Kubernetes Service](/azure/aks/)|Multi-container orchestrations.|

## Alternative hosting choices for Azure

These choices are tailored to specific use cases. 

| Service | Suggested for |
|--|--|
|[Storage](/azure/storage/blobs/storage-blob-static-website-how-to?tabs=azure-portal)|Azure Storage can also host a static web app. This is helpful if you need tight integration between robust Storage and your client application.|
|[Content Delivery Network ](/azure/cdn/) (CDN)|Deliver pre-rendered websites. Cache static objects loaded from Azure Blob storage, a web application, or any publicly accessible web server, by using the closest point of presence (POP) server. Azure CDN can also accelerate dynamic content, which cannot be cached, by leveraging various network and routing optimizations.|

## Choose your deployment process for Azure

Once you have selected a service to host your application, select a deployment process and tool. Deploying your client and server apps to Azure services means moving a file or set of files to Azure to be served via an HTTP endpoint. 

Common methods of moving files to the Azure cloud include:

| Method | Details |
|--|--|
|[GitHub Actions](/azure/app-service/deploy-github-actions?tabs=applevel)|Use this for automated or triggered continuous deployments.|
|[Visual Studio Code Extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=All%20categories&sortBy=Relevance)|Use this for manual, testing, or seldom deployments. Requires that you have the extension for the service installed locally.|
|[Azure CLI](../tutorial-vscode-azure-cli-node-04.md)|Use this for manual or seldom deployments. Requires that you have the extension for the service installed locally.|

Other deployment methods may exist, based on the specific service. For example, Azure app service supports a wide variety of deployment methods:
* [From ZIP file](/azure/app-service/deploy-zip)
* [With FTP](/azure/app-service/deploy-ftp)
* [Dropbox or OneDrive](/azure/app-service/deploy-content-sync)
* [Local Git](/azure/app-service/deploy-local-git)
* [cURL](/azure/app-service/deploy-zip#with-curl)
* [SSH](/azure/app-service/configure-linux-open-ssh-session)

## Verify your deployment with your HTTP endpoint

To verify your deployment, access your HTTP endpoint. The HTTP endpoint is visible on all services on the **Overview** page. 

### View HTTP endpoint in Azure portal

View your HTTP endpoint from the service's Overview page on the Azure portal. 

:::image type="content" source="../media/howto-deploy/azure-portal-hosting-url.png" alt-text="View your HTTP endpoint from the service's Overview page on the Azure portal.":::

## Next steps

* [Deploy with containers](deploy-containers.md)
