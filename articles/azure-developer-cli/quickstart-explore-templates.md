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

# Explore and customize an Azure Developer CLI Template

In this quickstart, you'll explore and customize the **`hello-azd`** Azure Developer CLI template. **hello-azd** provides a simple starting point for building and deploying applications to Azure using the Azure Developer CLI (`azd`). This quickstart expands on the concepts shown in the [Quickstart - Deploy an azd template](/azure/developer/azure-developer-cli/get-started) article, so it's recommended that you complete that quickstart first, or already have some experience using `azd`.

## Perequisites

- [Install the Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd) on your local machine
- [Install Visual Studio Code](https://code.visualstudio.com/download) or your editor of choice
  
  OR

- Have access to GitHub Codespaces

[!INCLUDE [azd-template-structure](includes/azd-template-structure.md)]

## Access the sample template

`hello-azd` is a sample template that's designed to showcase essential features of `azd`. The template provides a fully functional app you can deploy to Azure using a single command. The app includes a friendly user interface with information about `azd` and a small demo tool that allows you to upload and view support tickets.

The template supports the following features:

- Packages and deploys a containerized app to Azure Container Apps
- Creates the Azure resources needed by the app, such as an Azure Cosmos DB database
- Can automatically create a CI/CD pipeline using the `azd pipeline config` command

Follow the steps below to access the template so you can explore and customize it in the later sections.

## [Codespaces](#tab/codespaces)

1. Open the [hello-azd template repository](https://github.com/Azure-Samples/hello-azd) on GitHub.
2. Click the **Code** button and select **Codespaces**.
3. Create a new Codespace to launch a fully configured development environment in your browser.

## [Visual Studio Code](#tab/vs-code)

1. Clone the repository to your local machine:

   ```bash
   azd init -t hello-azd
   ```

2. Open the project folder in Visual Studio Code:

   ```bash
   code hello-azd
   ```

---

## Explore the template

With the template open in your tool of choice, you can browse the folder structure to explore how `azd` templates work. For example, complete the following tasks:

1. Expand the `src` folder to view the source code of the app.
    - The `hello-azd` template includes a containerized .NET Blazor app that provides a simple UI to learn about `azd` and manage sample ticket data. `azd` also supports other languages like JavaScript and Python.
    - When you run the template, the Blazor app is packaged as a container image and deployed to Azure Container Apps.

1. Expand the `infra` folder to explore the infrastructure as code files.
    - This template uses Bicep files (`.bicep`) to create Azure resources, but you can also use Terraform (`.tf`).
    - The `main.bicep` file orchestrates resource provisioning. Browse the contents of this file for examples of how to create app resources such as an Azure Storage account or an Azure Container App.

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

1. At the root of the template, open the `azure.yaml` file to view essential template configurations:
    - The template defines one service called `aca`.
    - The `aca` service configuration instructs `azd` to package and deploy the source code in the `src` folder to the Azure Container App provisioned by the Bicep modules you explored previously.
    - The `docker` configurations instruct `azd` to package and deploy the app as a container.

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

Complete the following steps to make these changes:

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

After making your changes, use the `azd up` command to provision and deploy the app resources:

1. Open a terminal in the project directory.
1. Run the following command:

   ```azdeveloper
   azd up
   ```

   This command will:

   - Package the app for deployment
   - Provision the required Azure resources
   - Deploy your application with the updated changes
   - Print the URL to access your application

        > [!NOTE]
        > If you haven't signed-in already, you will need to run the `azd auth login` to authenticate `azd` with your Azure account.

1. Open the URL printed in the `azd` console output logs in your browser to see your updated application live.

    :::image type="content" source="media/get-started/explore-templates-header.png" alt-text="A screenshot showing the updated app header.":::

1. You can also navigate to the created storage account in the Azure portal to view the two blob containers that were created.

    :::image type="content" source="media/get-started/explore-templates-blob-container.png" alt-text="A screenshot showing the created blob containers.":::

## Conclusion

In this quickstart, you explored the structure of the `hello-azd` template, customized its application and infrastructure, and deployed it to Azure using the Azure Developer CLI. For more advanced scenarios, explore additional templates or dive deeper into the `azd` documentation.

## Next steps

- [What are Azure Developer CLI commands?](/azure/developer/azure-developer-cli/azd-commands)
- [What are Azure Developer CLI templates?](/azure/developer/azure-developer-cli/azd-templates)
- [Create Azure Developer CLI tempaltes overview](/azure/developer/azure-developer-cli/make-azd-compatible)
