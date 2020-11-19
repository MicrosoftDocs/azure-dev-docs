---
title: Connect to all regions using Azure libraries for Python Multi-cloud 
description: How to use the azure_cloud module of msrestazure to connect to Azure in different sovereign regions
ms.date: 11/18/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Multi-cloud: Connect to all regions with the Azure libraries for Python

You can use the Azure libraries for Python to connect to all regions where Azure is [available](https://azure.microsoft.com/regions/services).

By default, the Azure libraries are configured to connect to the global Azure cloud.

## Using pre-defined sovereign cloud constants

Pre-defined sovereign cloud constants are provided by the `azure_cloud` module of the `msrestazure` library (0.4.11+):

- `AZURE_PUBLIC_CLOUD`
- `AZURE_CHINA_CLOUD`
- `AZURE_US_GOV_CLOUD`
- `AZURE_GERMAN_CLOUD`

To apply a constant across all your code, define an environment variable named `AZURE_CLOUD` using one of the values in the previous list. (`AZURE_PUBLIC_CLOUD` is the default value.)

To apply a constant within specific operations, import the desired constant from `msrestazure.azure_cloud` and use it when creating client objects. With `DefaultAzureCredential`, you also need to use the appropriate value from `azure.identity.AzureAuthorityHosts`:

```python
import os
from msrestazure.azure_cloud import AZURE_CHINA_CLOUD as cloud
from azure.mgmt.resource import ResourceManagementClient, SubscriptionClient
from azure.identity import DefaultAzureCredential, AzureAuthorityHosts

# Assumes the subscription ID to use is in the AZURE_SUBSCRIPTION_ID environment variable
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

# When using sovereign domains (that is, any cloud other than AZURE_PUBLIC_CLOUD),
# you must use an authority with DefaultAzureCredential.
credential = DefaultAzureCredential(authority=AzureAuthorityHosts.AZURE_CHINA)

resource_client = ResourceManagementClient(credential,
    subscription_id, base_url=cloud.endpoints.resource_manager,
    credential_scopes=[cloud.endpoints.resource_manager + ".default'"])

subscription_client = SubscriptionClient(credential,
    base_url=stack_cloud.endpoints.resource_manager,
    credential_scopes=[cloud.endpoints.resource_manager + ".default'"])
```
  
## Using your own cloud definition

The following code uses `get_cloud_from_metadata_endpoint` with the Azure Resource Manager endpoint for a private cloud (such as one built on Azure Stack):

```python
import os
from msrestazure.azure_cloud import get_cloud_from_metadata_endpoint
from azure.mgmt.resource import ResourceManagementClient, SubscriptionClient
from azure.identity import DefaultAzureCredential

# Assumes the subscription ID to use is in the AZURE_SUBSCRIPTION_ID environment variable
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

stack_cloud = get_cloud_from_metadata_endpoint("https://contoso-azurestack-arm-endpoint.com")

# When using a private, you must use an authority with DefaultAzureCredential.
# The active_directory endpoint should be a URL like https://login.microsoftonline.com.
# https:// is optional in the URL but required on the endpoint.
credential = DefaultAzureCredential(authority=stack_cloud.endpoints.active_directory)

resource_client = ResourceManagementClient(credential, subscription_id,
    base_url=stack_cloud.endpoints.resource_manager,
    credential_scopes=[cloud.endpoints.resource_manager + ".default'"])

subscription_client = SubscriptionClient(credential,
    base_url=stack_cloud.endpoints.resource_manager,
    credential_scopes=[stack_cloud.endpoints.resource_manager + ".default'"])
```
