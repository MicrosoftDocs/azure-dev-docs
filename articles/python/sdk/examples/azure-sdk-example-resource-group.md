---
title: Provision a resource group using the Azure libraries for Python
description: Use the resource management library in the Azure SDK for Python to create a resource group from Python code.
ms.date: 06/24/2021
ms.topic: conceptual
ms.custom: devx-track-python
---

# Example: Use the Azure libraries to provision a resource group

This example demonstrates how to use the Azure SDK management libraries in a Python script to provision a resource group. (The [Equivalent Azure CLI command](#for-reference-equivalent-azure-cli-commands) is given later in this article. If you prefer to use the Azure portal, see [Create resource groups](/azure/azure-resource-manager/management/manage-resource-groups-portal).)

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

## 1: Set up your local development environment

If you haven't already, **follow all the instructions** on [Configure your local Python dev environment for Azure](configure-local-development-environment.md).

Be sure to create and activate a virtual environment for this project.

## 2: Install the Azure library packages

Create a file named *requirements.txt* with the following contents:

:::code language="txt" source="~/../python-sdk-docs-examples/resource_group/requirements.txt":::

Be sure to use these versions of the libraries. Using older versions will result in errors such as "'AzureCliCredential' object object has no attribute 'signed_session'."

In a terminal or command prompt with the virtual environment activated, install the requirements:

```cmd
pip install -r requirements.txt
```

## 3: Write code to provision a resource group

Create a Python file named *provision_rg.py* with the following code. The comments explain the details:

:::code language="python" source="~/../python-sdk-docs-examples/resource_group/provision_rg.py":::

[!INCLUDE [cli-auth-note](includes/cli-auth-note.md)]

### Reference links for classes used in the code

- [AzureCliCredential (azure.identity)](/python/api/azure-identity/azure.identity.azureclicredential)
- [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)

## 4: Run the script

```cmd
python provision_rg.py
```

## 5: Verify the resource group

You can verify that the group exists through the Azure portal or the Azure CLI.

- Azure portal: open the [Azure portal](https://portal.azure.com), select **Resource groups**, and check that the group is listed. If you've already had the portal open, use the **Refresh** command to update the list.

- Azure CLI: run the following command:

    ```azurecli
    az group show -n PythonAzureExample-rg
    ```

## 6: Clean up resources

```azurecli
az group delete -n PythonAzureExample-rg  --no-wait
```

Run this command if you don't need to keep the resource group provisioned in this example. Resource groups don't incur any ongoing charges in your subscription, but it's a good practice to clean up any group that you aren't actively using. The `--no-wait` argument allows the command to return immediately instead of waiting for the operation to finish.

You can also use the [`ResourceManagementClient.resource_groups.delete`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2019_10_01.operations.resourcegroupsoperations#delete-resource-group-name--custom-headers-none--raw-false--polling-true----operation-config-) method to delete a resource group from code.

### For reference: equivalent Azure CLI commands

The following Azure CLI commands complete the same provisioning steps as the Python script:

:::code language="azurecli" source="~/../python-sdk-docs-examples/resource_group/provision.cmd":::

## See also

- [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Example: Provision Azure Storage](azure-sdk-example-storage.md)
- [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
- [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Provision and query a database](azure-sdk-example-database.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
