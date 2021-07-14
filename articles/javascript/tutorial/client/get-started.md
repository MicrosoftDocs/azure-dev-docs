---
title: JavaScript Client applications on Azure
description: Learn fundamental concepts to develop, build, deploy, and troubleshoot client applications hosted on Azure. 
ms.topic: tutorial
ms.date: 05/24/2021
ms.custom: languages:JavaScript, devx-track-javascript
---

# JavaScript client applications on Azure

Learn fundamental concepts to develop, build, deploy, and troubleshoot client applications hosted on Azure. 

## Develop client applications for the browser

Developing client applications for Azure can mean a few different things:

* **Hosting** a client application, such as a React app, on Azure. 
* **Authenticating and authorizing** your users with the Microsoft Identity provider. 
* **Integrating** Azure services, such as CosmosDB or Azure Storage from the client app.

While the specifics of using Azure are different from other cloud providers, the general process and end result are similar. The following local develop settings help you develop your apps faster with fewer errors or issues:

* **Your local environment**: Select your Node.js version, hosting operating system or container, and other environment settings. 
* **Your cloud environment**: Verify these choices are available in your selected hosting platform and work with your dependency and integration choices, such as the Azure SDK or the MSAL SDK for authentication. 
* **Build and run requirements**: Understand how your project builds and runs locally including how many processes, symlinks, and ports are needed for your full system. Make sure your selected hosting platform supports these. 
* **Build and package for deployment**: Develop your code and build processes to run independently from your environment. You should be able to get your client application from source control, install required dependencies, build, and run from a known base image. While some hosting platforms provide building your app, make sure your specific build requirements are supported. For **best results**, have your app transpiled and packaged for deployment before delivering to your Azure hosting provider. 

## Build tools and processes for local and remote builds

For best builds, your JavaScript project should build from a script in your package.json. If your application requires several build steps or symlinks, configure a CICD step. This step could be a GitHub action, Azure DevOps pipeline, or equivalent process to build and validate your app before deploying to Azure.

While Azure hosting platforms can include building for simple, single process apps, it is best to validate your app's build and deploy before relying on the Azure hosting platform to provide your build. If you know your app will grow to multi-build steps, or multi-process apps, you should invest the time now to build your build and deploy process without a dependency on Azure deployment.  

## Configure application settings

If your app uses Azure secrets, configuration strings, key or other security-related information, make sure you understand how to use and secure those settings for your hosting platform. 

* Client: Azure Static web apps typically expect the build process to inject secrets at build time. 
* Server: Azure Functions and Azure app service support `.env` files as well as Azure CLI and Azure portal access to application settings. 

## Deploy your client application to an Azure hosting platform

Deploy Static web apps with GitHub actions when you push to your designated deployment branch. 

You can manually deploy your source code to Azure Functions and App service hosting with many [common tools and processes](../../how-to/deploy-web-app.md#deploy-your-web-app-to-azure). 

When you intend to automate deployment, you can either include that in your build process pipeline, such as a GitHub action or Azure pipeline, or you can use a separate automation tool. 

The automatic deployment to Azure hosting requires an authentication mechanism such as [deployment credentials](/azure/app-service/deploy-github-actions?tabs=applevel#generate-deployment-credentials). 

## Troubleshoot and analyze your applications

Enable Application Insights for your application. Application Insights watches your app on the hosting platform level and can report when your app has issues such as endpoint errors, and runtime exceptions. 

## Next steps

Learn more about Azure hosting platforms:
* [Static Web apps](/azure/static-web-apps/): Client frameworks and optional server APIs
* [Azure Functions](/azure/azure-functions/): Serverless APIs
* [Azure App service](/azure/app-service/)
* [GitHub Actions](/azure/developer/github/github-actions)
* [Azure DevOps](/azure/devops/pipelines/ecosystems/javascript?view=azure-devops&tabs=code&preserve-view=true)
* [Application Insights](/azure/azure-monitor/app/app-insights-overview)