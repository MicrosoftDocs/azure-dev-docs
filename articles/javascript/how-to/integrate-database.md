---
title: Databases with Node.js apps on Azure
description: Azure offers a number of different databases for use with web and other Node.js apps.
ms.topic: how-to
ms.date: 12/08/2020
ms.custom: devx-track-js
---

# Integrate databases in Node.js apps

Azure databases provide a great managed cloud data solution along with either a native API or an Azure SDK to connect to the database. 

## Database and data storage solutions on Azure

The following table links to a variety of articles for connecting to and using Azure databases with Node.js. For a side-by-side list of different database options, see [Databases - Fully managed intelligent database services](https://azure.microsoft.com/product-categories/databases/).

| Service | Quickstart | npm package |
| --- | --- | --- |
| **SQL Server** on Cosmos DB| [Create a Node.js Azure Cosmos DB web app using SQL Server](/azure/cosmos-db/create-sql-api-nodejs) | [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos) |
| **MongoDB**  on Cosmos DB| [Create a Node.js and MongoDB web app](/azure/app-service-web/app-service-web-tutorial-nodejs-mongodb-app) | any MongoDB client |
| **Cassandra**  on Cosmos DB|[Build a Cassandra app with Node.js SDK and Azure Cosmos DB](/azure/cosmos-db/create-cassandra-nodejs)|[npm cassandra-driver](https://www.npmjs.com/package/cassandra-driver)|
| **Gremlin**  on Cosmos DB|[Build a Node.js application by using Azure Cosmos DB Gremlin API account](/azure/cosmos-db/create-graph-nodejs)|[npm gremlin](https://www.npmjs.com/package/gremlin)|
| **Redis Cache**  on Cosmos DB| [Create and consume a Redis cache](/azure/redis-cache/cache-nodejs-get-started) | [npm redis](https://www.npmjs.com/package/redis)|
| **Azure SQL database** | [Use Node.js to query and Azure SQL database](/azure/sql-database/sql-database-connect-query-nodejs) |[npm tedious](https://www.npmjs.com/package/tedious) |
| **MySQL** | [Use Node.js to connect and query data](/azure/mysql/connect-nodejs) | [npm mysql](https://www.npmjs.com/package/mysql)|
| **PostgreSQL** | [Use Node.js to connect and query data](/azure/postgresql/connect-nodejs) |[npm pg](https://www.npmjs.com/package/pg) |

## Cosmos DB connection strings with Azure CLI

Use the following command, [az cosmosdb keys list](/cli/azure/cosmosdb?view=azure-cli-latest#az-cosmosdb-list-connection-strings):

```azurecli-interactive
az cosmosdb keys list \
    -n $accountName \
    -g $resourceGroupName \
    --type connection-strings
```

## SQL connection strings with Azure CLI

Use the following command, [az sql db show-connection-string](/cli/azure/sql/db?view=azure-cli-latest#az_sql_db_show_connection_string):

```azurecli-interactive
az sql db show-connection-string \
    --client {ado.net, jdbc, odbc, php, php_pdo, sqlcmd} \
     [--auth-type {ADIntegrated, ADPassword, SqlPassword}] \
     [--ids] \
     [--name] \
     [--server] \
     [--subscription]
```

## MySQL username and password with Azure CLI

These are set at [resource creation time](/cli/azure/mysql/server?view=azure-cli-latest#az_mysql_server_create). 

## PostgreSQL username and password with Azure CLI

These are set at [resource creation time](/cli/azure/postgres/server?view=azure-cli-latest#az_postgres_server_create). 

## Azure Storage solutions for files and data

You can also use Azure Storage for file (blob), table, and queue (message) storage:

| Service | Quickstart |Recommended SDK |
| --- | --- |--- |
| **Blobs** | [Upload, download, list, and delete blobs using Azure Storage v10 SDK for JavaScript](/azure/storage/blobs/storage-quickstart-blobs-nodejs-v10) |[@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob)|
| **Queues** | [How to use Queue storage from Node.js](/azure/storage/queues/storage-nodejs-how-to-use-queues) |[npm @azure/storage-queue](https://www.npmjs.com/package/@azure/storage-queue)|
| **Tables** | [How to use Table storage from Node.js](/azure/cosmos-db/table-storage-how-to-use-nodejs) |[npm azure-storage](https://www.npmjs.com/package/azure-storage)|

## Next steps

* [Write serverless code](develop-serverless-apps.md) with Azure functions