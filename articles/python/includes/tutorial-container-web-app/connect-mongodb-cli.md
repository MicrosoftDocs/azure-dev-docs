---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/12/2022
---

To set environment variables in App Service, you create *app settings* with the following [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp config appsettings set \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $APP_SERVICE_NAME \
   --settings CONNECTION_STRING=$CONNECTION_STRING \
              DB_NAME=$DB_NAME  \
              COLLECTION_NAME=$COLLECTION_NAME 
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp config appsettings set `
   --resource-group $RESOURCE_GROUP_NAME `
   --name $APP_SERVICE_NAME `
   --settings CONNECTION_STRING=$CONNECTION_STRING `
              DB_NAME=$DB_NAME  `
              COLLECTION_NAME=$COLLECTION_NAME 
```

---

* CONNECTION_STRING &rarr; A connection string that starts with "mongodb://".
* DB_NAME &rarr; Use "restaurants_reviews".
* COLLECTION_NAME &rarr; Use "restaurants_reviews".
* WEBSITES_PORT &rarr; Use "8000" for Django and "5000" for Flask. This environment variables specifies the port on which the container is listening.
