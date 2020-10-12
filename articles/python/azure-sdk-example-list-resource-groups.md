---
title: List resources groups in a subscription using the Azure libraries for Python
description: Use the resource management library in the Azure SDK for Python to list resource groups from Python code.
ms.date: 10/12/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Example: Use the Azure libraries to list resource groups in a subscription

This example demonstrates how to use the Azure SDK management libraries in a Python script to list all the resource groups in an Azure subscription. (The [Equivalent Azure CLI command](#for-reference-equivalent-azure-cli-commands) is given later in this article.

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

## 1: Set up your local development environment

If you haven't already, follow all the instructions on [Configure your local Python dev environment for Azure](configure-local-development-environment.md).

Be sure to create and activate a virtual environment for this project.

## 2: Install the Azure library packages

Create a file named *requirements.txt* with the following contents:

```text
azure-mgmt-resource
azure-identity
```

In a terminal or command prompt with the virtual environment activated, install the requirements:

```cmd
pip install -r requirements.txt
```

## 3: Write code to provision a resource group

Create a Python file named *list_groups.py* with the following code. The comments explain the details:

```python
# Import the needed credential and management objects from the libraries.
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
import os

# Acquire a credential object using CLI-based authentication.
credential = AzureCliCredential()

# Retrieve subscription ID from environment variable.
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

# Obtain the management object for resources.
resource_client = ResourceManagementClient(credential, subscription_id)

# Retrieve the list of resource groups
resource_list = resource_client.resource_groups.list()

# Show the groups in formatted output
column_width = 40

print("Resource Group".ljust(column_width) + "Location")
print("-" * (column_width * 2))

for resource in list(resource_list):
    print(f"{resource.name:<{column_width}}{resource.location}")
```

[!INCLUDE [cli-auth-note](includes/cli-auth-note.md)]

### Reference links for classes used in the code

- [AzureCliCredential (azure.identity)](/python/api/azure-identity/azure.identity.azureclicredential)
- [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)

## 4: Run the script

```cmd
python list_groups.py
```

### For reference: equivalent Azure CLI commands

The following Azure CLI command lists resource groups in a subscription using JSON output:

```azurecli
az group list
```

## See also

- [Example: Provision a resource group](azure-sdk-example-resource-group.md)
- [Example: Provision Azure Storage](azure-sdk-example-storage.md)
- [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
- [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Provision and query a database](azure-sdk-example-database.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
