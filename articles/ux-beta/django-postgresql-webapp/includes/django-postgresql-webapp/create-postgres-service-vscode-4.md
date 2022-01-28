---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/19/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal', 'vscode-azure-tools', 'azure-cli']
ms.custom: devx-track-python
---

* **Step 4.** In the following prompts, enter the following information:

    | Field | Value |
    | --- | --- |
    | Server name | Enter a name for the database server that's unique across all Azure (the database server's URL becomes `https://<server-name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. Example: **msdocs-tutorial-django-postgresql-db-< unique id >** |
    | Compute + Storage | Select **B1 Basic**, 1 vCore, 2GiB Memory, 5GB storage. |
    | Admin username, Password, Confirm password | Enter credentials for an administrator account on the database server. Record these credentials as you'll need them later in this tutorial. |
    | Resource group | Select **Create new** and enter "msdocs-tutorial-django-postgresql-rg". |
    | Location | Select a location near you. |
