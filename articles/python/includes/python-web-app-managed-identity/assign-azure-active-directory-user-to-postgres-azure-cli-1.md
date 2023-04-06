---
ms.topic: include
ms.custom: devx-track-azurecli
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
USERPRINCIPALNAME='<user-principal-name>'

azureaduser=$(az ad user list \
    --filter "userPrincipalName eq '$USERPRINCIPALNAME'" \
    --query [].objectId --output tsv) 
echo $azureaduser
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$USERPRINCIPALNAME='<user-principal-name>'

$azureaduser=$(az ad user list `
    --filter "userPrincipalName eq '$USERPRINCIPALNAME'" `
    --query [].objectId --output tsv) 
Get-Variable azureaduser
```

---
