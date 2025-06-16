---
title: Create a resource group using the Azure libraries for Python
description: Use the resource management library in the Azure SDK for Python to create a resource group from Python code.
ms.date: 05/29/2025
ms.topic: how-to
ms.custom: devx-track-python, py-fresh-zinc
---

# Example: Use the Azure libraries to create a resource group

This example demonstrates how to use the Azure SDK management libraries in a Python script to create a resource group. (The [Equivalent Azure CLI command](#for-reference-equivalent-azure-cli-command) is given later in this article. If you prefer to use the Azure portal, see [Create resource groups](/azure/azure-resource-manager/management/manage-resource-groups-portal).)

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

## 1: Set up your local development environment

If you haven't already, set up an environment where you can run this code. Here are some options:

[!INCLUDE [create_environment_options](../../includes/create-environment-options.md)]

## 2: Install the Azure library packages

1. In your console, create a *requirements.txt* file that lists the management libraries used in this example:

    ```azurecli
    azure-mgmt-resource
    azure-identity
    ```

1. In your console with the virtual environment activated, install the requirements:

    ```console
    pip install -r requirements.txt
    ```

## 3. Set environment variables

In this step, you set environment variables for use in the code in this article. The code uses the `os.environ` method to retrieve the values.

# [Bash](#tab/bash)

```azurecli
#!/bin/bash
export AZURE_RESOURCE_GROUP_NAME=<ResourceGroupName> # Change to your preferred resource group name
export LOCATION=<Location> # Change to your preferred region
export AZURE_SUBSCRIPTION_ID=$(az account show --query id --output tsv)
```

# [PowerShell](#tab/powershell)

```azurecli
# PowerShell syntax
$env:AZURE_RESOURCE_GROUP_NAME = <ResourceGroupName> # Change to your preferred resource group name
$env:LOCATION = <Location> # Change to your preferred region
$env:AZURE_SUBSCRIPTION_ID = $(az account show --query id --output tsv)
```

---

## 4: Write code to create a resource group

In this step, you create a Python file named *provision_blob.py* with the following code. This Python script uses the Azure SDK for Python management libraries to create a resource group in your Azure subscription.

Create a Python file named *provision_rg.py* with the following code. The comments explain the details:

```Python
# Import the needed credential and management objects from the libraries.
import os

from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient

# Acquire a credential object using DevaultAzureCredential.
credential = DefaultAzureCredential()

# Retrieve subscription ID from environment variable.
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

# Retrieve resource group name and location from environment variables
RESOURCE_GROUP_NAME = os.environ["AZURE_RESOURCE_GROUP_NAME"]
LOCATION = os.environ["LOCATION"]

# Obtain the management object for resources.
resource_client = ResourceManagementClient(credential, subscription_id)

# Provision the resource group.
rg_result = resource_client.resource_groups.create_or_update(RESOURCE_GROUP_NAME,
    { "location": LOCATION })

print(f"Provisioned resource group {rg_result.name}")

# Within the ResourceManagementClient is an object named resource_groups,
# which is of class ResourceGroupsOperations, which contains methods like
# create_or_update.
#
# The second parameter to create_or_update here is technically a ResourceGroup
# object. You can create the object directly using ResourceGroup(location=
# LOCATION) or you can express the object as inline JSON as shown here. For
# details, see Inline JSON pattern for object arguments at
# https://learn.microsoft.com/azure/developer/python/sdk
# /azure-sdk-library-usage-patterns#inline-json-pattern-for-object-arguments

print(
    f"Provisioned resource group {rg_result.name} in the {rg_result.location} region"
)

# The return value is another ResourceGroup object with all the details of the
# new group. In this case the call is synchronous: the resource group has been
# provisioned by the time the call returns.

# To update the resource group, repeat the call with different properties, such
# as tags:
rg_result = resource_client.resource_groups.create_or_update(
    RESOURCE_GROUP_NAME,
    {
        "location": LOCATION,
        "tags": {"environment": "test", "department": "tech"},
    },
)

print(f"Updated resource group {rg_result.name} with tags")

# Optional lines to delete the resource group. begin_delete is asynchronous.
# poller = resource_client.resource_groups.begin_delete(rg_result.name)
# result = poller.result()
```

### Authentication in the code

Later in this article, you sign in to Azure using the Azure CLI to execute the sample code. If your account has sufficient permissions to create resource groups and storage resources in your Azure subscription, the script should run successfully without additional configuration.

To use this code in a production environment, authenticate using a service principal by setting environment variables. This approach enables secure, automated access without relying on interactive login. For detailed guidance, see [How to authenticate Python apps with Azure services](../authentication-overview.md).

Ensure that the service principal is assigned a role with sufficient permissions to create resource groups and storage accounts. For example, assigning the Contributor role at the subscription level provides the necessary access. To learn more about role assignments, see [Role-based access control (RBAC) in Azure](/azure/role-based-access-control/overview).

### Reference links for classes used in the code

- [DefaultAzureCredential (azure.identity)](/python/api/azure-identity/azure.identity.defaultazurecredential)
- [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)

## 5: Run the script

1. If you haven't already, sign in to Azure using the Azure CLI:

    ```azurecli
    az login
    ```

1. Run the script:

    ```cmd
    python provision_rg.py
    ```

## 6: Verify the resource group

You can verify that the resource group exists through the Azure portal or the Azure CLI.

- Azure portal: open the [Azure portal](https://portal.azure.com), select **Resource groups**, and check that the group is listed. If necessary, use the **Refresh** command to update the list.

- Azure CLI: use the [az group show](/cli/azure/group#az-group-show) command:

    # [Bash](#tab/bash)

    ```azurecli
    #!/bin/bash
    az group show -n $AZURE_RESOURCE_GROUP_NAME
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    # PowerShell syntax
    az group show -n $env:AZURE_RESOURCE_GROUP_NAME
    ```

    ---

## 7: Clean up resources

Run the [az group delete](/cli/azure/group#az-group-delete) command if you don't need to keep the resource group created in this example. Resource groups don't incur any ongoing charges in your subscription, but resources in the resource group might continue to incur charges. It's a good practice to clean up any group that you aren't actively using. The `--no-wait` argument allows the command to return immediately instead of waiting for the operation to finish.

# [Bash](#tab/bash)

```azurecli
#!/bin/bash
az group delete -n $AZURE_RESOURCE_GROUP_NAME --no-wait
```

# [PowerShell](#tab/powershell)

```azurecli
# PowerShell syntax
az group delete -n $env:AZURE_RESOURCE_GROUP_NAME --no-wait
```

---

You can also use the [`ResourceManagementClient.resource_groups.begin_delete`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.resourcegroupsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-resourcegroupsoperations-begin-delete) method to delete a resource group from code. The commented code at the bottom of the script in this article demonstrates the usage.

### For reference: equivalent Azure CLI command

The following Azure CLI [az group create](/cli/azure/group#az-group-create) command creates a resource group with tags just like the Python script:

:::code language="azurecli" source="~/../python-sdk-docs-examples/resource_group/provision.cmd":::

## See also

- [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Example: Create Azure Storage](azure-sdk-example-storage.md)
- [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
- [Example: Create a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Create and query a database](azure-sdk-example-database.md)
- [Example: Create a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
