---
title: Azure deployment stacks integration with the Azure Developer CLI
description: How to use Azure deployment stacks with the Azure Developer CLI (azd)
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/24/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Azure deployment stacks integration with the Azure Developer CLI

The Azure Developer CLI (`azd`) supports [Azure deployment stacks](/azure/azure-resource-manager/bicep/deployment-stacks) for template deployments. An Azure deployment stack is a resource that enables you to manage a group of Azure resources as a single, cohesive unit. By using deployment stacks, you can gain additional control over the set of resources associated with your `azd` template and app.

In this article, you learn how to:

- Enable Azure deployment stack support in `azd`.
- Deploy `azd` templates using Azure deployment stacks.
- Configure deployment stack behavior using `azd` configurations.

## Enable Azure deployment stack support

Azure deployment stacks support must be enabled via the `azd config` command:

```bash
azd config set alpha.deployment.stacks on
```

> [!NOTE]
> Azure deployment stacks support is currently an alpha feature, which is why it must be enabled manually. However, deployment stacks will become the default deployment behavior of `azd` in a future release.
> [Learn more about our versioning strategy.](./feature-versioning.md)

Verify the feature was enabled successfully using the `azd config show` command:

```bash
azd config show
```

## Deploy a template using deployment stacks

After you enable the deployment stacks feature, no further changes to your `azd` templates are required to leverage the default behavior of this feature. `azd` automatically wraps the provisioned template resources in an Azure deployment stack when you run `azd up`:

```bash
azd up
```

`azd` uses the scope defined in the `main.bicep` file of your template for the Azure deployment stack. For example, if your template is scoped to the subscription or resource group level, you can view the associated deployment stack in the Azure portal on the **Deployment stacks** page of the associated subscription or resource group page.

:::image type="content" source="media/deployment/subscription-deployment-stack.png" alt-text="A screenshot showing a subscription level deployment stack in the Azure portal.":::

Select the deployment stack to view the management pages for it:

:::image type="content" source="media/deployment/deployment-stack-details.png" alt-text="A screenshot showing the deployment stack details.":::

## Delete a deployment stack

By default, you can delete a deployment stack and its associated resources using the standard `azd down` command:

```bash
azd down
```

The exact behavior of `azd down` and deployment stacks is configured using the `azure.yaml` file.

## Configure the deployment stack

`azd` exposes various configuration settings through the `infra` section of the `azure.yaml` file to influence the behavior of the Azure deployment stack. These settings map to the standard options detailed in [Deployment stacks](/azure/azure-resource-manager/bicep/deployment-stacks) documentation. Consider the following `azure.yaml` example:

```yml
name: todo-nodejs-mongo-aca
metadata:
  template: todo-nodejs-mongo-aca@0.0.1-beta
infra:
  provider: bicep
  deploymentStacks:
    actionOnUnmanage:
      resources: delete
      resourceGroups: delete
    denySettings:
      mode: denyDelete
      excludedActions:
        - Microsoft.Resources/subscriptions/resourceGroups/delete
      excludedResources:
        - <your-resource-id-1>
        - <your-resource-id-2>
      excludedPrincipals:
        - <your-targeted-principal-id-1>
        - <your-targeted-principal-id-2>
      applyToChildScopes: true
# ...
# Remaining file contents omitted
# ...
```

In the preceding example, the following options are defined in the `deploymentStacks` section:

- **actionOnUnmanage**: When a deployment stack is deleted, the associated Azure resources are considered unmanaged. This setting determines how Azure will handle unmanaged resources. Possible values include:
  - `delete` is the default value and destroys any resources managed by the deleted deployment stack.
  - `detach` leaves resources in place but removes their association to the deleted deployment stack.
- **denySettings**: A subsection that provides nuanced control over the resources of the deployment stack.
  - **mode**: Determines high level restrictions on the deployment stack resources. Possible values include:
    - `none` is the default value and allows the deployment stack resources to be deleted, or new resources to be added.
    - `denyDelete` prevents any deployment stack resources from being deleted.
    - `denyWriteAndDelete` prevents any deployment stack resources from being deleted and also prevents new resources from being added to the deployment stack.
  - **excludedActions**: Lists the [Azure role-based access control (RBAC)](/azure/role-based-access-control/overview) actions that are not allowed on the deployment stack resources.
  - **excludedResources**: Lists the resource IDs that are excluded from the `denySettings`.
  - **excludedPrincipals**: Lists the service principal IDs that are excluded from the `denySettings`.
  - **applyToChildScopes**: A boolean value that sets whether the deny settings apply to child resources of resources in the deployment stack. For example, a SQL Server resource has child database resources.

> [!div class="nextstepaction"]
> [Azure Developer CLI FAQ](./faq.yml)
