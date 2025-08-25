---
title: Use Azure Storage with the Azure SDK for Python
description: Use the Azure SDK for Python libraries to access an existing blob container in an Azure Storage account and then upload a file to that container.
ms.date: 09/30/2024
ms.topic: how-to
ms.custom: devx-track-python, devx-track-azurecli, py-fresh-zinc
---

# Example: Access Azure Storage using the Azure libraries for Python

In this article, you learn how to use the Azure client libraries in Python application code to upload a file to an Azure Blob storage container. The article assumes you've created the resources shown in [Example: Create Azure Storage](azure-sdk-example-storage.md).

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

## 1. Set up your local development environment

If you haven't already, set up an environment where you can run this code. Here are some options:

[!INCLUDE [create_environment_options](../../includes/create-environment-options.md)]

## 2. Install library packages

In your *requirements.txt* file, add lines for the client library package you need and save the file.

:::code language="txt" source="~/../python-sdk-docs-examples/storage/requirements_use.txt":::

Then, in your terminal or command prompt, install the requirements.

```console
pip install -r requirements.txt
```

## 3. Create a file to upload

Create a source file named *sample-source.txt*. This file name is what the code expects.

:::code language="txt" source="~/../python-sdk-docs-examples/storage/sample-source.txt":::

## 4. Use blob storage from app code

This section demonstrates two ways to access data in the blob container that you created in [Example: Create Azure Storage](azure-sdk-example-storage.md). To access data in the blob container, your app must be able to authenticate with Azure and be authorized to access data in the container. This section presents two ways of doing this:

- The **Passwordless (Recommended)** method authenticates the app by using [`DefaultAzureCredential`](../authentication/credential-chains.md#defaultazurecredential-overview). `DefaultAzureCredential` is a chained credential that can authenticate an app (or a user) using a sequence of different credentials, including developer tool credentials, application service principals, and managed identities.

- The **Connection string** method uses a connection string to access the storage account directly.

For the following reasons and more, we recommend using the passwordless method whenever possible:

- A connection string authenticates the connecting agent with the Storage *account* rather than with individual resources within that account. As a result, a connection string grants broader authorization than might be needed. With `DefaultAzureCredential` you can grant more granular, least privileged permissions over your storage resources to the identity your app runs under using [Azure RBAC](/azure/role-based-access-control/overview).

- A connection string contains access info in plain text and therefore presents potential vulnerabilities if it's not properly constructed or secured. If such a connection string is exposed, it can be used to access a wide range of resources within the Storage account.

- A connection string is usually stored in an environment variable, which makes it vulnerable to compromise if an attacker gains access to your environment. Many of the credential types supported by `DefaultAzureCredential` don't require storing secrets in your environment.

### [Passwordless (Recommended)](#tab/managed-identity)

`DefaultAzureCredential` is an opinionated, preconfigured chain of credentials. It's designed to support many environments, along with the most common authentication flows and developer tools. An instance of `DefaultAzureCredential` determines which credential types to try to get a token for based on a combination of its runtime environment, the value of certain well-known environment variables, and, optionally, parameters passed into its constructor.

In the following steps, you configure an application service principal as the application identity. Application service principals are suitable for use both during local development and for apps hosted on-premises. To configure `DefaultAzureCredential` to use the application service principal, you set the following environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET`.

Notice that a client secret is configured. This is necessary for an application service principal, but, depending on your scenario, you can also configure `DefaultAzureCredential` to use credentials that don't require setting a secret or password in an environment variable.

For example, in local development, if `DefaultAzureCredential` can't get a token using configured environment variables, it tries to get one using the user (already) signed into development tools like Azure CLI; for an app hosted in Azure, `DefaultAzureCredential` can be configured to use a managed identity. In all cases, the code in your app remains the same, only the configuration and/or the runtime environment changes.

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
    az ad sp create-for-rbac --name <service-principal-name>
    ```

    The output of this command will look like the following. Make note of these values or keep this window open as you'll need these values in the next step and won't be able to view the password (client secret) value again. You can, however, add a new password later without invalidating the service principal or existing passwords if needed.

    ```json
    {
      "appId": "00001111-aaaa-2222-bbbb-3333cccc4444",
      "displayName": "<service-principal-name>",
      "password": "Aa1Bb~2Cc3.-Dd4Ee5Ff6Gg7Hh8Ii9_Jj0Kk1Ll2",
      "tenant": "aaaabbbb-0000-cccc-1111-dddd2222eeee"
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
    set AZURE_CLIENT_ID=00001111-aaaa-2222-bbbb-3333cccc4444
    set AZURE_TENANT_ID=aaaabbbb-0000-cccc-1111-dddd2222eeee
    set AZURE_CLIENT_SECRET=Aa1Bb~2Cc3.-Dd4Ee5Ff6Gg7Hh8Ii9_Jj0Kk1Ll2
    ```

    # [bash](#tab/bash)

    ```bash
    AZURE_CLIENT_ID=00001111-aaaa-2222-bbbb-3333cccc4444
    AZURE_TENANT_ID=aaaabbbb-0000-cccc-1111-dddd2222eeee
    AZURE_CLIENT_SECRET=Aa1Bb~2Cc3.-Dd4Ee5Ff6Gg7Hh8Ii9_Jj0Kk1Ll2
    ```

    ---

1. Attempt to run the code (which fails intentionally):

    ```console
    python use_blob_auth.py
    ```

1. Observe the error "This request is not authorized to perform this operation using this permission." The error is expected because the local service principal that you're using doesn't yet have permission to access the blob container.

1. Grant [Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-blob-data-contributor) permissions on the blob container to the service principal using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) Azure CLI command:

    ```azurecli
    az role assignment create --assignee <AZURE_CLIENT_ID> \
        --role "Storage Blob Data Contributor" \
        --scope "/subscriptions/<AZURE_SUBSCRIPTION_ID>/resourceGroups/PythonAzureExample-Storage-rg/providers/Microsoft.Storage/storageAccounts/pythonazurestorage12345/blobServices/default/containers/blob-container-01"
    ```

    The `--assignee` argument identifies the service principal. Replace \<AZURE_CLIENT_ID> placeholder with the app ID of your service principal.

    The `--scope` argument identifies where this role assignment applies. In this example, you grant the "Storage Blob Data Contributor" role to the service principal for the container named "blob-container-01".

    - Replace `PythonAzureExample-Storage-rg` and `pythonazurestorage12345` with the resource group that contains your storage account and the exact name of your storage account. Also, adjust the name of the blob container, if necessary. If you use the wrong name, you see the error, "Cannot perform requested operation on nested resource. Parent resource 'pythonazurestorage12345' not found."

    - Replace the \<AZURE_SUBSCRIPTION_ID> place holder with your Azure subscription ID. (You can run the [az account show](/cli/azure/account#az-account-show) command and get your subscription ID from the `id` property in the output.)

    > [!TIP]
    > If the role assignment command returns an error "No connection adapters were found" when using bash shell, try setting `export MSYS_NO_PATHCONV=1` to avoid path translation. For more information, see this [issue](https://github.com/git-for-windows/git/issues/577#issuecomment-166118846).

1. **Wait a minute or two for the permissions to propagate**, then run the code again to verify that it now works. If you see the permissions error again, wait a little longer, then try the code again.

For more information on role assignments, see [How to assign role permissions using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

> [!IMPORTANT]
> In the preceding steps, your app ran under an application service principal. An application service principal requires a client secret in its configuration. However, you can use the same code to run the app under different credential types that don't require you to explicitly configure a password or secret in the environment. For example, during development, `DefaultAzureCredential` can use developer tool credentials like the credentials you use to sign in via the Azure CLI; or, for apps hosted in Azure, it can use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). To learn more, see [Authenticate Python apps to Azure services by using the Azure SDK for Python](../authentication/overview.md).

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

If you followed the instructions to use passwordless authentication, you can add the `--connection-string` parameter to the preceding command with the connection string for your storage account. To get the connection string, use the [az storage account show-connection-string](/cli/azure/storage/account#az-storage-account-show-connection-string) command.

```azurecli
az storage account show-connection-string --resource-group PythonAzureExample-Storage-rg --name pythonazurestorage12345 --output tsv
```

Use the entire connection string as the value for the `--connection-string` parameter.

> [!NOTE]
> If your Azure user account has the "Storage Blob Data Contributor" role on the container, you can use the following command to list the blobs in the container:
>
> ```azurecli
> az storage blob list --container-name blob-container-01 --account-name pythonazurestorage12345 --auth-mode login
> ```

## 6. Clean up resources

Run the [az group delete](/cli/azure/group#az-group-delete) command if you don't need to keep the resource group and storage resources used in this example. Resource groups don't incur any ongoing charges in your subscription, but resources, like storage accounts, in the resource group might continue to incur charges. It's a good practice to clean up any group that you aren't actively using. The `--no-wait` argument allows the command to return immediately instead of waiting for the operation to finish.

```azurecli
az group delete -n PythonAzureExample-Storage-rg  --no-wait
```

[!INCLUDE [resource_group_begin_delete](../../includes/resource-group-begin-delete.md)]

If you followed the instructions to use passwordless authentication, it's a good idea to delete the application service principal you created. You can use the [az ad app delete](/cli/azure/ad/app#az-ad-app-delete) command. Replace the \<AZURE_CLIENT_ID> placeholder with the app ID of your service principal.

```azurecli
az ad app delete --id <AZURE_CLIENT_ID>
```

## See also

- [Quickstart: Azure Blob Storage client library for Python](/azure/storage/blobs/storage-quickstart-blobs-python)
- [Example: Create a resource group](azure-sdk-example-resource-group.md)
- [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Example: Create a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Create Azure Storage](azure-sdk-example-storage.md)
- [Example: Create and query a database](azure-sdk-example-database.md)
- [Example: Create a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
