---
ms.topic: include
ms.date: 08/17/2022
---

During the deploy with VS Code, a webhook is created that enables the web app to pull new images from the Azure Container Registry.

> [!IMPORTANT]
> Review the webhooks configuration in the Azure Portal to confirm the **Service URI** ends with "/api/registry/webhook". To review the service URI, open the Docker extension in VS Code and find the registry you created. Right-click the registry and select **Open in Portal**. In the Azure portal, go to the **Webhooks** resource of the registry.
