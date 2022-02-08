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

After the Azure Database for PostgreSQL server is created, configure access to the server by adding firewall rules.

1. On the server page, select **Connection security** in the left pane.

1. Change **Allow access to Azure services** to **Yes** to allow the web app to access the database.
<br/><br/>
For this tutorial, you will allow access to the database from other Azure services (including your web app), but in a production app use an [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview) to restrict access further.

1. Select **Add current client IP address** to allow access from your local environment.

1. Select **Save** to save the changes.