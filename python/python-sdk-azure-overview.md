---
title: Azure libraries for Python
description: Overview of the Azure management and service libraries for Python
author: sptramer
ms.author: sttramer
manager: carmonm
ms.date: 06/01/2017
ms.topic: conceptual
ms.devlang: python
---

# Azure libraries for Python

The Azure libraries for Python let you use Azure services and manage Azure resources from your application code. 

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

## Sample code and reference
The following samples cover common automation tasks with the Azure management libraries for Python and have code ready to use in your own apps:
- [Virtual Machines](python-sdk-azure-virtual-machine-samples.md)
- [Web apps](python-sdk-azure-web-apps-samples.md)
- [SQL Database](python-sdk-azure-sql-database-samples.md)

A [reference](/python/api/overview/azure) is available for all packages in both the service an management libraries. New features, breaking changes, and migration instructions from previous versions are available in the [release notes](python-sdk-azure-release-notes.md). 

## Get help and give feedback

Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-python) and open issues against the SDK on the [project GitHub](https://github.com/Azure/azure-sdk-for-python).
