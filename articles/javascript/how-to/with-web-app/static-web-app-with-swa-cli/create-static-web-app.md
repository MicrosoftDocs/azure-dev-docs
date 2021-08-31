---
title: "4-SWA: Create Static Web app "
description: Create a Static Web app. This creation process deploys your GitHub repo to Azure.  
ms.topic: how-to
ms.date: 08/31/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---

# 4. Create a new Azure Static Web app

Create a Static Web app. This creation process deploys your GitHub repo to Azure. If you haven't finished pushing your React app to GitHub, complete [that step](create-react-app.md#commit-app-changes-to-source-control) before continuing.

## Create Static Web app

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


In the VS Code integrated terminal, where you logged into the Azure CLI in a previous section of this article, use the following Azure CLI command, [az staticwebapp create](/cli/staticwebapp#az_staticwebapp_create), to create your Static Web App:

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

## Verify GitHub Action Build

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

1. Do not continue with the remaining steps of this article series until the Action builds and deploys successfully.

## Troubleshooting GitHub Actions for Static Web apps

If your app didn't build successfully, there are usually a few top issues:
 * Your locations for your assets inside your project, app location of `app` and build outpu directory such as `build`, are not correct. 
 * Your build environment doesn't match your local development environment and that difference is causing a problem.
 * Your project size, with dependencies, exceeds the size limitation [quota](/static-web-apps/quotas) for Static Web apps. 
 * Other [troubleshooting steps](/azure/static-web-apps/troubleshooting) for Static Web apps.


## View your deployed React app in a browser

1. In VS Code, select the Azure Explorer.
1. In the Azure Explorer, right-click your new Static Web app, then select **Browse site**. 
   
   This opens a browser to your new app. It should appear exactly as your local version of the app.

## Pull GitHub action file to your local environment

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

## Next steps

* [Create Azure Function API app](create-function-api-app.md)
* [GitHub Action Workflow syntax](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions)
* [SWA configuration](/azure/static-web-apps/configuration)
* [SWA CLI options](https://github.com/azure/static-web-apps-cli#configuration)