---
ms.topic: include
ms.date: 10/09/2023
---

To set environment variables in App Service, you create *app settings* with the following [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

```azurecli
MONGO_CONNECTION_STRING='your Mongo DB connection string in single quotes'
MONGO_DB_NAME=restaurants_reviews
MONGO_COLLECTION_NAME=restaurants_reviews

az webapp config appsettings set \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $APP_SERVICE_NAME \
   --settings CONNECTION_STRING=$MONGO_CONNECTION_STRING \
              DB_NAME=$MONGO_DB_NAME  \
              COLLECTION_NAME=$MONGO_COLLECTION_NAME 
```

* CONNECTION_STRING: A connection string that starts with "mongodb://".
* DB_NAME: Use "restaurants_reviews".
* COLLECTION_NAME: Use "restaurants_reviews".
