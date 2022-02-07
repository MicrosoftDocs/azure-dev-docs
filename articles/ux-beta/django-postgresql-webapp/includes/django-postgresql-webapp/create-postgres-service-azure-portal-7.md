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

**Step 7.** Under **Connection security** change **Allow access to Azure services** to **Yes**.

When the PostgreSQL server is created, you can create a firewall rule that allows your web app to access the database server. In this tutorial, you will allow access to the database from other Azure services, but in a production app you should use an [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview).
