---
title: Extend an Azure Developer CLI Template
description: Extend an Azure Developer CLI template by creating a Bicep module that adds Azure Translator capabilities and exposes its outputs as azd environment values.
ms.date: 09/11/2026
ms.topic: tutorial
ms.custom: devx-track-azdevcli, devx-track-bicep
ai-usage: ai-generated
---

# Extend an azd template by adding an Azure service

After you build a new Azure Developer CLI (`azd`) template or start from an existing one, you can extend and evolve its application and infrastructure as your requirements change. This tutorial demonstrates how to add a new Azure service to a template without relying on a module that the template already provides.

You'll start with the [`hello-azd` template](https://github.com/Azure-Samples/hello-azd), create a Bicep module that defines an Azure Translator resource, reference the module from the template's infrastructure entry point, and expose its outputs as `azd` environment values. The tutorial focuses on extending the infrastructure and doesn't modify the application code.

> [!NOTE]
> You can make the following changes directly or with help from an AI coding assistant. Regardless of the authoring method, review the resulting files and validate the template before deployment.

## Prerequisites

To complete this tutorial, you need:

- [Azure Developer CLI installed](install-azd.md).
- An Azure subscription.
- Permission to create Azure resources in the subscription.
- An empty directory for the initialized template.

## Initialize the template

Open a terminal in an empty directory, and then initialize the `hello-azd` template in that directory:

```azdeveloper
azd init --template hello-azd .
```

The template includes:

- A C# application deployed to Azure Container Apps as the `aca` service in `azure.yaml`.
- A user-assigned managed identity for the application.
- An Azure Storage account with a blob container and table.
- Azure Container Registry and an Azure Container Apps environment.
- Reusable Bicep modules under `infra/core`.

For guidance on selecting and reviewing a template before initialization, see [Start from an existing template](start-with-existing-template.md).

## Create a Translator module

Create a file named `infra/translator.bicep`, either manually or with help from an AI coding assistant. This new module is self-contained and doesn't depend on modules from the starting template:

```bicep
@description('Name of the Azure Translator resource.')
param name string

@description('Azure region for the resource.')
param location string

@description('Tags to apply to the resource.')
param tags object = {}

@description('Pricing tier for Azure Translator.')
@allowed([
  'F0'
  'S1'
])
param sku string = 'F0'

resource translator 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: name
  location: location
  kind: 'TextTranslation'
  sku: {
    name: sku
  }
  properties: {
    customSubDomainName: name
    disableLocalAuth: true
    publicNetworkAccess: 'Enabled'
  }
  tags: tags
}

output name string = translator.name
output endpoint string = translator.properties.endpoint
```

The module uses the `TextTranslation` resource kind and disables local key authentication. The `F0` tier is useful for evaluation but allows only one free Translator resource per subscription. Use `S1` if the subscription already contains an `F0` resource or if the project requires a paid tier.

> [!IMPORTANT]
> This introductory example enables the public endpoint so you can provision the resource without adding network infrastructure. Before you use this pattern in production, evaluate private endpoints, network access controls, monitoring, and your organization's security requirements.

## Reference the module from `main.bicep`

The `hello-azd` template defines the `rg` resource group, `location`, `tags`, and `resourceToken` values in `infra/main.bicep`. You can make this edit by hand or prompt an AI assistant to add it. Add the following module after the `rg` resource declaration:

```bicep
module translator './translator.bicep' = {
  name: 'translator'
  scope: rg
  params: {
    name: 'translator-${resourceToken}'
    location: location
    tags: tags
  }
}
```

The `scope` property deploys the module into the resource group that the template creates. The existing `resourceToken` value makes the Translator resource name distinct for each environment.

## Export the Translator outputs

Add the following outputs at the end of `infra/main.bicep`:

```bicep
output AZURE_TRANSLATOR_NAME string = translator.outputs.name
output AZURE_TRANSLATOR_ENDPOINT string = translator.outputs.endpoint
```

After provisioning, `azd` captures these nonsecret outputs in the active environment. A later application-code change can use these values to locate the Translator resource.

## Provision and verify the infrastructure

Provision the template's infrastructure without deploying its application code:

```azdeveloper
azd provision
```

Run `azd env get-values` and confirm that the output includes `AZURE_TRANSLATOR_NAME` and `AZURE_TRANSLATOR_ENDPOINT`. In the Azure portal, verify that the resource group contains an Azure Translator resource.

At this point, the template provisions the AI service but doesn't connect the sample application to it. To complete that integration, configure least-privilege access for the application's managed identity, pass the endpoint to the application, and add a Translator client to the application code. For more information, see the [Azure Translator documentation](/azure/ai-services/translator/).

## Clean up resources

When you no longer need the resources, delete them to avoid continued charges:

```azdeveloper
azd down --purge
```

## Related content

- [Template development overview](build-templates-overview.md)
- [Start with a new template](start-with-new-template.md)
- [Start from an existing template](start-with-existing-template.md)
- [Explore and edit template files](explore-edit-templates.md)

[!INCLUDE [request-help](includes/request-help.md)]
