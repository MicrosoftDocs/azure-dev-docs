---
title: Connect to all regions using Azure libraries for Python multicloud 
description: How to use the azure_cloud module of msrestazure to connect to Azure in different sovereign regions
ms.date: 04/23/2025
ms.topic: article
ms.custom: devx-track-python, py-fresh-zinc
---

# Multicloud: Connect to all regions with the Azure libraries for Python

You can use the Azure libraries for Python to connect to all regions where Azure is [available](https://azure.microsoft.com/regions/services).

By default, the Azure libraries are configured to connect to the global Azure cloud.

## Using pre-defined sovereign cloud constants

Pre-defined sovereign cloud constants are provided by the `AzureAuthorityHosts` module of the `azure.identity` library:

- `AZURE_CHINA`
- `AZURE_GOVERNMENT`
- `AZURE_PUBLIC_CLOUD`

To use a definition, import the appropriate constant from `azure.identity.AzureAuthorityHosts` and apply it when creating client objects.

When using [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential), as shown in the following example, you can specify the cloud by using the appropriate value from `azure.identity.AzureAuthorityHosts`.

:::code language="python" source="~/../python-sdk-docs-examples/sovereign_domain/sovereign_cloud.py":::
  
## Using your own cloud definition

In the following code, replace the values of the `authority`, `endpoint`, and `audience` variables with values appropriate for your private cloud.

:::code language="python" source="~/../python-sdk-docs-examples/sovereign_domain/private_cloud.py":::

For example, for Azure Stack, you can use the [az cloud show](/cli/azure/cloud#az-cloud-show) CLI command to return the details of a registered cloud. The following output shows the values returned for the Azure public cloud, but the output for an Azure Stack private cloud should be similar.

```output
{
  "endpoints": {
    "activeDirectory": "https://login.microsoftonline.com",
    "activeDirectoryDataLakeResourceId": "https://datalake.azure.net/",
    "activeDirectoryGraphResourceId": "https://graph.windows.net/",
    "activeDirectoryResourceId": "https://management.core.windows.net/",
    "appInsightsResourceId": "https://api.applicationinsights.io",
    "appInsightsTelemetryChannelResourceId": "https://dc.applicationinsights.azure.com/v2/track",
    "attestationResourceId": "https://attest.azure.net",
    "azmirrorStorageAccountResourceId": null,
    "batchResourceId": "https://batch.core.windows.net/",
    "gallery": "https://gallery.azure.com/",
    "logAnalyticsResourceId": "https://api.loganalytics.io",
    "management": "https://management.core.windows.net/",
    "mediaResourceId": "https://rest.media.azure.net",
    "microsoftGraphResourceId": "https://graph.microsoft.com/",
    "ossrdbmsResourceId": "https://ossrdbms-aad.database.windows.net",
    "portal": "https://portal.azure.com",
    "resourceManager": "https://management.azure.com/",
    "sqlManagement": "https://management.core.windows.net:8443/",
    "synapseAnalyticsResourceId": "https://dev.azuresynapse.net",
    "vmImageAliasDoc": "https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/arm-compute/quickstart-templates/aliases.json"
  },
  "isActive": true,
  "name": "AzureCloud",
  "profile": "latest",
  "suffixes": {
    "acrLoginServerEndpoint": ".azurecr.io",
    "attestationEndpoint": ".attest.azure.net",
    "azureDatalakeAnalyticsCatalogAndJobEndpoint": "azuredatalakeanalytics.net",
    "azureDatalakeStoreFileSystemEndpoint": "azuredatalakestore.net",
    "keyvaultDns": ".vault.azure.net",
    "mariadbServerEndpoint": ".mariadb.database.azure.com",
    "mhsmDns": ".managedhsm.azure.net",
    "mysqlServerEndpoint": ".mysql.database.azure.com",
    "postgresqlServerEndpoint": ".postgres.database.azure.com",
    "sqlServerHostname": ".database.windows.net",
    "storageEndpoint": "core.windows.net",
    "storageSyncEndpoint": "afs.azure.net",
    "synapseAnalyticsEndpoint": ".dev.azuresynapse.net"
  }
}

```

In the preceding code, you can set `authority` to the value of the `endpoints.activeDirectory` property, `endpoint` to the value of the `endpoints.resourceManager` property, and `audience` to the value of `endpoints.activeDirectoryResourceId` property +  ".default".

For more information, see [Use Azure CLI with Azure Stack Hub](/azure-stack/user/azure-stack-version-profiles-azurecli2) and [Get authentication information for Azure Stack Hub](/azure-stack/user/authenticate-azure-stack-hub).
