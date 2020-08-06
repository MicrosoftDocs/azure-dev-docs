---
title: Connect to all regions using Azure libraries for Python Multi-cloud 
description: How to use the azure_cloud module of msrestazure to connect to Azure in different sovereign regions
ms.date: 07/13/2020
ms.topic: conceptual
---

# Multi-cloud: Connect to all regions with the Azure libraries for Python

You can use the Azure libraries for Python to connect to all regions where Azure is [available](https://azure.microsoft.com/regions/services).

By default, the Azure libraries are configured to connect to global Azure.

## Using pre-defined sovereign cloud constants

Pre-defined sovereign cloud constants are provided by the `azure_cloud` module of `msrestazure` (0.4.11+):

- `AZURE_PUBLIC_CLOUD`
- `AZURE_CHINA_CLOUD`
- `AZURE_US_GOV_CLOUD`
- `AZURE_GERMAN_CLOUD`

To apply a constant across all your code, define an environment variable named `AZURE_CLOUD` using one of the values in the previous list. (`AZURE_PUBLIC_CLOUD` is the default value.)

To apply a constant within specific operations, import the desired constant from `msrest.azure_cloud` and use it when creating credentials and client objects:

```python
from msrestazure.azure_cloud import AZURE_CHINA_CLOUD
from msrestazure.azure_active_directory import UserPassCredentials
from azure.mgmt.resource import ResourceManagementClient

credentials = UserPassCredentials(login, password,
    cloud_environment=AZURE_CHINA_CLOUD)

client = ResourceManagementClient(credentials,
    subscription_id, base_url=AZURE_CHINA_CLOUD.endpoints.resource_manager)
```
  
## Using your own cloud definition

The following code uses `get_cloud_from_metadata_endpoint` with the Azure Resource Manager endpoint for a private cloud (such as one built on Azure Stack):

```python
from msrestazure.azure_cloud import get_cloud_from_metadata_endpoint
from msrestazure.azure_active_directory import UserPassCredentials
from azure.mgmt.resource import ResourceManagementClient

stack_cloud = get_cloud_from_metadata_endpoint("https://contoso-azurestack-arm-endpoint.com")
credentials = UserPassCredentials(login, password,
    cloud_environment=stack_cloud)

client = ResourceManagementClient(credentials, subscription_id,
    base_url=stack_cloud.endpoints.resource_manager)
```

## Using ADAL

When connecting to another region, consider the following questions:

- What is the endpoint where to ask for a token (authentication)?
- What is the endpoint where I will use this token (usage)?

The following is a generic example:

```python
import adal
from msrestazure.azure_active_directory import AdalAuthentication
from azure.mgmt.resource import ResourceManagementClient

# Service Principal
tenant = 'ABCDEFGH-1234-1234-1234-ABCDEFGHIJKL'
client_id = 'ABCDEFGH-1234-1234-1234-ABCDEFGHIJKL'
password = 'password'

# Public Azure - default values
authentication_endpoint = 'https://login.microsoftonline.com/'
azure_endpoint = 'https://management.azure.com/'

context = adal.AuthenticationContext(authentication_endpoint+tenant)
credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
    azure_endpoint, client_id, password)

subscription_id = '33333333-3333-3333-3333-333333333333'

resource_client = ResourceManagementClient(credentials,
    subscription_id, base_url=azure_endpoint)
```

### Azure Government

```python
import adal
from msrestazure.azure_active_directory import AdalAuthentication
from azure.mgmt.resource import ResourceManagementClient

# Service Principal
tenant = 'ABCDEFGH-1234-1234-1234-ABCDEFGHIJKL'
client_id = 'ABCDEFGH-1234-1234-1234-ABCDEFGHIJKL'
password = 'password'

# Government
authentication_endpoint = 'https://login.microsoftonline.us/'
azure_endpoint = 'https://management.usgovcloudapi.net/'

context = adal.AuthenticationContext(authentication_endpoint+tenant)
credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
    azure_endpoint, client_id, password)

subscription_id = '33333333-3333-3333-3333-333333333333'

resource_client = ResourceManagementClient(credentials,
    subscription_id, base_url=azure_endpoint)
```

### Azure Germany

```python
import adal
from msrestazure.azure_active_directory import AdalAuthentication
from azure.mgmt.resource import ResourceManagementClient

# Service Principal
tenant = 'ABCDEFGH-1234-1234-1234-ABCDEFGHIJKL'
client_id = 'ABCDEFGH-1234-1234-1234-ABCDEFGHIJKL'
password = 'password'

# Azure Germany
authentication_endpoint = 'https://login.microsoftonline.de/'
azure_endpoint = 'https://management.microsoftazure.de/'

context = adal.AuthenticationContext(authentication_endpoint+tenant)
credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
    azure_endpoint, client_id, password)

subscription_id = '33333333-3333-3333-3333-333333333333'

resource_client = ResourceManagementClient(credentials,
    subscription_id, base_url=azure_endpoint)
```

### Azure China 21Vianet

```python
import adal
from msrestazure.azure_active_directory import AdalAuthentication
from azure.mgmt.resource import ResourceManagementClient

# Service Principal
tenant = 'ABCDEFGH-1234-1234-1234-ABCDEFGHIJKL'
client_id = 'ABCDEFGH-1234-1234-1234-ABCDEFGHIJKL'
password = 'password'

# Azure China
authentication_endpoint = 'https://login.chinacloudapi.cn/'
azure_endpoint = 'https://management.chinacloudapi.cn/'

context = adal.AuthenticationContext(authentication_endpoint+tenant)
credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
    azure_endpoint, client_id, password)

subscription_id = '33333333-3333-3333-3333-333333333333'

resource_client = ResourceManagementClient(credentials,
    subscription_id, base_url=azure_endpoint)
```
