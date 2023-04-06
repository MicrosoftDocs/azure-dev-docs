---
ms.topic: include
ms.custom: devx-track-azurecli
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
RESOURCE_GROUP_NAME='msdocs-web-app-rg'
DB_SERVER_NAME='msdocs-web-app-postgres-database-<unique-id>'

az postgres server ad-admin create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server-name $DB_SERVER_NAME \
    --display-name $USERPRINCIPALNAME \
    --object-id $azureaduser
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$RESOURCE_GROUP_NAME='msdocs-web-app-rg'
$DB_SERVER_NAME='msdocs-web-app-postgres-database-<unique-id>'

az postgres server ad-admin create `
    --resource-group $RESOURCE_GROUP_NAME `
    --server-name $DB_SERVER_NAME `
    --display-name $USERPRINCIPALNAME `
    --object-id $azureaduser
```

---
