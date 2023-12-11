---
title: Scale your azd Python web app with Bicep
description: Quickstart article featuring the modification of Bicep files azd provision to scale your azd Python web app.
ms.date: 12/11/2023
ms.topic: conceptual
ms.custom: devx-track-python
---

# Quickstart: Scale your azd Python web app with Bicep

The Python web azd templates allow you to quickly create a new web application and deploy it to Azure. The azd templates were designed to use the most inexpensive Azure service options available. Undoubtedly, you will want to adjust to the service levels (or skus) for each of the services defined in the template to suit your scenario. To do that, you will need to make changes to the bicep templates in the infra folder, and then run the azd provision command.
In this tutorial, you will update the appropriate bicep template files in a Python web azd template to scale up or add new services to your deployment. Then, you will execute the azd provision command and view the change you made to the Azure deployment.

## Prerequisites

Install the Bicep extension from Microsoft.

## Deploy a template

To begin, you'll need a working azd deployment 

1. Follow steps 1 through 7 in the Quickstart article. In step 2, use the following command: 

  ```shell
  azd init --template azure-django-postgres-flexible-appservice
  ```

  This article uses App Service because it is a simple way to illustrate how to modify the SKU of an Azure service. We’ll talk about more advanced scenarios later in this document.

  Open the Azure portal, navigate to ___ and take note of the App Service pricing plan.

2. In step 1 of the Quickstart article, you were instructed to create the azdtest folder. Open that folder in Visual Studio Code.

3. In the Explorer pane, navigate to the infra folder. You will see the following files.

  <image>

  The main.bicep file contains _

  The db.bicep file contains _

  The web.bicep file contains _

The core folder is a deeply nested folder structure containing bicep templates for many Azure services. These will be referenced by the three top level bicep files (main, db and hosting).
There’s also a main.params.json which contains settings.

4. Open the web.bicep file and locate the module appService definition. In particular, look for the property setting:

  ```bicep
      sku: {
        name: 'B1'
      }
  ```

  Change from `B1` to `S1`. This changes from the Basic Service Plan (which is designed for apps with lower traffic requirements and don’t need advanced auto scale and traffic management features) to the Standard Service plan which is designed for running production workloads. As a result of this change, the price per hour will increase slightly.

  Details about the different service plans and their associated costs can be found on the [App Service pricing page](https://azure.microsoft.com/en-us/pricing/details/app-service/windows/).

5. Assuming you already have the application deployed in Azure, use the following command to deploy changes to the infrastructure while not redeploying the application code itself.

  ```shell
  azd provision
  ```

  You will be prompted for a location and subscription. Choose the same location and subscription you previously deployed to.

6. When complete, confirm your application still works.

## Add a new service definition

Next, we’ll add an Azure Cache for Redis in preparation for a fictitious new feature we plan to add some day.

To accomplish this, we'll add a new redis.bicep file with the core functionality, then modify the main.bicep to pass in arguments to the parameters defined in the redis.bicep file and accept the output.

7. Add a new file in the *infra* folder named *redis.bicep*. Copy and paste the following code into the new file:

  ```python
  param name string
  param location string = resourceGroup().location
  param tags object = {}
  param keyVaultName string
  param connStrKeyName string
  param passwordKeyName string
  param primaryKeyKeyName string

  @allowed([
    'Enabled'
    'Disabled'
  ])
  param publicNetworkAccess string = 'Enabled'

  @allowed([
    'C'
    'P'
  ])
  param skuFamily string = 'C'

  @allowed([
    0
    1
    2
    3
    4
    5
    6
  ])
  param skuCapacity int = 1
  @allowed([
    'Basic'
    'Standard'
    'Premium'
  ])
  param skuName string = 'Standard'

  param saveKeysToVault bool = true

  resource redis 'Microsoft.Cache/redis@2020-12-01' = {
    name: name
    location: location
    properties: {
      sku: {
        capacity: skuCapacity
        family: skuFamily
        name: skuName
      }
      publicNetworkAccess: publicNetworkAccess
      enableNonSslPort: true    
    }
    tags: tags
  }

  resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
    name: keyVaultName
  }

  resource redisKey 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = if (saveKeysToVault) {
    name: primaryKeyKeyName
    parent: keyVault
    properties: {
      value: redis.listKeys().primaryKey
    }
  }

  resource redisConnStr 'Microsoft.KeyVault/vaults/secrets@2018-02-14' = if (saveKeysToVault) {
    name: connStrKeyName
    parent: keyVault
    properties: {
      value: '${name}.redis.cache.windows.net,abortConnect=false,ssl=true,password=${redis.listKeys().primaryKey}'
    }
  }
  resource redisPassword 'Microsoft.KeyVault/vaults/secrets@2018-02-14' = if (saveKeysToVault) {
    name: passwordKeyName
    parent: keyVault
    properties: {
      value: redis.listKeys().primaryKey
    }
  }

  output REDIS_ID string = redis.id
  output REDIS_HOST string = redis.properties.hostName
  ```

8. Modify the main.bicep file to create an instance of the redis resource.

  In the main.bicep file, add the following code below the ending curly braces associated with the *Web frontend* section and above the *secrets* section.

  ```python
  module redis 'redis.bicep' = {
    name: 'redis'
    scope: resourceGroup
    params: {
      name: replace('${take(prefix, 19)}-rds', '--', '-')
      location: location
      tags: tags
      keyVaultName: keyVault.outputs.name
      connStrKeyName: 'RedisConnectionString'
      passwordKeyName: 'RedisPassword'
      primaryKeyKeyName: 'RedisPrimaryKey'
      publicNetworkAccess: 'Enabled'
      skuFamily: 'C'
      skuCapacity: 1
      skuName: 'Standard'
      saveKeysToVault: true
    }
  }
  ```

9. Add output values to the bottom of the file:

  ```python
  output REDIS_ID string = redis.outputs.REDIS_ID
  output REDIS_HOST string = redis.outputs.REDIS_HOST
  ```

10. Confirm that the entire main.bicep file is identical to the following:

  ```python
  targetScope = 'subscription'

  @minLength(1)
  @maxLength(64)
  @description('Name which is used to generate a short unique hash for each resource')
  param name string

  @minLength(1)
  @description('Primary location for all resources')
  param location string

  @secure()
  @description('DBServer administrator password')
  param dbserverPassword string

  @secure()
  @description('Secret Key')
  param secretKey string

  param webAppExists bool = false

  @description('Id of the user or app to assign application roles')
  param principalId string = ''

  var resourceToken = toLower(uniqueString(subscription().id, name, location))
  var prefix = '${name}-${resourceToken}'
  var tags = { 'azd-env-name': name }

  resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
    name: '${name}-rg'
    location: location
    tags: tags
  }

  // Store secrets in a keyvault
  module keyVault './core/security/keyvault.bicep' = {
    name: 'keyvault'
    scope: resourceGroup
    params: {
      name: '${take(replace(prefix, '-', ''), 17)}-vault'
      location: location
      tags: tags
      principalId: principalId
    }
  }

  module db 'db.bicep' = {
    name: 'db'
    scope: resourceGroup
    params: {
      name: 'dbserver'
      location: location
      tags: tags
      prefix: prefix
      dbserverDatabaseName: 'relecloud'
      dbserverPassword: dbserverPassword
    }
  }

  // Monitor application with Azure Monitor
  module monitoring 'core/monitor/monitoring.bicep' = {
    name: 'monitoring'
    scope: resourceGroup
    params: {
      location: location
      tags: tags
      applicationInsightsDashboardName: '${prefix}-appinsights-dashboard'
      applicationInsightsName: '${prefix}-appinsights'
      logAnalyticsName: '${take(prefix, 50)}-loganalytics' // Max 63 chars
    }
  }

  // Container apps host (including container registry)
  module containerApps 'core/host/container-apps.bicep' = {
    name: 'container-apps'
    scope: resourceGroup
    params: {
      name: 'app'
      location: location
      containerAppsEnvironmentName: '${prefix}-containerapps-env'
      containerRegistryName: '${replace(prefix, '-', '')}registry'
      logAnalyticsWorkspaceName: monitoring.outputs.logAnalyticsWorkspaceName
    }
  }

  // Web frontend
  module web 'web.bicep' = {
    name: 'web'
    scope: resourceGroup
    params: {
      name: replace('${take(prefix, 19)}-ca', '--', '-')
      location: location
      tags: tags
      applicationInsightsName: monitoring.outputs.applicationInsightsName
      keyVaultName: keyVault.outputs.name
      identityName: '${prefix}-id-web'
      containerAppsEnvironmentName: containerApps.outputs.environmentName
      containerRegistryName: containerApps.outputs.registryName
      exists: webAppExists
      dbserverDomainName: db.outputs.dbserverDomainName
      dbserverUser: db.outputs.dbserverUser
      dbserverDatabaseName: db.outputs.dbserverDatabaseName
      dbserverPassword: dbserverPassword
    }
  }

  module redis 'redis.bicep' = {
    name: 'redis'
    scope: resourceGroup
    params: {
      name: replace('${take(prefix, 19)}-rds', '--', '-')
      location: location
      tags: tags
      keyVaultName: keyVault.outputs.name
      connStrKeyName: 'RedisConnectionString'
      passwordKeyName: 'RedisPassword'
      primaryKeyKeyName: 'RedisPrimaryKey'
      publicNetworkAccess: 'Enabled'
      skuFamily: 'C'
      skuCapacity: 1
      skuName: 'Standard'
      saveKeysToVault: true
    }
  }

  var secrets = [
    {
      name: 'DBSERVERPASSWORD'
      value: dbserverPassword
    }
    {
      name: 'SECRETKEY'
      value: secretKey
    }
  ]

  @batchSize(1)
  module keyVaultSecrets './core/security/keyvault-secret.bicep' = [for secret in secrets: {
    name: 'keyvault-secret-${secret.name}'
    scope: resourceGroup
    params: {
      keyVaultName: keyVault.outputs.name
      name: secret.name
      secretValue: secret.value
    }
  }]

  output AZURE_LOCATION string = location
  output AZURE_CONTAINER_ENVIRONMENT_NAME string = containerApps.outputs.environmentName
  output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerApps.outputs.registryLoginServer
  output AZURE_CONTAINER_REGISTRY_NAME string = containerApps.outputs.registryName
  output SERVICE_WEB_IDENTITY_PRINCIPAL_ID string = web.outputs.SERVICE_WEB_IDENTITY_PRINCIPAL_ID
  output SERVICE_WEB_NAME string = web.outputs.SERVICE_WEB_NAME
  output SERVICE_WEB_URI string = web.outputs.SERVICE_WEB_URI
  output SERVICE_WEB_IMAGE_NAME string = web.outputs.SERVICE_WEB_IMAGE_NAME
  output AZURE_KEY_VAULT_ENDPOINT string = keyVault.outputs.endpoint
  output AZURE_KEY_VAULT_NAME string = keyVault.outputs.name
  output APPLICATIONINSIGHTS_NAME string = monitoring.outputs.applicationInsightsName
  output BACKEND_URI string = web.outputs.uri

  output REDIS_ID string = redis.outputs.REDIS_ID
  output REDIS_HOST string = redis.outputs.REDIS_HOST
```

Step 10. Make sure all changes are saved, then use the following command to update your prvisioned resources on Azure:

  ```shell
  azd provision
  ```

  > [!NOTE]
  > Depending on many factors, adding an instance of Azure Cache for Redis could take a very long time. In testing, we experienced times in excess of 20 minutes. As long as you do not see any errors, allow the process to continue until complete.

Step 11. When complete, open the Azure Portal and confirm you now have an instance of Azure Cache for Redis added to your Resource Group.

## Clean up resources

1. Clean up the resources created by the template by running the [azd down](/azure/developer/azure-developer-cli/reference#azd-down) command.

   ```Shell
   azd down
   ```

   The `azd down` command deletes the Azure resources and the GitHub Actions workflow.
   When prompted, agree to deleting all resources associated with the resource group.

   You may also delete the *azdtest* folder, or use it as the basis for your own application by modifying the files of the project.
