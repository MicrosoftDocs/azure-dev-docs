---
ms.custom: devx-track-js
ms.topic: include
ms.date: 02/18/2021
---


## Create an Azure Cache for Redis resource with Azure CLI

Use the following Azure CLI [az redis create](/cli/azure/redis#az_redis_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new MariaDB resource for your database. 

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

```text
{
  "accessKeys": null,
  "enableNonSslPort": true,
  "hostName": "YOUR-RESOURCE-NAME.redis.cache.windows.net",
  "id": "/subscriptions/bb881e62-cf77-4d5d-89fb-29d71e930b66/resourceGroups/YOUR-RESOURCE-GROUP/providers/Microsoft.Cache/Redis/YOUR-RESOURCE-NAME",
  "instances": [
    {
      "isMaster": false,
      "nonSslPort": 13000,
      "shardId": null,
      "sslPort": 15000,
      "zone": null
    }
  ],
  "linkedServers": [],
  "location": "East US",
  "minimumTlsVersion": null,
  "name": "YOUR-RESOURCE-NAME",
  "port": 6379,
  "provisioningState": "Creating",
  "redisConfiguration": {
    "maxclients": "256",
    "maxfragmentationmemory-reserved": "12",
    "maxmemory-delta": "2",
    "maxmemory-reserved": "2"
  },
  "redisVersion": "4.0.14",
  "replicasPerMaster": null,
  "resourceGroup": "YOUR-RESOURCE-GROUP",
  "shardCount": null,
  "sku": {
    "capacity": 0,
    "family": "C",
    "name": "Basic"
  },
  "sslPort": 6380,
  "staticIp": null,
  "subnetId": null,
  "tags": {},
  "tenantSettings": {},
  "type": "Microsoft.Cache/Redis",
  "zones": null
}
```

## Add firewall rule for your client IP address to Redis resource

Add firewall rules with [az redis firewall-rules create](/cli/azure/redis/firewall-rules#az_redis_firewall_rules_create) command to define access to your cache from your client IP or your app's IP.

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
* Use the Azure portal to view and change your firewall rules, which includes adding your detected client IP
* Run you Node.js code, the error about your firewall rules violation includes your client IP address

## Get the Redis keys with Azure CLI

Retrieve the Redis connection string for this instance with the [az redis list-keys](/cli/azure/redis#az_redis_list_keys) command:

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