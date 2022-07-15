---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

Create application settings:

1. Select **+ New application setting** to create settings for each of the following values (which are expected by the sample app):

    * *DBHOST* &rarr; Use the server name you used earlier when created the database, for example, *msdocs-web-app-postgres-database-\<unique id>*.
    The sample code automatically appends `.postgres.database.azure.com` to create the PostgreSQL server URL.
    * *DBNAME* &rarr;  Enter `restaurant`, the name of the application database.
    * *DBUSER* &rarr; The administrator user name used when you provisioned the database.
    * *STORAGE_ACCOUNT_NAME* &rarr; The name of the storage account, which is the combined with `blob.core.windows.net` to create the storage URL endpoint.
    * *STORAGE_CONTAINER_NAME* &rarr; The name of the container in the storage account, where photos are stored. For example, *photos*.

1. Confirm you have five settings with the correct values.

1. Select **Save** to apply the settings.
