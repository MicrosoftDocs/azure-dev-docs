---
title: "Intro: Create Static Web Apps using CLI"
description: Create a static web app (React and API) and locally develop using the SWA CLI. Run the same code locally and remotely to ensure that customers get the correct web behavior.
ms.topic: how-to
ms.date: 08/31/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---
# 1. Create a static web app using CLI

In this article series, learn how to:

* Create a [static web app](/azure/static-web-apps/) (SWA)
* Locally develop your static web app using the [SWA CLI](https://github.com/Azure/static-web-apps-cli). 
* Run the same code remotely without changes.

Your static web app consists of:
* A client React app in the `app` directory, served from `http://localhost:3000`
* An Azure Function API in the `api` directory served from `http://localhost:7071`

The local static web app CLI provides:
* A proxy local between from the React app to the Function API. The URL in the React looks like `/api/hello`, without specifying the server or port number for the API. Requests using this URL are successful locally because the SWA CLI manages the proxy for you.  
* A local authentication emulator when accessing `/.auth/login/<provider>`
* Route management and authorization 

Complete sample code provided:

* Sample [basic app](https://github.com/Azure-Samples/js-e2e-static-web-app-with-cli/tree/1-basic-app-with-api) - on branch named `1-basic-app-with-api`
* Sample [basic app with auth](https://github.com/Azure-Samples/js-e2e-static-web-app-with-cli/tree/2-basic-app-with-api-and-auth) - on branch named `2-basic-app-with-api-and-auth`

## Prepare your development environment

Install the following:

* [GitHub account](https://github.com/)
* [Azure CLI](/cli/azure/install-azure-cli) - v2.27.2
* [Visual Studio Code](https://code.visualstudio.com/Download) (VS Code)
* [Node.js](https://nodejs.org/en/download/) - this create-react-app was developed with Node.js v14.17.1. 
* [Azure Functions Core Tools](/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cportal%2Cbash%2Ckeda#install-the-azure-functions-core-tools) - v3.0.3477+


### Sign in to Azure CLI

1. In VS Code, in an integrated bash terminal, sign in to the Azure CLI:

    ```bash
    az login
    ```

    This opens a browser for you to continue your authentication. 

1. When authentication is complete, close the browser and return to VS Code. 

## Next steps

* [Create GitHub repo](create-github-repo.md)