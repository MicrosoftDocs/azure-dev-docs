---
title: Explore and Customize an Azure Developer CLI Template
description: Learn the basics of how to work with and customize Azure Developer CLI templates.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/10/2025
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Explore and Customize an Azure Developer CLI Template

In this quickstart, you'll explore and customize the **`hello-azd`** Azure Developer CLI template. **hello-azd** provides a simple starting point for building and deploying applications to Azure using the Azure Developer CLI (`azd`). This quickstart expands on the concepts shown in the [Quickstart - Deploy an azd template](/azure/developer/azure-developer-cli/get-started) article, so it's recommended that you complete that quickstart first, or already have some experience using `azd`.

## Perequisites

- [Install the Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd) on your local machine
- [Install Visual Studio Code](https://code.visualstudio.com/download) or your editor of choice
  OR
- Have access to GitHub Codespaces

[!INCLUDE [azd-template-structure](includes/azd-template-structure.md)]

## Access the template

The `hello-azd` template provides a simple yet powerful starting point for building and deploying applications to Azure. Follow the steps below to access the template so you can explore and customize it in the later sections.

## [Codespaces](#tab/codespaces)

1. Navigate to the [hello-azd template repository](https://github.com/Azure-Samples/hello-azd) on GitHub.
2. Click the **Code** button and select **Codespaces**.
3. Create a new Codespace or open an existing one. This will launch a fully configured development environment in your browser.

## [Visual Studio Code](#tab/vs-code)

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Azure-Samples/hello-azd.git
   ```

2. Open the project folder in Visual Studio Code:

   ```bash
   code hello-azd
   ```

3. Ensure you have the Azure Developer CLI and other dependencies installed locally.

---

## Explore the template

`hello-azd` is a sample template that's designed to showcase essential features of `azd`. The template provides a fully functional app you can deploy to Azure using a single command. The app includes a friendly user interface with information about `azd` and a small demo tool that allows you to upload and view support tickets. 

The template supports the following features:

- Packages and deploys a containerized app to Azure Container Apps
- Creates the Azure resources needed by the app, such as an Azure Storage Account and an Azure Cosmos DB database
- Can automatically create a CI/CD pipeline using the `azd pipeline config` command

With the template open in your tool of choice, you can browse the folder structure to explore how `azd` templates work. For example, complete the following tasks:

1. Expand the `src` folder to explore the source code of the app:
    - The `hello-azd` template features a containerized .NET Blazor app that provides a simple UI to learn about `azd` and manage sample ticket data.
    - During the `azd up` workflow, a container image for the Blazor app is created and deployed to Azure Container Apps.
    - `azd` supports other languages and frameworks for both front-end and back-end development, such as Python or JavaScript.

1. Expand the `infra` folder to explore the infrastructure as code files.
    - This template uses Bicep files (`.bicep`) to create Azure resources, but you can also use Terraform (`.tf`).
    - The `main.bicep` file orchestrates resource provisioning. Browse the contents of this file for examples of how to create app resources such as an Azure Storage account or an Azure Container App.
    - The code in the `main.bicep` file references files in the `core` and `app` folders to create resources.
        - The `core` folder contains reusable Bicep modules that any template can use.
        - The `app` folder contains Bicep files specific to the `hello-azd` template.

    ```bicep
    // Create a storage account
    module storage './core/storage/storage-account.bicep' = {
        name: 'storage'
        scope: rg
        params: {
        name: !empty(storageAccountName) ? storageAccountName : '${abbrs.storageStorageAccounts}${resourceToken}'
        location: location
        tags: tags
        containers: [
            {
            name: 'attachments'
            }
        ]
        }
    }
    ```

1. Open the `azure.yaml` file to view essential template configurations:
    - The template defines one service called `aca`.
    - The `aca` service configuration instructs `azd` to package and deploy the source code in the `src` folder to the Azure Container App provisioned by the Bicep modules you explored previously.
    - The docker configurations instruct `azd` to package and deploy the app as a container.

    ```yml
    metadata:
      template: hello-azd-dotnet
    name: azd-starter
    services:
      aca:
        project: ./src
        language: csharp
        host: containerapp
        docker:
          path: ./Dockerfile
    ```

## Update the Template

You can make changes to the template to influence the deployed app and resources. In this example, you'll make two small changes to the app and explore the deployed results:

- Update the app header welcome text to your own message
- Update the created storage account so that it creates an additional blob container

1. In the `src > Components > Pages` folder, open the `Home.razor` component.
1. Replace the *Hello, Azure Developer CLI!* header text at the top of the page with a different message, such as *Hello, customized template!* and save your changes.

    ```razor
    <MudText Typo="Typo.h2" GutterBottom="true">Hello, customized template!</MudText>
    ```

1. In the `infra` folder, open the `main.bicep` file.
1. Locate the block of Bicep code around line 75 that creates a storage account and a blob container:

    ```bicep
    // Create a storage account
    module storage './core/storage/storage-account.bicep' = {
      name: 'storage'
      scope: rg
      params: {
        name: !empty(storageAccountName) ? storageAccountName : '${abbrs.storageStorageAccounts}${resourceToken}'
        location: location
        tags: tags
        containers: [
          {
            name: 'attachments'
          }
        ]
      }
    }
    ```

    Replace the code with the following snippet that creates an additional container and save your changes:

    ```bicep
    // Create a storage account
    module storage './core/storage/storage-account.bicep' = {
      name: 'storage'
      scope: rg
      params: {
        name: !empty(storageAccountName) ? storageAccountName : '${abbrs.storageStorageAccounts}${resourceToken}'
        location: location
        tags: tags
        containers: [
          {
            name: 'attachments'
          },
          {
            name: 'archive'
          }
        ]
      }
    }

## Run the Template

After making your changes, use the `azd up` command to provision resources and deploy the application:

1. Open a terminal in your editor that is set to the project directory.
1. Run the following command:

   ```azdeveloper
   azd up
   ```

   This command will:

   - Package your app for deployment
   - Provision the required Azure resources.
   - Deploy your application with the updated changes.
   - Provide the URL to access your application.

    > [!NOTE]
    > If you haven't signed-in already, you will need to run the `azd auth login` to authenticate `azd` with your Azure account.

1. Open the URL printed in the `azd` console output logs in your browser to see your updated application live.

    :::image type="content" source="media/get-started/explore-templates-header.png" alt-text="A screenshot showing the updated app header.":::

1. You can also navigate to the created storage account in the Azure portal to view the two blob containers that were created.

    :::image type="content" source="media/get-started/explore-templates-blob-container.png" alt-text="A screenshot showing the created blob containers.":::

That's it! You've successfully explored, customized, and deployed the `hello-azd` template.
