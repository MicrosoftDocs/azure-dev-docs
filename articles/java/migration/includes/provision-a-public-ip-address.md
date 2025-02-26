---
author: KarlErickson
ms.author: karler
ms.reviewer: manriem
ms.date: 2/28/2020
---

### Provision a public IP address

If your application is to be accessible from outside your internal or virtual network(s), you'll need a public static IP address. You should provision this IP address inside your cluster's node resource group, as shown in the following example:

```azurecli
export nodeResourceGroup=$(az aks show \
    --resource-group $resourceGroup \
    --name $aksName \
    --query 'nodeResourceGroup' \
    --output tsv)
export publicIp=$(az network public-ip create \
    --resource-group $nodeResourceGroup \
    --name applicationIp \
    --sku Standard \
    --allocation-method Static \
    --query 'publicIp.ipAddress' \
    --output tsv)
echo "Your public IP address is ${publicIp}."
```
