---
title: Connect to all regions using Azure libraries for Python multicloud 
description: How to use the azure_cloud module of msrestazure to connect to Azure in different sovereign regions
ms.date: 12/07/2023
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Multicloud: Connect to all regions with the Azure libraries for Python

You can use the Azure libraries for Python to connect to all regions where Azure is [available](https://azure.microsoft.com/regions/services).

By default, the Azure libraries are configured to connect to the global Azure cloud.

## Using pre-defined sovereign cloud constants

Pre-defined sovereign cloud constants are provided by the `AzureAuthorityHosts` module of the `azure.identity` library:

- `AZURE_CHINA`
- `AZURE_GERMANY`
- `AZURE_GOVERNMENT`
- `AZURE_PUBLIC_CLOUD`

To use a definition, import the appropriate constant from `azure.identity.AzureAuthorityHosts` and apply it when creating client objects.

When using `DefaultAzureCredential`, as shown in the following example, you can specify the cloud by using the appropriate value from `azure.identity.AzureAuthorityHosts`.

:::code language="python" source="~/../python-sdk-docs-examples/sovereign_domain/sovereign_cloud.py":::
  
## Using your own cloud definition

The following code uses `get_cloud_from_metadata_endpoint` with the Azure Resource Manager endpoint for a private cloud (such as one built on Azure Stack):

:::code language="python" source="~/../python-sdk-docs-examples/sovereign_domain/private_cloud.py":::
