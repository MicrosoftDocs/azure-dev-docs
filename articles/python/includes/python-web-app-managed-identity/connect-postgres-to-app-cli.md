---
ms.topic: include
ms.date: 07/21/2022
---

To set environment variables in App Service, you create *app settings* with the following [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp config appsettings set \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $APP_SERVICE_NAME \
   --settings DBHOST=$DB_SERVER_NAME \
              DBNAME=restaurant \
              DBUSER=webappuser \
              STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT_NAME \
              STORAGE_CONTAINER_NAME=photos
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp config appsettings set `
   --resource-group $RESOURCE_GROUP_NAME `
   --name $APP_SERVICE_NAME `
   --settings DBHOST=$DB_SERVER_NAME `
              DBNAME=restaurant  `
              DBUSER=webappuser `
              STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT_NAME `
              STORAGE_CONTAINER_NAME=photos
```

---

* *$DBHOST* &rarr; Enter the server name you used earlier when you created the database, for example, *msdocs-web-app-postgres-database-\<unique-id>*. The sample code appends *.postgres.database.azure.com* to create the full qualified PostgreSQL server URL.
* *$DBNAME* &rarr; Enter *restaurant*, the name of the application database.
* *$DBUSER* &rarr; Enter *webappuser*, the user you created for the managed identity in the previous article. The sample code constructs the correct Postgres username from `DBUSER` and `DBHOST`, so don't include the *@server* portion.
* *$STORAGE_ACCOUNT_NAME* &rarr; The name of the storage account, which the sample code combines with *blob.core.windows.net* to create the storage URL endpoint.
* *$STORAGE_CONTAINER_NAME* &rarr; The name of the container in the storage account, where photos are stored. For example, *photos*.
* *SECRET_KEY* &rarr; Enter a secret key for the app. This key is used, for example, to encrypt the session cookie. You can generate a value with `python -c "import secrets; print(secrets.token_hex())"`.
