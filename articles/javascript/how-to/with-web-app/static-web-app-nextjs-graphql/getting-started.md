---
title: "Intro: Create Next.js GraphQL trivia game"
description: Create a Next.js GraphQL app with server-side rendering to generate a trivia game.
ms.topic: how-to
ms.date: 01/10/2023
ms.custom: devx-track-js
#intent: Create Next.js GraphQL app with SSR to deploy as SWA hybrid. 
---

# Create a Next.js GraphQL app with server-side rendering

Build and deploy a Next.js app to Static Web Apps as a Next.js hybrid application. A hybrid application provides for both the client application and the server-side rendering functionality of the app. 

## What the sample solution does

The sample solution is a Trivia game. You're asked a series of 10 trivia questions. At the end of the game, your score is displayed and you can start the game again. Bonus for multi-lingual players, start and play the game in a different language.

When deployed, the sample solution flow includes:

1. Get random trivia question, the correct answer, and three incorrect answers from database.
1. Display question. 
1. After answered, display if the answer was correct.
1. Move to next question. 

## Where is Azure in this sample solution

Azure provides three key parts to this solution:

* Hosting as a Static Web app with server-side rendering
* Translation services through Azure Text Translation
* Database services through Cosmos DB with the NoSQL API.

The Azure integration code for translation and databases is found in the [./azure](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/tree/main/azure) directory of the repository.

To upload the data to Cosmos DB, detailed in a separate step later in this article series, an [upload](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/azure/uploadData.ts) script is provided for you.

## Prerequisites

Make sure the following are installed on your local developer workstation:

- An Azure account with **an active subscription which you own**. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- [Node.js LTS supported by Azure Functions runtime](https://nodejs.org/en/download) - use the same Node.js version on your local workstation and the deployed Azure Function.
- [Azure CLI](/cli/azure/install-azure-cli): to remove resources after you completed the following procedure.
- For local development
    - [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
        - Visual Studio Code extensions:
            - [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.
            - [Azure Databases extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
    - Azurite: local Function app development can use [Azurite](https://www.npmjs.com/package/azurite) to satisfy the local.settings.json's requirement for `"AzureWebJobsStorage": "UseDevelopmentStorage=true"`.

## Get the sample solution

A complete Next.js solution is available so you can follow along without worrying about correctly entering code. Download or clone the sample codebase to your local workstation. 

1. Clone the sample solution:

    ```bash
    git clone https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame.git
    ```

1. Navigate to the application folder:

    ```bash
    cd js-e2e-graphql-nextjs-triviagame
    ```

1. Install the dependencies:

    ```Console
    npm install
    ```

## Create a resource group for your project

Create a resource group named `msdocs-python-cloud-etl-rg` in a region near you. A resource group allows you to control security and billing limited to the resource group. 

[!INCLUDE [create resource group 3-tab](../../../../includes/create-resource-group.md)]

## Next step

> [!div class="nextstepaction"]
> [Work with Cosmos DB database >>](create-database-upload-data.md)