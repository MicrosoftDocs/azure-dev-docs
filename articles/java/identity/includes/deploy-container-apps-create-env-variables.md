---
author: KarlErickson
ms.author: bappadityams
ms.date: 09/11/2024
---

Now that your Azure CLI setup is complete, you can define the environment variables that are used throughout this article.

# [Bash](#tab/bash)

Define the following variables in your bash shell.

```azurecli
export RESOURCE_GROUP="ms-identity-containerapps"
export LOCATION="canadacentral"
export ENVIRONMENT="env-ms-identity-containerapps"
export API_NAME="ms-identity-api"
export JAR_FILE_PATH_AND_NAME="./target/ms-identity-spring-boot-webapp-0.0.1-SNAPSHOT.jar"
```

# [Azure PowerShell](#tab/azure-powershell)

Define the following variables in your PowerShell console.

```powershell
$RESOURCE_GROUP="ms-identity-containerapps"
$LOCATION="canadacentral"
$ENVIRONMENT="env-ms-identity-containerapps"
$API_NAME="ms-identity-api"
```

Create a resource group.

```azurecli
az group create  \
   --name $RESOURCE_GROUP \
   --location $LOCATION \
```

Create an environment with an auto-generated Log Analytics workspace.

```azurecli
az containerapp env create  \
   --name $ENVIRONMENT \
   --resource-group $RESOURCE_GROUP
   --location $LOCATION \
```

Show the default domain of the container app environment. Please note this domain to configure in the next sections.

````azurecli
az containerapp env show \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP
  --query properties.defaultDomain
````
