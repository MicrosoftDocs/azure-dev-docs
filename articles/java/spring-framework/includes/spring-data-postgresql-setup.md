---
ms.date: 05/18/2020
author: KarlErickson
ms.date: 07/15/2022
ms.author: bbenz
---

## Prepare the working environment

First, set up some environment variables. In [Azure Cloud Shell](https://shell.azure.com/), run the following commands:

### [Passwordless (Recommended)](#tab/passwordless)

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME=<YOUR_POSTGRESQL_AD_NON_ADMIN_USERNAME>
export AZ_LOCAL_IP_ADDRESS=<YOUR_LOCAL_IP_ADDRESS>
export CURRENT_USERNAME=$(az ad signed-in-user show --query userPrincipalName -o tsv)
export CURRENT_USER_OBJECTID=$(az ad signed-in-user show --query id -o tsv)
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_NAME>`: The name of your PostgreSQL server, which should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can see the full list of available regions by entering `az account list-locations`.
- `<YOUR_POSTGRESQL_AD_NON_ADMIN_USERNAME>`: The username of your PostgreSQL database server. Make sure the username is a valid user in your Azure AD tenant.
- `<YOUR_LOCAL_IP_ADDRESS>`: The IP address of your local computer, from which you'll run your Spring Boot application. One convenient way to find it is to open [whatismyip.akamai.com](http://whatismyip.akamai.com/).

> [!IMPORTANT]
> When setting <YOUR_POSTGRESQL_AD_NON_ADMIN_USERNAME>, the username must already exist in your Azure AD tenant or you will be unable to create an Azure AD user in your database.

### [Password](#tab/password)

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_POSTGRESQL_ADMIN_USERNAME=spring
export AZ_POSTGRESQL_ADMIN_PASSWORD=<YOUR_POSTGRESQL_ADMIN_PASSWORD>
export AZ_POSTGRESQL_NON_ADMIN_USERNAME=spring_non_admin
export AZ_POSTGRESQL_NON_ADMIN_PASSWORD=<YOUR_POSTGRESQL_NON_ADMIN_PASSWORD>
export AZ_LOCAL_IP_ADDRESS=<YOUR_LOCAL_IP_ADDRESS>
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_NAME>`: The name of your PostgreSQL server. It should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can see the full list of available regions by entering `az account list-locations`.
- `<YOUR_POSTGRESQL_ADMIN_PASSWORD>` and `<YOUR_POSTGRESQL_NON_ADMIN_PASSWORD>`: The password of your PostgreSQL database server. That password should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
- `<YOUR_LOCAL_IP_ADDRESS>`: The IP address of your local computer, from which you'll run your Spring Boot application. One convenient way to find it is to open [whatismyip.akamai.com](http://whatismyip.akamai.com/).

---

Next, create a resource group by using the following command:

```azurecli
az group create \
    --name $AZ_RESOURCE_GROUP \
    --location $AZ_LOCATION \
    --output tsv
```

## Create an Azure Database for PostgreSQL instance

### Create a PostgreSQL server and set up admin user

The first thing you'll create is a managed PostgreSQL server with an admin user.

> [!NOTE]
> You can read more detailed information about creating PostgreSQL servers in [Create an Azure Database for PostgreSQL server by using the Azure portal](/azure/postgresql/quickstart-create-server-database-portal).

#### [Passwordless (Recommended)](#tab/passwordless)

If you're using Azure CLI, run the following command to make sure it has sufficient permission:

```bash
az login --scope https://graph.microsoft.com/.default
```

Then, run following commands to create the server:

```azurecli
az postgres server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --location $AZ_LOCATION \
    --sku-name B_Gen5_1 \
    --storage-size 5120 \
    --output tsv
```

Next, run the following command to set the Azure AD admin user:

```azurecli
az postgres server ad-admin create \
    --resource-group $AZ_RESOURCE_GROUP \
    --server-name $AZ_DATABASE_NAME \
    --display-name $CURRENT_USERNAME \
    --object-id $CURRENT_USER_OBJECTID
```

> [!IMPORTANT]
> When setting the administrator, a new user is added to the Azure Database for PostgreSQL server with full administrator permissions. Only one Azure AD admin can be created per PostgreSQL server. Selection of another one will overwrite the existing Azure AD admin configured for the server.

This command creates a small PostgreSQL server and sets the Active Directory admin to the signed-in user.

#### [Password](#tab/password)

```azurecli
az postgres server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --location $AZ_LOCATION \
    --sku-name B_Gen5_1 \
    --storage-size 5120 \
    --admin-user $AZ_POSTGRESQL_ADMIN_USERNAME \
    --admin-password $AZ_POSTGRESQL_ADMIN_PASSWORD \
    --output tsv
```

This command creates a small PostgreSQL server.

---

### Configure a PostgreSQL database

The PostgreSQL server that you created earlier is empty. Use the following command to create a new database called `demo`:

```azurecli
az postgres db create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name demo \
    --server-name $AZ_DATABASE_NAME \
    --output tsv
```

### Configure a firewall rule for your PostgreSQL server

Azure Database for PostgreSQL instances are secured by default. They have a firewall that doesn't allow any incoming connection. To be able to use your database, you need to add a firewall rule that will allow the local IP address to access the database server.

Because you configured your local IP address at the beginning of this article, you can open the server's firewall by running the following command:

```azurecli
az postgres server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME-database-allow-local-ip-wsl \
    --server $AZ_DATABASE_NAME \
    --start-ip-address $AZ_LOCAL_IP_ADDRESS \
    --end-ip-address $AZ_LOCAL_IP_ADDRESS \
    --output tsv
```

If you're connecting to your PostgreSQL server from Windows Subsystem for Linux (WSL) on a Windows computer, you'll need to add the WSL host ID to your firewall.

Obtain the IP address of your host machine by running the following command in WSL:

```bash
cat /etc/resolv.conf
```

Copy the IP address following the term `nameserver`, then use the following command to set an environment variable for the WSL IP Address:

```bash
AZ_WSL_IP_ADDRESS=<the-copied-IP-address>
```

Then, use the following command to open the server's firewall to your WSL-based app:

```azurecli
az postgres server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME-database-allow-local-ip-wsl \
    --server $AZ_DATABASE_NAME \
    --start-ip-address $AZ_WSL_IP_ADDRESS \
    --end-ip-address $AZ_WSL_IP_ADDRESS \
    --output tsv
```

### Create a PostgreSQL non-admin user and grant permission

Next, create a non-admin user and grant all permissions on the `demo` database to it.

> [!NOTE]
> You can read more detailed information about creating PostgreSQL users in [Create users in Azure Database for PostgreSQL](/azure/PostgreSQL/single-server/how-to-create-users).

#### [Passwordless (Recommended)](#tab/passwordless)

Create a SQL script called *create_ad_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_ad_user.sql
SET aad_validate_oids_in_tenant = off;
CREATE ROLE "$AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME" WITH LOGIN IN ROLE azure_ad_user;
GRANT ALL PRIVILEGES ON DATABASE demo TO "$AZ_POSTGRESQL_AD_NON_ADMIN_USERNAME";
EOF
```

Then, use the following command to run the SQL script to create the Azure AD non-admin user:

```bash
psql "host=$AZ_DATABASE_NAME.postgres.database.azure.com user=$CURRENT_USERNAME@$AZ_DATABASE_NAME dbname=demo port=5432 password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) sslmode=require" < create_ad_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_ad_user.sql
```

#### [Password](#tab/password)

Create a SQL script called *create_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_user.sql
CREATE ROLE "$AZ_POSTGRESQL_NON_ADMIN_USERNAME" WITH LOGIN PASSWORD '$AZ_POSTGRESQL_NON_ADMIN_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE demo TO "$AZ_POSTGRESQL_NON_ADMIN_USERNAME";
EOF
```

Then, use the following command to run the SQL script to create the Azure AD non-admin user:

```bash
psql "host=$AZ_DATABASE_NAME.postgres.database.azure.com user=$AZ_POSTGRESQL_ADMIN_USERNAME@$AZ_DATABASE_NAME dbname=demo port=5432 password=$AZ_POSTGRESQL_ADMIN_PASSWORD sslmode=require" < create_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_user.sql
```

---
