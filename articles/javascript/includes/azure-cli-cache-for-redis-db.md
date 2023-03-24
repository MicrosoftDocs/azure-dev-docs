---
ms.custom: devx-track-js, devx-track-azurecli
ms.topic: include
ms.date: 08/09/2022
---


### Create an Azure Cache for Redis resource with Azure CLI

Use the following Azure CLI [az redis create](/cli/azure/redis#az-redis-create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new Redis resource for your database. 

```azurecli
az redis create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE-NAME \
    --location eastus \
    --sku Basic \
    --vm-size c0 \
    --enable-non-ssl-port
```

This command may take a couple of minutes to complete and creates a publicly available resource in the `eastus` region. 

The response includes your server's configuration details including: 
* the version of Redis: `redisVersion`
* ports: `sslPort` and `port`


### Add firewall rule for your client IP address to Redis resource

Add firewall rules with [az redis firewall-rules create](/cli/azure/redis/firewall-rules#az-redis-firewall-rules-create) command to define access to your cache from your client IP or your app's IP.

```azurecli
az redis firewall-rules create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE-NAME \
    --rule-name AllowMyIP \
    --start-ip 123.123.123.123 \
    --end-ip 123.123.123.123
```

If you don't know your client IP address, use one of these methods:
* Use the Azure portal to view and change your firewall rules, which include adding your detected client IP.
* When you run your Node.js code, your receive an error about your firewall rules violation, which includes your client IP address. Copy the IP address and use it to set your firewall rule.

### Get the Redis keys with Azure CLI

Retrieve the Redis connection string for this instance with the [az redis list-keys](/cli/azure/redis#az-redis-list-keys) command:

```azurecli
az redis list-keys \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE-NAME
```

This returns the two keys:

```json
{
    "primaryKey": "5Uey0GHWtCs9yr1FMUMcu1Sv17AJA2QMqPm9CyNKjAA=",
    "secondaryKey": "DEPr+3zWbL6d5XwxPajAriXKgoSeCqraN8SLSoiMWhM="
  }
```

### Connect Azure Cache for Redis to your App service web app

Add connection information to your App service web app with [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command.

```azurecli
az webapp config appsettings set \
--subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
--resource-group YOUR-RESOURCE-GROUP \
--name YOUR-APP-SERVICE-RESOURCE-NAME \
--settings "REDIS_URL=YOUR-REDIS-HOST-NAME" "REDIS_PORT=YOUR-REDIS-PORT" "REDIS_KEY=YOUR-REDIS-KEY"
```

Replace the following settings in the preceding code:

* YOUR-SUBSCRIPTION-ID-OR-NAME
* YOUR-RESOURCE-GROUP
* YOUR-APP-SERVICE-RESOURCE-NAME
* YOUR-REDIS-HOST-NAME
* YOUR-REDIS-PORT
* YOUR-REDIS-KEY
