---
ms.custom: devx-track-js
ms.topic: include
ms.date: 02/08/2021
---


## Create a Cosmos DB resource for Cassandra DB

Use the following Azure CLI [az cosmosdb create](/cli/azure/cosmosdb#az_cosmosdb_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new resource for your Cassandra database. 

```azurecli
az cosmosdb create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE_NAME \
    --capabilities EnableCassandra
```

This command may take a couple of minutes to complete and creates a publicly available resource. You don't need to configure firewall rules to allow your client IP address through. 

The response includes your server's configuration details including: 

* the public endpoint 

```json
{
  "apiProperties": null,
  "capabilities": [
    {
      "name": "EnableCassandra"
    }
  ],
  "connectorOffer": null,
  "consistencyPolicy": {
    "defaultConsistencyLevel": "Session",
    "maxIntervalInSeconds": 5,
    "maxStalenessPrefix": 100
  },
  "cors": [],
  "databaseAccountOfferType": "Standard",
  "disableKeyBasedMetadataWriteAccess": false,
  "documentEndpoint": "https://YOUR-RESOURCE_NAME.documents.azure.com:443/",
  "enableAnalyticalStorage": false,
  "enableAutomaticFailover": false,
  "enableCassandraConnector": null,
  "enableFreeTier": false,
  "enableMultipleWriteLocations": false,
  "failoverPolicies": [
    {
      "failoverPriority": 0,
      "id": "YOUR-RESOURCE_NAME-centralus",
      "locationName": "Central US"
    }
  ],
  "id": "/subscriptions/YOUR-SUBSCRIPTION-ID-OR-NAME/resourceGroups/YOUR-RESOURCE-GROUP/providers/Microsoft.DocumentDB/databaseAccounts/YOUR-RESOURCE_NAME",
  "ipRules": [],
  "isVirtualNetworkFilterEnabled": false,
  "keyVaultKeyUri": null,
  "kind": "GlobalDocumentDB",
  "location": "Central US",
  "locations": [
    {
      "documentEndpoint": "https://YOUR-RESOURCE_NAME-centralus.documents.azure.com:443/",
      "failoverPriority": 0,
      "id": "YOUR-RESOURCE_NAME-centralus",
      "isZoneRedundant": false,
      "locationName": "Central US",
      "provisioningState": "Succeeded"
    }
  ],
  "name": "YOUR-RESOURCE_NAME",
  "privateEndpointConnections": null,
  "provisioningState": "Succeeded",
  "publicNetworkAccess": "Enabled",
  "readLocations": [
    {
      "documentEndpoint": "https://YOUR-RESOURCE_NAME-centralus.documents.azure.com:443/",
      "failoverPriority": 0,
      "id": "YOUR-RESOURCE_NAME-centralus",
      "isZoneRedundant": false,
      "locationName": "Central US",
      "provisioningState": "Succeeded"
    }
  ],
  "resourceGroup": "YOUR-RESOURCE-GROUP",
  "systemData": {
    "createdAt": "2021-02-16T23:00:23.0375775Z"
  },
  "tags": {},
  "type": "Microsoft.DocumentDB/databaseAccounts",
  "virtualNetworkRules": [],
  "writeLocations": [
    {
      "documentEndpoint": "https://YOUR-RESOURCE_NAME-centralus.documents.azure.com:443/",
      "failoverPriority": 0,
      "id": "YOUR-RESOURCE_NAME-centralus",
      "isZoneRedundant": false,
      "locationName": "Central US",
      "provisioningState": "Succeeded"
    }
  ]
}
```


## Create a keyspace on the server with Azure CLI

Use the following Azure CLI [az cosmosdb cassandra keyspace create](/cli/azure/cosmosdb/cassandra/keyspace#az_cosmosdb_cassandra_keyspace_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new Cassandra keyspace on your server. 

```azurecli
az mariadb db create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --account-name YOUR-RESOURCE_NAME \
    --name YOUR-KEYSPACE-NAME
```

## Create a table on the keyspace with Azure CLI

Use the following Azure CLI [az cosmosdb cassandra keyspace create](/cli/azure/cosmosdb/cassandra/table#az_cosmosdb_cassandra_table_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new Cassandra keyspace on your server. 

```azurecli
az cosmosdb cassandra table create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --account-name YOUR-RESOURCE_NAME \
    --keyspace-name YOUR-KEYSPACE-NAME \
    --name YOUR-TABLE-NAME \
    --schema @schema.json
```

The schema file's JSON defines the table columns, data types, and partition key:

```json
{
    "columns": [
        {
            "name": "Name",
            "type": "Ascii"
        },
        {
            "name": "Alias",
            "type": "Ascii"
        },
        {
            "name": "Region",
            "type": "Ascii"
        }        
    ],
    "partitionKeys": [
        {
            "name": "Region"
        }
    ]
}
```

## Get the Cassandra connection string with Azure CLI
Retrieve the MongoDB connection string for this instance with the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az_cosmosdb_keys_list) command:

```azurecli
az cosmosdb keys list \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE-NAME \
    --type connection-strings 
```

This returns your connection strings. The following JSON is an example result with the security information replaced with:

* `YOUR-RESOURCE-NAME`
* `PASSWORD-1`
* `PASSWORD-2`
* `ACCOUNT-KEY-1`
* `ACCOUNT-KEY-2`

```json
{
    "connectionStrings": [
      {
        "connectionString": "AccountEndpoint=https://YOUR-RESOURCE-NAME.documents.azure.com:443/;AccountKey=PASSWORD-1;",
        "description": "Primary SQL Connection String"
      },
      {
        "connectionString": "AccountEndpoint=https://YOUR-RESOURCE-NAME.documents.azure.com:443/;AccountKey=PASSWORD-2;",
        "description": "Secondary SQL Connection String"
      },
      {
        "connectionString": "AccountEndpoint=https://YOUR-RESOURCE-NAME.documents.azure.com:443/;AccountKey=ACCOUNT-KEY-1;",
        "description": "Primary Read-Only SQL Connection String"
      },
      {
        "connectionString": "AccountEndpoint=https://YOUR-RESOURCE-NAME.documents.azure.com:443/;AccountKey=ACCOUNT-KEY-2;",
        "description": "Secondary Read-Only SQL Connection String"
      },
      {
        "connectionString": "HostName=YOUR-RESOURCE-NAME.cassandra.cosmos.azure.com;Username=YOUR-RESOURCE-NAME;Password=PASSWORD-1;Port=10350",
        "description": "Primary Cassandra Connection String"
      },
      {
        "connectionString": "HostName=YOUR-RESOURCE-NAME.cassandra.cosmos.azure.com;Username=YOUR-RESOURCE-NAME;Password=PASSWORD-2;Port=10350",
        "description": "Secondary Cassandra Connection String"
      },
      {
        "connectionString": "HostName=YOUR-RESOURCE-NAME.cassandra.cosmos.azure.com;Username=YOUR-RESOURCE-NAME;Password=ACCOUNT-KEY-1;Port=10350",
        "description": "Primary Read-Only Cassandra Connection String"
      },
      {
        "connectionString": "HostName=YOUR-RESOURCE-NAME.cassandra.cosmos.azure.com;Username=YOUR-RESOURCE-NAME;Password=ACCOUNT-KEY-2;Port=10350",
        "description": "Secondary Read-Only Cassandra Connection String"
      }
    ]
  }
```

Connect to the Cassandra database with a connection string. 