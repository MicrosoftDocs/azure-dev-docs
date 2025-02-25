---
ms.custom: overview
ms.topic: include
ms.date: 12/20/2024
ms.service: azure
---


## Stream logs to see the load balancer results

1. In the [Azure portal](https://portal.azure.com), search your resource group.
1. From the list of resources in the group, select the Azure Container Apps resource.
1. Select **Monitoring** > **Log stream** to view the log.
1. Use the chat app to generate traffic in the log.
1. Look for the logs, which reference the Azure OpenAI resources. Each of the three resources has its numeric identity in the log comment that begins with `Proxying to https://openai3`, where `3` indicates the third Azure OpenAI resource.

    :::image type="content" source="../media/get-started-scaling-load-balancer-azure-container-apps/container-app-log-stream.png" alt-text="Screenshot that shows Azure Container Apps streaming logs with two log lines highlighted to demonstrate the log comments. ":::

When the load balancer receives status that the request exceeds quota, the load balancer automatically rotates to another resource.
