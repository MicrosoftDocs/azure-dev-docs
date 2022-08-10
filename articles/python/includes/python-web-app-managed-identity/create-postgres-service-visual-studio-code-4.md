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

After the firewall rule allowing local access has been successfully added, you can create the `restaurant` database.

1. In the **Azure** extension, find the PostgreSQL Server you created, right-click it, and select **Create Database**.

1. At the prompt, enter *restaurant* as the **Database Name**.

If you have trouble creating the database, the server may still be processing the firewall rule from the previous step. Wait a moment and try again.
