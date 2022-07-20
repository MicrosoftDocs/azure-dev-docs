---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/20/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['vscode-azure-tools']
ms.custom: devx-track-python
---

As a final step, you need to configure the database server's firewall to accept connections from all Azure resources. This configuration makes connecting with psql to complete further configuration easier. This can't be done with VS Code. Instead, see the Azure portal instructions.  In the portal, the options is **Allow access to Azure services option**, which should be set to **Yes**.
