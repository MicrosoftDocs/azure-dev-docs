---
title: Create Static web app resource
description: Create the Static Web app resource with a Visual Studio Code extension for that service.
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---

# 4. Create Azure Static Web app resource

In this section of the tutorial, create the Static Web app resource with a Visual Studio Code extension for that service and push local code to your remote repository to build, then deploy the app to Azure.

## Create a new branch dedicated to deployment

The Azure Static web app receives a build from a specific branch of your GitHub repository. Currently, the tutorial used the `main` branch. In a new terminal in Visual Studio Code, create a `live` branch dedicated for building and deploying the app to Azure.

```bash
git checkout -b live
```

## Push the live branch to GitHub

In the Visual Studio Code terminal, push the local branch, `live` to your remote repository.

```bash
git push origin live
```

## Create a Static Web app resource

1. Select the **Azure** icon, then right-click on the **Static Web Apps** service, then select **Create Static web app...**. 

    :::image type="content" source="../../media/static-web-app/visualstudiocode-storage-extension-create-static-web-resource.png" alt-text="Visual Studio Code screenshot with Visual Studio extension":::

1. Authorize GitHub to have access to Visual Studio Code. This is necessary because the extension is going to make changes to your GitHub repo for you.  

    :::image type="content" source="../../media/static-web-app/authorize-github-access-visual-studio-code-github-action-pipeline.png" alt-text="Authorize GitHub to have access to Visual Studio Code. This is necessary because the extension is going to make changes to your GitHub repo for you.":::

1. Enter a name for your static web app, `Demo-ComputerVisionAnalyzer`.  
1. Select `live` as the branch name. 
1. Select `/`, the root, as the location of the application code.
1. Select **Skip for now** for the location of the Azure Functions code.
1. Enter `build` for the location of your build output.
1. Select an Azure location close to you.  

## Update the GitHub action with secret environment variables

The Computer Vision key and endpoint are in the repository's secrets collection but are not in the GitHub action yet. This step adds the key and endpoint to the action.

1. Pull down the changes made from creating the Azure resource, to get the GitHub action file.

    ```bash
    git pull origin live
    ```

1. In the Visual Studio Code editor, edit the GitHub Action file found at `./.github/workflows/` to add the secrets. 

    :::code language="yml" source="~/../js-e2e-client-cognitive-services/.github/workflows/sample-github-workflow.yml" highlight="34-36" :::

    
1. Add and commit the change to the local `live` branch.

    ```bash
    git add . && git commit -m "add secrets to action"
    ```

1. Push the change to the remote repository, starting a new build-and-deploy action to your Azure Static web app.

    ```bash
    git push origin live
    ```

## View the GitHub Action build process

1. In a web browser, open your GitHub repository for this tutorial, and select **Actions**. 

1. Select the top build in the list, then select **Build and Deploy Job** on the left-side menu to watch the build process. Wait until the **Build And Deploy** successfully finishes.

    :::image type="content" source="../../media/static-web-app/browser-screenshot-github-action-build-react-computer-vision-app.png" alt-text=" Select the top build in the list, then select `Build and Deploy Job` on the left-side menu to watch the build process. Wait until the build successfully finishes.":::

## View web site

1. In Visual Studio Code, select the **Azure** icon in the far right menu, then select your Static web app, then right-click **Browse site**, then select **Open** to view the public static web site. 

:::image type="content" source="../../media/static-web-app/visualstudiocode-browse-static-web-app.png" alt-text="Select `Browse site`, then select `Open` to view the public static web site. ":::

You can also find the URL for the site at:
* the Azure portal for your resource, on the **Overview** page.
* the GitHub action's build-and-deploy output has the site URL at the very end of the script 

:::image type="content" source="../../media/static-web-app/github-action-build-pipeline-success-site-url.png" alt-text="Partial screenshot of GitHub action's build-and-deploy output has the site URL at the very end of the script":::

## Next step

> [!div class="nextstepaction"]
> [Review React code and Cognitive Services Computer Vision analysis](add-computer-vision-react-app.md)