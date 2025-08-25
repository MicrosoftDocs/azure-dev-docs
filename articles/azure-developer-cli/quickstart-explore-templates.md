---
title: Explore and customize an Azure Developer CLI Template
description: Learn the basics of how to work with and customize Azure Developer CLI templates.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/14/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Explore and customize an Azure Developer CLI template

In this quickstart, you explore and customize an Azure Developer CLI template. The **hello-azd** template provides a simple starting point for building and deploying applications to Azure using the Azure Developer CLI (`azd`). This quickstart expands on the concepts demonstrated in the [Quickstart - Deploy an azd template](/azure/developer/azure-developer-cli/get-started) article.

## Prerequisites

To complete this quickstart in your browser you'll need:

- Access to GitHub Codespaces

Alternatively, to complete this quickstart using local tooling:

- [The Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed on your local machine
- [Visual Studio Code](https://code.visualstudio.com/download) or your editor of choice
- Docker desktop installed on your local machine


[!INCLUDE [azd-template-structure-minimal](includes/azd-template-structure-minimal.md)]

## Set up the sample template

`hello-azd` is a sample template designed to showcase essential features of `azd` that you can deploy to Azure using a single command. The template provides a friendly UI with information about `azd` and a small demo tool that allows you to upload and view support tickets.

The template supports the following features:

- Packages and deploys a containerized app to Azure Container Apps
- Creates the Azure resources needed by the app, such as an Azure Cosmos DB database
- Can automatically [Configure a CI/CD pipeline](configure-devops-pipeline.md) using the `azd pipeline config` command

Follow these steps to set up the template:

## [Codespaces](#tab/codespaces)

1. Open the [hello-azd template repository](https://github.com/Azure-Samples/hello-azd) on GitHub.
1. Select the **Code** button and then select **Codespaces**.
1. Create a new Codespace to launch a fully configured development environment in your browser. You might need to wait a moment for the environment to initialize.
1. After the Codespaces environment loads, initialize the `azd` template using the `azd init` command:

    ```bash
   azd init -t hello-azd
   ```

1. When prompted, enter a name for the `azd` environment, such as `helloazd`.

## [Visual Studio Code](#tab/vs-code)

1. In an empty directory on your local machine, clone and initialize the repository using the `azd init` command:

   ```bash
   azd init -t hello-azd
   ```

1. When prompted, enter a name for the `azd` environment, such as `helloazd`.

1. Open the project folder in Visual Studio Code:

   ```bash
   code .
   ```

---

## Explore the template

With the template open in your tool of choice, you can browse the folder structure to explore how `azd` templates work:

1. Expand the `src` folder to view the source code of the app.
    - The `hello-azd` template includes a containerized .NET app that provides a simple UI to learn about `azd` and manage sample ticket data. `azd` also supports other languages like JavaScript and Python.
    - When you run `azd up`, the app is packaged as a container image and deployed to Azure Container Apps.

1. Expand the `infra` folder to explore the infrastructure as code files.
    - This template uses Bicep files (`.bicep`) to create Azure resources, but you can also use Terraform (`.tf`).
    - The `main.bicep` file creates Azure resources by referencing other Bicep modules in the `infra` folder, such as an Azure Storage account:

        ```bicep
        // Omitted...

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

        // Omitted...
        ```

1. At the root of the template, open the `azure.yaml` file to view essential template configurations:
    - The template defines one service called `aca`.
    - The `aca` service configuration instructs `azd` to package and deploy the source code in the `src` folder to the Azure Container App provisioned by the Bicep modules you explored previously.
    - The `docker` configurations instruct `azd` to package and deploy the app as a container.

        ```yml
        metadata:
          template: hello-azd-dotnet  # Specifies the template being used
        name: azd-starter  # Name of the project
        services:
          aca:  # Define the Azure Container App service
            project: ./src  # Path to the source code
            language: csharp  # Programming language
            host: containerapp  # Hosting service
            docker:
              path: ./Dockerfile  # Location of the Dockerfile
        ```

## Update the Template

You can make changes to the template to influence the deployed app and resources. In this example, you make two small changes to the app and explore the deployed results:

- Update the app header welcome text to your own message
- Update the created storage account so that it creates two blob containers instead of one

To make these changes, complete the following steps:

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

    Replace the code with the following snippet:

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

1. To provision and deploy the template, run the `azd up` command:

   ```azdeveloper
   azd up
   ```

   This command will:

   - Package the app for deployment
   - Provision the required Azure resources
   - Deploy your application with the updated changes
   - Print the URL for the deployed application

1. To see your updated application live, open the URL printed in the `azd` console output logs in your browser.

    :::image type="content" source="media/get-started/explore-templates-header.png" alt-text="A screenshot showing the updated app header.":::

1. To view the two blob containers that were created, navigate to the created storage account in the Azure portal.

    :::image type="content" source="media/get-started/explore-templates-blob-container.png" alt-text="A screenshot showing the created blob containers.":::

## Conclusion

In this quickstart, you explored the structure of the `hello-azd` template, customized its application and infrastructure, and deployed it to Azure using the Azure Developer CLI. For more advanced scenarios, explore other templates or dive deeper into the `azd` documentation.

## Next steps

- [What are Azure Developer CLI commands?](/azure/developer/azure-developer-cli/azd-commands)
- [What are Azure Developer CLI templates?](/azure/developer/azure-developer-cli/azd-templates)
- [Create Azure Developer CLI templates overview](/azure/developer/azure-developer-cli/make-azd-compatible)
