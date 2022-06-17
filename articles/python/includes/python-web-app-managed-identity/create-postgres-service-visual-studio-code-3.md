---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['vscode-azure-tools']
ms.custom: devx-track-python
---

Once the database is created, configure access from your local environment to the Azure Database for PostgreSQL server by opening the **Command Palette** (Ctrl + Shift + P).

1. Search for and select **PostgreSQL: Configure Firewall**.  (Select a subscription if prompted.)

1. Select the database you created above. If the database name doesn't appear in the list, it's likely it hasn't finished being created.

1. Select **Yes** in the dialog box to add your IP address to the firewall rules of the PostgreSQL server.

