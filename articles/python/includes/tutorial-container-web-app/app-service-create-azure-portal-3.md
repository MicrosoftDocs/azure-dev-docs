---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/12/2022
---

Specify Docker information of the App Service, including:

* **Options** &rarr; Select **Single Container**.
* **Image Source** &rarr; Select **Azure Container Registry**.
* **Registry** &rarr; The registry you created for this tutorial. 
* **Image** &rarr; An image in the registry.
* **Tag** &rarr; "latest"

The registry [admin account](/azure/container-registry/container-registry-authentication#admin-account) is needed when you use the Azure portal to deploy a container image. If the admin account is not enabled, you'll see an error when specifying the **Image**.
