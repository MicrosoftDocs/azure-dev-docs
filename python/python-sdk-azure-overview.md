---
title: Azure SDK for Python
description: Overview of the features and capabilities of the Azure SDK for Python that helps developers be more productive when working with Azure services.
author: kraigb
ms.author: kraigb
manager: barbkess
ms.date: 10/18/2019
ms.topic: conceptual
ms.devlang: python
---

# Azure SDK for Python

The Azure SDK for Python is composed of many individual libraries that simplify using and managing Azure resources from Python application code. The SDK supports Python 2.7 and Python 3.5.3 or later.

Each Azure service has a set of libraries that you can install individually using `pip install <library>`. For a list of all the package names, see the [Azure SDK for Python Package Index](https://github.com/Azure/azure-sdk-for-python/blob/master/packages.md)

You can also install the whole SDK using `pip install azure`. For more details, see [Install the SDK](python-azure-sdk-install.md).

## Manage Azure resources

Create and manage Azure resources from Python applications using the Azure libraries for Python.

For example, to create a SQL Server instance, you can use the following code:

```python
sql_client = SqlManagementClient(
    credentials,
    subscription_id
)

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

Review the [install instructions](python-sdk-azure-install.md) for a full list of the libraries and how to import them into your projects and then read the [get started article](python-sdk-azure-get-started.yml) to set up your authentication and run sample code against your own Azure subscription.

## Connect to Azure services

In addition to using Python libraries to create and manage resources within Azure, you can also use Python libraries to connect and use those resources in your apps. For example, you might update a table SQL Database or store files in Azure Storage. Select the library you need for a particular service from the complete list of libraries and visit the Python developer center for tutorials and sample code for help using them in your apps.

For example, to upload a simple HTML page on a blob and get the Url:

```python
storage_client = CloudStorageAccount(storage_account_name, storage_key)
blob_service = storage_client.create_block_blob_service()

blob_service.create_container(
    'mycontainername',
    public_access=PublicAccess.Blob
)

blob_service.create_blob_from_bytes(
    'mycontainername',
    'myblobname',
    b'<center><h1>Hello World!</h1></center>',
    content_settings=ContentSettings('text/html')
)

print(blob_service.make_blob_url('mycontainername', 'myblobname'))
```


## Getting started

For your convenience, each service has a separate set of libraries that you can choose to use instead of one, large Azure package. To get started with a specific library, see the README.md (or README.rst) file located in the library's project folder in our [GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk).

For more detailed instructions and to learn how to import them into your projects review the [install instructions](python-sdk-azure-install.md) and then read the [get started article](python-sdk-azure-get-started.yml) to set up your authentication and run sample code against your own Azure subscription.

## Connect and use Azure services - client libraries

You can use Python libraries to connect to existing Azure resources and use them in your apps. For example, you might want to upload files to Azure Storage or use a Computer Vision model. Select the library you need for a particular service from the [complete list of libraries](https://github.com/Azure/azure-sdk-for-python/blob/master/packages.md) and visit the [Python developer center](https://docs.microsoft.com/en-us/azure/python/) for tutorials and [Azure Samples](https://docs.microsoft.com/en-us/samples/browse/) for sample code for help using them in your apps.

For example, to upload a simple blob:

To get the library:
```bash
pip install azure-storage-blob
```

In your code include:
```python
from azure.storage.blob import BlobClient

blob = BlobClient.from_connection_string("my_connection_string", container="mycontainer", blob="my_blob")

with open("./SampleSource.txt", "rb") as data:
    blob.upload_blob(data)
```

### New SDKs
We have a new wave of client libraries that share a number of core functionalities such as: retries, logging, transport protocols, authentication protocols, etc. that can be found in the [azure-core](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/core/azure-core) library. You can learn more about these libraries by reading the [guidelines](https://azure.github.io/azure-sdk/python_introduction.html) that they follow. For now, the libraries that follow the guidelines include:
- `azure-storage-blob`
- `azure-storage-file`
- `azure-storage-queue`
- `azure-keyvault-keys`
- `azure-keyvault-secrets`

## Manage Azure resources - management libraries

Create and manage Azure resources from Python applications using the Azure management libraries for Python.
These libraries enable you to provision specific resources in Azure and are responsible for directly mirroring and consuming Azure service's REST endpoints. The management libraries use the `azure-mgmt-<service name>` convention for their package names. Through them you can create, list, and delete all your Azure resources.

For example, to create a SQL Server instance, you can use the following code:

To get the library:
```bash
pip install azure-mgmt-sql
```

In your code include:
```python
sql_client = SqlManagementClient(
    credentials,
    subscription_id
)

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

The following samples cover common automation tasks with the Azure management libraries for Python and have code ready to use in your own apps:
- [Virtual Machines](python-sdk-azure-virtual-machine-samples.md)
- [Web apps](python-sdk-azure-web-apps-samples.md)
- [SQL Database](python-sdk-azure-sql-database-samples.md)

## Sample code and reference

- Browse through a specific service site to find more tutorials (such as [Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-python))
- Go to [Azure Samples](https://docs.microsoft.com/en-us/samples/browse/) to search for samples relevant to you
- You can find sample code right next to the libraries in our [GitHub](https://github.com/Azure/azure-sdk-for-python/) repository
- Find code snippets in our [reference documentation](https://docs.microsoft.com/en-us/python/api?view=azure-python)
- Check out our [release notes](https://azure.github.io/azure-sdk/) for new changes in the SDKs


<!-- - Migration guides -->


## Get help and give feedback

- Visit our [Azure SDK for Python documentation](https://aka.ms/python-docs)
- Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-python)
- Open issues against the SDK on [GitHub](https://github.com/Azure/azure-sdk-for-python/issues)
- Tweet at [@AzureSDK](https://twitter.com/AzureSdk/)
