---
title: include file tutorial-04.md
description: include file tutorial-04.md
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---

In this section of the tutorial, you create the Azure Static web app resource, configure the GitHub action pipeline, configure the cloud application, then view the application in a browser.

## Create Static web app resource 

Use the Visual Studio Code explorer extension to create a Static web app resource. In order for the following steps to work, you must have a repository on GitHub, with at least one branch. 

1. Navigate to the Azure Static Web Apps (preview) extension. Right-click on the subscription then select `Create Static Web App...`.

    :::image type="content" source="../../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-static-web-resource.png" alt-text="Navigate to the Azure Static Web Apps (preview) extension. Right-click on the subscription then select `Create Static Web App...`.":::

1. Authorize GitHub to have access to Visual Studio Code. This is necessary because the extension is going to make changes to your GitHub repo for you.  

    :::image type="content" source="../../media/tutorial-browser-file-upload/authorize-github-access-visual-studio-code-github-action-pipeline.png" alt-text="Authorize GitHub to have access to Visual Studio Code. This is necessary because the extension is going to make changes to your GitHub repo for you.":::

1. Follow the prompts using the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new static web app.| Enter a value such as `fileuploadappyourname`. Replace `yourname` with your lowercase name or unique ID. <br>Each Azure resource resides in an Azure resource group. This is a logical group to help you manage resources. That management can be all resources within a project or team, as an example. This resource is created in a resource group with the same name. |
    |Choose branch for repository.| Select **main** as the branch to pull into the status web app. |
    |Select the location of your application code| Select **/** meaning the root of the folder. |
    |Select the location of your Azure Functions code |Select **Skip for now**|
    |Enter the path of your build output|**Build** should already be selected. Press **Enter**. The React create-react-app builds into the **build** directory so there isn't a reason to change this. |
    |Select a location for new resources.|Select a location close you to.|


    This resource creation process is building the app as part of a GitHub action in your repo. The process is unaware that the React app needs to be built with the npm command, `npm run build`. We'll fix that but before we do, let's clean up the repo. 

## Clean up the code for security reasons

The resource name and SAS token are hard-coded strings. This isn't secure and not how to handle this type of data for a static web app. Copy these values to a text file then remove them from the code file. 

1. Currently, the SAS token is hard-coded in the `src/uploadToBlob.ts` file. That isn't secure so copy the token, making sure to remove it from the code. When you are done, you should have the token stored locally for a few mintues, such as a text file, and the variable in the code file should be set back to an empty string. We can configure the static web app to use an app setting (environment variable) for the SAS token later.

    Your code for the sas token should look like:

    ```typescript
    const sasToken = process.env.storagesastoken || "";
    ```

1. Copy the resource name to the text file and remove it from the `src/uploadToBlob.ts` file. 

    Your code for the resource name should look like:

    ```typescript
    const storageAccountName = process.env.storageresourcename || "";
    ```

1. You may notice that a `/.vscode/settings.json` file is in your repo. Check the file in with the GitHub feature in Visual Studio Code. This file doesn't contain any security information. 

    ```json
    {
        "staticWebApps.appSubpath": "/",
        "staticWebApps.apiSubpath": "",
        "staticWebApps.appArtifactSubpath": "build"
    }
    ```

## Configure the pipeline to build the app successfully

The pipeline doesn't correctly build the app yet. To fix that, get the changes from the remote repo, which Visual Studio Code made while creating this specific resource. 

1. Pull down the changes from your remote repository to your local computer. You can use the Git features built into Visual Studio Code.

    :::image type="content" source="../../media/tutorial-browser-file-upload/visualstudiocode-github-pull.png" alt-text="Pull down the changes from your remote repository to your local computer. You can use the Git features built into Visual Studio Code.":::

    If you look at your repository log (`git log` at the terminal), you'll see the entry from Visual Studio Code:

    :::image type="content" source="../../media/tutorial-browser-file-upload/git-terminal-log-vscode-add-workflow.png" alt-text="If you look at your repository log (`git log` at the terminal), you'll see the entry from Visual Studio Code.":::

1. The resource creation process added a `.github/workflows` folder. Open the `*.yml` file. This file defines the current GitHub actions build process. 

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
            uses: Azure/static-web-apps-deploy@v0.0.1-preview
            with:
              azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_WITTY_POND_0E3BCDF1E }}
              repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
              action: "upload"
              ###### Repository/Build Configurations - These values can be configured to match you app requirements. ######
              # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
              app_location: "/" # App source code path
              api_location: "api" # Api source code path - optional
              app_artifact_location: "build" # Built app content directory - optional
              ###### End of Repository/Build Configurations ######
    
      close_pull_request_job:
        if: github.event_name == 'pull_request' && github.event.action == 'closed'
        runs-on: ubuntu-latest
        name: Close Pull Request Job
        steps:
          - name: Close Pull Request
            id: closepullrequest
            uses: Azure/static-web-apps-deploy@v0.0.1-preview
            with:
              azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_WITTY_POND_0E3BCDF1E }}
              action: "close"
    ```

1. The first job, `build_and_deploy_job`, is the build for the React client app. At the bottom of that job, add a [custom build command](/azure/static-web-apps/github-actions-workflow#custom-build-commands) in the section `with`. Add the following line to tell the build pipeline that an npm script is used to build the react app:

    ```yml
    app_build_command: npm run build
    ```

1. Commit the file with a comment such as `Fix build pipeline to run npm script`. 

    :::image type="content" source="../../media/tutorial-browser-file-upload/visualstudiocode-github-commit-pipeline-file.png" alt-text="Commit the file with a comment such as `Fix build pipeline to run npm script`.":::

1. Push the build action commit to the remote repository. 

    :::image type="content" source="../../media/tutorial-browser-file-upload/visualstudiocode-github-push-commit-remote.png" alt-text="Push the build action commit to the remote repository.":::

    This change kicked off a GitHub build action on your remote repository.

1. Open your remote GitHub repository in a browser, select **Actions**, then watch for a build notice. The job should complete successfully. 

:::image type="content" source="../../media/tutorial-browser-file-upload/github-action-build-pipeline-success.png" alt-text="Open your remote GitHub repository in a browser, select Actions, then watch for a build notice. The job should complete successfully.":::

## Configure your static web app for CORS and the SAS token

1. Open the [Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseAll) then select your  resource.
1. In the **Settings** section, select **CORS**. 




## Want to know more? 

