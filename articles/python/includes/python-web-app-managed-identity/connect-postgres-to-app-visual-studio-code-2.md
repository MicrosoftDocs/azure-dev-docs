---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

Each time you add a new setting, a dialog box appears at the top of the VS Code window where you can add each setting name followed by its value.
<br><br>
Add the following settings:

* *DBHOST* &rarr; Enter the server name you used earlier when created the database, for example, *msdocs-web-app-postgres-database-\<unique-id>*. The code in *azuresite/production.py* automatically appends `.postgres.database.azure.com` to create the full PostgreSQL server URL.
* *DBNAME* &rarr; Enter *restaurant*.
* *DBUSER* &rarr; Enter the administrator user name you specified when creating the database. The code in *azuresite/production.py* automatically constructs the full Postgres username from `DBUSER` and `DBHOST`, so don't include the `@server` portion.
* *STORAGE_ACCOUNT_NAME* &rarr; The name of the storage account, which is the combined with `blob.core.windows.net` to create the full endpoint.
* *STORAGE_CONTAINER_NAME* &rarr; The name of the container in the storage account, where photos are stored. For example, "photos".