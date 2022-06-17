---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

To set environment variables in App Service, you create *app settings* with the following [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp config appsettings set \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $APP_SERVICE_NAME \
   --settings DBHOST=$DB_SERVER_NAME \
              DBNAME=$DB_NAME \
              DBUSER=$ADMIN_USERNAME \
              STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT_NAME \
              STORAGE_CONTAINER_NAME=photos
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp config appsettings set `
   --resource-group $RESOURCE_GROUP_NAME `
   --name $APP_SERVICE_NAME `
   --settings DBHOST=$DB_SERVER_NAME `
              DBNAME=$DB_NAME  `
              DBUSER=$ADMIN_USERNAME `
              STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT_NAME `
              STORAGE_CONTAINER_NAME=photos
```

---

* *$DBHOST* &rarr; Use the name of the name you used earlier with the `az postgres server create` command. The Python sample code automatically appends `.postgres.database.azure.com` to create the full PostgreSQL server URL.
* *$DBNAME* &rarr; Use `restaurant`.
* *$DBUSER* &rarr; Use the administrator credentials that you used with the earlier `az postgres server create` command. The Python sample code automatically constructs the full Postgres username from `DBUSER` and `DBHOST`, so don't include the `@server` portion.
* *$STORAGE_ACCOUNT_NAME* &rarr; The name of the storage account, which is the first part of the full endpoint: `https://<STORAGE_ACCOUNT_NAME>.blob.core.windows.net/`.
* *$STORAGE_CONTAINER_NAME* &rarr; The name of the container in the storage account, where photos are stored. For example, "photos".