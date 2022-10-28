---
ms.topic: include
ms.date: 07/12/2022
---

On the basic settings of the App Service, specify:

* **Resource Group** &rarr; Use the same resource group that the Azure Container Registry is in.
* **Name** &rarr; Use a unique name that will be `http://<app-name>.azurewebsites.net`.
* **Publish** &rarr; Use **Docker container** so that the registry image you build is used.
* **Operating System** &rarr; **Linux**
* **Region** &rarr; Use the same region as the resource group and Azure Container Registry.
* **Linux Plan** &rarr; Select an existing Linux plan or use a new one.
* **Sku and size** &rarr; Select **Basic B1**. Select the **Change size** link to access more options.
* **Zone redundancy** &rarr; Select **Disabled** if this option is available for the SKU selected.

Select **Next: Docker** to continue. 
