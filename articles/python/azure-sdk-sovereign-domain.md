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

To use a definition, import the appropriate constant from `msrestazure.azure_cloud` and apply it when creating client objects. 

When using `DefaultAzureCredential`, as shown in the following example, you also need to use the appropriate value from `CLOUD.endpoints.active_directory`.

:::code language="python" source="~/../python-sdk-docs-examples/sovereign_domain/sovereign_cloud.py":::
  
## Using your own cloud definition

The following code uses `get_cloud_from_metadata_endpoint` with the Azure Resource Manager endpoint for a private cloud (such as one built on Azure Stack):

:::code language="python" source="~/../python-sdk-docs-examples/sovereign_domain/private_cloud.py":::
