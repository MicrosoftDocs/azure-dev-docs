---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Clean up resources

When you're done with both the chat app and the load balancer, clean up the resources. The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

### Clean up chat app resources

Return to the chat app article to clean up those resources. 

* [.NET](/dotnet/ai/get-started-app-chat-template#clean-up-resources)
* [JavaScript](/azure/developer/javascript/get-started-app-chat-template#clean-up-resources)
* [Python](/azure/developer/python/get-started-app-chat-template#clean-up-resources)

### Clean up load balancer resources

Run the following Azure Developer CLI command to delete the Azure resources and remove the source code:

```bash
azd down --purge --force
```

The switches provide: 

* `purge`: Deleted resources are immediately purged. This allows you to reuse the Azure OpenAI TPM.
* `force`: The deletion happens silently, without requiring user consent. 

### Clean up GitHub Codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the GitHub Codespaces dashboard (<https://github.com/codespaces>).

1. Locate your currently running Codespaces sourced from the [`azure-samples/openai-apim-lb`](https://github.com/azure-samples/openai-apim-lb) GitHub repository.

    :::image type="content" source="../media/get-started-scaling-load-balancer-azure-api-management/codespace-clean-up-repository.png" alt-text="Screenshot of all the running Codespaces including their status and templates.":::

1. Open the context menu for the Codespaces item and then select **Delete**.

    :::image type="content" source="../media/get-started-scaling-load-balancer-azure-api-management/codespace-clean-up-repository-delete.png" alt-text="Screenshot of the context menu for a single codespace with the delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="../media/get-started-scaling-load-balancer-azure-api-management/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

If you have trouble deploying the Azure API Management load balancer, log your issue to the repository's [Issues](https://github.com/Azure-Samples/openai-apim-lb/issues).
