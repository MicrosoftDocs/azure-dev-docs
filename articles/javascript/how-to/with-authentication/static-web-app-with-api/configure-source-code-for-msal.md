---
title: "3: Create the local authenticated Static web app"
titleSuffix: Azure Developer Center
description: In this article, learn to configure a Static web app and API to use the MSAL SDK to authenticate users both on the client app and on the Azure Function API. 
ms.topic: how-to
ms.date: 06/15/2021
ms.custom: devx-track-js
---

# Create the local authenticated Static web app

In this article, learn to configure a Static web app and API to use the MSAL SDK to authenticate users both on the client app and on the Azure Function API.

Start by cloning the full client/API sample. Then set the MSAL configuration values you obtained when you registered the identity application. Then run the application locally.

The React app passes an authenticated user's access token to the Function API so that the API can act on behalf of the user. This specific API calls the Microsoft Graph, _as an example_ of calling an Azure service.

## Clone the GitHub repository for the sample project

The sample code is _part of_ a repository with several samples. While you are cloning the entire repo, make sure that in the rest of the article, you are focused on just the single sample.

1. In a bash terminal on your local machine, clone the sample repository.

    ```bash
    git clone https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial
    ```

1. Navigate to the sample for this article in the `\4-Deployment\2-deploy-static\App` directory, then install the dependencies. 

    ```bash
    cd "ms-identity-javascript-react-tutorial\4-Deployment\2-deploy-static\App" && \
    npm install && \
    cd api && \
    npm install && \
    cd .. 
    ```

1. Open the project in VS Code

    ```bash
    code .
    ```

## Configure settings and secrets

The React client and the Azure Function both need to have configuration settings to use the MSAL SDK. 

You should have collected the following information from the [previous article in this series](register-application-with-identity.md):

* Application (client) ID
* Directory (tenant) ID
* Client secret
* App ID URI

1. Open the React file, `./src/authConfig.js`. and set the following values:

    |Property|Value|Description|
    |--|--|--|
    |msalConfig.auth.clientId|Application (client) ID|Enter value as string.|
    |functionApi.scopes|`https://<App ID URI>/access_as_user`|Enter value as part of the URI, `<App ID URI>`.|

1. Open the Function API file, `./api/local.settings.json`, and set the following values:

    |Property|Value|Description|
    |--|--|--|
    |CLIENT_ID|Application (client) ID|Enter value as string.|
    |CLIENT_SECRET|Client secret|Enter value as string.|
    |TENANT_INFO|Directory (tenant) ID|Enter value as string.|

## Install the Static web app CLI

1. In VS Code, use an integrated bash teriminal to install the Static web app CLI.

    ```bash
    npm install -g @azure/static-web-apps-cli 
    ```

1. Build the React client app. 

    ```bash
    npm run build
    ```

1. Start both the React client and the Function API

    ```bash
    swa start ./build --api ./api
    ```

1. 

## Create Static web app

## Configure Static web app settings and secrets

### Configure React settings and secrets

### Configure API settings and secrets

## Configure app registration redirect URL

## Deploy Static web app to Azure

## Run client and API on Azure
