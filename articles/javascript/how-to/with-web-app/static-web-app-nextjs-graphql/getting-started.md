---
title: "Trivia game: create Next.js GraphQL trivia game"
description: Create a Next.js GraphQL app with server-side rendering to generate a trivia game.
ms.topic: how-to
ms.date: 01/19/2023
ms.custom: devx-track-js, devx-graphql
#intent: Create Next.js GraphQL app with SSR to deploy as SWA hybrid. 
---


# Trivia game: Create a Next.js GraphQL app with server-side rendering

Build and deploy a Next.js app to Static Web Apps as a Next.js hybrid application. A hybrid application provides for both the client application and the server-side rendering functionality of the app. 

## What the sample app does

The sample solution is a Trivia game. You're asked a series of 5 trivia questions. At the end of the game, your score is displayed and you can start the game again. Bonus for multi-lingual players, start and play the game in a different language.

When deployed, the sample solution flow includes:

1. Get random trivia question, the correct answer, and three incorrect answers from database.
1. Display question. 
1. After answered, display if the answer was correct.
1. Move to next question. 

## Where is Azure in this app

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

## Fork the sample solution

A complete Next.js solution is available so you can follow along without worrying about correctly entering code. Download or clone the sample codebase to your local workstation. 

1. Fork the sample solution so you have a version under your own account. This is necessary for deploying from GitHub to Azure Static Web Apps in the final step of this series. 

    In a browser, use the following URL to fork into your account, [https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/fork](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/fork). Finish the steps to complete the fork.

1. Clone your fork to your local computer in a command prompt or bash terminal. Change the following command to use your account name.

    ```bash
    git clone https://github.com/YOUR-ACCOUNT-NAME/js-e2e-graphql-nextjs-triviagame.git
    ```

1. Go into the project directory. 

    ```bash
    cd js-e2e-graphql-nextjs-triviagame
    ```

1. Install the dependencies:

    ```Console
    npm install
    ```

## Create a resource group

Create a resource group named `msdocs-python-cloud-etl-rg` in a region near you. A resource group allows you to control security and billing limited to the resource group. 

[!INCLUDE [create resource group 3-tab](../../../../includes/create-resource-group.md)]

## Next step

> [!div class="nextstepaction"]
> [Work with Cosmos DB database >>](create-database-upload-data.md)