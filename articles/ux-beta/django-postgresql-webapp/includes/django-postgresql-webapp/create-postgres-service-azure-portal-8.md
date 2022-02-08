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

In the global controls of the Azure portal, select the Azure Cloud Shell, connect to the PostgreSQL server and create the `pollsdb` database.

```Console
psql --host=<server-url> \
     --port=5432 \
     --username=<admin-user>@<server-name> \
     --dbname=postgres

postgres=> CREATE DATABASE pollsdb;
```

The values of `<server-url>` and `<admin-user>` are the values from a previous step. The server url will the path to the server, for example, *msdocs-django-postgres-webapp-db-<unique-id>.postgres.database.azure.com*. 
<br><br>
Verify that the `pollsdb1` was successfully created by running \c pollsdb to change the prompt from `postgre` (default) to the new `pollsdb`. Type `\?` to show help or `\q` to quit.