---
author: KarlErickson
ms.author: haiche
ms.date: 04/27/2023
ms.custom: devx-track-azurecli
---

```azurecli
WINDOWSVM_NIC_ID=$(az vm show \
    --resource-group abc1110rg \
    --name myWindowsVM \
    --query networkProfile.networkInterfaces[0].id \
    --output tsv)
WINDOWSVM_NSG_ID=$(az network nic show \
    --ids ${WINDOWSVM_NIC_ID} \
    --query networkSecurityGroup.id \
    --output tsv)
WINDOWSVM_DISK_ID=$(az vm show \
    --resource-group abc1110rg \
    --name myWindowsVM \
    --query storageProfile.osDisk.managedDisk.id \
    --output tsv)
WINDOWSVM_PUBLIC_IP=$(az network nic show \
    --ids ${WINDOWSVM_NIC_ID} \
    --query ipConfigurations[0].publicIpAddress.id \
    --output tsv)

echo "deleting myWindowsVM"
az vm delete --resource-group abc1110rg --name myWindowsVM --yes
echo "deleting nic ${WINDOWSVM_NIC_ID}"
az network nic delete --ids ${WINDOWSVM_NIC_ID}
echo "deleting public-ip ${WINDOWSVM_PUBLIC_IP}"
az network public-ip delete --ids ${WINDOWSVM_PUBLIC_IP}
echo "deleting disk ${WINDOWSVM_DISK_ID}"
az disk delete --yes --ids ${WINDOWSVM_DISK_ID}
echo "deleting nsg ${WINDOWSVM_NSG_ID}"
az network nsg delete --ids ${WINDOWSVM_NSG_ID}
```
