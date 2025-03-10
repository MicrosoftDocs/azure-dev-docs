---
title: Get started with the Azure Developer CLI compose feature
description: How to compose and build your apps using the Azure Developer CLI compose feature
author: alexwolfmsft
ms.author: alexwolf
ms.date: 11/15/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
---

# Get started with the Azure Developer CLI compose feature

The Azure Developer CLI (`azd`) composability (compose) feature enables you to progressively compose the Azure resources required for your app without manually writing Bicep code. Compose also uses [Azure Verified Modules (AVM)](https://aka.ms/avm) when possible, providing recommended practices using building blocks for Azure that are secure by design.

In this article, you learn:

- Key concepts about the `azd` compose feature
- How to work with the compose feature

> [!NOTE]
> The `azd` compose feature is currently in alpha and should not be used in production apps. Changes to Alpha features in subsequent releases may result in breaking changes. Visit the [azd feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning) and [feature stages](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/feature-stages.md) pages for more information. Select the **Feedback** button on the upper right to leave feedback about the `compose` feature and this article.

## What is the compose feature?

The Azure Developer CLI (azd) composability feature offers a new way to get started with azd. Before the compose feature, developers had two primary options to configure the Azure resources to provision and deploy an application.

- Start with a [prebuilt template](/azure/developer/azure-developer-cli/azd-templates), which defines resources and services that should be provisioned and deployed on Azure and then customize. Browse templates in the [AI template gallery](https://azure.github.io/ai-app-templates) or the [community gallery](https://azure.github.io/awesome-azd/)

- Start from an existing codebase following the instructions of [simplified init flow](/azure/developer/azure-developer-cli/start-with-app-code).

Any further customization required the user to modify the bicep files. 

The `azd` compose feature introduces a third option to add Azure resources to your apps. Developers use the `azd add` command to instruct `azd` to compose new Azure resources and update template configurations using simple prompt workflows. This feature is particularly useful for developers who want to avoid writing Bicep or using an existing template.

The `azd compose` feature supports adding resources for the following Azure Services:

- Azure AI Services models and Azure AI Foundry
- Azure Container Apps
- Azure Cosmos DB
- Azure Cosmos DB for MongoDB
- Azure Cosmos DB for PostgreSQL
- Azure Cache for Redis
- Azure Database for MySQL
- Azure Key Vault
- Azure OpenAI with Microsoft Entra ID authentication
- Azure Service Bus and Azure Event Hubs
- Azure Blob Storage

## Enable the compose feature

The `azd` compose feature is currently in alpha, which means you need to enable it manually. Visit the [azd feature stages](https://aka.ms/azd-feature-stages) page for more information.

```bash
azd config set alpha.compose on
```

## Work with the compose feature

Access `azd` compose features through the [`azd add`](/azure/developer/azure-developer-cli/reference#azd-add) command. The `azd add` command works with templates created using the following `azd init` workflows:

- **Use code in the current directory** (for apps that target Azure Container Apps for hosting)
- **Create a minimal project**

Templates initialized through the **Select a template** flow aren't currently supported. The `azd` compose feature manages infrastructure for you and isn't compatible with templates that have existing `infra` folder assets. Visit the [Generate the Bicep code](#generate-the-bicep-code) section and [template creation workflows](/azure/developer/azure-developer-cli/make-azd-compatible) page for more information.

Complete the following steps to add new resources to your template without writing any code:

1. In a terminal window, navigate to the root of your `azd` template.

1. Run the `azd add` command to add a new resource and start the compose workflow:

    ```bash
    azd add
    ```

1. Select one of the supported resources to add to your app. For this example, select database.

    ```output
    ? What would you like to add?  [Use arrows to move, type to filter]
      Azure OpenAI
    > Database
      Host service
    ```

1. For the type of database, select `PostgreSQL`.

    ```output
    ? Which type of database?  [Use arrows to move, type to filter]
      MongoDB
    > PostgreSQL
      Redis
    ```

1. Enter a name for the new resource, such as `azddb`.

    ```output
    ? Input the name of the app database (PostgreSQL)
    ```

1. If your app contains a service(s), `azd` prompts you to select the service(s) that uses this resource.

    ```output
    ? Select the service(s) that uses this resource
    > [✓]  webfrontend
    ```

1. `azd` generates a preview of the changes it will apply to the `azure.yaml` file. Press enter to accept and apply the changes.

    ```output
    Previewing changes to azure.yaml:
    
    +  azddata:
    +      type: db.postgres
    
       webfrontend:
           type: host.containerapp
           uses:
               - azddb
    +          - azddata
           port: 80
    ```

1. Run the `azd up` command to provision any changes made through the `azd add` command. In this example, `azd` provisions a PostgreSQL database in Azure.

1. Run the `azd add` command again to add other resources, such as an OpenAI service.

## Explore the azure.yaml file

`azure.yaml` is the configuration file that azd uses to manage your app. `azd` manages the services and resources composed through the `azd add` command using the corresponding `services` and `resources` nodes. Consider the following example of an `azure.yaml` file updated entirely through `azd add`:

```yml
name: azdcomposesample
metadata:
  template: azd-init@1.11.0
services:
  webfrontend:
    project: src
    host: containerapp
    language: dotnet
resources:
  webfrontend:
    type: host.containerapp
    port: 80
    uses:
      - azdsql
      - azdchat
  azdsql:
    type: db.postgres
  azdchat:
    type: ai.openai.model
    model:
      name: gpt-4o
      version: "2024-08-06"
```

- The `services` node declares:
    - A deployment mapping named `webfrontend` between a .NET web app in the `src` directory and Azure Container Apps.
- The `resources` node declares:
    - An Azure container app and a matching dependency mapping named `webfrontend` between the hosted .NET container app and the database and AI service it depends on. The `uses` node maps the app to the other resources it depends on.
    - An Azure Database for PostgreSQL resource named `azdsql`.
    - An Azure OpenAI resource named `azdchat`.

### Generate the Bicep Code

If you'd like to explore or customize the Bicep used internally by `azd` to provision the resources created by `azd add`, run the `azd infra synth` command:

```bash
azd infra synth
```

`azd` generates the corresponding Bicep files in the `infra` folder of your app.

Running the `azd infra synth` command exits you from the `azd` compose feature and simplified init process. Changes you make to the Bicep files generated by `azd infra synth` aren't accounted for by `azd` compose. For example, after you run `azd infra synth`, if you edit the Bicep code and then run `azd infra synth`, the Bicep files you edited are overwritten by the regenerated code.

> [!NOTE]
> The `azd infra synth` feature is also in alpha status and must be enabled:
> ```bash
> azd config set alpha.infraSynth on
>```

## Next steps

> [!div class="nextstepaction"]
> [Create Azure Developer CLI templates overview](/azure/developer/azure-developer-cli/make-azd-compatible)
