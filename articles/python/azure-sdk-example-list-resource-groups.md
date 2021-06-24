---
title: List resource groups and resources using the Azure libraries for Python
description: Use the resource management library in the Azure SDK for Python to list resource groups and resources in a group.
ms.date: 06/24/2021
ms.topic: conceptual
ms.custom: devx-track-python
---

# Example: Use the Azure libraries to list resource groups and resources

This example demonstrates how to use the Azure SDK management libraries in a Python script to perform two tasks:

- List all the resource groups in an Azure subscription.
- List resources within a specific resource group.

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

The [Equivalent Azure CLI command](#for-reference-equivalent-azure-cli-commands) is given later in this article.

## 1: Set up your local development environment

If you haven't already, **follow all the instructions** on [Configure your local Python dev environment for Azure](configure-local-development-environment.md).

Be sure to create and activate a virtual environment for this project.

## 2: Install the Azure library packages

Create a file named *requirements.txt* with the following contents:

:::code language="text" source="~/../python-sdk-examples/resource_group/requirements.txt":::

Be sure to use these versions of the libraries. Using older versions will result in errors such as "'AzureCliCredential' object object has no attribute 'signed_session'."

In a terminal or command prompt with the virtual environment activated, install the requirements:

```cmd
pip install -r requirements.txt
```

## 3: Write code to work with resource groups

### 3a. List resource groups in a subscription

Create a Python file named *list_groups.py* with the following code. The comments explain the details:

:::code language="python" source="~/../python-sdk-examples/resource_group/list_groups.py":::

### 3b. List resources within a specific resource group

Create a Python file named *list_resources.py* with the following code. The comments explain the details.

By default, the code lists resources in "myResourceGroup". To use a different resource group, set the `RESOURCE_GROUP_NAME` environment variable to the desired group name.

:::code language="python" source="~/../python-sdk-examples/resource_group/list_resources.py":::

### Authentication in the code

[!INCLUDE [cli-auth-note](includes/cli-auth-note.md)]

### Reference links for classes used in the code

- [AzureCliCredential (azure.identity)](/python/api/azure-identity/azure.identity.azureclicredential)
- [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)

## 4: Run the scripts

List all resources groups in the subscription:

```cmd
python list_groups.py
```

List all resources in a resource group:

```cmd
python list_resources.py
```

### For reference: equivalent Azure CLI commands

The following Azure CLI command lists resource groups in a subscription using JSON output:

```azurecli
az group list
```

The following command lists resources within the "myResourceGroup" in the centralus region (the location argument is necessary to identify a specific data center):

```azurecli
az resource list --resource-group myResourceGroup --location centralus
```

## See also

- [Example: Provision a resource group](azure-sdk-example-resource-group.md)
- [Example: Provision Azure Storage](azure-sdk-example-storage.md)
- [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
- [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Provision and query a database](azure-sdk-example-database.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
