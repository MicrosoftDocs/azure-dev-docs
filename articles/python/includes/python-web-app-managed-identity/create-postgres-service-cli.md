---
author: jessmjohnson
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
