---
ms.topic: include
ms.custom: devx-track-azurecli
ms.date: 03/31/2022
---
#### [Azure Container Apps](#tab/azure-container-app)

```azurecli
az containerapp identity assign \
    --resource-group <resource-group-name> \
    --name <container-app-name> \
    --system-assigned
```

#### [Azure Virtual Machines](#tab/azure-virtual-machines)

```azurecli
az vm identity assign \
    --resource-group <resource-group-name> \
    -name <virtual-machine-name>
```

---
