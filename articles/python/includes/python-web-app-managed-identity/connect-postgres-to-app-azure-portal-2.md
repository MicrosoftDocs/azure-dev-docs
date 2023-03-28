---
ms.topic: include
ms.date: 07/21/2022
---

Create application settings:

1. Select **+ New application setting** to create the following settings:

    * *DBHOST* &rarr; Use the server name you used earlier when you created the database, for example, *msdocs-web-app-postgres-database-\<unique id>*. The sample code appends *.postgres.database.azure.com* to create the full qualified PostgreSQL server URL.
    The sample code appends *.postgres.database.azure.com* to create the fully qualified PostgreSQL server URL.
    * *DBNAME* &rarr;  Enter *restaurant*, the name of the application database.
    * *DBUSER* &rarr; Enter *webappuser*, the user you created for the managed identity in the previous article. The sample code constructs the correct Postgres username from `DBUSER` and `DBHOST`, so don't include the *@server* portion.
    * *STORAGE_ACCOUNT_NAME* &rarr; The name of the storage account, which the sample code combines with *blob.core.windows.net* to create the storage URL endpoint.
    * *STORAGE_CONTAINER_NAME* &rarr; The name of the container in the storage account, where photos are stored. For example, *photos*.
    * *SECRET_KEY* &rarr; Enter a secret key for the app. This key is used, for example, to encrypt the session cookie. You can generate a value with `python -c "import secrets; print(secrets.token_hex())"`.

1. Confirm you have five settings with the correct values.

1. Select **Save** to apply the settings.
