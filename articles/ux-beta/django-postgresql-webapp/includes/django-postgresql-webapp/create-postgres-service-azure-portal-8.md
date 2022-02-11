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

In the global controls of the Azure portal, open the [Azure Cloud Shell](https://shell.azure.com), connect to the PostgreSQL server. 

:::image type="content" border="False" source="./media/django-postgresql-webapp/azure-cloud-shell-launch-icon.png" alt-text="How to access the Azure Cloud Shell from the Azure portal global controls.":::

Create the `restaurant` database with the following command:

```Console
psql --host=<server-name>.postgres.database.azure.com \
     --port=5432 \
     --username=<admin-user>@<server-name> \
     --dbname=postgres

postgres=> CREATE DATABASE restaurant;
```

The values of `<server-name>` and `<admin-user>` are the values from a previous step.

Optionally, verify that the `restaurant` database was successfully created by running `\c restaurant` to change the prompt from `postgre` (default) to the `restaurant`. Type `\?` to show help or `\q` to quit.
