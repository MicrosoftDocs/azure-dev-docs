---
title: Build static web app on Azure with JavaScript
description: Build a JAMstack app (JavaScript, APIs, and Markup) on Azure
ms.topic: how-to
ms.date: 04/13/2021
ms.custom: seo-javascript-september2019, devx-track-js
---

# Build a new Static web app on Azure with Node.js

Azure Static Web Apps is a service that automatically builds and deploys full stack web apps to Azure from a code repository. Static web apps are commonly built using libraries and frameworks like Angular, React, Svelte, Vue, or Blazor where server side rendering is not required. In addition, API endpoints are hosted using a serverless architecture, which avoids the need for a full back-end server all together.

## Prepare your development environment

* [Azure subscription](https://azure.microsoft.com/free/)
* [Node.js and npm](https://nodejs.org/en/download)
* [Visual Studio Code](https://code.visualstudio.com/)
    * [Azure Static Web Apps (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)
* [Git](https://git-scm.com/downloads) 
* [GitHub account](https://github.com/join)

## 1. Create a local static web app

1. If you don't have a client app yet, create a new local static React web app and start it. The following creates a new React app, as an example. 

    ```bash
    npx create-react-app my-app && cd my-app && npm start
    ```
    
    The app is started on port 3000 and should be visible in your browser. The folder has also been initialized with git to the `main` default branch and the initial version has been committed to your local git. 

## 2. Prepare your repository to deploy to a Static web app

1. Create a new [GitHub](https://github.com/new) repository to hold your new app. 

1. Create a remote entry to your remote fork to your GitHub repo. Change the following command for your own GitHub account and repo name.

    ```bash
    git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPO.git
    ```

1. Create a new branch, `live`, that will only be used to deploy to your Static web app.

    ```bash
    git checkout -b live
    ```

1. Push your local `live` branch to a remote `live` branch.

    ```bash
    git push origin live
    ```

    Your local React static web app is now on GitHub in the `live` branch. You are ready to set up your Azure Static web app.

## Create a Static Web app resource

1. Select the **Azure** icon, then right-click on the **Static Web Apps** service, then select **Create Static web app...**. 

    :::image type="content" source="../../media/static-web-app/visualstudiocode-storage-extension-create-static-web-resource.png" alt-text="Visual Studio Code screenshot with Visual Studio extension":::

1. Enter the following information in the subsequent fields, presented one at a time. 

    |Field name| value|Notes|
    |--|--|--|
    |A name for your static web app.|`React-static-web-app`|The name of your Azure resource.|
    |Choose branch for repository|`live`|The GitHub branch name.|
    |Select the location of your application code.|`/`|The root or subdirectory or your source code project.|
    |Select the location of your Azure Functions code.|Select **Skip for now**|Not API functions in this example.|
    |Enter the path of your build output relative to your app's location.|`build`|The create-react-app build script defaults to the `build` directory.|
    |Select a location for new resources|Select an Azure location close to you.|If you are unsure, select `westus`.|

## View the GitHub Action build process

1. In a web browser, open your GitHub repository, and select **Actions**. 

1. Select the top build in the list, then select **Build and Deploy Job** on the left-side menu to watch the build process. Wait until the **Build And Deploy** successfully finishes.

    :::image type="content" source="../../media/static-web-app/browser-screenshot-github-action-build-react-computer-vision-app.png" alt-text=" Select the top build in the list, then select `Build and Deploy Job` on the left-side menu to watch the build process. Wait until the build successfully finishes.":::

## View Azure static web site in browser

1. In Visual Studio Code, select the **Azure** icon in the far right menu, then select your Static web app, then right-click **Browse site**, then select **Open** to view the public static web site. 

:::image type="content" source="../../media/static-web-app/visualstudiocode-browse-static-web-app.png" alt-text="Select `Browse site`, then select `Open` to view the public static web site. ":::

You can also find the URL for the site at:
* the Azure portal for your resource, on the **Overview** page.
* the GitHub action's build-and-deploy output has the site URL at the very end of the script 

## Next step

> Learn more about [Static web apps](/azure/static-web-apps/)
> [API support/azure/static-web-apps/apis]() in Static web apps
