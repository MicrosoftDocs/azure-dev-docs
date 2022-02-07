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

**Step 5.** Configure Access to PostgreSQL database:

* Open the **Command Palette** (Ctrl + Shift + P).

* Search for select *PostgreSQL: Configure Firewall*.

* Select a subscription if prompted.

* Select the database you created above, for example *msdocs-tutorial-django-postgres-db-< unique id >*. If the database name doesn't appear in the list, it's likely it hasn't finished being created.

* Click **Yes** in the dialogue box to add your IP address to the firewall rules of the PostgreSQL server.
