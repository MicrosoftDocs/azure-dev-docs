---
author: mriem
ms.author: manriem
ms.date: 2/28/2020
---

### Provision a public IP address

If your application is to be accessible from outside your internal or virtual network(s), you'll need a public static IP address. You should provision this IP address inside your cluster's node resource group, as shown in the following example:

```bash
nodeResourceGroup=$(az aks show -g $resourceGroup -n $aksName --query 'nodeResourceGroup' -o tsv)
publicIp=$(az network public-ip create -g $nodeResourceGroup -n applicationIp --sku Standard --allocation-method Static --query 'publicIp.ipAddress' -o tsv)
echo "Your public IP address is ${publicIp}."
```
