---
author: vaangadi
ms.author: vaangadi
ms.date: 3/19/2021
---

### Provision Azure App Service for Jboss EAP runtime

Use the following commands to create Azure App Service Plan and the resource group. Once the App Service Plan is created you can create a Linux web app plan using the JBoss EAP runtime. 
```bash
az group create -g $resourceGroup -l eastus
az acr create -g $resourceGroup -n $acrName --sku Standard
az appservice plan create --name $jbossAppService --resource-group $resourceGroup --sku P1V2 --is-linux

```
