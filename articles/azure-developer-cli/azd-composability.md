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

The Azure Developer CLI enables you to compose and build up your apps by adding supported Azure components progressively. This feature offers a dev-centric, guided experience to add Azure resources to your project without manually writing Bicep code. Composability also uses [Azure Verified Modules (AVM)](https://aka.ms/avm) when possible, providing recommended practices using building blocks for Azure that are secure by design.

## What is the compose feature?

To configure `azd` templates to provision specific resources on Azure, developers historically had two options:

- Locate a template that provisions the resources they required using an existing template from a template gallery such as [Awesome AZD]().
- Manually write custom Bicep or Terraform files in the `infra` folder to define the exact resources that should be created in Azure.

However, the introduction of the `azd` compose feature gives developers a third option to progressively add resources to their apps. Developers use the `azd add` command to instruct `azd` to compose new Azure resources and update template configurations using simple prompt workflows.

The `azd compose` feature supports the following Azure Services:

- Azure Container Apps
- Azure OpenAI with Microsoft Entra ID authentication
- Azure Cosmos DB for MongoDB
- Azure Cosmos DB for PostgreSQL
- Azure Cache for Redis

Future releases will support additional Azure services.

## Enable the compose feature

The `azd` compose feature is currently in alpha, which means you'll need to enable it manually. Visit the [azd feature stages](https://aka.ms/azd-feature-stages) page for more information.

```
azd config set alpha.compose on
```

## Work with the compose feature

Access `azd` compose features through the [`azd add`](/azure/developer/azure-developer-cli/reference#azd-add) command. The `azd add` command works with any new or existing templates creating using one of the various [template creation workflows](/azure/developer/azure-developer-cli/make-azd-compatible).

Complete the following steps to add new resources to your template without writing any code:

1. In a terminal window, navigate to the root of your `azd` template.

1. Run `azd add` command to add a new resource and start the compose workflow:

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

1. Enter a name for the new resource.

1. `azd` generates a preview of the changes it will apply to the `azure.yaml` file. Press enter to accept the changes.

1. Run the `azd up` command to provision any changes made through the `azd add` command.

## Explore the azure.yaml file

The `azure.yaml` file manages the services and resources composed through the `azd add` command using the corresponding `services` and `resources` nodes. Consider the following example of an `Azure.yaml` file updated entirely through `azd add`:

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
    - A matching dependency mapping named `webfrontend` between the hosted .NET container app and the database and AI service it depends on. The `uses` attribute maps the app to the other resources it depends on.
    - An Azure Database for PostgreSQL resource named `azdsql`.
    - An Azure OpenAI resource named `azdchat`.

### Generate the Bicep Code

If you'd like to explore or customize the Bicep used internally to provision the resources created by `azd add`, run the `azd infra synth` command:

```bash
azd infra synth
```

`azd` generates the corresponding Bicep files in the `infra` folder of your app.

> [!NOTE]
> The `azd infra synth` feature is also in alpha status and must be enabled:
> ```bash
> azd config set alpha.infraSynth on
>```
