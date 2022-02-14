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

Configure access to the PostgreSQL database:

1. Open the **Command Palette** (Ctrl + Shift + P).

1. Search for select *PostgreSQL: Configure Firewall*.

1. Select a subscription if prompted.

1. Select the database you created above, for example *msdocs-tutorial-django-postgres-db-\<unique-id>*. If the database name doesn't appear in the list, it's likely it hasn't finished being created.

1. Select **Yes** in the dialog box to add your IP address to the firewall rules of the PostgreSQL server.

1. Right-click the database instance and select **Open in Portal**.

1. In the Resource menu on the left, select **Connection security**.

1. Set **Allow access to Azure services** to **Yes**.

1. Select **Save** to save the changes.
