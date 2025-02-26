---
author: KarlErickson
ms.author: karler
ms.reviewer: bbanerjee
ms.date: 10/04/2024
---

To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

```azurecli
az login
```

To ensure you're running the latest version of the CLI, run the upgrade command.

```azurecli
az upgrade
```

Next, install or update the Azure Container Apps extension for the CLI.

If you receive errors about missing parameters when you run `az containerapp` commands in Azure CLI, be sure you have the latest version of the Azure Container Apps extension installed.

```azurecli
az extension add --name containerapp --upgrade
```

> [!NOTE]
> Starting in May 2024, Azure CLI extensions no longer enable preview features by default. To access Container Apps [preview features](/azure/container-apps/whats-new), install the Container Apps extension with `--allow-preview true`.
>
> ```azurecli
> az extension add --name containerapp --upgrade --allow-preview true
> ```

Now that the current extension or module is installed, register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces.

> [!NOTE]
> Azure Container Apps resources have migrated from the `Microsoft.Web` namespace to the `Microsoft.App` namespace. Refer to [Namespace migration from Microsoft.Web to Microsoft.App in March 2022](https://github.com/microsoft/azure-container-apps/issues/109) for more details.

```azurecli
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights
```
