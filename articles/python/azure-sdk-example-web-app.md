---
title: Provision and deploy a web app using the Azure SDK libraries
description: Use the management libraries in the Azure SDK libraries for Python to provision a web app and then deploy app code from a GitHub repository.
ms.date: 06/24/2021
ms.topic: conceptual
ms.custom: devx-track-python, devx-track-azurecli
---

# Example: Use the Azure libraries to provision and deploy a web app

This example demonstrates how to use the Azure SDK management libraries in a Python script to provision a web app on Azure App Service and deploy app code from a GitHub repository. ([Equivalent Azure CLI commands](#for-reference-equivalent-azure-cli-commands) are given at later in this article.)

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

## 1: Set up your local development environment

If you haven't already, **follow all the instructions** on [Configure your local Python dev environment for Azure](configure-local-development-environment.md).

Be sure to create a service principal for local development, and create and activate a virtual environment for this project.

## 2: Install the needed Azure library packages

Create a file named *requirements.txt* with the following contents:

:::code language="txt" source="~/../python-sdk-examples/webapp/requirements.txt":::

In a terminal or command prompt with the virtual environment activated, install the requirements:

```cmd
pip install -r requirements.txt
```

## 3: Fork the sample repository

Visit [https://github.com/Azure-Samples/python-docs-hello-world](https://github.com/Azure-Samples/python-docs-hello-world) and fork the repository into your own GitHub account. You use a fork to ensure that you have permissions to deploy the repository to Azure.

![Forking the sample repository on GitHub](media/azure-sdk-example-web-app/fork-github-repository.png)

Then create an environment variable named `REPO_URL` with the URL of your fork. The example code in the next section depends on this environment variable:

# [cmd](#tab/cmd)

```cmd
set REPO_URL=<url_of_your_fork>
```

# [bash](#tab/bash)

```bash
REPO_URL=<url_of_your_fork>
```

---

## 4: Write code to provision and deploy a web app

Create a Python file named *provision_deploy_web_app.py* with the following code. The comments explain the details:

:::code language="python" source="~/../python-sdk-examples/webapp/provision_deploy_web_app.py":::

[!INCLUDE [cli-auth-note](includes/cli-auth-note.md)]

### Reference links for classes used in the code

- [AzureCliCredential (azure.identity)](/python/api/azure-identity/azure.identity.azureclicredential)
- [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)
- [WebSiteManagementClient (azure.mgmt.web import)](/python/api/azure-mgmt-web/azure.mgmt.web.websitemanagementclient)

## 5: Run the script

```cmd
python provision_deploy_web_app.py
```

## 6: Verify the web app deployment

1. Visit the deployed web site by running the following command:

    ```azurecli
    az webapp browse -n PythonAzureExample-WebApp-12345
    ```

    Replace "PythonAzureExample-WebApp-12345" with the specific name of your web app.

    You should see "Hello, World!" in the browser.

1. Visit the [Azure portal](https://portal.azure.com), select **Resource groups**, and check that "PythonAzureExample-WebApp-rg" is listed. Then Navigate into that list to verify the expected resources exist, namely the App Service Plan and the App Service.

## 7: Clean up resources

```azurecli
az group delete -n PythonAzureExample-WebApp-rg --no-wait
```

Run this command if you don't need to keep the resources provisioned in this example and would like to avoid ongoing charges in your subscription.

You can also use the [`ResourceManagementClient.resource_groups.delete`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2019_10_01.operations.resourcegroupsoperations#delete-resource-group-name--custom-headers-none--raw-false--polling-true----operation-config-) method to delete a resource group from code.

### For reference: equivalent Azure CLI commands

The following Azure CLI commands complete the same provisioning steps as the Python script:

# [cmd](#tab/cmd)

:::code language="azurecli" source="~/../python-sdk-examples/webapp/provision.cmd":::

# [bash](#tab/bash)

:::code language="azurecli" source="~/../python-sdk-examples/webapp/provision.sh":::

---

## See also

- [Example: Provision a resource group](azure-sdk-example-resource-group.md)
- [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Example: Provision Azure Storage](azure-sdk-example-storage.md)
- [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
- [Example: Provision and use a MySQL database](azure-sdk-example-database.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
