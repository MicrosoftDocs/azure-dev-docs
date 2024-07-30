---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---


## Stream logs to see the load balancer results

1. In the [Azure portal](https://portal.azure.com), search your resource group. 
1. From the list of resources in the group, select the Container App resource.
1. Select **Monitoring -> Log stream** to view the log.
1. Use the chat app to generate traffic in the log. 
1. Look for the logs, which reference the Azure OpenAI resources. Each of the three resources has its numeric identity in the log comment beginning with `Proxying to https://openai3`, where `3` indicates the third Azure OpenAI resource.

    :::image type="content" source="../media/get-started-scaling-load-balancer-azure-container-apps/container-app-log-stream.png" alt-text="Screenshot showing Azure Container App streaming logs with two log lines high lighted which demonstrate the log comment. ":::

1. As you use the chat app, when the load balancer receives status that the request has exceeded quota, the load balancer automatically rotates to another resource.
