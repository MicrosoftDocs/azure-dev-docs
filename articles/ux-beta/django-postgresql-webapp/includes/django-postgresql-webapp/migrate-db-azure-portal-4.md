---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/27/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

**Step 4.** If you see an error that the database is locked, make sure that you ran the `az webapp settings` command in the previous section. Without those settings, the migrate command cannot communicate with the database, resulting in the error.