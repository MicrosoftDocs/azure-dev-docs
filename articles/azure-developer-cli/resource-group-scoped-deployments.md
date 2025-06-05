---
title: Resource Group Scoped Deployments
description: How to deploy templates that target resource group scope instead of subscription scope with the Azure Developer CLI (azd)
author: gkulin
ms.author: gracekulin
ms.date: 09/12/2024
ms.service: azure-dev-cli
ms.topic: article
ms.custom: devx-track-azdevcli
---

# Resource Group Scoped Deployments

Azure Developer CLI (`azd`) supports deployments at both the subscription and resource group scopes. By default, `azd` creates a resource group that contains the provisioned resources in the subscription you choose during the `azd up` workflow. However, `azd` also allows you to deploy to an existing resource group. When you choose an existing resource group, the scope of permissions needed to run `azd provision` is reduced from subscription level to the resource group level.

In this article, you learn how to modify templates to enable resource group scoped deployments.

> [!NOTE]
> Resource Group Scoped Deployment is currently a beta feature.
> [Learn more about our versioning strategy.](./feature-versioning.md)

## Modify the target scope of a template

1. In `main.bicep` file of your `azd` template, change `targetScope`:

    ```bicep
    targetScope = 'resourceGroup'
    ```

1. Remove `scope: rg` from all the module references in `main.bicep`.

1. Use resource group instead of subscription when you create a unique resource token in `main.bicep`, .

    ```bicep
    var resourceToken = toLower(uniqueString(resourceGroup().id, environmentName, location))
    ```

1. Remove the following section of code in `main.bicep` that organizes resources into a resource group.

    ```bicep
    // Organize resources in a resource group
    resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
        name: !empty(resourceGroupName) ? resourceGroupName : '${abbrs.resourcesResourceGroups}${environmentName}'
        location: location
        tags: tags
    }
    ```

1. If applicable, in the `.azdo\pipelines\azure-dev.yml` and `.github\workflows\azure-dev.yml` files, add the Azure resource group environment variable to your tasks.

    ```yml
    AZURE_RESOURCE_GROUP: $(AZURE_RESOURCE_GROUP)
    ```

> [!NOTE]
> For an example of these changes applied to the [React Web App with Node.js API and MongoDB on Azure template](https://github.com/Azure-Samples/todo-nodejs-mongo), see [this GitHub comparison](https://github.com/Azure-Samples/todo-nodejs-mongo/compare/main...ellismg:todo-nodejs-mongo:ellismg/move-to-rg-scope).

To set the resource group to deploy to manually, you can set `AZURE_RESOURCE_GROUP` in your environment. Learn more about that [here](./manage-environment-variables.md#user-provided-environment-variables).

Alternatively, if you do not have a resource group specified in your environment, `azd` prompts you to pick an existing resource group from your subscription or create a new one when you run `azd provision`.

## Next steps

> [!div class="nextstepaction"]
> [Azure Developer CLI FAQ](./faq.yml)
