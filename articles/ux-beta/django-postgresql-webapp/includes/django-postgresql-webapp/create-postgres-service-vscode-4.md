---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/28/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['vscode-azure-tools']
ms.custom: devx-track-python
---

**Step 4.** In the following prompts, enter the following information:

* *Server name* &rarr; Enter a name for the database server that's unique across all Azure (the database server's URL becomes `https://<server-name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. Example: **msdocs-tutorial-django-postgresql-db-< unique id >**
* *Compute + Storage* &rarr; Select **B1 Basic**, 1 vCore, 2GiB Memory, 5GB storage.
* *Admin username, Password* &rarr; Enter credentials for an administrator account on the database server. Record these credentials as you'll need them later in this tutorial.
* *Resource group* &rarr; Select **Create new** and enter "msdocs-tutorial-django-postgresql-rg".
* *Location* &rarr; Select a location near you.
