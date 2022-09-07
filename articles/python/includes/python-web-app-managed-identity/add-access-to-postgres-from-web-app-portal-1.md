---
author: jessmjohnson
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

Add a rule to allow your web app to access the PostgreSQL Flexible server.

1. In the left resource menu for the server, select **Networking**.

1. Select the **Yes** next to **Allow public access to Azure services**.

1. Select **+ Add current client IP address** if you haven't already and you'll connect to the database from your local environment.

1. Select **Save** to save the change.

To secure communication between production web apps and database servers, use an [Azure Virtual Network (VNet)](/azure/virtual-network/virtual-networks-overview).
