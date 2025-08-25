---
title: Create a virtual machine using the Azure SDK libraries for Python
description: How to create an Azure virtual machine using Python and the Azure SDK management libraries.
ms.date: 06/10/2025
ms.topic: conceptual
ms.custom:
  - devx-track-python
  - py-fresh-zinc
  - sfi-image-nochange
---

# Example: Use the Azure libraries to create a virtual machine

In this article, you learn how to use the Azure SDK management libraries in a Python script to create a resource group that contains a Linux virtual machine.

The [Equivalent Azure CLI commands](#equivalent-azure-cli-commands) are listed later in this article. If you prefer to use the Azure portal, see [Create a Linux VM](/azure/virtual-machines/linux/quick-create-portal) and [Create a Windows VM](/azure/virtual-machines/windows/quick-create-portal).

> [!NOTE]
> Creating a virtual machine through code is a multi-step process that involves provisioning a number of other resources that the virtual machine requires. If you're simply running such code from the command line, it's much easier to use the [`az vm create`](/cli/azure/vm#az_vm_create) command, which automatically provisions these secondary resources with defaults for any setting you choose to omit. The only required arguments are a resource group, VM name, image name, and login credentials. For more information, see [Quick Create a virtual machine with the Azure CLI](/azure/virtual-machines/scripts/virtual-machines-windows-cli-sample-create-vm-quick-create).

## 1: Set up your local development environment

If you haven't already, set up an environment where you can run this code. Here are some options:

```azurecli
#!/bin/bash
# Create a virtual environment
python -m venv .venv
# Activate the virtual environment
source .venv/Scripts/activate # only required for Windows (Git Bash)
```

* Use a [conda environment](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html). To install Conda, see [Install Miniconda](https://docs.conda.io/en/latest/miniconda.html).

* Use a [Dev Container](https://containers.dev/) in [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) or [GitHub Codespaces](https://docs.github.com/en/codespaces/overview).

## 2: Install the needed Azure library packages

Create a *requirements.txt* file specifying the Azure SDK management packages required by this script.

:::code language="txt" source="~/../python-sdk-docs-examples/vm/requirements.txt":::

Next, install the management libraries specified in *requirements.txt*:

```console
pip install -r requirements.txt
```

## 3: Write code to create a virtual machine

Create a Python file named *provision_vm.py* with the following code. The comments explain the details:

:::code language="python" source="~/../python-sdk-docs-examples/vm/provision_vm.py":::

### Authentication in the code

Later in this article, you sign in to Azure using the Azure CLI to execute the sample code. If your account has sufficient permissions to create resource groups and storage resources in your Azure subscription, the script should run successfully without additional configuration.

To use this code in a production environment, authenticate using a service principal by setting environment variables. This approach enables secure, automated access without relying on interactive login. For detailed guidance, see [How to authenticate Python apps with Azure services](../authentication-overview.md).

Ensure that the service principal is assigned a role with sufficient permissions to create resource groups and storage accounts. For example, assigning the Contributor role at the subscription level provides the necessary access. To learn more about role assignments, see [Role-based access control (RBAC) in Azure](/azure/role-based-access-control/overview).

### Reference links for classes used in the code

* [Defaultredential (azure.identity)](/python/api/azure-identity/azure.identity.defaultazurecredential)
* [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)
* [NetworkManagementClient (azure.mgmt.network)](/python/api/azure-mgmt-network/azure.mgmt.network.networkmanagementclient)
* [ComputeManagementClient (azure.mgmt.compute)](/python/api/azure-mgmt-compute/azure.mgmt.compute.computemanagementclient)

## 4. Run the script

1. If you haven't already, sign in to Azure using the Azure CLI:

    ```azurecli
    az login
    ```

1. Set the `AZURE_SUBSCRIPTION_ID` environment variable to your subscription ID. (You can run the [az account show](/cli/azure/account#az-account-show) command and get your subscription ID from the `id` property in the output):

    ```azurecli
    export AZURE_SUBSCRIPTION_ID=$(az account show --query id -o tsv)
    ```

1. Run the script:

    ```console
    python provision_vm.py
    ```

The provisioning process takes a few minutes to complete.

## 5. Verify the resources

Open the [Azure portal](https://portal.azure.com), navigate to the "PythonAzureExample-VM-rg" resource group, and note the virtual machine, virtual disk, network security group, public IP address, network interface, and virtual network.

![Azure portal page for the new resource group showing the virtual machine and related resources](../../media/azure-sdk-example-virtual-machines/portal-vm-resources.png)

You can also use the Azure CLI to verify that the VM exists with the [az vm list](/cli/azure/vm#az-vm-list) command:

```azurecli
az vm list --resource-group PythonAzureExample-VM-rg
```

### Equivalent Azure CLI commands

:::code language="azurecli" source="~/../python-sdk-docs-examples/vm/provision.sh":::

If you get an error about capacity restrictions, you can try a different size or region. For more information, see [Resolve errors for SKU not available](/azure/azure-resource-manager/troubleshooting/error-sku-not-available).

## 6: Clean up resources

Leave the resources in place if you want to continue to use the virtual machine and network you created in this article. Otherwise, run the [az group delete](/cli/azure/group#az-group-delete) command to delete the resource group.

Resource groups don't incur any ongoing charges in your subscription, but resources contained in the group, like virtual machines, might continue to incur charges. It's a good practice to clean up any group that you aren't actively using. The `--no-wait` argument allows the command to return immediately instead of waiting for the operation to finish.

```azurecli
az group delete -n PythonAzureExample-VM-rg --no-wait
```

[!INCLUDE [resource_group_begin_delete](../../includes/resource-group-begin-delete.md)]

## See also

* [Example: Create a resource group](azure-sdk-example-resource-group.md)
* [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
* [Example: Create Azure Storage](azure-sdk-example-storage.md)
* [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
* [Example: Create a web app and deploy code](azure-sdk-example-web-app.md)
* [Example: Create and query a database](azure-sdk-example-database.md)
* [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
* [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)

The following resources contain more comprehensive examples using Python to create a virtual machine:

* [Azure Virtual Machines Management Samples - Python](https://github.com/Azure-Samples/virtual-machines-python-manage) (GitHub). The sample demonstrates more management operations like starting and restarting a VM, stopping and deleting a VM, increasing the disk size, and managing data disks.
