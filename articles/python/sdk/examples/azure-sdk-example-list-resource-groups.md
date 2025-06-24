---
title: List resource groups and resources using the Azure libraries for Python
description: Use the resource management library in the Azure SDK for Python to list resource groups and resources in a group.
ms.date: 04/23/2025
ms.topic: how-to
ms.custom: devx-track-python, py-fresh-zinc
---

# Example: Use the Azure libraries to list resource groups and resources

This example demonstrates how to use the Azure SDK management libraries in a Python script to perform two tasks:

- List all the resource groups in an Azure subscription.
- List resources within a specific resource group.

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

The [Equivalent Azure CLI commands](#for-reference-equivalent-azure-cli-commands) are listed later in this article.

## 1: Set up your local development environment

If you haven't already, set up an environment where you can run this code. Here are some options:

* Configure a Python virtual environment using `venv` or your tool of choice. To start using the virtual environment, be sure to activate it. To install python, see [Install Python](https://www.python.org/downloads/).

### [Bash](#tab/bash)

```azurecli-interactive
#!/bin/bash
# Create a virtual environment
python -m venv .venv
# Activate the virtual environment
source .venv/Scripts/activate # only required for Windows (Git Bash)
```

### [PowerShell](#tab/powershell)

```powershell-interactive
# Create a virtual environment
python -m venv venv
# Activate the virtual environment
. .\venv\Scripts\Activate.ps1
```

---

* Use a [conda environment](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html). To install Conda, see [Install Miniconda](https://docs.conda.io/en/latest/miniconda.html).

* Use a [Dev Container](https://containers.dev/) in [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) or [GitHub Codespaces](https://docs.github.com/en/codespaces/overview).

## 2: Install the Azure library packages

Create a file named *requirements.txt* with the following contents:

:::code language="txt" source="~/../python-sdk-docs-examples/resource_group/requirements.txt":::

In a terminal or command prompt with the virtual environment activated, install the requirements:

```console
pip install -r requirements.txt
```

## 3: Write code to work with resource groups

### 3a. List resource groups in a subscription

Create a Python file named *list_groups.py* with the following code. The comments explain the details:

:::code language="python" source="~/../python-sdk-docs-examples/resource_group/list_groups.py":::

### 3b. List resources within a specific resource group

Create a Python file named *list_resources.py* with the following code. The comments explain the details.

By default, the code lists resources in "myResourceGroup". To use a different resource group, set the `RESOURCE_GROUP_NAME` environment variable to the desired group name.

:::code language="python" source="~/../python-sdk-docs-examples/resource_group/list_resources.py":::

### Authentication in the code

Later in this article, you sign in to Azure with the Azure CLI to run the sample code. If your account has permissions to create and list resource groups in your Azure subscription, the code will run successfully.

To use such code in a production script, you can set environment variables to use a service principal-based method for authentication. To learn more, see [How to authenticate Python apps with Azure services](../authentication-overview.md). You need to ensure that the service principal has sufficient permissions to create and list resource groups in your subscription by assigning it an appropriate [role in Azure](/azure/role-based-access-control/overview); for example, the *Contributor* role on your subscription.

### Reference links for classes used in the code

- [DefaultAzureCredential (azure.identity)](/python/api/azure-identity/azure.identity.defaultazurecredential)
- [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)

## 4: Run the scripts

1. If you haven't already, sign in to Azure using the Azure CLI:

    ```azurecli
    az login
    ```

1. Set the `AZURE_SUBSCRIPTION_ID` environment variable to your subscription ID. (You can run the [az account show](/cli/azure/account#az-account-show) command and get your subscription ID from the `id` property in the output):

    # [Bash](#tab/bash)

    ```bash
    export AZURE_SUBSCRIPTION_ID=00000000-0000-0000-0000-000000000000
    ```

    # [Powershell](#tab/powershell)

    ```powershell
    $env:AZURE_SUBSCRIPTION_ID="00000000-0000-0000-0000-000000000000"
    ```

    ---

1. List all resources groups in the subscription:

    ```console
    python list_groups.py
    ```

1. List all resources in a resource group:

    ```console
    python list_resources.py
    ```

    By default, the code lists resources in "myResourceGroup". To use a different resource group, set the `RESOURCE_GROUP_NAME` environment variable to the desired group name.

### For reference: equivalent Azure CLI commands

The following Azure CLI command lists resource groups in a subscription:

```azurecli
az group list
```

The following command lists resources within the "myResourceGroup" in the centralus region (the `location` argument is necessary to identify a specific data center):

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
