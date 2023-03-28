---
ms.topic: include
ms.date: 07/21/2022
---

Each time you add a new setting, a dialog box appears at the top of the VS Code window where you can add each setting name followed by its value.
<br><br>
Add the following settings:

* *DBHOST* &rarr; Enter the server name you used earlier when you created the database, for example, *msdocs-web-app-postgres-database-\<unique-id>*. The sample code appends *.postgres.database.azure.com* to create the full qualified PostgreSQL server URL.
* *DBNAME* &rarr; Enter *restaurant*, the name of the application database.
* *DBUSER* &rarr; Enter *webappuser*, the user you created for the managed identity in the previous article. The sample code constructs the correct Postgres username from `DBUSER` and `DBHOST`, so don't include the *@server* portion.
* *STORAGE_ACCOUNT_NAME* &rarr; The name of the storage account, which the sample code combines with *blob.core.windows.net* to create the storage URL endpoint.
* *STORAGE_CONTAINER_NAME* &rarr; The name of the container in the storage account, where photos are stored. For example, *photos*.
* *SECRET_KEY* &rarr; Enter a secret key for the app. This key is used, for example, to encrypt the session cookie. You can generate a value with `python -c "import secrets; print(secrets.token_hex())"`.
