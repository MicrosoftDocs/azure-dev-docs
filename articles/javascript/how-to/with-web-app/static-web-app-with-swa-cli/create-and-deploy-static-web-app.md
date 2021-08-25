---
title: Create Static web app using CLI
description: Create a Static Web App and locally develop using the SWA CLI. Run the same code locally and remotely to ensure that customers get the correct web behavior.
ms.topic: how-to
ms.date: 08/25/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---
# Create Static web app using CLI

Learn how to create a [Static Web App](/azure/static-web-apps/) and locally develop using the [SWA CLI](https://github.com/Azure/static-web-apps-cli). Run the same code locally and deploy remotely without changes to ensure the same quality of experience for your customers that you see in your local development environment.

The Static Web app consists of:
* A client React app in the `app` directory, served from `http://localhost:3000`
* An Azure Function API in the `api` directory served from `http://localhost:7071`

Once the two apps are created, use the Static Web App CLI to proxy local requests from the React app to the Function API. The URL in the React looks like `/api/hello`, without specifying the server or port number for the API. Requests using this URL are successful locally because the SWA CLI manages the proxy for you.  

## Features

This project framework provides the following features:

* React app and API are in TypeScript
* Parent package.json with scripts to control full-stack locally

## Prepare your development environment

Install the following:

* [Azure CLI](/cli/azure/install-azure-cli) - v2.27.2
* [Visual Studio Code](https://code.visualstudio.com/Download) (VS Code)
* [Node.js](https://nodejs.org/en/download/) - this process was developed with v14.17.1. Other versions may introduce issues with create-react-app. 
* SWA CLI

    ```bash
    npm install -g @azure/static-web-apps-cli
    ```

* [Azure Functions Core Tools](/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cportal%2Cbash%2Ckeda#install-the-azure-functions-core-tools) - v3.0.3477+

### Git branches

Because you will be pushing and pulling between your local development and your remote GitHub repo, it is important that both your local git environment and remote repo have the same `default` branch. If you are new to Git and GitHub, both branches are `main`. If both default branches are not `main`, you need to configure both branches to be the same name and any time you see `main` referenced in this document, use your own default branch name instead. 

## Create Static Web app

### Create React app

1. Open VS Code in the directory which will become the root of the project. 
1. In VS Code, open an integrated **bash** terminal. All remaining terminal commands should be run from the same terminal unless otherwise specified. 

1. In the root of the project, create a _create-react-app_ in `/app` directory with the following command:

    ```bash
    npx create-react-app app --template typescript
    ```

1. Install dependencies for the local React app:

    ```bash
    cd app && npm install typescript --save-dev && npm install && cd ..
    ```

1. Change `tsconfig.json` to ignore compile errors for any variables without a specified type:

    ```json
    "noImplicitAny": false
    ```

    This specific step is to bypass any issues with create-react-app. In your professional projects, once you are comfortable with your build and deployment of the app, return to this setting and set it to `true`. Resolve any compile-time errors for TypeScript before committing these changes to source control. 

1. Verify local React app builds successfully:

    ```bash
    npm run build
    ```

    If you run into errors, which may happen depending on the version of various packages and your environment, fix the errors before continuing. It is important to know that your project successfully builds locally before moving deployment to Azure Static web apps.

1. Run the project, which should open the project in a browser to `http://localhost:3000/`:
   
    ```bash 
    npm start
    ```

1. When you see the project successfully loaded in the browser, stop the run time with <kbd>Ctrl</kbd> + <kbd>c</kbd>.
1. Move back to the root of the project:

    ```bash 
    cd ..
    ```

    Leave this bash terminal open, you will return to it in a later step. 
   
## Create new GitHub repo

1. Use [this GitHub link](https://github.com/new) to go to your account on GitHub and create a new repo. For this procedure, create the repo as a public repo.  
   
1. After your create repo, copy the repo URL, such as `https://github.com/YOUR-ACCOUNT/YOUR-REPO-NAME`.

1. Create a **Personal Access Token** (PAT) for this repo using [GitHub documentation found here](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line).

1. If you intend to create your Azure Static Web app using the Azure CLI (one of the choices below), you need to create a personal access token (PAT) using [GitHub documentation found here](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line), then copy this PAT for that later step. 

1. In VS Code, return to your bash window at the root of your project. 
1. Initialize Git:

    ```bash
    git init
    ```
1. Change the following command to use your account and repo name. This command adds your GitHub repo as a remote named `origin`. 
   
   ```bash
   git add remote origin https://github.com/YOUR-ACCOUNT/YOUR-REPO-NAME
   ```

1. Commit and push your React app to your new repo:
   
   ```bash
   git pull origin main && git add . && git commit -m "react app" && git push origin main
   ```

### Sign in to Azure CLI

1. In VS Code, in an integrated bash terminal, sign in to the Azure CLI:

    ```bash
    az login
    ```

    This opens a browser for you to continue your authentication. 

1. When authentication is complete, close the browser and return to VS Code. 

### Create Static Web App

# [Visual Studio Code](#tab/create-swa-vscode)

In VS Code, find the Azure Explorer's Static Web App section, right-click on the `+` to create a new Static Web App. Use the following information to complete the prompts:

|Prompt|Setting|
|--|--|
|Enter a name for the new static web app.|Enter a name that you can find and identify as yours, such as `YOUR-ALIAS-static-web-app-react-api` where your replace YOUR-ALIAS with your email alias. |
|Choose a build preset to configure default project structure.|Select `React`|
|Enter a location of your application code.|Enter `app` because the app needs to be referenced from the root.|
|Enter a location of your build output relative to your app's location.| Enter `build`. **Do not** preface this with a forward slash.|

If this is your first Azure resource, you may be asked other questions such as resource group or location. Use naming conventions to create the resource group, such as `YOUR-ALIAS-westus-rg` then select the location you specified in the name.

# [Azure CLI](#tab/create-swa-azure-cli)


In the VS Code integrated terminal, where you logged into the Azure CLI in a previous section of this article, use the following Azure CLI command, [az staticwebapp create](/cli/staticwebapp#az_staticwebapp_create), to create your Static Web App:

```azurecli
az staticwebapp create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME
    --resource-group YOUR-RESOURCE_GROUP_NAME \
    --name YOUR-ALIAS-static-web-app-react-api \
    --source https://github.com/YOUR-ACCOUNT/YOUR-REPO-NAME \
    --token YOUR-GITHUB-REPO-PERSONAL-ACCESS-TOKEN
    --location YOUR-LOCATION \
    --branch main \
    --app-location "app"
    --app-artifact-location "build"
```

---



### Verify GitHub Action Build

1. In a web browser, return to your GitHub repo and select the **Actions** area. 
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
    Visit your site at: https://purple-coast-1234567.azurestaticapps.net
    Thanks for using Azure Static Web Apps!
    Exiting
    ```

### Troubleshooting GitHub Actions

If your app didn't build successfully, there are usually a few top issues:
 * Your locations for your assets inside your project, app location of `app` and asset directory such as `build`, are not correct. 
 * Your build environment doesn't match your local development environment and that difference is causing a problem.
 * Your project size, with dependencies, exceeds the size limitation [quota](/static-web-apps/quotas) for Static Web apps. 
 * Other [troubleshooting steps](/azure/static-web-apps/troubleshooting) for Static Web apps.


### Pull GitHub action file to your local environment

1. Pull your remote GitHub action file to your local environment:
   
   ```bash
   git pull origin main
   ```

1. Review the `.yml` file in the `./github/workflows` directory:

    ```YML
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
            azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_PURPLE_COAST_1234567 }}
            repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
            action: "upload"
            ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
            # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
            app_location: "app" # App source code path
            api_location: "api" # Api source code path - optional
            output_location: "build" # Built app content directory - optional
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
            azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_PURPLE_COAST_1234567 }}
            action: "close"
    ```

1. If you need the Node.js version to stay the same, regardless of the ubuntu version, use the [Oryx configuration](https://github.com/microsoft/Oryx/blob/main/doc/configuration.md#oryx-configuration), `NODE_VERSION`, to set that value. The `.yml` needs an environment variable to pass that setting:
   
    ```YML
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
                azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_PURPLE_COAST_1234567 }}
                repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
                action: "upload"
                ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
                # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
                app_location: "app" # App source code path
                api_location: "api" # Api source code path - optional
                output_location: "build" # Built app content directory - optional
                ###### End of Repository/Build Configurations 
            env: # Add environment variables here
                NODE_VERSION: 14.17.1
            ######

    close_pull_request_job:
        if: github.event_name == 'pull_request' && github.event.action == 'closed'
        runs-on: ubuntu-latest
        name: Close Pull Request Job
        steps:
        - name: Close Pull Request
            id: closepullrequest
            uses: Azure/static-web-apps-deploy@v1
            with:
            azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_PURPLE_COAST_1234567 }}
            action: "close"
    ```

### Create Function API

The Azure Function service provides serverless APIs. This allows you to focus on your TypeScript code and _not_ have to configure a full back-end web server. 

1. In the root of the project, create a create-react-app in a directory named `api`:

    ```bash
    func init api --typescript
    ```

1. Move into the directory to create an API:

    ```bash
    cd api
    ```

1. Create http trigger API with a route of `/api/hello` (`--name hello`) that allows all requests (`--authlevel anonymous`):

    ```bash 
    func new --name hello --template "HTTP trigger" --authlevel "anonymous" 
    ```

1. Install dependencies for the Azure Function API:

    ```bash
    npm install 
    ```

1. Open the `./api/index.ts` file and replace all the contents with the following so that the function returns a JSON object:
   
    ```typescript
    import { AzureFunction, Context, HttpRequest } from "@azure/functions"

    const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
        context.log('HTTP trigger function processed a request.');
        const name = (req.query.name || (req.body && req.body.name));
        const responseMessage = name
            ? "Hello, " + name + ". This HTTP triggered function executed successfully."
            : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                input: name,
                message: responseMessage
            }

        };

    };

    export default httpTrigger;   
   ```

1. Start the Azure function API:

    ```bash 
    npm start
    ```

1. Query the API in a browser with the following URL:

    ```bash
    http://localhost:7071/api/hello?name=joesmith
    ```

1. The web browser returns the following successful message. 

    ```text
    Hello, joesmith. This HTTP triggered function executed successfully.
    ```

1. Stop the local Azure Function runtime in the terminal with <kbd>Ctrl</kbd> + <kbd>c</kbd>.

1. Check the new API code into your repo and push to the remote:
   
   ```bash
   git add . && git commit -m "hello api" && git push origin main
   ```

1. In a web browser, go back to your GitHub repo, and make sure the next build of your Action succeeds with these new changes. 
   
1. In VS Code, verify the successful build pushed to your Azure Static Web app. Look at the functions node in your Azure explorer for Static Web Apps. 

   :::image type="content" source="../../../media/static-web-app-with-swa-cli/visual-studio-code-azure-explorer-function-list.png" alt-text="Partial screenshot of VS Code displaying Azure Explorer's Static Web App `functions` node with `hello` displayed.":::

## Connecting the client and serverless API to each other

At this point, both the React client and the Azure Function API work both locally and remotely, _but_ they don't work together in either environment. The remote environment provides a proxy between the two environments but the local environment doesn't. Use the Static Web App CLI (SWA CLI) to provide the proxied environment for your local app.

Run both the React and Functions development environments, provided by each framework, then use those app URLs with the SWA CLI to provide the proxy between the two. 

### Create parent proxied project

1. In order to control both the React app and API projects, create a `./package.json` file in the root of the project.

    ```bash
    npm init -y
    ```

1. Install concurrently to run `package.json` scripts:

    ```bash
    npm install concurrently azure-functions-core-tools@3 --save-dev 
    ```

1. Replace the current `package.json` file's `scripts` section with the following script entries:

    ```bash
    "start-api": "cd api && npm start",
    "start-app": "cd app && npm start",
    "start-dev": "concurrently \"npm:start-api\" \"npm:start-app\" ",
    "start-swa": "swa start http://localhost:3000 --api http://localhost:7071",
    "start": " npm run start-dev && npm run swa-up"
    ```

    These scripts separate out the development server of each environment from the SWA CLI call to join those two environments. 

    |Script|Purpose|
    |--|--|
    |`start-api`|Start local Azure Functions runtime.|
    |`start-app`|Start React app's local runtime.|
    |`start-dev`|Start both local runtimes.|
    |`start-swa`|Start SWA across both apps. Use the `http://locahost:4280` base URL to request the proxied app.|
    |`start`|Start everything.|

## Start local app for full-stack debugging

The React client and the Azure Function API have separate local development servers. 
1. In order to debug both client and API at the same time, open two separate instances of VS Code. 
1. In one instance, open the `./app` folder. In the second instance, open the `./api` folder. In each project, open an integrated terminal and start the project:
   
    ```bash
    npm start
    ```

    When both the React app and the Function API have started correctly, continue to the next step. 

1. In one of the VS Code instances (it doesn't matter which), open a second integrated terminal, change to the root directory and start the proxy:
   
    ```bash
    npm run start-swa
    ```

    The React client is now available on both port 3000 (with a proxy to the API) and on port 4280. For the rest of the article , use port 4280 when you want to use the React app.  

    :::image type="content" source="../../../media/static-web-app-with-swa-cli/run-both-client-and-api-locally-separate-vs-code.png" alt-text="Partial screenshot of Windows desktop with two separate VS Code instances running." lightbox="../../../media/static-web-app-with-swa-cli/run-both-client-and-api-locally-separate-vs-code.png":::


## Add form to the React app to use the Function API

In VS Code for the React app, find the `./src/App.tsx file` and replace the entire file with the following code:

    ```TypeScript
    import React from 'react';
    import logo from './logo.svg';
    import './App.css';

    function App() {

    const [name, setName] = React.useState('');
    const [message, setMessage] = React.useState('');

    const getDataFromApi = async(e: any)=>{
        e.preventDefault();
        const data = await fetch(`/api/hello?name=${name}`);
        const json = await data.json();

        if (json.message){
            setMessage(json.message);
        }
    };

    return (
        <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
            Static Web App: React App with Azure Function API
            </p>
            <form id="form1" className="App-form" onSubmit={e => getDataFromApi(e)}>
            <div>
                <input 
                type="text" 
                id="name" 
                className="App-input" 
                placeholder="Name" 
                value={name} 
                onChange={e=>setName(e.target.value)} />
                <button type="submit" className="App-button">Submit</button>
            </div>
            </form>
            <div><h5>Message: {message} </h5></div>
        </header>
        </div>
    );
    }

    export default App;
    ```

## Use static web app in browser

1. Return to the web browser for the React app, ``, and use the new form to enter your name and pass that name to the Function API.
   
   :::image type="content" source="../../../media/static-web-app-with-swa-cli/react-app-with-form-pass-name-api.png" alt-text="Screenshot of web browser displaying React app form.":::

1. The React app responds with the success message:
   
   :::image type="content" source="../../../media/static-web-app-with-swa-cli/react-app-with-form-results-pass-name-api.png" alt-text="Screenshot of web browser displaying React app form and API response.":::

1. Check the new app code into your repo and push to the remote:
   
   ```bash
   git add . && git commit -m "hello api" && git push origin main
   ```

1. In a web browser, go back to your GitHub repo, and make sure the next build of your Action succeeds with these new changes. 

1. In VS Code, in the Azure explorer, find your Static web app, then right-click and select **Browse site**.

1. The same React app, as your local version, should appear. The same form functionality as your local version should work, returning a message from the API.  
   
   Your code now successfully works locally and remotely for an Azure Static Web App. 

## Next steps

* [Static Web apps troubleshooting](/azure/static-web-apps/troubleshooting)
* [Azure Functions diagnostics](/azure/azure-functions/functions-diagnostics)