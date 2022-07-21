---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

Create a rule that allows other Azure services to connect to the PostgreSQL server by using the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) command.

#### [bash](#tab/terminal-bash)

```azurecli
az postgres server firewall-rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server $DB_SERVER_NAME \
    --name AllowAllWindowsAzureIps \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az postgres server firewall-rule create `
    --resource-group $RESOURCE_GROUP_NAME `
    --server $DB_SERVER_NAME `
    --name AllowAllWindowsAzureIps `
    --start-ip-address 0.0.0.0 `
     -end-ip-address 0.0.0.0
```

---

* *resource-group* &rarr; Name of resource group from earlier in this tutorial, for example, "msdocs-web-app-rg".
* *server* &rarr; Name of the database server, for example, "msdocs-web-app-postgres-database-\<unique-id>".
* *name* &rarr; Name for firewall rule. Use "AllowAllWindowsAzureIps".
* *start-ip-address, end-ip-address* &rarr; Use "0.0.0.0", which means that access will be from other Azure services. For a production app, use an [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview).

Using the same command, create a firewall rule that allows your local environment access to connect to the server.

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

* *resource-group* &rarr; Name of resource group from earlier in this tutorial, for example, "msdocs-web-app-rg".
* *server-name* &rarr; Name of the database server, for example, "msdocs-web-app-postgres-database-\<unique-id>".
* *name* &rarr; Name of the firewall rule. Use "AllowMyIP".
* *start-ip-address* &rarr; Use your computer's IP address. To get your current IP address, see [WhatIsMyIPAddress.com](https://whatismyipaddress.com/).
* *end-ip-address* &rarr; Set equal to *start-ip-address*.
