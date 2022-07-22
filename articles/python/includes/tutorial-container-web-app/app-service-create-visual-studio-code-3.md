---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/22/2022
---

Follow the prompts to deploy the image:

* Select registry provider &rarr; "Azure"
* Select registry &rarr; Select the registry you created earlier in this tutorial.
* Select repository &rarr; Select the repository name "msdocspythoncontainerwebapp.azurecr.io". If you don't see this repo, refresh the Docker extension **REGISTRIES** section.
* Select tag &rarr; "latest"
* Enter a globally unique name for the web app &rarr; Enter a name that is globally unique to Azure App Service. For example, if you use "msdocs-python-container-web-app", the web app URL would be `http://msdocs-python-container-web-app.azurewebsites.net`.
* Select a resource group &rarr; Use the resource group that contains the Azure Container Registry you created earlier.
* Select a location &rarr; Use the same location as the resource group.
* Select a Linux App Service plan &rarr; Use an existing or create a new one.
