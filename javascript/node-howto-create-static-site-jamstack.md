---
title: Build static sites with Node.js Azure
description: How to use Azure to build a JAMstack app (JavaScript, APIs, and Markup)
author: kraigb
manager: barbkess
ms.devlang: nodejs
ms.topic: article
ms.service: azure-nodejs
ms.date: 08/20/2019
ms.author: kraigb
---

# How to build JAMstack (static site) web apps with Azure

Great web apps can be productively built and maintained using a combination of a *JavaScript* front end, *APIs* (third-party or custom APIs built as serverless code), and templated *markup* (HTML and CSS) that is served as static pages. With this combination, also known as the JAMstack, you avoid writing complicated back end code to serve web pages. Instead, the system serves only static pages (HTML, CSS, and JavaScript), where those pages call upon your APIs for server-side work. Because you can write those APIs with auto-scaling serverless technologies, you completely avoid the cost and security concerns of using a typical always-on servers or web hosts. (For more information, see [jamstack.org](https://jamstack.org/).)

To implement a static/JAMstack site on Azure, you employ a variety of tools and services:

- Configure a database as necessary.
- Implement serverless API code in Azure Functions. Those APIs typically use the database.
- Choose any libraries you want for front-end development, such as Angular. You then upload these static HTML, CSS, and JavaScript files to Azure Blob Storage, which provides a built-in web server.
- Create a reverse proxy so that all your traffic goes through one URL domain.

You can watch a demonstration of the process with the //build 2019 session, [Productive front-end development with JavaScript, Visual Studio Code, and Azure](https://mybuild.techcommunity.microsoft.com/sessions/77038?source=sessions#top-anchor).

> [!VIDEO https://medius.studios.ms/Embed/Video-nc/B19-BRK3021?latestplayer=true]

A step-by-step tutorial can be found on [Deploy a static website to Azure](tutorial-vscode-static-website-node-01.md).

The following articles also explain further details:

- **Databases**: you can use any database you like, such as the different database services on Azure described on [How to integrate Azure databases in Node.js apps](node-howto-integrate-databases.md).
  
- **Serverless APIs**:

  - Start with [Deploy Azure Functions from Visual Studio Code](tutorial-vscode-serverless-node-01.md), which introduces you to Azure Functions in the context of Visual Studio Code, which which simplifies many of the details.
  - When you complete the article, you have an Azure Functions project (a folder) that contains a subfolder named for the function, which is the same as its HTTP endpoint. That function folder contains an *index.js* file with the code.
  - You can modify that function as needed, and also add more functions to the project, then deploy them again to Azure where they are publicly available.
  - For additional resources on serverless development, see [How to write serverless Node.js code on Azure](node-howto-write-serverless-code.md)

- **Deploy your front-end to Azure Storage**: with your APIs in hand, you can now write your front-end code to use those APIs, using whatever framework you like. When you're ready, follow the article, [Tutorial: Host a static website on Blob Storage](/azure/storage/blobs/storage-blob-static-website-host), to upload those files to Azure and turn on static website hosting.

- **Create a reverse proxy**: A reverse proxy, as described on [Work with Azure Functions proxies](/azure/azure-functions/functions-proxies) allows you to easily direct certain requests to different URLs. In this case, you want to direct requests for your front-end files to the Azure Storage URL, where you deployed those files, and API requests to the Azure Functions URL.

  - To create these proxies, edit the *proxies.json* file in your Functions project so that it appears as shown below, substituting your URLs for `<storage_url>` and `<api_url>`:
  
    ```json
    {
      "$schema": "http://json.schemastore.org/proxies",
      "proxies": {
        "Static frontend on Azure Storage": {
          "matchCondition": {
            "route": "/{*restOfPath}"
          },
          "backendUri": "<storage_url>/{restOfPath}"
        },
        "Azure Functions API": {
          "matchCondition": {
            "route": "/api/{*restOfPath}"
          },
          "backendUri": "<api_url>/api/{restOfPath}"
        }
      }
    }
    ```
