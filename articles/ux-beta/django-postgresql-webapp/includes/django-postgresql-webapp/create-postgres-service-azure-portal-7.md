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

Add firewall rules:

1. On the server page, select **Connection security** in the resource menu.

1. In the working pane, change **Allow access to Azure services** to **Yes** to allow the web app to access the database.

   For this tutorial, you will allow access to the database from other Azure services (including your web app), but in a production app use an [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview) to restrict access further.

1. Select **Add current client IP address** to allow access from your local environment.

1. Select **Save** to save the changes.