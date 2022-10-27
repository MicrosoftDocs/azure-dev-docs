---
ms.topic: include
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
az role assignment create \
    --assignee "99999999-9999-9999-9999-999999999999" \
    --resource-group "msdocs-web-app-rg" \
    --role "Storage Blob Data Contributor" 
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az role assignment create `
    --assignee "99999999-9999-9999-9999-999999999999" `
    --resource-group "msdocs-web-app-rg" `
    --role "Storage Blob Data Contributor" 
```

---
