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

* Locally run a [static web app](/azure/static-web-apps/) (SWA)
* Locally proxy front-end requests to local API using the [SWA CLI](https://github.com/Azure/static-web-apps-cli). 
* Deploy and run the same code remotely without changes.

The proxy between the front-end and APIs is provided by the Static web app CLI provides:
* The URL in React, `/api/todo`, doesn't specify the server or port number for the API. Requests using this URL are successful locally because the SWA CLI manages the proxy for you. 
* A local authentication emulator when accessing `/.auth/login/<provider>`
* Route management and authorization 

## Authentication in this sample

The authentication in this sample is provided for front-end users:
* Login/Logout
* Public and private content

This is an _easy auth_ implementation. The back-end API can't act [_on behalf of_(OBO)](/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) the logged in user. Acting on behalf of the user requires more configuration both in the Azure Active Directory app and the Azure Identity SDK in the API. 

## 1. Prepare your development environment

Create the following accounts:

- Azure subscription - [Create a free Azure account](https://azure.microsoft.com/free/)
- [GitHub account](https://github.com/) - You need a GitHub account to deploy in this tutorial. If you don't have one, you can deploy from the SWA CLI. Learn more about [deployment with the SWA CLI](/azure/static-web-apps/static-web-apps-cli-deploy).

Install the following on your local development computer:

- [Node.js](https://nodejs.org/en/download/releases/) v18+
- [Visual Studio Code](https://code.visualstudio.com/Download) (VS Code)
- [Azure Static Web Apps (SWA) CLI](https://azure.github.io/static-web-apps-cli/docs/use/install) installed globally with `-g` flag
- [Azure Functions Core Tools](./functions-run-local.md) v4.0.5095+ (if running locally) installed globally with `-g` flag
- [TypeScript](https://www.typescriptlang.org/) v4+

## 2. Fork the sample repository

You need to have your own fork of the sample repository to complete the deployment from GitHub. During the fork process, you only need to copy the `main` branch. 

Fork the [sample repository](https://github.com/Azure-Samples/js-e2e-static-web-app-with-cli/).

## 3. Clone the forked sample repository

 The remaining local development steps are optional and helpful to know what the application looks like and how it should behave before you deploy to Azure. If you aren't interested in running the sample locally, you can skip to [Create a new Azure Static Web app](#create-a-new-azure-static-web-app).

1. In a bash terminal, clone **your forked repository** to your local computer. Do not clone the original sample repository. An example URL is ``

    ```bash
    git clone YOUR-FORKED-REPO-URL
    ```

1. Install dependencies for SWA CLI.

    ```bash
    cd azure-typescript-e2e-apps && npm install
    ```

1. Install dependencies for the local front-end app:

    ```bash
    cd app-react-vite && npm install 
    ```

1. Install dependencies for the local back-end app:

    ```bash
    cd ../apiV4-inmemory && npm install && cd ..
    ```


### 4. Build and run local app

The sample repository has several versions of the front-end and backend apps. The following steps use the React version of the front-end and the Azure Function v4 with Node.js version of the back-end.

1. From the root of the sample app, use the SWA CLI with the `swa-cli.config.json` file to build the front-end and back-end apps:

    ```bash
    swa build
    ```

    If you run into errors, which may happen depending on the version of various packages and your environment, fix the errors before continuing. It's important to know that your project successfully builds locally before moving on to deployment to Azure Static Web Apps.

1. From the root of the sample app, use the SWA CLI to start the apps with a proxy.
   
    ```bash 
    swa start
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

1. The form and its call to the back-end API work successfully because the SWA CLI proxied the API request to the Azure Functions app running locally. 

## 5. Create a new Azure Functions app

To use the preview version of the Azure Functions v4 runtime, you need to create a new Azure Functions app. This is known as a bring-your-own (BYO) function. The static web app also needs to be rebuilt and redeployed to use the new Azure Functions app URI in the fetch requests to the API.

1. In a web browser, open the Azure portal to create a new Azure Functions app: [Create new app](https://ms.portal.azure.com/#create/Microsoft.FunctionApp)

1. Use the following information to create the Function App::


    |Tab:Seetting|Value|
    |Basics: Subscription|Select the subscription you want to use.|
    |Basics: Resource Group|Create a new resource group such as `first-static-web-app-with-api`. The name isn't used in the app's public URL. Resource groups help you group and managed related Azure resources.|
    |Basics: Instance details: Function App name|Enter a globally unique name such as `swa-api` with 3 random characters added at the end.|
    |Basics: Instance details: Code or container|Select `Code`.|
    |Basics: Instance details: Runtime stack|Select `Node.js`.|
    |Basics: Instance details: Runtime stack|Select `18LTS`.|
    |Basics: Operating system| Select `Linux`.|
    |Basics: Hosting|Select `Consumption`.|
    |Storage: Storage account|Don't change this. A new Azure Storage account will be created to help with function events.|
    |Networking|Don't change anything.|
    |Monitoring: Application Insights: Enable Application Insights|Select `Yes. Don't change the default name provided.|
    |Deployment: GitHub Actions Settings: Continuous deployment|Select `Enable`.|
    |Deployment: GitHub account| Select your GitHub account, it if isn't already set.|
    |Deployment: Organization|Select your GitHub account which you used when you forked the sample repository.|
    |Deployment: Repository|Select your forked repository name, `azure-typescript-e2e-apps`.|
    |Deployment: Branch|Select `main`.|
    |Tags|Don't change anything.|
    |Review + create|Select `Create`.|

1. The previous step added a GitHub workflow file to your forked repository. The workflow file needs to up pulled down to your local computer to edit the file with the location of the subdirectory of the correct API source code.

    ```bash
    git pull origin main
    ```

1. In Visual Studio Code, open the new workflow file in `./.github/workflows/main_*.yml`. Your specific filename will be different.
1. The workflow file assumes the function source code is at the root of the repository and is the only app in the repository but that isn't the case with this sample application. To fix that, edit the set which builds the Azure Function app.

    :::code language="yaml" source="~/../azure-typescript-e2e-apps/example-workflows/react-app-inmem-api.yml" highlight="4,10-11,34" :::

1. Save the file and add, commit, and push it back to GitHub with git:

    ```bash
    git add .
    git commit -m "fix the workflow for a subdir"
    git push origin main
    ```

1. From a browser, rerun the workflow on GitHub in your fork's actions area.

## 6. Create a new Azure Static web app

This creation process deploys the forked GitHub sample repository to Azure. 

1. Open the Azure portal and sign in with your Azure account: [Azure portal](https://ms.portal.azure.com/#create/Microsoft.StaticApp).
1. Use the following information to complete the information:

    |Prompt|Setting|
    |--|--|
    |Subscription|Select the subscription you want to use.|
    |Resource Group|Select `Create new` and enter a new for the resource group such as `first-static-web-app`. The name isn't use in the app's public URL. Resource groups help you group resources used for a single project.|
    |Hosting plan type|Select `Free`|
    |Azure Functions and staging details|Select a region close to you.|
    |Deployment details - source| Select `GitHub`|
    |Deployment details - GitHub| Sign in to GitHub if necessary.|
    |Deployment details - Organization|Select your GitHub account.|
    |Deployment details - Repository|Select the forked repository named `js-e2e-static-web-app-with-cli`.|
    |Deployment details - Branch|Select the `main` branch.|
    |Build details - Build Presents|Select `Custom`.|
    |Build details - App location|Enter `/v2/app`.|
    |Build details - Api location|Enter `/v2/api`.|
    |Build details - Output location|Enter the location of the front-end's output directory, `dist`.|
    
    :::image type="content" source="../../media/static-web-app-with-swa-cli/azure-portal-create-static-web-app" alt-text="Screenshot of Azure portal showing settings to create a static web app from a GitHub repository.":::

1. Select **Review + create**, then select **Create**.

1. The creation process creates a deployment script known as a **GitHub action** and writes that file to your forked GitHub repository. Before any additional local development, you need to pull that change down with the following command:

    ```bash
    git pull origin main
    ```

1. The GitHub action found at `./.github/workflows/azure-static-web-apps-*.yml` is responsible for building and deploying the front-end and the back-end apps. 

    :::code language="yaml" source="js-e2e-static-web-app-with-cli" range="{range}":::

## 6. Fix GitHub Action file for JavaScript deployments

The default action file deploys the `node_modules` folders which is not necessary and will cause deployment to fail. 

1. Open the GitHub action file found at `./.github/workflows/azure-static-web-apps-*.yml` in Visual Studio Code. 
1. Modify the 

1. The GitHub deployment action runs but fails for a couple of reasons we can fix.
### Verify GitHub Action Build

When the GitHub action files was added to your forked GitHub repository, it was also triggered. 

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

1. Review the `.yml` file in the local `./v2/.github/workflows` directory:

    ```yml
    name: Azure Static Web Apps CI/CD

    on:
      push:
        branches:
          - main
      pull_request:
        types: [opened, synchronize, reopened, closed]
        branches:
          - main
    
    jobs:
      build_and_deploy_job:
        if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
        runs-on: ubuntu-latest
        name: Build and Deploy Job
        steps:
          - uses: actions/checkout@v2
            with:
              submodules: true
          - name: Build And Deploy
            id: builddeploy
            uses: Azure/static-web-apps-deploy@v1
            with:
              azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_GRAY_FLOWER_1123 }}
              repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
              action: "upload"
              ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
              # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
              app_location: "/v2/app" # App source code path
              api_location: "/v2/api" # Api source code path - optional
              output_location: "dist" # Built app content directory - optional
              ###### End of Repository/Build Configurations ######
    
      close_pull_request_job:
        if: github.event_name == 'pull_request' && github.event.action == 'closed'
        runs-on: ubuntu-latest
        name: Close Pull Request Job
        steps:
          - name: Close Pull Request
            id: closepullrequest
            uses: Azure/static-web-apps-deploy@v1
            with:
              azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_GRAY_FLOWER_123 }}
              action: "close"
    ```

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