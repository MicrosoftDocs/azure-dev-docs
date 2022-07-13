---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/12/2022
---

Follow the prompts to deploy the image:

* Select registry provider &rarr; Azure
* Select registry &rarr; Select the registry you created earlier in this tutorial.
* Select repository &rarr; Select repository name. If you don't see your repo, refresh the Docker extension **REGISTRIES** section.
* Select tag &rarr; "latest"
* Enter a globally unique name for the web app &rarr; Enter a name so that the final URL `http://<app-name>.azurewebsites.net.` is globally unique.
* Select a resource group &rarr; Use the resource group that contains the Azure Container Registry you created earlier.
* Select a location &rarr; Use the same location as the resource group.
* Select a Linux App Service plan &rarr; Use an existing or create a new one.
