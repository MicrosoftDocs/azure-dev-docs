---
title: Build static web app on Azure with JavaScript
description: Build a JAMstack app (JavaScript, APIs, and Markup) on Azure
ms.topic: how-to
ms.date: 04/13/2021
ms.custom: seo-javascript-september2019, devx-track-js
---

# Build a new Static web app on Azure with Node.js

Azure Static Web Apps is a service that automatically builds and deploys full stack web apps to Azure from a code repository. Static web apps are commonly built using libraries and frameworks like Angular, React, Svelte, Vue, or Blazor where server-side rendering is not required. In addition, API endpoints are hosted using a serverless architecture, which avoids the need for a full back-end server all together.

## 1. Prepare your development environment

* Create a free [Azure subscription](https://azure.microsoft.com/free/)
* Install [Node.js 14+ and npm](https://nodejs.org/en/download)
* Install [Visual Studio Code](https://code.visualstudio.com/) and use the following extensions:
    * [Azure Static Web Apps (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)
* Install [Git](https://git-scm.com/downloads) 
* Use or create a [GitHub account](https://github.com/join)

## 2. Create a local static web app

If you don't have a client app yet, create a new local static React web app and start it. The following creates a new React app, as an example. If you do have an app, make sure to review the configuration for your [specific front-end framework](/azure/static-web-apps/front-end-frameworks). 

```bash
npx create-react-app my-app && cd my-app && npm start
```

The app is started on port 3000 and should be visible in your browser. The folder has also been initialized with git to the `main` default branch and the initial version has been committed to your local git. 

## 3. Prepare your repository to deploy to a Static web app

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

    Your local React app is now on GitHub in the `live` branch. You are ready to set up your Azure Static web app.

## 4. Create a Static Web app resource

1. Select the **Azure** icon, then right-click on the **Static Web Apps** service, then select **Create Static web app...**. 

    :::image type="content" source="../media/howto-static-web-app/visualstudiocode-storage-extension-create-static-web-resource.png" alt-text="Visual Studio Code screenshot with Visual Studio extension":::

1. Enter the following information in the subsequent fields, presented one at a time. 

    |Field name| value|Notes|
    |--|--|--|
    |A name for your static web app.|`React-static-web-app`|The name of your Azure resource.|
    |Choose build preset to configure default project structure.|`React`|Select the front-end framework. |
    |Select a location for new resources|Select an Azure location close to you.|If you are unsure, select `West US 2`.|

## 5. View the GitHub Action build process

1. In a web browser, open your GitHub repository, and select **Actions**. 

1. Select the top build in the list, then select **Build and Deploy Job** on the left-side menu to watch the build process. Wait until the **Build And Deploy** successfully finishes.

    :::image type="content" source="../media/howto-static-web-app/browser-screenshot-github-action-build-react-computer-vision-app.png" alt-text=" Select the top build in the list, then select `Build and Deploy Job` on the left-side menu to watch the build process. Wait until the build successfully finishes.":::

## 6. View Azure static web site in browser

In Visual Studio Code, select the **Azure** icon in the far right menu, then select your Static web app, then right-click **Browse site**, then select **Open** to view the public static web site. 

:::image type="content" source="../media/howto-static-web-app/visualstudiocode-browse-static-web-app.png" alt-text="Select `Browse site`, then select `Open` to view the public static web site. ":::

You can also find the URL for the site at:
* the Azure portal for your resource, on the **Overview** page.
* the GitHub action's build-and-deploy output has the site URL at the very end of the script 

## Next step

* Learn more about [Static web apps](/azure/static-web-apps/)
* [Add an API](/azure/static-web-apps/add-api) in Static web apps
