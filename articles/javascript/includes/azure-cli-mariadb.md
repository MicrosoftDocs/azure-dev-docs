---
ms.custom: devx-track-js
ms.topic: include
ms.date: 02/04/2021
---


## Create a MariaDB resource with Azure CLI

Use the following Azure CLI [az mariadb server create](/cli/azure/mariadb/server#az_mariadb_server_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new MariaDB resource for your database. 

```azurecli
az mariadb server create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOURRESOURCENAME \
    --enable-public-network true \
    --location eastus \
    --admin-user YOUR-ADMIN-NAME \
    --admin-password YOUR-ADMIN-PASSWORD \
    --sku-name GP_Gen5_2 \
    --version 10.2 
```

This command may take a couple of minutes to complete and creates a publicly available resource in the `eastus` region. 

## Create a database on the server with Azure CLI

Use the following Azure CLI [az mariadb db create](/cli/azure/mariadb/db#az_mariadb_db_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new MariaDB database on your server. 

```azurecli
az mariadb db create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --server-name YOURRESOURCENAME \
    --name YOURDATABASENAME
```

## Get the MariaDB connection string with Azure CLI

Retrieve the MariaDB connection string for this instance with the [az mariadb server show-connection-string](/cli/azure/mariadb/server#az_mariadb_server_show_connection_string) command:

```azurecli
az mariadb server show-connection-string \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --server-name YOURRESOURCENAME \
    --database-name YOURDATABASENAME \
    --admin-user YOUR-ADMIN-NAME \
    --admin-password YOUR-ADMIN-PASSWORD 
```

This returns the connection strings for the popular languages as a JSON object:

```json
{
  "connectionStrings": {
    "ado.net": "Server=YOURRESOURCENAME.mariadb.database.azure.com; Port=3306; Database=YOURDATABASENAME; Uid=YOUR-ADMIN-NAME@YOURRESOURCENAME; Pwd=YOUR-ADMIN-PASSWORD",
    "jdbc": "jdbc:mariadb://YOURRESOURCENAME.mariadb.database.azure.com:3306/YOURDATABASENAME?user=YOUR-ADMIN-NAME@YOURRESOURCENAME&password=YOUR-ADMIN-PASSWORD",
    "node.js": "var conn = mysql.createConnection({host: 'YOURRESOURCENAME.mariadb.database.azure.com', user: 'YOUR-ADMIN-NAME@YOURRESOURCENAME',password: YOUR-ADMIN-PASSWORD, database: YOURDATABASENAME, port: 3306});",
    "php": "host=YOURRESOURCENAME.mariadb.database.azure.com port=3306 dbname=YOURDATABASENAME user=YOUR-ADMIN-NAME@YOURRESOURCENAME password=YOUR-ADMIN-PASSWORD",
    "python": "cnx = mysql.connector.connect(user='YOUR-ADMIN-NAME@YOURRESOURCENAME', password='YOUR-ADMIN-PASSWORD', host='YOURRESOURCENAME.mariadb.database.azure.com', port=3306, database='YOURDATABASENAME')",
    "ruby": "client = Mysql2::Client.new(username: 'YOUR-ADMIN-NAME@YOURRESOURCENAME', password: 'YOUR-ADMIN-PASSWORD', database: 'YOURDATABASENAME', host: 'YOURRESOURCENAME.mariadb.database.azure.com', port: 3306)"
  }
}
``` 



