---
title: Deploy GraphQL to Static Web Apps 
description: Learn how to deploy to Static Web Apps with Visual Studio Code.
ms.topic: how-to
ms.date: 07/26/2021
ms.custom: devx-track-js
---

# 5. Deploy to Static Web Apps

In this article, learn how to deploy to Static Web Apps with Visual Studio Code. Static Web Apps pulls the information and files for deployment from GitHub by using your fork of the samples repository.  


## Create an app in Visual Studio Code

Here's how:

1. Select **Azure** from the activity bar, and then select **Static Web Apps** from the side bar. 

1. If you see a pop-up window in Visual Studio Code asking which branch you want to deploy from, select the default branch, **main**. 

    This setting means that only changes you commit to that branch are deployed to your static web app. 

1. If you see a pop-up window asking you to commit your changes, don't do this. The sample should be ready to deploy without changes.

    To roll back the changes, in Visual Studio Code, select the **Source Control** icon in the activity bar. Then select each changed file in the **Changes** list, and select the **Discard changes** icon.

1. Right-click on the subscription name, and then select **Create Static Web App (Advanced)**.    

1. Follow the prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |*Enter the name for the new static web app.*|Create a unique name for your resource. For example, you can prepend your name to the repository name, such as `joansmith-azure-graphql-trivia-game`. |
    |*Select a resource group for new resources.*|Use the resource group that you created for your database created with Azure Cosmos DB.|
    |*Select a SKU*| Select the free SKU for this tutorial.|
    |*Choose build preset to configure default project structure.*|Select **React**.|
    |*Select the location of your application code*|`/`|
    |*Select the location of your Azure Functions code*|`/api`<br><br>This is the path from the root of the repository to your function app. |
    |*Enter the path of your build output...*|`dist`<br><br>This is the path from your app to your generated files.|
    |*Select a location for new resources.*|Select a region close to you.|

1. After the resource is created, select **Open Actions in GitHub** from the notifications. This opens a browser window pointed to your forked repo. 

    The list of actions indicates that your web app, both client and function, were successfully pushed to Static Web Apps. 

    Wait until the build and deployment complete before continuing. This might take a minute or two to finish.

## Add configuration settings in the Azure portal

The function app won't connect to your database created with Azure Cosmos DB until the connection string is configured for the remote function app. 

1. Select **Azure** from the activity bar. 
1. Right-click on your static web app resource, and then select **Open in Portal**.
1. Select **Configuration** > **+ Add**.
1. Add each of the following settings:

    |Setting|Your search resource value|
    |--|--|
    |`CosmosDB`|Your `CosmosDB` connection string|

1. Select **Save** to save the settings. 
1. Return to Visual Studio Code. 
1. In the Azure explorer, refresh your static web app to see the application settings. 

## Use your static web app

1. In Visual Studio Code, open the [activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon.
1. In the side bar, under **Static web apps**, right-click on your Azure subscription. Then find the static web app you created for this tutorial.
1. Right-click the static web app name, and select **Browse site**.
1. Select **Open** in the pop-up dialog.
1. In the browser, start and play the trivia game. 

## Clean up resources

To clean up the resources created in this tutorial, delete the resource group.

1. In Visual Studio Code, open the [activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the side bar, under **Resource Groups**, right-click on your Azure subscription. Then find the resource group you created for this tutorial.
1. Right-click the resource group name, and then select **Delete**. This deletes both the search and static web app resources.
1. If you no longer want the GitHub fork of the sample, remember to delete that on GitHub. Go to your fork's **Settings**, and then delete the fork. 

## Next steps

* [Upload an image to an Azure Storage blob](../../../../tutorial/browser-file-upload-azure-storage-blob.md)
