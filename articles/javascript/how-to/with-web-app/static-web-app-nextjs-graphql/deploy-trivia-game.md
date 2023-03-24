---
title: "Trivia game: deploy to Static Web Apps"
description: Create a Static Web App resource for the trivia game.
ms.topic: how-to
ms.date: 01/19/2023
ms.custom: devx-track-js, devx-graphql
#intent: Create Next.js GraphQL app with SSR to deploy as SWA hybrid. 
---

# Trivia game: deploy to Static Web Apps

The trivia game deploys both client and server of the Next.js to Static Web Apps as a Next.js Hybrid application from your GitHub fork. When the app is deployed, you can see the managed function deployed in the Azure portal. 

## Create a Static Web App

Create a static web app in [this Static Web App tutorial](/azure/static-web-apps/deploy-nextjs-hybrid#create-a-static-web-app) with the following caveats

* Use your fork of the sample project. 
* Select **Next.js** from the Build Presets during the process.

When you create a Static Web App, it creates a GitHub action to deploy your app. 

## Verify the Next.js app deployed

1. Open the Azure portal with the following URL, [https://portal.azure.com](https://portal.azure.com).
1. Use the top search box to search for `Static Web Apps`.
1. Select your app from the list.
1. Select **Settings -> APIs** to see your API is deployed as a **managed** backend resource. Select the managed resource to see the name of the function is `next_function`.
1. In the Azure portal, on the **Overview** page, select **URL** to view your static web app in the browser.
1. The web app displays but the trivia game doesn't start. This is because the web app server doesn't know about the database and translation resource names and keys.  

## Configure your static web app

Configure web app server with logging and secrets.  

1. Open the Azure portal with the following URL, [https://portal.azure.com](https://portal.azure.com).
1. Use the top search box to search for `Static Web Apps`.
1. Select your app from the list.
1. On the **Overview** page, copy the **URL** value. You use this URL later to view your app in a browser. 

    If you look at it now, it won't work because the server doesn't know the Cosmos DB and Translator secrets.
1. Select **Settings -> Application Insights**. For **Enable Application Insights** select **Yes**, then **Save**. 

    This setting will help you see information about your Next.js server failures.

1. Select **Settings -> Configuration**.
1. Use the **+ Add** feature to add your secrets to the app. You can use the following secrets from your local `.env.local` file. 

    |Name|Value|
    |--|--|
    |AZURE_COSMOSDB_ENDPOINT|`https://YOUR-COSMOS-DB-RESOURCE-NAME.documents.azure.com:443/`, replace `YOUR-COSMOS-DB-RESOURCE-NAME` with your own Cosmos DB resource name.|
    |AZURE_COSMOSDB_KEY|Enter your Cosmos DB key value.|
    |AZURE_COSMOSDB_DATABASE_ID|`trivia`|
    |AZURE_COSMOSDB_CONTAINER_ID|`questions`|
    |AZURE_TRANSLATOR_KEY|Enter your Translator key, created in the **Global** region.|
    |AZURE_TRANSLATOR_ENDPOINT|`https://api.cognitive.microsofttranslator.com/`|

## Play the trivia game

Start and play the game for your deployed app. 

1. In a browser, paste the URL you copied from the Azure portal for your static web app.
1. Play through the game through to the end. 

## Troubleshooting

1. Verify that your static web app has the following configured:

* Application Insights is enabled
* Settings -> Configuration for your secrets
* Setting -> APIs lists a managed function named `next_function`

1. Verify your GitHub action finished successfully. 
1. Verify that your updated action with preview features enabled was successfully pushed to your fork on the **main branch**.
1. Review Application Insights logs for failures and exceptions. 

## Clean up

[!INCLUDE [3 ways to delete resource group](../../../includes/resource-group-remove.md)]

## Next step

* [Unsupported Next.js features during preview](/azure/static-web-apps/deploy-nextjs-hybrid#unsupported-features-in-preview)
