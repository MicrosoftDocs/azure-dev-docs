---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

A series of prompts will guide you through the process of creating the App Service. Fill in the information as follows.

1. Name &rarr; *msdocs-web-app-\<unique-id>* 

   The name must be unique across Azure. When deployed, this name is used in the DNS name of the web app is `https://<app-service-name>.azurewebsites.net`. <br>

1. Resource group &rarr; Select **Create New Resource Group**. 

   Create a new resource group, where you'll put all the Azure resources for this tutorial. <br>

1. Runtime stack Python &rarr; **Python 3.9**

1. Location &rarr; Select a region/location near you.

    All resources you'll create in this tutorial should use the same location.

1. Service plan &rarr; Create a new App Service plan, which will control how many resources (CPU/memory) are available to your app and how much you pay.

    * Select **Basic (B1) Develop and test**. This will incur a small cost in your Azure subscription but provides better performance than the Free (F1) tier.

    * Choose a name. You can use the App Service name or the auto-generated name.

1. App Insights &rarr; Select **Skip for now**.
