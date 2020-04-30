---
title: Demonstration of using the Azure SDK with Azure Storage
description: Example of working with Azure Storage using Python and both the Azure SDK management libraries and Azure SDK client libraries
ms.date: 04/29/2020
ms.topic: conceptual
---

# Example: Use the Azure SDK with Azure Storage

In this article, you learn how to use the Azure SDK management libraries in a Python script to create a resource group that contains and Azure Storage account and a Blob storage container. You then learn how to use the Azure SDK client libraries in Python application code to upload a file to that Blob storage container.

All the commands in this article work the same in Linux/Mac OS bash and Windows command shells.

## Set up your development environment

If you haven't already, follow all the instructions on [Configure your local Python dev environment for Azure](configure-local-development-environment.md). Be sure to create and activate a virtual environment for this project, and to create a service principal for local development

## Provision resources with the management libraries

1. In your terminal with the virtual environment activated, install the management library for resource groups:

    ```bash
    pip install azure-mgmt-resource
    ```

1. Install the management library for Azure Storage:

    ```bash
    pip install azure-mgmt-storage
    ```

1. Create a Python file named *provision_blob.py* with the following code. The comments explain the details:

    ```python
    # Import the needed management objects from the libraries. The azure.common library
    # is installed automatically with the other libraries.
    from azure.common.client_factory import get_client_from_cli_profile
    from azure.mgmt.resource import ResourceManagementClient
    from azure.mgmt.storage import StorageManagementClient

    # Obtain the management object for resources, using the credentials from the CLI login.
    resource_client = get_client_from_cli_profile(ResourceManagementClient)

    # Create a resource group named "AzureSDKPythonOverview-rg" in the Central US region.
    resource_client.resource_groups.create_or_update("AzureSDKPythonOverview-rg", {"location": "centralus"})

    # Obtain the management object for Azure Storage, again using CLI credentials
    storage_client = get_client_from_cli_profile(StorageManagementClient)
    TODO
    ```

    This code uses the CLI-based authentication methods (`get_client_from_cli_profile`) because it demonstrates actions that you might otherwise do with the Azure CLI directly. In both cases you're using the same identity for authentication.

    To use such code in a production script, you should instead use `DefaultAzureCredential` or a service principal based method as describe in [How to authenticate Python apps with Azure services](azure-sdk-authenticate.md).

1. Run the script:

    ```bash
    python provision_blob.py
    ```

1. Open the [Azure portal](https://portal.azure.com) to verify that the resource group and storage account were created as expected. You may need to select **Show hidden types** in the resource group to see a storage account provisioned from a Python script:

    ![Azure portal page for the new resource group, showing the storage account](media/azure-sdk-example-storage/portal-show-hidden-types.png)

1. Select the storage account, then select **Blob service** > **Containers** in the left-hand menu to verify that the "bloc-container-01" appears: 

    ![Azure portal page for the storage account showing the blob container](media/azure-sdk-example-storage/portal-show-blob-containers.png)

For an additional example using Azure Storage, see the [Manage Python Storage sample](https://docs.microsoft.com/samples/azure-samples/storage-python-manage/storage-python-manage/).

### For reference: equivalent Azure CLI commands

The following Azure CLI commands complete the same provisioning as the previous Python script:

```azurecli
# Create the resource group

az group create -n AzureSDKExample-Storage-rg -l centralus

# Create the storage account

az storage account create -g AzureSDKExample-Storage-rg -l centralus -n pythonsdkstorage12345 --kind StorageV2 --sku Standard_LRS

# Retrieve the connection string the the account

az storage account show-connection-string -g AzureSDKExample-Storage-rg -n pythonsdkstorage12345

# Create an environment variable named AZURE_STORAGE_CONNECTION_STRING using the value shown
# by the previous command. (Mac OS/Linux, drop "set " from the command or change to "export ".)

set AZURE_STORAGE_CONNECTION_STRING=<connection_string_value>

# Create the blob container; this command uses the environment variable
# AZURE_STORAGE_CONNECTION_STRING to connect to the storage account.

az storage container create --account-name pythonsdkoverview12345 -n blob-container-02
```

## Use resources with the client libraries

The following steps assume you've provisioned a Storage account and blob container as demonstrated in the previous section. With those resources in place, you can now write application code to upload a file blob to that container.

1. In your terminal with the virtual environment activated, install the management library for resource groups:

    ```bash
    pip install azure-storage-blob
    ```

1. Create a Python file named *use_blob.py* with the following code. The comments explain the steps:

    ```python
    import os

    # Import the client object from the SDK library
    from azure.storage.blob import BlobClient

    # Retrieve the connection string from an environment variable. You can also create
    # the BlobClient object using credentials, but a connection string is shown here for
    # simplicity.
    conn_string = os.environ["AZURE_STORAGE_CONNECTION_STRING"]

    # Create the client object for the resource identified by the connection string,
    # indicating also the blob container and the name of the specific blob we want.
    blob_client = BlobClient.from_connection_string(conn_string, container_name="blob-container-01", blob_name="sampleblob.txt")

    # Open a local file and upload its contents to Blob Storage
    with open("./samplesource.txt", "rb") as data:
        blob_client.upload_blob(data)
    ```

1. Create a source file named *samplesource.txt* (as the code expects), with contents like the following:

    ```text
    Hello there, Azure Storage. I'm a friendly file ready to be stored in a blob.
    ```

1. Run the code:

    ```bash
    python use_blob.py
    ```

1. On the [Azure portal](https://portal.azure.com), navigate into the blob container to verify that a new blob exists named *sampleblob.txt* with the same contents as the *sameplsource.txt* file:

    ![Azure portal page for the blob container, showing the uploaded file](media/azure-sdk-example-storage/portal-blob-container-file.png)

### Variations

Using a connection string, as demonstrated in the previous example, is the simplest and most direct means to access Azure Storage. Connection strings, however, have two main drawbacks:

- A connection string inherently authenticates the connecting agent with the Storage *account* rather than with individual resources within that account. As a result, a connection string provides grants broader authorization than may be required.
- A connection string contains an access key in plain text and therefore presents potential vulnerabilities if it's improperly constructed or improperly secured. If such a connection string is exposed it can be used to access a wide range of resources within the Storage account.

For these reasons, you may prefer to use a different authentication method when creating the `BlobClient` object.
