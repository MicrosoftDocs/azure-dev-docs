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

* *resource-group* &rarr; Name of resource group from earlier in this tutorial. (`msdocs-web-app-rg`)
* *server* &rarr; Name of the server from **Step 1**. (`msdocs-web-app-postgres-database-<unique-id>`)
* *name* &rarr; Name for firewall rule. (use `AllowAllWindowsAzureIps`)
* *start-ip-address, end-ip-address* &rarr; `0.0.0.0` means that access will be from other Azure services. For a production app, you should use an [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview).