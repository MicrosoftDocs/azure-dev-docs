---
title: Deploy GraphQL Azure static web app 
description: Learn how to deploy to Azure Static Web Apps with VS Code.
ms.topic: how-to
ms.date: 07/14/2021
ms.custom: devx-track-js
---

# 5. Deploy to Azure Static web app

In this article, learn how to deploy to Azure Static Web Apps with VS Code.

Azure Static Web Apps pulls the information and files for deployment from GitHub using your fork of the samples repository.  


## Create a Static Web App in Visual Studio Code

1. Select **Azure** from the Activity Bar, then select **Static Web Apps** from the Side bar. 

1. If you see a pop-up window in VS Code asking which branch you want to deploy from, select the default branch, **main**. 

    This setting means only changes you commit to that branch are deployed to your static web app. 

1. If you see a pop-up window asking you to commit your changes, do not do this. The sample should be ready to deploy without changes.

    To roll back the changes, in VS Code select the Source Control icon in the Activity bar, then select each changed file in the Changes list and select the **Discard changes** icon.

1. Right-click on the subscription name then select **Create Static Web App (Advanced)**.    

1. Follow the prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |Enter the name for the new Static Web App.|Create a unique name for your resource. For example, you can prepend your name to the repository name such as, `joansmith-azure-graphql-trivia-game`. |
    |Select a resource group for new resources.|Use the resource group you created for your Cosmos DB database.|
    |Select a SKU| Select the free SKU for this tutorial.|
    |Choose build preset to configure default project structure.|Select **React**|
    |Select the location of your application code|`/`|
    |Select the location of your Azure Function code|`/api`<br><br>This is the path, from the root of the repository, to your Azure Function app. |
    |Enter the path of your build output...|`dist`<br><br>This is the path, from your Azure Static web app, to your generated files.|
    |Select a location for new resources.|Select a region close to you.|

1. The resource is created, select **Open Actions in GitHub** from the Notifications. This opens a browser window pointed to your forked repo. 

    The list of actions indicates your web app, both client and functions, were successfully pushed to your Azure Static Web App. 

    Wait until the build and deployment complete before continuing. This may take a minute or two to finish.

## Add configuration settings in Azure portal

The Azure Function app won't connect to your Cosmos DB database until the connection string is configured for the remote Function app. 

1. Select **Azure** from the Activity Bar. 
1. Right-click on your Static web app resource then select **Open in Portal**.
1. Select **Configuration** then select **+ Add**.
1. Add each of the following settings:

    |Setting|Your Search resource value|
    |--|--|
    |CosmosDB|Your CosmosDB connection string|

1. Select **Save** to save the settings. 
1. Return to VS Code. 
1. In the Azure explorer, refresh your Static web app to see the Static web app's application settings. 

## Use your Static web app

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon.
1. In the Side bar, **right-click on your Azure subscription** under the `Static web apps` area and find the Static web app you created for this tutorial.
1. Right-click the Static Web App name and select **Browse site**.
1. Select **Open** in the pop-up dialog.
1. In the browser, start and play the trivia game. 

## Clean up resources

To clean up the resources created in this tutorial, delete the resource group.

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, **right-click on your Azure subscription** under the `Resource Groups` area and find the resource group you created for this tutorial.
1. Right-click the resource group name then select **Delete**.
    This deletes both the Search and Static web app resources.
1. If you no longer want the GitHub fork of the sample, remember to delete that on GitHub. Go to your fork's **Settings** then delete the fork. 

## Next steps

* [Upload an image to an Azure Storage blob](../../../../tutorial/browser-file-upload-azure-storage-blob.md)
