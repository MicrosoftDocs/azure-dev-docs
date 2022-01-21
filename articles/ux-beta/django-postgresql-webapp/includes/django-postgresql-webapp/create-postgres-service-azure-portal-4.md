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

On the **Single server** page, fill out the form as follows.

| Setting | Value | Description |
| --- | --- | --- |
| Resource group | msdocs-django-postgres-webapp-rg | Use the same resource group name from **Step 1**. |
| Name | msdocs-django-postgres-webapp-db |  The PostgreSQL database server name. This name must be **unique across all Azure** (the server endpoint becomes `https://<name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and and server identifier. |
| Location | eastus | Use the same location from **Step 1**. |
| Admin username | demoadmin | Username for the administrator login. It can't be **azure_superuser, admin, administrator, root, guest, or public**. |
| Password | *secure password* | Password of the administrator user. It must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters. |

<!--
1. *Resource Group* &rarr; Select and use a name of **msdocs-django-postgres-webapp-rg**.
1. *Name* &rarr; Enter **msdocs-django-postgres-webapp-db-XYZ** where XYZ is any three random characters as the name for the database server. This name must be unique across Azure (the database server's URL becomes `https://<server-name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. <br />
 Example: `msdocs-tutorial-django-postgresql-db-<unique-identifier>`
1. *Data source* &rarr; **None**
1. *Location* &rarr; Same Azure region used for the Web App.
1. *Version* &rarr; Keep the default (which is the latest version).
1. *Compute + storage* &rarr; Select **Configure server** under *Sku and size setting* to select a different Compute + storage plan.
1. *Administrator account* &rarr; Enter a **username** and **secure password** to be used for the database administrator account.
 -->
