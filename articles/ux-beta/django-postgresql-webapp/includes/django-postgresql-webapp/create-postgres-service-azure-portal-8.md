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

**Step 8.** In the Azure Cloud Shell or in your local environment, connect to the PostgreSQL server and create the `pollsdb` database.

```Console
psql --host=<server-name>.postgres.database.azure.com \
     --port=5432 \
     --username=<admin-user>@<server-name> \
     --dbname=postgres

postgres=> CREATE DATABASE pollsdb;
```

The values of `<server name>` and `<admin-user>` are the values from a previous step.