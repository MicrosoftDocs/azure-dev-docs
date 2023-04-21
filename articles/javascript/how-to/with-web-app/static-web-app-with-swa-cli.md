---
title: "Create static web app with serverless app"
description: Create a static web app (React and API) and locally develop using the SWA CLI. Run the same code locally and remotely to ensure that customers get the correct web behavior.
ms.topic: how-to
ms.date: 10/19/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---
# Create a Static web app with a serverless API 

Learn how to locally run then deploy a static web app with a serverless API to Azure. This tutorial uses the **preview version of the latest Azure Functions Node.js programming model**.

Learn how to:

* Create a [static web app](/azure/static-web-apps/) (SWA)
* Locally develop your static web app using the [SWA CLI](https://github.com/Azure/static-web-apps-cli). 
* Run the same code remotely without changes.

Your static web app consists of:
* Use front-end, served from `http://localhost:4280`
* Proxy requests to Azure Function API in the `api` directory served from `http://localhost:7071`


The proxy between the front-end and APIs is provided by the Static web app CLI provides:
* The URL in React, `/api/hello`, doesn't specify the server or port number for the API. Requests using this URL are successful locally because the SWA CLI manages the proxy for you.  
* A local authentication emulator when accessing `/.auth/login/<provider>`
* Route management and authorization 

## Authentication in this sample

The authentication in this sample provides:
* React client provides:
    * Login/Logout
    * Public and private content

This is an _easy auth_ implementation. The API can't act [_on behalf of_(OBO)](/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) the logged in user. Acting on behalf of the user requires more configuration both in the Azure Active Directory app and the Azure Identity SDK in the API. 

## Prepare your development environment

Install the following:

- [GitHub account](https://github.com/) - You need a GitHub account to deploy Azure Static web apps.
- [Azure CLI](/cli/azure/install-azure-cli)
- [Azure Static Web Apps (SWA) CLI](https://azure.github.io/static-web-apps-cli/docs/use/install)
- [Visual Studio Code](https://code.visualstudio.com/Download) (VS Code)
- [`@azure/functions`](https://www.npmjs.com/package/@azure/functions) npm package v4.0.0-alpha.9+
- [Node.js](https://nodejs.org/en/download/releases/) v18+
- [TypeScript](https://www.typescriptlang.org/) v4+
- [Azure Functions Runtime](./functions-versions.md) v4.16+
- [Azure Functions Core Tools](./functions-run-local.md) v4.0.5095+ (if running locally)


## Fork and clone the sample repository

1. Fork the [sample repository](https://github.com/Azure-Samples/js-e2e-static-web-app-with-cli/).
1. In a base terminal, clone your forked repository to your local computer.

    ```bash
    git clone YOUR-FORKED-REPO-URL
    ```

1. Install dependencies for SWA CLI.

    ```bash
    cd js-e2e-static-web-app-with-cli && npm install
    ```

1. Install dependencies for the local front-end app:

    ```bash
    cd app && npm install 
    ```

1. Install dependencies for the local back-end app:

    ```bash
    cd ../api && npm install && cd ..
    ```


### Build and run local app

1. Verify local React app builds successfully by running the following command from the `./app` directory:

    ```bash
    npm run build
    ```

    If you run into errors, which may happen depending on the version of various packages and your environment, fix the errors before continuing. It's important to know that your project successfully builds locally before moving deployment to Azure Static Web Apps.

1. Start the project from the root directory. This command uses the SWA CLI to start the front-end and back-end apps locally with a proxy between them.
   
    ```bash 
    npm start
    ```

1. When you see the following lines in the bash terminal, the project successfully started. 

    ```bash
    [swa] Serving static content:
    [swa]   /workspaces/js-e2e-static-web-app-with-cli/v2/app/dist
    [swa] 
    [swa] Serving API:
    [swa]   /workspaces/js-e2e-static-web-app-with-cli/v2/api
    [swa] 
    [swa] Azure Static Web Apps emulator started at http://0.0.0.0:4280. Press CTRL+C to exit.
    ```

1. Open a web browser to the proxied URL, `http://localhost:4280`. You should see the following page:
   
    :::image type="content" source="{source}" alt-text="{alt-text}":::

1. You can sign in using authentication provided by the SWA CLI using on of the listed providers. The process mocks authectication in Azure Static web apps. The front-end code uses the `/.auth/me` endpoint to get the user's identity. Once a user is authenticated, the front-end displays _private_ information such as the API's environment variables.

    :::code language="{language}" source="{source}" range="{range}":::


## 4. Create a new Azure Static Web app

Create a Static Web app. This creation process deploys your GitHub repo to Azure. If you haven't finished pushing your React app to GitHub, complete [that step](#commit-app-changes-to-source-control) before continuing.

### Create Static Web app

Create the Static Web app with either the Azure CLI or the VS Code extension for Azure Static web apps. 

# [Visual Studio Code](#tab/create-swa-vscode)

In VS Code, find the Azure Explorer's Static Web App section, right-click on the `+` to create a new Static Web App. Use the following information to complete the prompts:

|Prompt|Setting|
|--|--|
|Enter a name for the new static web app.|Enter a name that you can find and identify as yours, such as `YOUR-ALIAS-staticwebapp-with-api` where your replace YOUR-ALIAS with your email alias. |
|Choose a build preset to configure default project structure.|Select `React`|
|Enter a location of your application code.|Enter `app` because the app needs to be referenced from the root.|
|Enter a location of your build output relative to your app's location.| Enter `build`. **Do not** preface this with a forward slash.|

If this is your first Azure resource, you may be asked other questions such as resource group or location. Use naming conventions to create the resource group, such as `YOUR-ALIAS-westus-rg` then select the location you specified in the name.

# [Azure CLI](#tab/create-swa-azure-cli)


In the VS Code integrated terminal, where you logged into the Azure CLI in a previous section of this article, use the following Azure CLI command, [az staticwebapp create](/cli/azure/staticwebapp#az-staticwebapp-create), to create your Static Web App:

```azurecli
az staticwebapp create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP-NAME \
    --name YOUR-ALIAS-staticwebapp-with-api \
    --source https://github.com/YOUR-ACCOUNT/staticwebapp-with-api \
    --token YOUR-GITHUB-REPO-PERSONAL-ACCESS-TOKEN \
    --location YOUR-LOCATION \
    --branch main \
    --app-location "app" \
    --output-location "build"
```

---

### Verify GitHub Action Build

1. In a web browser, return to your GitHub repo and select the **Actions** area. The actions URL should look like:

    ```HTTP
    https://github.com/YOUR-ACCOUNT/staticwebapp-with-api/actions
    ```

1. Select the workflow, then select the **Build and Deploy** job.

1. Find the end of this job and make sure it was successful:

    ```console
    Finished building app with Oryx
    Zipping App Artifacts
    Done Zipping App Artifacts
    Either no Api directory was specified, or the specified directory was not found. Azure Functions will not be created.
    Uploading build artifacts.
    Finished Upload. Polling on deployment.
    Status: InProgress. Time: 0.0980254(s)
    Status: Succeeded. Time: 15.1951385(s)
    Deployment Complete :)
    Visit your site at: https://random-name.azurestaticapps.net
    Thanks for using Azure Static Web Apps!
    Exiting
    ```

1. Don't continue with the remaining steps of this article series until the Action builds and deploys successfully.

### Troubleshooting GitHub Actions for Static Web apps

If your app didn't build successfully, there are usually a few top issues:
 * Your locations for your assets inside your project, app location of `app` and build output directory such as `build`, aren't correct. 
 * Your build environment doesn't match your local development environment and that difference is causing a problem.
 * Your project size, with dependencies, exceeds the size limitation [quota](/azure/static-web-apps/quotas) for Static Web apps. 
 * Other [troubleshooting steps](/azure/static-web-apps/troubleshooting) for Static Web apps.


### View your deployed React app in a browser

1. In VS Code, select the Azure Explorer.
1. In the Azure Explorer, right-click your new Static Web app, then select **Browse site**. 
   
   This opens a browser to your new app. It should appear exactly as your local version of the app.

### Pull GitHub action file to your local environment

You need to pull down the remote action definition file before moving to the next article in the series. 

1. Pull your remote GitHub action file to your local environment:
   
   ```bash
   git pull origin main
   ```

1. Review the `.yml` file in the local `./github/workflows` directory:

    :::code language="YAML" source="~/../js-e2e-static-web-app-with-cli-1-basic-app-with-api/.github/workflows/azure-static-web-apps.yml.sample" highlight="28-33":::

    Most of the file is generic to any Static Web app. The highlighted lines in the preceding source listing are specific to this app.

1. If you need the Node.js version to stay the same, regardless of the ubuntu version, use the [Oryx configuration](https://github.com/microsoft/Oryx/blob/main/doc/configuration.md#oryx-configuration), `NODE_VERSION`, to set that value. The `.yml` needs an environment variable, `env`, to pass that setting:
   
    :::code language="YAML" source="~/../js-e2e-static-web-app-with-cli-1-basic-app-with-api/.github/workflows/azure-static-web-apps-NODE_VERSION.yml.sample" highlight="34,35"::: 

## 5. Create your Azure Function API

Create an Azure Function API for your React app. The Azure Function service provides serverless APIs. This allows you to focus on your TypeScript code and _not_ have to configure a full back-end web server. 

### Create an Azure Function app

1. In the root of the project, create a Function app in a directory named `api`:

    ```bash
    func init api --typescript
    ```

1. Move into the `api` directory to create an API endpoint:

    ```bash
    cd api
    ```

1. Create an http trigger API and its associated files:

    ```bash 
    func new --name hello --template "HTTP trigger" --authlevel "anonymous" 
    ```

    |Setting|Description|
    |--|--|
    |`--name hello`|Creates an API with a route of `/api/hello`|
    |`--template "HTTP trigger"`|The API is triggered by HTTP requests. Other template types allow triggering from other Azure Service integrations.|
    |`--authlevel "anonymous"`|All requests to this API are allowed.|

1. Install dependencies for the Azure Function API:

    ```bash
    npm install 
    ```

### Change the Function API to return JSON

Open the `./api/hello/index.ts` file and replace all the contents with the following so that the function returns a JSON object:
   
:::code language="TypeScript" source="~/../js-e2e-static-web-app-with-cli-1-basic-app-with-api/api/hello/index.ts" highlight="12-15":::  

### Start the Azure Function app

Start the Azure function API:

```bash 
npm start
```

### Use the Function API in the browser

1. Query the API in a browser with the following URL:

    ```bash
    http://localhost:7071/api/hello?name=joesmith
    ```

1. The web browser returns the following successful message. 

    ```json
    {
      "input": "joesmith",
      "message": "Hello, joesmith. This HTTP triggered function executed successfully."
    }
    ```

### Stop the local Function app

Stop the local Azure Function runtime in the terminal with <kbd>Ctrl</kbd> + <kbd>c</kbd>.

### Commit API changes to source control

1. Check the new API code into your repo and push to the remote:
   
   ```bash
   git add . && git commit -m "hello api" && git push origin main
   ```

### Verify your GitHub Action build

1. In a web browser, go back to your GitHub repo, and make sure the next build of your Action succeeds with these new changes. The actions URL should look like:

    ```HTTP
    https://github.com/YOUR-ACCOUNT/staticwebapp-with-api/actions
    ```
   
    View the **Build and Deploy Job** to find the API successfully deployed:

    ```text
    Function Runtime Information. OS: Linux, Functions Runtime: v3, Node version: 12.X
    Finished building function app with Oryx
    Zipping Api Artifacts
    Done Zipping Api Artifacts
    Zipping App Artifacts
    Done Zipping App Artifacts
    Uploading build artifacts.
    Finished Upload. Polling on deployment.
    Status: InProgress. Time: 0.1977171(s)
    Status: InProgress. Time: 15.3964651(s)
    Status: Succeeded. Time: 31.3050572(s)
    Deployment Complete :)
    Visit your site at: https://purple-field-12345678.azurestaticapps.net
    Thanks for using Azure Static Web Apps!
    Exiting
    ```

1. In VS Code, verify the successful build pushed to your Azure Static Web Apps resource. Look at the functions node in your Azure explorer for Static Web Apps. 

   :::image type="content" source="../../media/static-web-app-with-swa-cli/visual-studio-code-azure-explorer-function-list.png" alt-text="Partial screenshot of VS Code displaying Azure Explorer's Static Web Apps `functions` node with `hello` displayed.":::

    You may need to refresh using the Azure explorer's Static Web app bar in VS Code.

   :::image type="content" source="../../media/static-web-app-with-swa-cli/visual-studio-code-swa-refresh.png" alt-text="Partial screenshot of VS Code displaying Azure Explorer's Static Web Apps command bar with the refresh icon highlighted.":::

1. In the bash terminal, move back to the root of the project:

    ```bash 
    cd ..
    ```
## 6. Connect React client app to Azure Function API

Change the local React app code to use the Azure Function API. 

At this point in the article series, both the React client and the Azure Function API work both locally and remotely. The **remote** Azure Static Web Apps resource provides a proxy between the React client and API. The **local** environment needs the same proxy so the local React client and API can work together. Use the Static Web Apps CLI (SWA CLI) to provide the **local proxied environment** for your local app.

Run both the React and Functions development environments, provided by each framework, then use those app URLs with the SWA CLI to provide the proxy between the two. 

### Create parent proxied project

1. In order to control both the React app and API projects, create a `./package.json` file in the root of the project.

    ```bash
    npm init -y
    ```

1. Install required dependencies to run `package.json` scripts:

    ```bash
    npm install concurrently azure-functions-core-tools@3 @azure/static-web-apps-cli --save-dev 
    ```

1. Replace the current `package.json` file's `scripts` section with the following script entries:

    ```json
    "scripts": {
      "start-api": "cd api && npm start",
      "start-app": "cd app && npm start",
      "start-dev": "concurrently \"npm:start-api\" \"npm:start-app\" ",
      "start-swa": "swa start http://localhost:3000 --api-location http://localhost:7071",
      "start": " npm run start-dev && npm run swa-up"
    }, 
    ```

    These scripts separate out the development server of each environment from the SWA CLI call to join those two environments. 

    |Script|Purpose|
    |--|--|
    |`start-api`|Start local Azure Functions runtime.|
    |`start-app`|Start React app's local runtime.|
    |`start-dev`|Start both local runtimes.|
    |`start-swa`|Start SWA across both apps. Use the `http://locahost:4280` base URL to request the proxied app.|
    |`start`|Start everything.|

### Start local app for full-stack app

The React client and the Azure Function API have separate local development servers. 

1. In order to debug both client and API at the same time, open two separate instances of VS Code. 
1. In one instance, open the `./app` folder. In the second instance, open the `./api` folder. In each project, open an integrated terminal and start the project:
   
    ```bash
    npm start
    ```

    When both the React app and the Function API have started correctly, continue to the next step. 

    :::image type="content" source="../../media/static-web-app-with-swa-cli/run-both-client-and-api-locally-separate-visual-studio-code.png" alt-text="Partial screenshot of Windows desktop with two separate VS Code instances running." lightbox="../../media/static-web-app-with-swa-cli/run-both-client-and-api-locally-separate-visual-studio-code.png":::

1. In one of the VS Code instances (it doesn't matter which instance), open a second integrated terminal, change to the root directory and start the proxy:
   
    ```bash
    cd .. && npm run start-swa
    ```

1. For the rest of the article, use port 4280, `http://locahost:4280/`, when you want to use the React app.  

    The React client is now available on both port 3000 and on port 4280 (with a proxy to the API). 

### Add an HTML form to the React app to use the Function API

In VS Code for the React app, find the `./src/App.tsx file` and replace the entire file with the following code:

:::code language="TypeScript" source="~/../js-e2e-static-web-app-with-cli-1-basic-app-with-api/app/src/App.tsx" highlight="7-18, 27-39":::  

### Use your static web app in browser

1. Return to the web browser for the React app, and use the new form to enter your name and pass that name to the Function API.
   
   :::image type="content" source="../../media/static-web-app-with-swa-cli/react-app-with-form-pass-name-api.png" alt-text="Screenshot of web browser displaying React app form.":::

1. The React app responds with the success message:
   
   :::image type="content" source="../../media/static-web-app-with-swa-cli/react-app-with-form-results-pass-name-api.png" alt-text="Screenshot of web browser displaying React app form and API response.":::

### Commit changes to source control

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

## 7. Add easy authentication to web app

In this article, add authentication to the React client app, which uses the Static Web app authentication. 


* Sample [basic app and API with authentication](https://github.com/Azure-Samples/js-e2e-static-web-app-with-cli/tree/2-basic-app-with-api-and-auth) - on branch named `2-basic-app-with-api-and-auth`

### Create navigation bar for authentication

Create a navigation component, which provides login and logout functionality.

1. In VS Code, create a `components` directory under the React `./app/src` directory.
1. Create a `NavBar.tsx` file and copy the following code into the file. 

    :::code language="JSON" source="~/../js-e2e-static-web-app-with-cli-2-basic-app-with-api-and-auth/app/src/components/NavBar.tsx" highlight="8,11":::  

1. Create a `PublicHome.tsx` file and copy the following code into the file: 

    :::code language="JSON" source="~/../js-e2e-static-web-app-with-cli-2-basic-app-with-api-and-auth/app/src/components/PublicHome.tsx" :::  

1. Create a `PrivateHome.tsx` file and copy the following code into the file: 

    :::code language="JSON" source="~/../js-e2e-static-web-app-with-cli-2-basic-app-with-api-and-auth/app/src/components/PrivateHome.tsx" highlight="15-23":::  

1. Open the `./app/src/App.tsx` file and copy the following code into the file: 

    :::code language="JSON" source="~/../js-e2e-static-web-app-with-cli-2-basic-app-with-api-and-auth/app/src/App.tsx" highlight="18-34":::  

    The highlighted code lines request the current authentication from the `/.auth/me` route provided by the Static Web Apps environment. 

### Test the local authentication process provided by SWA CLI

1. Allow the local app to rebuild and refresh the entire app in the browser, `http://localhost:4280`. 
   

    :::image type="content" source="../../media/static-web-app-with-swa-cli/static-web-app-with-auth-providers.png" alt-text="Browser screenshot showing the app with authentication provider choices of Twitter, GitHub, and Azure AD. ":::

1. Select the GitHub authentication provider.
1. The local SWA CLI provides an authentication form to use.
   
    :::image type="content" source="../../media/static-web-app-with-swa-cli/local-browser-swa-cli-authentication-form.png" alt-text="Browser screenshot showing the app with authentication form provided with SWA CLI. ":::

    This form simulates the authentication process for your local development environment. It doesn't call the real authentication providers.

1. Enter a name and select **Login** to finish the local authentication process. Control is then returned back to your app and the PrivateHome component is displayed. 

    :::image type="content" source="../../media/static-web-app-with-swa-cli/local-browser-swa-cli-authentication-form-private-home-component-with-navbar.png" alt-text="Browser screenshot showing the PrivateHome component because authentication has been provided. ":::

    Both the NavBar and PrivateHome HTML form display the authenticated user name, which is returned from the authentication process.

### Commit changes to source control

1. Check the new app code into your local repo and push to the remote repo:
   
   ```bash
   git add . && git commit -m "swa authentication" && git push origin main
   ```

1. In a web browser, go back to your GitHub repo, and make sure the next build of your Action succeeds with these new changes. The actions URL should look like:

    ```HTTP
    https://github.com/YOUR-ACCOUNT/staticwebapp-with-api/actions
    ```

1. In VS Code, in the Azure explorer, find your static web app, then right-click and select **Browse site**.

1. The same React app, as your local version, should appear. The same form functionality as your local version should work, returning a message from the API.  

## 8. Clean up all resources used in this article series

Clean up all resources created in this article series.

### Remove the Azure Static Web Apps resource


# [Visual Studio Code](#tab/remove-swa-vscode)

In VS Code, find the Azure Explorer's Static Web Apps section, right-click on the Static Web Apps and select **Delete**. In the pop-up window, **Are you sure...**, select **Delete** again. 

# [Azure CLI](#tab/remove-swa-azure-cli)


In the VS Code integrated terminal, where you logged into the Azure CLI in a previous section of this article series, use the following Azure CLI command, [az staticwebapp delete](/cli/azure/staticwebapp/appsettings#az-staticwebapp-appsettings-delete), to delete your Static Web Apps resource:

```azurecli
az staticwebapp delete \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP-NAME \
    --name YOUR-ALIAS-staticwebapp-with-api \
    --no-wait
    --yes
```

---

### Delete your GitHub repo

Delete your GitHub repo, and all the files associated with it.

1. In a web browser, open your repo's settings with a URL like: `https://github.com/YOUR-ACCOUNT/staticwebapp-with-api/settings`.
1. At the bottom of the page, in the **Danger Zone**, select **Delete this repository** and complete that process.

### Remove your authentication from the authentication provider

If you deploy your app to the remote Static Web Apps resource and have logged in, then want to remove your personal authentication approvals, you need to purge these approvals. This step isn't needed if you haven't deployed to Azure.

Purge your authentication from your providers, using the following links:

* [Twitter](https://identity.azurestaticapps.net/.auth/purge/twitter)
* [GitHub](https://identity.azurestaticapps.net/.auth/purge/github)
* [Azure AD](https://identity.azurestaticapps.net/.auth/purge/aad)

## Next steps

* [Add search to your web site](/azure/search/tutorial-javascript-overview)