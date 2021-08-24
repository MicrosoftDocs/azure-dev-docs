# Static web app using CLI

This [Static web app](https://docs.microsoft.com/azure/static-web-apps/) using the [SWA CLI](https://github.com/Azure/static-web-apps-cli) to run the app locally.

## Features

This project framework provides the following features:

* React app and Api are in TypeScript
* Parent package.json with scripts to control full-stack locally

## Prepare your development environment

Install the following:

* Node.js - 14.17.1 with nvm
* VSCode
* SWA CLI
* Azure Functions Core Tools


## Steps to recreate 



### Create React app

1. In the root of the project, create create-react-app in `/app` directory:

    ```bash
    npx create-react-app app --template typescript
    ```

1. Install dependencies:

    ```bash
    cd app && npm install typescript --save-dev && npm install && cd ..
    ```

1. Add to tsconfig.json:

    ```json
    "noImplicitAny": false
    ```

1. Verify app builds successfully:

    ```bash
    npm run build
    ```

    If you run into errors, which may happen depending on the version of various packages and your environment, fix the errors before continuing. It is important to know that your project successfully builds locally before moving deploying to Azure Static web apps.

1. Run the project, which should open the project in a browser to `http://localhost:3000/`:
   
    ```bash 
    npm start
    ```

1. When you see the project successfully loaded in the browser, stop the run time with `cntrl-c`.
1. Using bash, move to the root of the project:

    ```bash 
    cd ..
    ```
    Leave this bash terminal open, you will return to it in a later step. 
   
## Create a GitHub repo

1. Use [this GitHub link](https://github.com/new) to go to your account on GitHub and create a new repo. For this procedure, create the repo as a public repo. Don't add any files to the repo. 
   
1. After your create repo, copy the repo URL, such as `https://github.com/YOUR-ACCOUNT/YOUR-REPO-NAME`.

1. Return to your bash window at the root of your project.
1. Initialize Git:

    ```bash
    git init
    ```
1. Add your repo as a remote named origin. Change the following command to use your account and repo name.
   
   ```bash
   git add remote origin https://github.com/YOUR-ACCOUNT/YOUR-REPO-NAME
   ```

### Create Static Web App

1. In VS Code, find the Azure Explorer's Static Web App section, right-click on the `+` to create a new Static Web App. Use the following information to complete the prompts:

    |Prompt|Setting|
    |--|--|
    |Enter a name for the new static web app.|Enter a name that you can find and identify as yours, such as `YOUR-ALIAS-static-web-app-react-api` where your replace YOUR-ALIAS with your email alias. |
    |Choose a build preset to configure default project structure.|Select `React`|
    |Enter a location of your application code.|Enter `/app` because the app needs to be referenced from the root.|
    |Enter a location of your build output relative to your app's location.| Enter `build`. **Do not** preface this with a forward slash.|

    If this is your first Azure resource, you may be asked other questions such as resource group or location. Use naming conventions to create the resource group, such as `YOUR-ALIAS-westus-rg` then select the location you specified in the name.

### Verify GitHub Action Build

1. In a web browser, return to your repo and select the **Actions** area. 
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

    If your app didn't build successfully, there are usually a few top issues:
    * Your build environment doesn't match your local development environment and that difference is causing a problem.
    * Your locations for your assets inside your project, app location of `app` and asset directory such as `build`, are not correct. 

1. Pull your remote GitHub action file to your local environment:
   
   ```bash
   git pull origin main
   ```

1. Review the `.yml` file in the `./github/workflows` directory:

    ```YMAL
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
            app_location: "/app" # App source code path
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


### Create Function api

1. In the root of the project, create create-react-app in `/api` directory:

    ```bash
    func init api --worker-runtime node --language typescript
    ```

2. Create http trigger API:

    ```bash 
    func new --name HttpHello --worker-runtime node --template "HTTP trigger" --language TypeScript --authlevel anonymous
    ```

3. Install dependencies:

    ```bash
    cd api && npm install && cd ..
    ```

### Create parent package.json file

1. In order to control both app and api projects, create a `./package.json` file in the root of the project.

    ```bash
    npm init -y
    ```

1. Install concurrently to run `package.json` scripts:

    ```bash
    npm install concurrently azure-functions-core-tools@3 --save-dev 
    ```

1. Replace the current `package.json` file's `scripts` section with the following script entries:

    ```bash
    "start-api": "cd api & npm start",
    "start-app": "cd app & npm start",
    "start-dev": "concurrently \"npm:start-api\" \"npm:start-app\" ",
    "start-swa": "swa start http://localhost:3000 --api http://localhost:7071",
    "start": " npm run start-dev && npm run swa-up"
    ```


## Start local development servers

The React client and the Azure Function API have separate local development servers. 1. In order to debug both client and API at the same time, open two separate instances of VS Code. 
1. In one instance, open the `./app` folder. In the second instance, open the `./api` folder. 
1. In the integrated terminal for each instance, start the development server:
    ```bash
    npm start
    ```


## Verify installation

1. At the root, start the full stack, both api and app, with the following script command:

    ```bash
    npm start
    ```

1. Verify the React client is running at `http://localhost:3000/` and is open in a browser.
1. Verify the Function is running at `http://localhost:7071/` with the following command:

    ```bash
    curl http://localhost:7071/api/hello --verbose
    ```