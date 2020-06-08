---
 author: judubois
 ms.date: 05/18/2020
 ms.author: judubois
---

## Prepare the working environment

First, set up some environment variables by using the following commands:

```bash
AZ_RESOURCE_GROUP=database-workshop
AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
AZ_LOCATION=<YOUR_AZURE_REGION>
AZ_SQL_SERVER_USERNAME=spring
AZ_SQL_SERVER_PASSWORD=<YOUR_AZURE_SQL_PASSWORD>
AZ_LOCAL_IP_ADDRESS=<YOUR_LOCAL_IP_ADDRESS>
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_NAME>`: The name of your Azure SQL Database server. It should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can have the full list of available regions by entering `az account list-locations`.
- `<AZ_SQL_SERVER_PASSWORD>`: The password of your Azure SQL Database server. That password should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
- `<YOUR_LOCAL_IP_ADDRESS>`: The IP address of your local computer, from which you'll run your Spring Boot application. One convenient way to find it is to point your browser to [whatismyip.akamai.com](http://whatismyip.akamai.com/).

Next, create a resource group using the following command:

```azurecli
az group create \
    --name $AZ_RESOURCE_GROUP \
    --location $AZ_LOCATION \
    | jq
```

> [!NOTE]
> We use the `jq` utility to display JSON data and make it more readable. This utility is installed by default on [Azure Cloud Shell](https://shell.azure.com/). If you don't like that utility, you can safely remove the `| jq` part of all the commands we'll use.

## Create an Azure SQL Database instance

The first thing we'll create is a managed Azure SQL Database server.

> [!NOTE]
> You can read more detailed information about creating Azure SQL Database servers in [Quickstart: Create an Azure SQL Database single database](/azure/sql-database/sql-database-single-database-get-started).

In [Azure Cloud Shell](https://shell.azure.com/), run the following command:

```azurecli
az sql server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --location $AZ_LOCATION \
    --admin-user $AZ_SQL_SERVER_USERNAME \
    --admin-password $AZ_SQL_SERVER_PASSWORD \
    | jq
```

This command creates an Azure SQL Database server.

### Configure a firewall rule for your Azure SQL Database server

Azure SQL Database instances are secured by default. They have a firewall that doesn't allow any incoming connection. To be able to use your database, you need to add a firewall rule that will allow the local IP address to access the database server.

Because you configured our local IP address at the beginning of this article, you can open the server's firewall by running the following command:

```azurecli
az sql server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME-database-allow-local-ip \
    --server $AZ_DATABASE_NAME \
    --start-ip-address $AZ_LOCAL_IP_ADDRESS \
    --end-ip-address $AZ_LOCAL_IP_ADDRESS \
    | jq
```

### Configure a Azure SQL database

The Azure SQL Database server that you created earlier is empty. It doesn't have any database that you can use with the Spring Boot application. Create a new database called `demo` by running the following command:

```azurecli
az sql db create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name demo \
    --server $AZ_DATABASE_NAME \
    | jq
```
