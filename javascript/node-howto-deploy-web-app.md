---
title: Deploy Node.js web apps to Azure
description: Getting started with Azure App Service and other hosting options for web apps, including progressive web apps (PWA)
author: kraigb
manager: barbkess
ms.devlang: nodejs
ms.topic: article
ms.service: azure-nodejs
ms.date: 08/20/2019
ms.author: kraigb
ms.custom: seo-javascript-september2019, seo-javascript-october2019
---

# Deploy Node.js web apps to Azure App Service

On Azure, you have several options for deploying and hosting web apps:

- The best hosting option for web apps is Azure App Service, a platform-as-a-service (PaaS) offering. To get started, try any of the following resources:

  - [Create a Node.js web app in Azure](/azure/app-service/app-service-web-get-started-nodejs)
  - [Try Azure App Service - Create an Express app from a template](https://code.visualstudio.com/tryappservice/?utm_source=msftdocs&utm_medium=microsoft&utm_campaign=tryappservice)
  - [Host a web app with Azure App Service - Learn module](/learn/modules/host-a-web-app-with-azure-app-service/index)
  - [Build a Node.js and MongoDB app in Azure](/azure/app-service/app-service-web-tutorial-nodejs-mongodb-app)
  - [App Service samples](/samples/browse/?languages=javascript%2Cnodejs&products=azure-app-service)

- You can build your own containers and deploy them to Azure using the Azure Container Registry and Azure Kubernetes Service. For details see [How to deploy Node.js containers to Azure](node-howto-deploy-containers.md).

- If you like to work primarily with serverless code, refer to [How to write serverless Node.js code on Azure](node-howto-write-serverless-code.md).

- For details on creating a JAMstack (static) site, see [How to build JAMstack (static site) web apps with Azure](node-howto-create-static-site-jamstack.md).

- If you'd like to control the infrastructure, you can simply use a virtual machine. To get started, follow the [Deploy a website with Azure virtual machines](/learn/paths/deploy-a-website-with-azure-virtual-machines/) path on Microsoft Learn.

For a complete overview of different hosting options, see [Decision tree for Azure compute services](/azure/architecture/guide/technology-choices/compute-decision-tree) as well as the [Core Cloud Services - Azure compute options](/learn/modules/intro-to-azure-compute/) module on Microsoft Learn.
