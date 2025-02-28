---
author: KarlErickson
ms.author: karler
ms.date: 05/27/2021
---

### Provision Azure App Service for JBoss EAP runtime

Use the following commands to create a resource group and an Azure App Service Plan. After the App Service Plan is created, a Linux web app plan is created using the JBoss EAP runtime. You can create JBoss EAP sites only on PremiumV3 and IsolatedV2 App Service Plan tiers.

Be sure the specified environment variables have appropriate values.

> [!NOTE]
> PremiumV3 and IsolatedV2 are both eligible for Reserved Instance pricing, which can reduce your costs. For more information on App Service Plan tiers and Reserved Instance pricing, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).

```azurecli
az group create --resource-group $resourceGroup --location eastus
az acr create --resource-group $resourceGroup --name $acrName --sku Standard
az appservice plan create \
    --resource-group $resourceGroup \
    --name $jbossAppService \
    --is-linux \
    --sku P0v3
az webapp create \
    --resource-group $resourceGroup \
    --name $jbossWebApp \
    --plan $jbossAppServicePlan \
    --runtime "JBOSSEAP|8-java17"
    #  Or use "JBOSSEAP|8-java11" if you're using Java 11
```
