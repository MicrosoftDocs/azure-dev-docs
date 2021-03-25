---
author: VaijanathB
ms.author: vaangadi
ms.date: 3/19/2021
---

### Provision Azure App Service for JBoss EAP runtime

Use the following commands to create Azure App Service Plan and the resource group. Once the App Service Plan is created you can create a Linux web app plan using the JBoss EAP runtime. JBoss EAP is currently only allowed for PremiumV2, PremiumV3, Isolated v1 and Isolated v2 App Service Plan tiers.
   
```bash
az group create -g $resourceGroup -l eastus
az acr create -g $resourceGroup -n $acrName --sku Standard
az appservice plan create --name $jbossAppService --resource-group $resourceGroup --sku P1V2 --is-linux
az webapp create --name $jbossWebApp  --plan $jbossAppServicePlan --resource-group $resourceGroup --runtime "JBOSSEAP|7.2-java8"
```
