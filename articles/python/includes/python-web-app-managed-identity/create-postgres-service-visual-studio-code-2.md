---
author: jessmjohnson
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['vscode-azure-tools']
ms.custom: devx-track-python
---


A series of prompts will guide you through the process of creating the database. Fill in the information as follows.

1. Select **PostgreSQL Single Server**.

1. Specify a **name** for the server.

   Enter a name for the database server that's unique across all Azure (the database server's URL becomes `https://<server-name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. For example: *msdocs-web-app-postgres-database-\<unique-id>*.<br><br>

1. Select the **B1 Basic** SKU (1 vCore, 2 GiB Memory, 5-GB storage).

1. Create an administrator user name.

   This name for an administrator account on the database server. Record this name and password as you'll need them later in this tutorial.<br><br>

1. Create a password for the administrator and confirm it.

1. Select a user group to put the database in.

   Use the same resource group that you created the App Service in.<br><br>

1. Select a location for the database.

   Select the same location as the resource group and App Service.
