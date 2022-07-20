---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

On the database resource page, add a firewall rule that allows your local environment to access the database server as well as other Azure services.

1. In the left resource menu, go to the **Connection Security** resource page.

1. For the **Allow access to Azure services** option, select **Yes**.

1. Select **+ Add current client IP address** to add your current IP address.

1. Select **Save**.
