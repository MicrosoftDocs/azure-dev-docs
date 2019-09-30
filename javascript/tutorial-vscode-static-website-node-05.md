---
title: Deploy changes to a static Node.js website from Visual Studio Code
description: Tutorial part 5, make changes and redeploy
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: kraigb
---

# Make changes and redeploy

[Previous step: Deploy to Azure Storage](tutorial-vscode-static-website-node-04.md)

In this step, you make a simple change to the app's source code and redeploy the site to experience the end-to-end deployment workflow.

1. In Visual Studio Code, open the *src/app.js* file change line 11 to match the following:

    ```js
    <h1 className="App-title">Welcome to Azure!</h1>
    ```

1. At a terminal or command prompt, run `npm run build`.

1. In VS Code, right-click your updated *build* folder and again choose **Deploy to Static Website**. Choose your Storage account and confirm that you want to deploy your changes. (The Azure extension automatically deletes old files before deploying changes to avoid caching issues.)

1. Once your deployment is complete, refresh the site in the browser to observe changes:

    ![Changes in the app after redeployment](media/static-website/updated-azure-app.png)

> [!div class="nextstepaction"]
> [I deployed changes](tutorial-vscode-static-website-node-06.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-staticwebsite&step=code-change)
