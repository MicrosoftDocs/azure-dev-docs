---
title: Create and deploy a Python web app to Azure App Service using the Azure SDK libraries
description: Use Azure SDK for Python to create a web app and then deploy app code from a GitHub repository to Azure App Service.
ms.date: 12/28/2023
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Example: Use the Azure libraries to create and deploy a web app

This example demonstrates how to use the Azure SDK *management* libraries in a Python script to create  and deploy a web app to Azure App Service. The app code is deployed from a GitHub repository.

With the management libraries (namespaces beginning with `azure-mgmt`, for example, `azure-mgmt-web`), you can write configuration and deployment programs to perform the same tasks that you can through the Azure portal, Azure CLI, or other resource management tools. For examples, see [Quickstart: Deploy a Python (Django or Flask) web app to Azure App Service](/azure/app-service/quickstart-python). ([Equivalent Azure CLI commands](#for-reference-equivalent-azure-cli-commands) are given at later in this article.)

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

## 1: Set up your local development environment

If you haven't already, set up an environment where you can run this code. Here are some options:

[!INCLUDE [create_environment_options](../../includes/create-environment-options.md)]

## 2: Install the required Azure library packages

Create a file named *requirements.txt* with the following contents:

:::code language="txt" source="~/../python-sdk-docs-examples/webapp/requirements.txt":::

In a terminal or command prompt with the virtual environment activated, install the requirements:

```cmd
pip install -r requirements.txt
```

## 3: Fork the sample repository

Visit [https://github.com/Azure-Samples/python-docs-hello-world](https://github.com/Azure-Samples/python-docs-hello-world) and fork the repository into your own GitHub account. You'll use a fork to ensure that you have permissions to deploy the repository to Azure.

![Forking the sample repository on GitHub](../../media/azure-sdk-example-web-app/fork-github-repository.png)

Then create an environment variable named `REPO_URL` with the URL of your fork. The example code in the next section depends on this environment variable:

# [cmd](#tab/cmd)

```cmd
set REPO_URL=<url_of_your_fork>
set AZURE_SUBSCRIPTION_ID=<subscription_id>
```

# [bash](#tab/bash)

```bash
REPO_URL=<url_of_your_fork>
AZURE_SUBSCRIPTION_ID=<subscription_id>
```

---

## 4: Write code to create and deploy a web app

Create a Python file named *provision_deploy_web_app.py* with the following code. The comments explain the details of the code. Be sure to define the `REPO_URL` and `AZURE_SUBSCRIPTION_ID` environment variables before running the script.

:::code language="python" source="~/../python-sdk-docs-examples/webapp/provision_deploy_web_app.py":::

[!INCLUDE [cli-auth-note](../../includes/cli-auth-note.md)]

### Reference links for classes used in the code

- [AzureCliCredential (azure.identity)](/python/api/azure-identity/azure.identity.azureclicredential)
- [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)
- [WebSiteManagementClient (azure.mgmt.web import)](/python/api/azure-mgmt-web/azure.mgmt.web.websitemanagementclient)

## 5: Run the script

```cmd
python provision_deploy_web_app.py
```

## 6: Verify the web app deployment

Visit the deployed web site by running the following command:

```azurecli
az webapp browse --name PythonAzureExample-WebApp-12345 --resource-group PythonAzureExample-WebApp-rg
```

Replace the web app name (`--name` option) and resource group name (`--resource-group` option) with the values you used in the script. You should see "Hello, World!" in the browser.

If you don't see the expected output, wait a few minutes and try again.

If you still don't see the expected output, then:

1. Go to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups**, and find the resource group you created.
1. Select the resource group name to view the resources it contains. Specifically, verify that there's an App Service Plan and the App Service.
1. Select the App Service, and then select **Deployment Center**.
1. Select the **logs** tab to view deployment logs.

## 7: Redeploy the web app code (optional)

The script sets up the resources needed to host your web app and sets the deployment source to your fork using manual integration. With manual integration, you must trigger the web app to pull from the configured repository and branch.

The script calls the [WebSiteManagementClient.web_apps.sync_repository](/python/api/azure-mgmt-web/azure.mgmt.web.websitemanagementclient) method to trigger a pull from the web app. If you push subsequent code changes to your repository, you can redeploy your code by invoking this API or by using other Azure tooling like the Azure CLI or Azure portal.

You can deploy your code with the Azure CLI by running the [az webapp deployment source sync](/cli/azure/webapp/deployment/source#az-webapp-deployment-source-sync)
 command:

```azurecli
az webapp deployment source sync --name PythonAzureExample-WebApp-12345 --resource-group PythonAzureExample-WebApp-rg
```

Replace the web app name (`--name` option) and resource group name (`--resource-group` option) with the values you used in the script.

To deploy your code from Azure portal:

1. Go to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups**, and find the resource group you created.
1. Select the resource group name to view the resources it contains. Specifically, verify that there's an App Service Plan and the App Service.
1. Select the App Service, and then select **Deployment Center**.
1. On the top menu, select **Sync** to deploy your code.

## 8: Clean up resources

```azurecli
az group delete --name PythonAzureExample-WebApp-rg --no-wait
```

Run the [az group delete](/cli/azure/group#az-group-delete) command if you don't need to keep the resource group created in this example. Resource groups don't incur any ongoing charges in your subscription, but it's a good practice to clean up any group that you aren't actively using. The `--no-wait` argument allows the command to return immediately instead of waiting for the operation to finish.

You can also use the [`ResourceManagementClient.resource_groups.begin_delete`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2021_04_01.operations.resourcegroupsoperations#azure-mgmt-resource-resources-v2021-04-01-operations-resourcegroupsoperations-begin-delete) method to delete a resource group from code.

### For reference: equivalent Azure CLI commands

The following Azure CLI commands complete the same provisioning steps as the Python script:

# [cmd](#tab/cmd)

:::code language="azurecli" source="~/../python-sdk-docs-examples/webapp/provision.cmd":::

# [bash](#tab/bash)

:::code language="azurecli" source="~/../python-sdk-docs-examples/webapp/provision.sh":::

---

## See also

- [Example: Create a resource group](azure-sdk-example-resource-group.md)
- [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Example: Create Azure Storage](azure-sdk-example-storage.md)
- [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
- [Example: Create and query a MySQL database](azure-sdk-example-database.md)
- [Example: Create a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
