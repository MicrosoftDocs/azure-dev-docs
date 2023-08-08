---
title: Resource Group Scoped Deployments
description: How to deploy templates that target resource group scope instead of subscription scope with the Azure Developer CLI (azd)
author: gkulin
ms.author: gracekulin
ms.date: 07/18/2022
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Resource Group Scoped Deployments [Alpha]
Azure Developer CLI (azd) supports deployments at the subscription level as well as at a resource group scope. By default, `azd` will deploy to the subscription you choose and then create a resource group in that subscription to store your services in. If you would like to deploy to an existing resource group, you can use `azd` to do so.

> [!NOTE]
> Resource Group Scoped Deployment is currently an alpha feature, so to deploy to a resource group, you need to enable it by running the following:
> ```azdeveloper
>   azd config set alpha.resourceGroupDeployments on
>   ```
> [Learn more about our versioning strategy.](./feature-versioning.md)

## Modify the template to change the target scope:
1. In `main.bicep` change `targetScope`:
    ```bicep
    targetScope = 'resourceGroup'
    ```
2. Remove `scope: rg` from all the module references in `main.bicep`

3. Change `resourceToken` to use resource group, instead of subscription, in `main.bicep`:
    ```bicep
    var resourceToken = toLower(uniqueString(resourceGroup().id, environmentName, location))
    ```

4. Remove the section of code in `main.bicep` that organizes resources into a resource group. It will look something like this:
    ```bicep
    // Organize resources in a resource group
    resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
        name: !empty(resourceGroupName) ? resourceGroupName : '${abbrs.resourcesResourceGroups}${environmentName}'
        location: location
        tags: tags
    }
    ```

5. If applicable, in your `.azdo\pipelines\azure-dev.yml` and `.github\workflows\azure-dev.yml` files turn on the resource group deplyoments alpha feature by adding the following to your steps:
    ```yml
    azd config set alpha.resourceGroupDeployments on
    ```
    Also, add the Azure resource group environment variable to your tasks:
    ```yml
    AZURE_RESOURCE_GROUP: $(AZURE_RESOURCE_GROUP)
    ```

For an example of these changes being made to our [React Web App with Node.js API and MongoDB on Azure template](https://github.com/Azure-Samples/todo-nodejs-mongo), see [this GitHub comparison](https://github.com/Azure-Samples/todo-nodejs-mongo/compare/main...ellismg:todo-nodejs-mongo:ellismg/move-to-rg-scope).
 

To set the resource group to deploy to manually, you can set `AZURE_RESOURCE_GROUP` in your environment. Learn more about that [here](./manage-environment-variables.md#user-provided-environment-variables). 

Alternatively, if you do not have a resource group specified in your environment, we will prompt you to pick an existing resource group from your subscription or create a new one when you run `azd provision`. 

## Next steps

> [!div class="nextstepaction"]
> [Azure Developer CLI FAQ](./faq.yml)
