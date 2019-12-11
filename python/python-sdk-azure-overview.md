---
title: Azure SDK for Python
description: Overview of the features and capabilities of the Azure SDK for Python that helps developers be more productive when working with Azure services.
ms.date: 10/30/2019
ms.topic: conceptual
---

# Azure SDK for Python

The Azure SDK for Python simplifies using and managing Azure resources from Python application code. The SDK supports Python 2.7 and Python 3.5.3 or later.

You install the SDK by installing any of its individual component libraries by using `pip install <library>`. You can see the list of libraries on the [Azure SDK for Python package index](https://github.com/Azure/azure-sdk-for-python/blob/master/packages.md)

For more detailed instructions for installing libraries and importing them into projects, see [Install the SDK](python-sdk-azure-install.md). Then review the [Get started with the SDK](python-sdk-azure-get-started.yml) to set up your authentication and run sample code against your own Azure subscription.

> [!TIP]
> For information on changes in the SDK, see the [SDK release notes](https://azure.github.io/azure-sdk/).

[!INCLUDE [chrome-note](includes/chrome-note.md)]

## Connect and use Azure services

A number of *client libraries* in the SDK help you connect to existing Azure resources and use them in your apps, such as uploading files, accessing table data, or working with the various Azure Cognitive Services. With the SDK you work with those resources using familiar Python programming paradigms rather than using the service's generic REST API.

For example, suppose you want to upload a blob to an Azure Storage account that you've previously provisioned. The first step is to install the appropriate library:

```bash
pip install azure-storage-blob
```

Next, import the library in your code:

```python
from azure.storage.blob import BlobClient
```

Finally, use the library's API to connect to and upload the data. In this example, the connection string and container name are already provisioned in your storage account. The blob name is the name you assign to the uploaded data:

```python
blob = BlobClient.from_connection_string("my_connection_string", container="mycontainer", blob="my_blob")

with open("./SampleSource.txt", "rb") as data:
    blob.upload_blob(data)
```

For details on working with each specific library, see the *README.md* or *README.rst* file located in the library's project folder in our [GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). Also refer to the available [Azure Samples](https://docs.microsoft.com/samples/browse/?languages=python).

You can also find additional code snippets in the [reference documentation](/python/api?view=azure-python)

### The Azure Core library

We are currently updating our Python client libraries to share core functionality such as retries, logging, transport protocols, authentication protocols, etc. This shared functionality is contained in the [azure-core](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/core/azure-core) library. For details on the library and its guidelines, see the [Python Guidelines: Introduction](https://azure.github.io/azure-sdk/python_introduction.html).

The libraries that currently work with the Core library are as follows:

- `azure-storage-blob`
- `azure-storage-queue`
- `azure-keyvault-keys`
- `azure-keyvault-secrets`

## Manage Azure resources

The Azure SDK for Python also includes many libraries to help you create, provision, and otherwise manage Azure resources themselves. We refer to these as *management libraries*. Each management library is named `azure-mgmt-<service name>`. With the management libraries, you can write Python code to accomplish the same tasks that you can using the [Azure portal](https://portal.azure.com) or the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

For example, suppose you want to create a SQL Server instance. First, install the appropriate management library:

```bash
pip install azure-mgmt-sql
```

In your Python code, import the library:

```python
from azure.mgmt.sql import SqlManagementClient

```

Next, create the management client object using your credentials and Azure subscription ID:

```python
sql_client = SqlManagementClient(credentials, subscription_id)
```

Finally, use that client object to create the resource, using an appropriate resource group name, server name, location, and administrator credentials:

```python
server = sql_client.servers.create_or_update(
    'myresourcegroup',
    'myservername',
    {
        'location': 'eastus',
        'version': '12.0', # Required for create
        'administrator_login': 'mysecretname', # Required for create
        'administrator_login_password': 'HusH_Sec4et' # Required for create
    }
)
```

As with the client libraries, you can find details on working with each management library in the *README.md* or *README.rst* file located in the library's project folder in our [GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk).

You can also find additional code snippets in the [reference documentation](/python/api?view=azure-python). 

## Get help and give feedback

- Visit the [Azure SDK for Python documentation](https://aka.ms/python-docs)
- Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-python)
- Open issues against the SDK on [GitHub](https://github.com/Azure/azure-sdk-for-python/issues)
- Tweet at [@AzureSDK](https://twitter.com/AzureSdk/)
