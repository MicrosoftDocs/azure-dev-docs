---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 01/24/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

```azurecli
export WINDOWSVM_NIC_ID=$(az vm show \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myWindowsVM \
    --query networkProfile.networkInterfaces[0].id \
    --output tsv)
export WINDOWSVM_NSG_ID=$(az network nic show \
    --ids ${WINDOWSVM_NIC_ID} \
    --query networkSecurityGroup.id \
    --output tsv)
export WINDOWSVM_DISK_ID=$(az vm show \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myWindowsVM \
    --query storageProfile.osDisk.managedDisk.id \
    --output tsv)
export WINDOWSVM_PUBLIC_IP=$(az network public-ip list \
    -g ${RESOURCE_GROUP_NAME} --query [0].id \
    --output tsv)

echo "deleting myWindowsVM"
az vm delete --resource-group ${RESOURCE_GROUP_NAME} --name myWindowsVM --yes
echo "deleting nic ${WINDOWSVM_NIC_ID}"
az network nic delete --ids ${WINDOWSVM_NIC_ID}
echo "deleting public-ip ${WINDOWSVM_PUBLIC_IP}"
az network public-ip delete --ids ${WINDOWSVM_PUBLIC_IP}
echo "deleting disk ${WINDOWSVM_DISK_ID}"
az disk delete --yes --ids ${WINDOWSVM_DISK_ID}
echo "deleting nsg ${WINDOWSVM_NSG_ID}"
az network nsg delete --ids ${WINDOWSVM_NSG_ID}
```
