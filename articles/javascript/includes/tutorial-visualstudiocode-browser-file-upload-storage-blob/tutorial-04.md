---
title: include file tutorial-04.md
description: include file tutorial-04.md
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---

In this section of the tutorial, you create the Azure Static web app resource, configure the GitHub action pipeline, configure the cloud application, then view the application in a browser.

## Create Static web app resource 

Use the Visual Studio Code explorer extension to create a Static web app resource. 

1. Navigate to the Azure Static Web Apps (preview) extension. Right-click on the subscription then select `Create Static Web App...`.

    :::image type="content" source="../../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-static-web-resource.png.png" alt-text="Navigate to the Azure Static Web Apps (preview) extension. Right-click on the subscription then select `Create Static Web App...`.":::

1. Follow the prompts using the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new static web app.| Enter a value such as `fileuploadappyourname`. Replace `yourname` with your lowercase name or unique ID. <br>Each Azure resource resides in an Azure resource group. This is a logical group to help you manage resources. That management can be all resources within a project or team, as an example. This resource is created in a resource group with the same name. |
    |Choose branch for repository.| Select **main** as the branch to pull into the status web app. |
    |Select the location of your application code| Select **/** meaning the root of the folder. |
    |Select the location of your Azure Functions code |Select **Skip for now**|
    |Enter the path of your build output|**Build** should already be selected. Press **Enter**. The React create-react-app builds into the **build** directory so there isn't a reason to change this. |
    |Select a location for new resources.|Select a location close you to.|

1. When the static web app creation process is complete. This process is building the app as part of a GitHub action in your repo. 

## Configure the pipeline to build the app successfully

The pipeline doesn't correctly build the app yet. Let's fix that.

1. The resource creation process added a `.github/workflows` folder. Pull down this change to your local computer. 

    ```bash
    git pull 
    ```

1. Right-click on the resource in the Azure Storage extension, select **Copy Primary Key**. You will need this **Storage account key** later.


## Want to know more? 

