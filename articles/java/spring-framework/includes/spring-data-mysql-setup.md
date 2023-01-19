---
author: KarlErickson
ms.date: 09/27/2022
ms.author: bbenz
---

## Prepare the working environment

First, set up some environment variables by running the following commands:

### [Passwordless (Recommended)](#tab/passwordless)

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_MYSQL_AD_NON_ADMIN_USERNAME=spring-non-admin
export AZ_USER_IDENTITY_NAME=<YOUR_USER_ASSIGNED_MANAGEMED_IDENTITY_NAME>
export CURRENT_USERNAME=$(az ad signed-in-user show --query userPrincipalName -o tsv)
export CURRENT_USER_OBJECTID=$(az ad signed-in-user show --query id -o tsv)
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_NAME>`: The name of your MySQL server, which should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can have the full list of available regions by entering `az account list-locations`.
- `<YOUR_USER_ASSIGNED_MANAGEMED_IDENTITY_NAME>`: The name of your user-assigned managed identity server, which should be unique across Azure.

### [Password](#tab/password)

```bash
export AZ_RESOURCE_GROUP=database-workshop
export AZ_DATABASE_NAME=<YOUR_DATABASE_NAME>
export AZ_LOCATION=<YOUR_AZURE_REGION>
export AZ_MYSQL_ADMIN_USERNAME=spring
export AZ_MYSQL_ADMIN_PASSWORD=<YOUR_MYSQL_ADMIN_PASSWORD>
export AZ_MYSQL_NON_ADMIN_USERNAME=spring-non-admin
export AZ_MYSQL_NON_ADMIN_PASSWORD=<YOUR_MYSQL_NON_ADMIN_PASSWORD>
```

Replace the placeholders with the following values, which are used throughout this article:

- `<YOUR_DATABASE_NAME>`: The name of your MySQL server, which should be unique across Azure.
- `<YOUR_AZURE_REGION>`: The Azure region you'll use. You can use `eastus` by default, but we recommend that you configure a region closer to where you live. You can see the full list of available regions by using `az account list-locations`.
- `<YOUR_MYSQL_ADMIN_PASSWORD>` and `<YOUR_MYSQL_NON_ADMIN_PASSWORD>`: The password of your MySQL database server. That password should have a minimum of eight characters. The characters should be from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).

---

Next, create a resource group:

```azurecli
az group create \
    --name $AZ_RESOURCE_GROUP \
    --location $AZ_LOCATION \
    --output tsv
```

## Create an Azure Database for MySQL instance and set up the admin user

The first thing you'll create is a managed MySQL server with an admin user.

> [!NOTE]
> You can read more detailed information about creating MySQL servers in [Create an Azure Database for MySQL server by using the Azure portal](/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal).

### [Passwordless (Recommended)](#tab/passwordless)

If you're using Azure CLI, run the following command to make sure it has sufficient permission:

```bash
az login --scope https://graph.microsoft.com/.default
```

Run the following command to create the server:

```azurecli
az mysql flexible-server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --location $AZ_LOCATION \
    --yes \
    --output tsv
```

Run the following command to create the user identity for assigning:

```azurecli
az identity create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_USER_IDENTITY_NAME
```

> [!IMPORTANT]
> After creating the user-assigned identity, ask your *Global Administrator* or *Privileged Role Administrator* to grant the following permissions for this identity: `User.Read.All`, `GroupMember.Read.All`, and `Application.Read.ALL`. For more information, see the [Permissions](/azure/mysql/flexible-server/concepts-azure-ad-authentication#permissions) section of [Active Directory authentication](/azure/mysql/flexible-server/concepts-azure-ad-authentication).

Run the following command to assign the identity to the MySQL server for creating the Azure AD admin:

```azurecli
az mysql flexible-server identity assign \
    --resource-group $AZ_RESOURCE_GROUP \
    --server-name $AZ_DATABASE_NAME \
    --identity $AZ_USER_IDENTITY_NAME
```

Run the following command to set the Azure AD admin user:

```azurecli
az mysql flexible-server ad-admin create \
    --resource-group $AZ_RESOURCE_GROUP \
    --server-name $AZ_DATABASE_NAME \
    --display-name $CURRENT_USERNAME \
    --object-id $CURRENT_USER_OBJECTID \
    --identity $AZ_USER_IDENTITY_NAME
```

> [!IMPORTANT]
> When setting the administrator, a new user is added to the Azure Database for MySQL server with full administrator permissions. Only one Azure AD admin can be created per MySQL server and selection of another one will overwrite the existing Azure AD admin configured for the server.

### [Password](#tab/password)

Run the following command to create the server:

```azurecli
az mysql flexible-server create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --location $AZ_LOCATION \
    --admin-user $AZ_MYSQL_ADMIN_USERNAME \
    --admin-password $AZ_MYSQL_ADMIN_PASSWORD \
    --yes \
    --output tsv
```

---

## Configure a MySQL database

Create a new database called `demo` by using the following command:

```azurecli
az mysql flexible-server db create \
    --resource-group $AZ_RESOURCE_GROUP \
    --database-name demo \
    --server-name $AZ_DATABASE_NAME \
    --output tsv
```

## Configure a firewall rule for your MySQL server

Azure Database for MySQL instances are secured by default. They have a firewall that doesn't allow any incoming connection.

You can skip this step if you're using Bash because the `flexible-server create` command already detected your local IP address and set it on MySQL server.

If you're connecting to your MySQL server from Windows Subsystem for Linux (WSL) on a Windows computer, you'll need to add the WSL host ID to your firewall. Obtain the IP address of your host machine by running the following command in WSL:

```bash
cat /etc/resolv.conf
```

Copy the IP address following the term `nameserver`, then use the following command to set an environment variable for the WSL IP Address:

```bash
AZ_WSL_IP_ADDRESS=<the-copied-IP-address>
```

Then, use the following command to open the server's firewall to your WSL-based app:

```azurecli
az mysql flexible-server firewall-rule create \
    --resource-group $AZ_RESOURCE_GROUP \
    --name $AZ_DATABASE_NAME \
    --start-ip-address $AZ_WSL_IP_ADDRESS \
    --end-ip-address $AZ_WSL_IP_ADDRESS \
    --rule-name allowiprange \
    --output tsv
```

## Create a MySQL non-admin user and grant permission

This step will create a non-admin user and grant all permissions on the `demo` database to it.

> [!NOTE]
> You can read more detailed information about creating MySQL users in [Create users in Azure Database for MySQL](/azure/mysql/single-server/how-to-create-users).

### [Passwordless (Recommended)](#tab/passwordless)

You've already enabled the Azure AD authentication. This step will create an Azure AD user and grant permissions.

First, create a SQL script called *create_ad_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
AZ_MYSQL_AD_NON_ADMIN_USERID=$CURRENT_USER_OBJECTID

cat << EOF > create_ad_user.sql
SET aad_auth_validate_oids_in_tenant = OFF;
CREATE AADUSER '$AZ_MYSQL_AD_NON_ADMIN_USERNAME' IDENTIFIED BY '$AZ_MYSQL_AD_NON_ADMIN_USERID';
GRANT ALL PRIVILEGES ON demo.* TO '$AZ_MYSQL_AD_NON_ADMIN_USERNAME'@'%';
FLUSH privileges;
EOF
```

Then, use the following command to run the SQL script to create the Azure AD non-admin user:

```bash
mysql -h $AZ_DATABASE_NAME.mysql.database.azure.com --user $CURRENT_USERNAME --enable-cleartext-plugin --password=$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken) < create_ad_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_ad_user.sql
```

### [Password](#tab/password)

First, create a SQL script called *create_user.sql* for creating a non-admin user. Add the following contents and save it locally:

```bash
cat << EOF > create_user.sql
CREATE USER '$AZ_MYSQL_NON_ADMIN_USERNAME'@'%' IDENTIFIED BY '$AZ_MYSQL_NON_ADMIN_PASSWORD';
GRANT ALL PRIVILEGES ON demo.* TO '$AZ_MYSQL_NON_ADMIN_USERNAME'@'%';
FLUSH PRIVILEGES;
EOF
```

Then, use the following command to run the SQL script to create the non-admin user:

```bash
mysql -h $AZ_DATABASE_NAME.mysql.database.azure.com --user $AZ_MYSQL_ADMIN_USERNAME --enable-cleartext-plugin --password=$AZ_MYSQL_ADMIN_PASSWORD < create_user.sql
```

Now use the following command to remove the temporary SQL script file:

```bash
rm create_user.sql
```

---
