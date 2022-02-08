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

**Step 7.** Under **Connection security**, configure access to the database by adding firewall rules.

1. Change **Allow access to Azure services** to **Yes** to allow the web app to access the database.
<br/><br/>
When the PostgreSQL server is created, you can create a firewall rule that allows your web app to access the database server. In this tutorial, you will allow access to the database from other Azure services, but in a production app you should use an [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview).

2. Select **Save** to save the changes.