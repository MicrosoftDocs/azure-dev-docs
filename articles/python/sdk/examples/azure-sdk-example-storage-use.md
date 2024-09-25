---
title: Use Azure Storage with the Azure SDK for Python
description: Use the Azure SDK for Python libraries to access an existing blob container in an Azure Storage account and then upload a file to that container.
ms.date: 09/25/2024
ms.topic: conceptual
ms.custom: devx-track-python, devx-track-azurecli, py-fresh-zinc
---

# Example: Access Azure Storage using the Azure libraries for Python

In this article, you learn how to use the Azure client libraries in Python application code to upload a file to an Azure Blob storage container. The article assumes you've created the resources shown in [Example: Create Azure Storage](azure-sdk-example-storage.md).

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

## 1: Set up your local development environment

If you haven't already, set up an environment where you can run this code. Here are some options:

[!INCLUDE [create_environment_options](../../includes/create-environment-options.md)]

## 2: Install library packages

In your *requirements.txt* file, add lines for the client library package you'll use and save the file.

:::code language="txt" source="~/../python-sdk-docs-examples/storage/requirements_use.txt":::

Then, in your terminal or command prompt, install the requirements.

```console
pip install -r requirements.txt
```

## 3: Create a file to upload

Create a source file named *sample-source.txt*. This file name is what the code expects.

:::code language="txt" source="~/../python-sdk-docs-examples/storage/sample-source.txt":::

## 4: Use blob storage from app code

This section demonstrates two ways to access the blob container created through [Example: Create Azure Storage](azure-sdk-example-storage.md).

The **Passwordless (Recommended)** method authenticates the app with `DefaultAzureCredential` as described in [Authenticate Python apps to Azure services during local development using service principals](../authentication-local-development-service-principal.md). With this method, you must first assign the appropriate permissions to the app identity. which in this example, is an application service principal. [DefaultAzureCredential](../authentication/credential-chains.md#defaultazurecredential-overview) is a chained credential, which provides the ability to authenticate using several different credential types. This means your app could just as easily run under your Azure user account or, if running on Azure, a managed identity without needing to make any code changes.

The **Connection sting** method uses a connection string to access the storage account directly. Although this method seems simpler, it has two significant drawbacks:

- A connection string authenticates the connecting agent with the Storage *account* rather than with individual resources within that account. As a result, a connection string grants broader authorization than might be needed.

- A connection string contains access info in plain text and therefore presents potential vulnerabilities if it's not properly constructed or secured. If such a connection string is exposed, it can be used to access a wide range of resources within the Storage account.

For these reasons, we recommend using the passwordless method in whenever possible.

### [Passwordless (Recommended)](#tab/managed-identity)

1. Create a file named *use_blob_auth.py* with the following code. The comments explain the steps.

    :::code language="python" source="~/../python-sdk-docs-examples/storage/use_blob_auth.py":::

    Reference links:
      - [DefaultAzureCredential (azure.identity)](/python/api/azure-identity/azure.identity.defaultazurecredential)
      - [BlobClient (azure.storage.blob)](/python/api/azure-storage-blob/azure.storage.blob.blobclient)

1. Create an environment variable named `AZURE_STORAGE_BLOB_URL`:

    # [cmd](#tab/cmd)

    ```cmd
    set AZURE_STORAGE_BLOB_URL=https://pythonazurestorage12345.blob.core.windows.net
    ```

    # [bash](#tab/bash)

    ```bash
    AZURE_STORAGE_BLOB_URL=https://pythonazurestorage12345.blob.core.windows.net
    ```

    ---

    Replace "pythonazurestorage12345" with the name of your storage account.

    The `AZURE_STORAGE_BLOB_URL` environment variable is used only by this example. It isn't used by the Azure libraries.

1. Use the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command to create a new service principal for the app. The command creates the app registration for the app at the same time. Give the service principal a name of your choosing.

    ```azurecli
    az ad sp create-for-rbac --name {service-principal-name}
    ```

    The output of this command will look like the following. Make note of these values or keep this window open as you'll need these values in the next step and won't be able to view the password (client secret) value again. You can, however, add a new password later without invalidating the service principal or existing passwords if needed.

    ```json
    {
      "appId": "00000000-0000-0000-0000-000000000000",
      "displayName": "{service-principal-name}",
      "password": "abcdefghijklmnopqrstuvwxyz",
      "tenant": "11111111-1111-1111-1111-111111111111"
    }
    ```

    Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

1. Create environment variables for the application service principal:

    Create the following environment variables with the values from the output of the previous command. These variables tell `DefaultAzureCredential` to use the application service principal.

    - `AZURE_CLIENT_ID` &rarr; The app ID value.
    - `AZURE_TENANT_ID` &rarr; The tenant ID value.
    - `AZURE_CLIENT_SECRET` &rarr; The password/credential generated for the app.

    # [cmd](#tab/cmd)

    ```cmd
    set AZURE_CLIENT_ID=00000000-0000-0000-0000-000000000000
    set AZURE_TENANT_ID=11111111-1111-1111-1111-111111111111
    set AZURE_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyz
    ```

    # [bash](#tab/bash)

    ```bash
    AZURE_CLIENT_ID=00000000-0000-0000-0000-000000000000
    AZURE_TENANT_ID=11111111-1111-1111-1111-111111111111
    AZURE_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyz
    ```

    ---

1. Attempt to run the code (which fails intentionally):

    ```console
    python use_blob_auth.py
    ```

1. Observe the error "This request is not authorized to perform this operation using this permission." The error is expected because the local service principal that you're using doesn't yet have permission to access the blob container.

1. Grant contributor permissions on the blob container to the service principal using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) Azure CLI command:

    ```azurecli
    az role assignment create --assignee <AZURE_CLIENT_ID> \
        --role "Storage Blob Data Contributor" \
        --scope "/subscriptions/<AZURE_SUBSCRIPTION_ID>/resourceGroups/PythonAzureExample-Storage-rg/providers/Microsoft.Storage/storageAccounts/pythonazurestorage12345/blobServices/default/containers/blob-container-01"
    ```

    The `--assignee` argument identifies the service principal. Replace \<AZURE_CLIENT_ID> placeholder with the app ID of your service principal.

    The `--scope` argument identifies where this role assignment applies. In this example, you grant the "Storage Blob Data Contributor" role to the service principal for the container named "blob-container-01".

    - Replace `PythonAzureExample-Storage-rg` and `pythonazurestorage12345` with the resource group that contains your storage account and the exact name of your storage account. Also, adjust the name of the blob container, if necessary. If you use the wrong name, you see the error, "Can not perform requested operation on nested resource. Parent resource 'pythonazurestorage12345' not found."

    - Replace the \<AZURE_SUBSCRIPTION_ID> place holder with your Azure subscription ID. (You can run the [az account show](/cli/azure/account#az-account-show) command and get your subscription ID from the `id` property in the output.)

    > [!TIP]
    > If the role assignment command returns an error "No connection adapters were found" when using bash shell, try setting `export MSYS_NO_PATHCONV=1` to avoid path translation. For more information, see this [issue](https://github.com/git-for-windows/git/issues/577#issuecomment-166118846).

1. **Wait a minute or two for the permissions to propagate**, then run the code again to verify that it now works. If you see the permissions error again, wait a little longer, then try the code again.

For more information on role assignments, see [How to assign role permissions using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

> [!NOTE]
> When deployed to Azure, this same code can be used to authorize requests to Azure Storage from an application running in Azure. However, you'll need to enable managed identity on your app in Azure. Then configure your storage account to allow that managed identity to connect. For detailed instructions on configuring this connection between Azure services, see the [Auth from Azure-hosted apps](/azure/developer/python/sdk/authentication-azure-hosted-apps) tutorial.

### [Connection String](#tab/connection-string)

A connection string includes the storage account access key and uses it to authorize requests. Always be careful to never expose the keys in an unsecure location.

1. Create a Python file named *use_blob_conn_string.py* with the following code. The comments explain the steps.

    :::code language="python" source="~/../python-sdk-docs-examples/storage/use_blob_conn_string.py":::

1. Create an environment variable named `AZURE_STORAGE_CONNECTION_STRING`, the value of which is the full connection string for the storage account. (This environment variable is also used by various Azure CLI comments.) You can get the connection string for your storage account by running the [az storage account show-connection-string](/cli/azure/storage/account#az-storage-account-show-connection-string) command.

    ```azurecli
    az storage account show-connection-string --resource-group PythonAzureExample-Storage-rg --name pythonazurestorage12345
    ```

    Replace `PythonAzureExample-Storage-rg` and `pythonazurestorage12345` with the resource group that contains your storage account and the exact name of your storage account.

    When you set the environment variable, use the entire value of the `connectionString` property in the output including the quotes.

1. Run the code:

    ```console
    python use_blob_conn_string.py
    ```

Again, although this method is simple, a connection string authorizes all operations in a storage account. With production code, it's better to use specific permissions as described in the previous section.

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

## 5. Verify blob creation

After running the code of either method, go to the [Azure portal](https://portal.azure.com), navigate into the blob container to verify that a new blob exists named *sample-blob-{random}.txt* with the same contents as the *sample-source.txt* file:

![Azure portal page for the blob container, showing the uploaded file](../../media/azure-sdk-example-storage/portal-blob-container-file.png)

If you created an environment variable named `AZURE_STORAGE_CONNECTION_STRING`, you can also use the Azure CLI to verify that the blob exists using the [az storage blob list](/cli/azure/storage/blob#az-storage-blob-list) command:

```azurecli
az storage blob list --container-name blob-container-01
```

If you followed the instructions to use blob storage with authentication, you can add the `--connection-string` parameter to the preceding command with the connection string for your storage account. To learn how to get the connection string, see the instructions in [4. Use blob storage from app code (Connection string tab)](azure-sdk-example-storage-use.md?tab=connection-string#4-use-blob-storage-from-app-code). Use the whole connection string including the quotes.

## 6: Clean up resources

Run the [az group delete](/cli/azure/group#az-group-delete) command if you don't need to keep the resource group and storage resources used in this example. Resource groups don't incur any ongoing charges in your subscription, but resources, like storage accounts, in the resource group might incur charges. It's a good practice to clean up any group that you aren't actively using. The `--no-wait` argument allows the command to return immediately instead of waiting for the operation to finish.

```azurecli
az group delete -n PythonAzureExample-Storage-rg  --no-wait
```

[!INCLUDE [resource_group_begin_delete](../../includes/resource-group-begin-delete.md)]

If you followed the instructions to use blob storage with authentication, it's a good idea to delete the application service principal you created. You can use the [az ad app delete](/cli/azure/ad/app#az-ad-app-delete) command. Replace the \<AZURE_CLIENT_ID> placeholder with the app ID of your service principal.

```console
az ad app delete --id <AZURE_CLIENT_ID>
```

## See also

- [Example: Create a resource group](azure-sdk-example-resource-group.md)
- [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Example: Create a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Create Azure Storage](azure-sdk-example-storage.md)
- [Example: Create and query a database](azure-sdk-example-database.md)
- [Example: Create a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
