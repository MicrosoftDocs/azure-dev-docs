---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/20/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

On the **Create Web App** page, fill out the form as follows.

1. *Resource Group* &rarr; Select *Create new* and use a name of **msdocs-django-postgres-webapp-rg**.
1. *Name* &rarr; **msdocs-django-postgres-webapp-plan-XYZ** where XYZ is any three random characters. This name must be unique across Azure.
1. *Runtime stack* &rarr; **Python 3.8**
1. *Region* &rarr; Any Azure region near you.
1. *App Service Plan* &rarr; Select **Create new** under *Linux Plan* and use a name of **msdocs-django-postgres-webapp-plan**.
1. *App Service Plan* &rarr; Select **Change size** under *Sku and size setting* to select a different App Service plan.
