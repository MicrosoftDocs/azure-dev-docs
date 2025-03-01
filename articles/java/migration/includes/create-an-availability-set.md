---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 04/27/2023
---

### Create an availability set

Create an availability set by using [az vm availability-set create](/cli/azure/vm/availability-set#az-vm-availability-set-create), as shown in the following example. Creating an availability set is optional, but we recommend it. For more information, see [Example Azure infrastructure walkthrough for Windows VMs](/azure/virtual-machines/windows/infrastructure-example).

### [Bash](#tab/in-bash)

```bash
az vm availability-set create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name myAvailabilitySet \
    --platform-fault-domain-count 2 \
    --platform-update-domain-count 2
```

### [PowerShell](#tab/in-powershell)

```powershell
az vm availability-set create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name myAvailabilitySet `
    --platform-fault-domain-count 2 `
    --platform-update-domain-count 2
```

---
