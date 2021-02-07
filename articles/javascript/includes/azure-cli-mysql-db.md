---
ms.custom: devx-track-js
ms.topic: include
ms.date: 02/04/2021
---


## Create an Azure Database for MySQL resource with Azure CLI

Use the following Azure CLI [az mysql server create](/cli/azure/mysql/server#az_mysql_server_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new MySQL resource for your database. 

```azurecli
az mysql server create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOURRESOURCENAME \
    --enable-public-network Enabled \
    --location eastus \
    --admin-user YOUR-ADMIN-NAME \
    --admin-password YOUR-ADMIN-PASSWORD \
    --sku-name B_Gen5_1 \
    --ssl-enforcement Disabled \
    --version 5.7 
```

This command may take a couple of minutes to complete and creates a publicly available resource in the `eastus` region. 

## Create a database on the server with Azure CLI

Use the following Azure CLI [az mysql db create](/cli/azure/mysql/db#az_mysql_db_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new MySQL database on your server. 

```azurecli
az mysql db create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --server-name YOURRESOURCENAME \
    --name YOURDATABASENAME
```


## Get the MySql connection string with Azure CLI

Retrieve the MySql connection string for this instance with the [az mysql server show-connection-string](/cli/azure/mysql/server#az_mysql_server_show_connection_string) command:

```azurecli
az mysql server show-connection-string \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --server-name YOURRESOURCENAME
```

This returns the connection strings for the popular languages as a JSON object. You need to replace `{database}`, `{username}`, and `{password}` with your own values before using the connection string. 

```json
{
  "connectionStrings": {
    "ado.net": "Server=YOURRESOURCENAME.mysql.database.azure.com; Port=3306; Database={database}; Uid={username}@YOURRESOURCENAME; Pwd={password}",
    "jdbc": "jdbc:mysql://YOURRESOURCENAME.mysql.database.azure.com:3306/{database}?user={username}@YOURRESOURCENAME&password={password}",
    "mysql_cmd": "mysql {database} --host YOURRESOURCENAME.mysql.database.azure.com --user {username}@YOURRESOURCENAME --password={password}",
    "node.js": "var conn = mysql.createConnection({host: 'YOURRESOURCENAME.mysql.database.azure.com', user: '{username}@YOURRESOURCENAME',password: {password}, database: {database}, port: 3306});",
    "php": "host=YOURRESOURCENAME.mysql.database.azure.com port=3306 dbname={database} user={username}@YOURRESOURCENAME password={password}",
    "python": "cnx = mysql.connector.connect(user='{username}@YOURRESOURCENAME', password='{password}', host='YOURRESOURCENAME.mysql.database.azure.com', port=3306, database='{database}')",
    "ruby": "client = Mysql2::Client.new(username: '{username}@YOURRESOURCENAME', password: '{password}', database: '{database}', host: 'YOURRESOURCENAME.mysql.database.azure.com', port: 3306)"
  }
}
``` 