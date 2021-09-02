---
title: "6-Integration: Connect app to API"
description: Change the local React app code to use the Azure Function API.
ms.topic: how-to
ms.date: 08/31/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---

# 6. Connect React client app to Azure Function API

Change the local React app code to use the Azure Function API. 

At this point in the article series, both the React client and the Azure Function API work both locally and remotely. The remote Azure Static Web Apps resource provides a proxy between the React client and API. The local environment needs the same proxy so the local React client and API can work together. Use the Static Web Apps CLI (SWA CLI) to provide the proxied environment for your local app.

Run both the React and Functions development environments, provided by each framework, then use those app URLs with the SWA CLI to provide the proxy between the two. 

## Create parent proxied project

1. In order to control both the React app and API projects, create a `./package.json` file in the root of the project.

    ```bash
    npm init -y
    ```

1. Install required dependencies to run `package.json` scripts:

    ```bash
    npm install concurrently azure-functions-core-tools@3 static-web-apps-cli --save-dev 
    ```

1. Replace the current `package.json` file's `scripts` section with the following script entries:

    :::code language="JSON" source="~/../js-e2e-static-web-app-with-cli-1-basic-app-with-api/package.json" range="6-12":::  

    These scripts separate out the development server of each environment from the SWA CLI call to join those two environments. 

    |Script|Purpose|
    |--|--|
    |`start-api`|Start local Azure Functions runtime.|
    |`start-app`|Start React app's local runtime.|
    |`start-dev`|Start both local runtimes.|
    |`start-swa`|Start SWA across both apps. Use the `http://locahost:4280` base URL to request the proxied app.|
    |`start`|Start everything.|

## Start local app for full-stack app

The React client and the Azure Function API have separate local development servers. 

1. In order to debug both client and API at the same time, open two separate instances of VS Code. 
1. In one instance, open the `./app` folder. In the second instance, open the `./api` folder. In each project, open an integrated terminal and start the project:
   
    ```bash
    npm start
    ```

    When both the React app and the Function API have started correctly, continue to the next step. 

1. In one of the VS Code instances (it doesn't matter which instance), open a second integrated terminal, change to the root directory and start the proxy:
   
    ```bash
    npm run start-swa
    ```

    The React client is now available on both port 3000 and on port 4280 (with a proxy to the API) . For the rest of the article, use port 4280 when you want to use the React app.  

    :::image type="content" source="../../../media/static-web-app-with-swa-cli/run-both-client-and-api-locally-separate-visual-studio-code.png" alt-text="Partial screenshot of Windows desktop with two separate VS Code instances running." lightbox="../../../media/static-web-app-with-swa-cli/run-both-client-and-api-locally-separate-visual-studio-code.png":::


## Add an HTML form to the React app to use the Function API

In VS Code for the React app, find the `./src/App.tsx file` and replace the entire file with the following code:

:::code language="TypeScript" source="~/../js-e2e-static-web-app-with-cli-1-basic-app-with-api/app/src/App.tsx" highlight="7-18, 27-39":::  

## Use your static web app in browser

1. Return to the web browser for the React app, and use the new form to enter your name and pass that name to the Function API.
   
   :::image type="content" source="../../../media/static-web-app-with-swa-cli/react-app-with-form-pass-name-api.png" alt-text="Screenshot of web browser displaying React app form.":::

1. The React app responds with the success message:
   
   :::image type="content" source="../../../media/static-web-app-with-swa-cli/react-app-with-form-results-pass-name-api.png" alt-text="Screenshot of web browser displaying React app form and API response.":::

## Commit changes to source control

1. Check the new app code into your local repo and push to the remote repo:
   
   ```bash
   git add . && git commit -m "hello swa cli" && git push origin main
   ```

1. In a web browser, go back to your GitHub repo, and make sure the next build of your Action succeeds with these new changes. The actions URL should look like:

    ```HTTP
    https://github.com/YOUR-ACCOUNT/staticwebapp-with-api/actions
    ```

1. In VS Code, in the Azure explorer, find your static web app, then right-click and select **Browse site**.

1. The same React app, as your local version, should appear. The same form functionality as your local version should work, returning a message from the API.  
   
   Your code now successfully works locally and remotely for an Azure Static Web App. 

## Next steps

* [Add authentication](add-authentication.md)
* [Static Web Apps troubleshooting](/azure/static-web-apps/troubleshooting)
* [Azure Functions diagnostics](/azure/azure-functions/functions-diagnostics)