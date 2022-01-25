---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

**Step 4.** On the **Single server** page, fill out the form as follows.

1. *Resource Group* &rarr; Select and use a name of **msdocs-django-postgres-webapp-rg**.
1. *Name* &rarr; Enter **msdocs-django-postgres-webapp-db** This name must be unique across Azure (the database server's URL becomes `https://<server-name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`.
1. *Data source* &rarr; **None**
1. *Location* &rarr; Same Azure region used for the Web App.
1. *Version* &rarr; Keep the default (which is the latest version).
1. *Compute + storage* &rarr; Select **Configure server** under *Sku and size setting* to select a different Compute + storage plan.
1. *Administrator account* &rarr; Enter a **username** and **secure password** to be used for the database administrator account.
