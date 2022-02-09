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

In the global controls of the Azure portal, select the Azure Cloud Shell, connect to the PostgreSQL server and create the `restaurant` database.

```Console
psql --host=<server-name>.postgres.database.azure.com \
     --port=5432 \
     --username=<admin-user>@<server-name> \
     --dbname=postgres

postgres=> CREATE DATABASE restaurant;
```

The values of `<server-name>` and `<admin-user>` are the values from a previous step.
<br>
Optionally, verify that the `restairamt` was successfully created by running `\c restaurant` to change the prompt from `postgre` (default) to the `restaurant`. Type `\?` to show help or `\q` to quit.