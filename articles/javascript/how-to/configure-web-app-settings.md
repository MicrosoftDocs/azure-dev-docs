---
title: Host web apps - configuration settings
description: Learn how to set common configurations for your web app.
ms.topic: conceptual
ms.date: 12/08/2020
ms.custom: devx-track-js
---

# Hosting web apps on Azure

Learn how to set common configurations for your web app. If a common setting is missing, [open an issue](#feedback) and tell us about it. 

Any **required settings** are requested with you create the resource. If a setting isn't requested at that time, it has a default value, which you can change after resource creation. 

## What is a web app?

A web app is anything that is reached with an Internet URL. There are many Azure services that can be considered as a web app. The top services typically used for a web app are:

* App service, which also includes
    * [Static web apps](/azure/static-web-apps/)
    * [Functions](/azure/azure-functions/)
    * [Web apps](/azure/app-service/)
    * [Containers](/azure/app-service/configure-custom-container?pivots=container-linux)
* Containers - [Kubernetes](/azure/aks/) and single [containers](/azure/container-instances/)
* Virtual Machines - [Windows](/azure/virtual-machines/windows) and [Linux](/azure/virtual-machines/linux)

## How to configure web app settings

Most Azure services provide four ways to configure settings:

* [Azure portal](https://portal.azure.com)
* [Azure SDK](https://github.com/Azure/azure-sdk) for service, usually noted as management
* [Azure CLI](/cli/azure/)
* [Azure PowerShell](/powershell/azure/)

Many settings can also be configured within Visual Studio Code with [extensions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice). 

## Use default domain name provided by Azure

Most Azure services provide a URL for your resource. The service name determines the subdomain with the rest of the domain coming from Azure. 

For example:

* Azure Functions - `https://my-function-app.azurewebsites.net`
* Azure Web app - `https://my-web-app.azurewebsites.net`
* Azure Storage Blobs - `https://mystorage.blob.core.windows.net/`

Some services, such as Static Web apps, provide a subdomain for you that is relatively unique, allowing you to use it immediately in production:

* Azure Static Web apps = `https://gentle-tree-0b08aaf12.azurestaticapps.net`

## Configure custom domain name 

Each service provides its own mechanism to add a custom domain. 

* [Azure Static web apps](/azure/static-web-apps/custom-domain)
* [Azure Functions](/azure/app-service/app-service-web-tutorial-custom-domain) & [Azure Web app](/azure/app-service/app-service-web-tutorial-custom-domain) - Functions are built on top of web apps so they use the same mechanism
* [Azure Storage Blobs](/azure/storage/blobs/storage-custom-domain-name?tabs=azure-portal)

## Configure port forwarding

You need to [map the app's port number](/azure/app-service/configure-language-nodejs?pivots=platform-windows#get-port-number) if it isn't the default port, `8080`. This lets the App service forward requests to the correct port. 

## Configure certificates

If your app requires certificates immediately, you have several choices about how to [provide certificates](/azure/app-service/configure-ssl-certificate#import-an-app-service-certificate):

* Upload your own certificate
* Manage certificates within the App service
* Import the certificate from Azure Key vault
* Provide certificate [in code](/azure/app-service/configure-ssl-certificate-in-code)

## Configure secrets

Secrets are typically provided in the following ways:

* Azure Key Vault  - Create a resource for this service, which provides [app secrets](/azure/app-service/app-service-key-vault-references). 
* App settings - If you are looking for a lighter weight solution, you can provide secrets as App settings, and reference these using the typical `process.env.VARNAME`. 

## Configure logging

Logging includes:

* platform logging - what is happening outside the app
* app logging - what is happening inside the app

Platform logs are provided for you:
* To understand the health of the environment.
* Let you scale to a different pricing tier, or across regions. 

Application logs aren't provided for you. You can add your own logging for internal app behavior:
* [Azure Monitor](/azure/azure-monitor/overview) provides npm libraries for [Application Insights](/azure/azure-monitor/app/app-insights-overview) to provide logging and the storage resource where the logs are archived. 

## Configure database and storage

Typically, a connection to a database or data storage begins with a connection string. 

Considerations for data connections:
* Bring your current connection
* New data storage - If your app needs a new storage mechanism, Azure provides [many different database](../how-to/integrate-database) choices. The connection does need to be securely stored. 

## Missing something? 

If something is missing from this list, please fill out the [feedback](#feedback) to tell us about it. 

## Next steps

* See many of these steps in an [end-to-end Node.js app](/azure/developer/javascript/how-to/develop-nodejs-on-azure) development flow. 