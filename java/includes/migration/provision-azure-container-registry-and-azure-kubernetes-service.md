---
author: mriem
ms.author: manriem
ms.date: 2/28/2020
---

### Provision Azure Container Registry and Azure Kubernetes Service

Use the following commands to create a container registry and an Azure Kubernetes cluster with a Service Principal that has the Reader role on the registry. Be sure to [choose the appropriate network model](/azure/aks/operator-best-practices-network#choose-the-appropriate-network-model) for your cluster's networking requirements.

```bash
az group create -g $resourceGroup -l eastus
az acr create -g $resourceGroup -n $acrName --sku Standard
az aks create -g $resourceGroup -n $aksName --attach-acr $acrName --network-plugin azure
```
