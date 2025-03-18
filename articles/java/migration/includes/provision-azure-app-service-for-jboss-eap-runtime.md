---
author: KarlErickson
ms.author: karler
ms.date: 03/17/2025
---

### Provision Azure App Service for JBoss EAP runtime

Use the following commands to create a resource group and an Azure App Service Plan. After the App Service Plan is created, a Linux web app plan is created using the JBoss Enterprise Application Platform (EAP) runtime.

Be sure the specified environment variables have appropriate values.

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
