---
author: VaijanathB
ms.author: vaangadi
ms.date: 05/27/2021
---

### Provision Azure App Service for JBoss EAP runtime

Use the following commands to create an Azure App Service Plan and a resource group. After the App Service Plan is created, you can create a Linux web app plan using the JBoss EAP runtime. You can create JBoss EAP sites only on PremiumV3 and IsolatedV2 App Service Plan tiers.

> [!NOTE]
> PremiumV3 and IsolatedV2 are both eligible for Reserved Instance pricing, which can reduce your costs. For more information on App Service Plan tiers and Reserved Instance pricing, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).

```bash
az group create -g $resourceGroup -l eastus
az acr create -g $resourceGroup -n $acrName --sku Standard
az appservice plan create --name $jbossAppService --resource-group $resourceGroup --sku P1V2 --is-linux
az webapp create --name $jbossWebApp  --plan $jbossAppServicePlan --resource-group $resourceGroup --runtime "JBOSSEAP|7.2-java8"
```
