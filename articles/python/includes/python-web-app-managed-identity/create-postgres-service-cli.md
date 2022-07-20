---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

**Step 1.** Run the [az postgres server create](/cli/azure/postgres/server#az-postgres-server-create) command to create the PostgreSQL server and database in Azure using the values below. It is not uncommon for this command to run for a few minutes to complete.

#### [bash](#tab/terminal-bash)

```azurecli
RESOURCE_GROUP_NAME='msdocs-web-app-rg'
DB_SERVER_NAME='msdocs-web-app-postgres-database-<unique-id>'
LOCATION='eastus'

az postgres server create \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $DB_SERVER_NAME  \
   --location $LOCATION \
   --admin-user <admin-user-name> \
   --admin-password <admin-password> \
   --sku-name B_Gen5_1
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$RESOURCE_GROUP_NAME='msdocs-web-app-rg'
$DB_SERVER_NAME='msdocs-web-app-postgres-database-<unique-id>'
$LOCATION='eastus'

az postgres server create `
   --resource-group $RESOURCE_GROUP_NAME `
   --name $DB_SERVER_NAME  `
   --location $LOCATION `
   --admin-user <admin-user-name> `
   --admin-password <admin-password> `
   --sku-name B_Gen5_1 
```

---

* *resource-group* &rarr; Use the same resource group name in which you created the web app, for example `msdocs-web-app-rg`.
* *name* &rarr; The PostgreSQL database server name. This name must be **unique across all Azure** (the server endpoint becomes `https://<name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. For example, use "msdocs-web-app-postgres-database-\<unique-id>".)
* *location* &rarr; Use the same location used for the web app. Change the location in the command above for your deployment.
* *admin-user* &rarr; Username for the administrator account. It can't be `azure_superuser`, `admin`, `administrator`, `root`, `guest`, or `public`. For example, `demoadmin` is okay.
* *admin-password* Password of the administrator user. It must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.

    > [!IMPORTANT]
    > When creating usernames or passwords **do not** use the `$` character. Later you create environment variables with these values where the `$` character has special meaning within the Linux container used to run Python apps.

* *sku-name* &rarr; The name of the pricing tier and compute configuration, for example `B_Gen5_1`. Follow the convention {pricing tier}{compute generation}{vCores} set create this variable. For more information, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/). To list available SKUs, use `az postgres server list-skus --location`.

**Step 2.** Configure the firewall rules on your server by using the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) command to give your local environment access to connect to the server.

#### [bash](#tab/terminal-bash)

```azurecli
YOUR_IP='<your-ip-address>'
az postgres server firewall-rule create \
   --resource-group $RESOURCE_GROUP_NAME \
   --server-name $DB_SERVER_NAME \
   --name AllowMyIP \
   --start-ip-address $YOUR_IP \
   --end-ip-address $YOUR_IP
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$YOUR_IP='<your-ip-address>'
az postgres server firewall-rule create `
   --resource-group $RESOURCE_GROUP_NAME `
   --server-name $DB_SERVER_NAME `
   --name AllowMyIP `
   --start-ip-address $YOUR_IP `
   --end-ip-address $YOUR_IP
```

---

* *resource-group* &rarr; Use the same resource group name in which you created the web app, for example `msdocs-web-app-rg`.
* *server-name* &rarr; The PostgreSQL database server name.
* *name* &rarr; *AllowMyIP*.
* *start-ip-address* &rarr; Use your computer's IP address. To get your current IP address, see [WhatIsMyIPAddress.com](https://whatismyipaddress.com/).
* *end-ip-address* &rarr; Set equal to *start-ip-address*.

**Step 3.** Add a firewall rule tha enables the server to accept connections from all Azure resources.

#### [bash](#tab/terminal-bash)

```azurecli
az postgres server firewall-rule create \
   --resource-group $RESOURCE_GROUP_NAME \
   --server-name $DB_SERVER_NAME \
   --name AllowAllWindowsAzureIps \
   --start-ip-address 0.0.0.0 \
   --end-ip-address 0.0.0.0 
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az postgres server firewall-rule create `
   --resource-group $RESOURCE_GROUP_NAME `
   --server-name $DB_SERVER_NAME `
   --name AllowAllWindowsAzureIps `
   --start-ip-address 0.0.0.0 `
   --end-ip-address 0.0.0.0 
```

---

* *resource-group* &rarr; The name of resource group you used, for example, *msdocs-web-app-rg*.
* *name* &rarr; The name of the database server, for example, *msdocs-web-app-postgres-database-\<unique-id>*.
