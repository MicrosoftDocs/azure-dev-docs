---
ms.custom: overview
ms.topic: include
ms.date: 06/26/2025
ms.service: azure
---

## Clean up resources

When you're finished with the chat app and the load balancer, clean up the resources. The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

### Clean up chat app resources

Return to the chat app article to clean up the resources:

* [.NET](/dotnet/ai/get-started-app-chat-template#clean-up-resources)
* [JavaScript](/azure/developer/javascript/get-started-app-chat-template#clean-up-resources)
* [Python](/azure/developer/python/get-started-app-chat-template#clean-up-resources)

### Clean upload balancer resources

Delete the Azure resources and remove the source code:

```bash
azd down --purge --force
```

The switches provide:

* `purge`: Deleted resources are immediately purged so that you can reuse the Azure OpenAI Service tokens per minute.
* `force`: The deletion happens silently, without requiring user consent.

### Clean up GitHub Codespaces and Visual Studio Code

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement that you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign in to the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running codespaces that are sourced from the [azure-samples/openai-aca-lb](https://github.com/azure-samples/openai-aca-lb) GitHub repository.

    :::image type="content" source="../media/get-started-scaling-load-balancer-azure-container-apps/codespace-clean-up-repository.png" alt-text="Screenshot that shows all the running codespaces, including their status and templates.":::

1. Open the context menu for the codespace, and then select **Delete**.

    :::image type="content" source="../media/get-started-scaling-load-balancer-azure-container-apps/codespace-clean-up-repository-delete.png" alt-text="Screenshot that shows the context menu for a single codespace with the Delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command** palette, and search for the **Dev Containers** commands.
1. Select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="../media/get-started-scaling-load-balancer-azure-container-apps/reopen-local-command-palette.png" alt-text="Screenshot that shows the Command palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code stops the running development container, but the container still exists in Docker in a stopped state. Free up space on your local machine by deleting the container instance, image, and volumes from Docker.

---

## Get help

If you have trouble deploying the Azure Container Apps load balancer, add your issue to the repository's [Issues](https://github.com/Azure-Samples/openai-aca-lb/issues) webpage.
