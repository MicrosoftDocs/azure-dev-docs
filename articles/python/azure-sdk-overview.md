---
title: Azure SDK for Python
description: Overview of the features and capabilities of the Azure SDK for Python that helps developers be more productive when provisioning, using, and managing Azure resources.
ms.date: 03/17/2020
ms.topic: conceptual
---

# Azure SDK for Python

The open-source Azure SDK for Python simplifies provisioning, using, and managing Azure resources from Python application code. The SDK supports Python 2.7 and Python 3.5.3 or later.

The SDK is made of individual component libraries, each of which you install by using `pip install <library>`. More detailed instructions are found on [Install the SDK](azure-sdk-install.md). The [Azure SDK for Python documentation](https://azure.github.io/azure-sdk-for-python/) provides the names of the libraries.

You can also follow the walkthrough, [Get started with the Azure SDK for Python](azure-sdk-get-started.yml), to experience the libraries for yourself.

> [!TIP]
> For information on changes in the SDK, see the [SDK release notes](https://azure.github.io/azure-sdk/).

[!INCLUDE [chrome-note](includes/chrome-note.md)]

## Management and client libraries

The Azure SDK for Python contains two types of libraries:

- *Management* libraries help you provision and manage Azure resources as you can do through the [Azure portal](https://portal.azure.com) or with command-line tools like the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and [Azure PowerShell](https://docs.microsoft.com/powershell/azure/). The management libraries are most typically used in configuration and deployment scripts. (The Azure CLI, in fact, is itself written with the Python management libraries.)

- *Client* libraries provide the means for application code to interact with already-provisioned services using natural Python idioms. Under the covers, the client libraries use Azure's REST APIs, but by using the SDK you don't need to worry about REST details.

The following sections provide more details and examples for each category.

## Manage Azure resources with management libraries

The management libraries of the Azure SDK for Python, each named `azure-mgmt-<service name>`, help you create, provision, and otherwise manage Azure resources.

For example, suppose you want to create a SQL Server instance. First, install the appropriate management library:

```bash
pip install azure-mgmt-sql
```

In your Python code, import the library:

```python
from azure.mgmt.sql import SqlManagementClient
```

Next, create the management client object using your credentials (see [Authenticate with the SDK](azure-sdk-authenticate.md)) and Azure subscription ID:

```python
sql_client = SqlManagementClient(credentials, subscription_id)
```

Finally, use that management client object to create the resource, using an appropriate resource group name, server name, location, and administrator credentials:

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

For details on working with each management library, see the *README.md* or *README.rst* file located in the library's project folder in the SDK's [GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). You can also find additional code snippets in the [reference documentation](/python/api?view=azure-python) and the [Azure Samples](https://docs.microsoft.com/samples/browse/?languages=python&products=azure).

## Connect and use Azure services with client libraries

The Azure SDK's *client libraries* help you connect to existing Azure resources and use them in your apps, such as uploading files, accessing table data, or working with the various Azure Cognitive Services. With the SDK you work with those resources using familiar Python programming paradigms rather than using the service's generic REST API. (Services that don't have a REST API aren't represented by a client library.)

For example, suppose you've deployed a web app to Azure App service and want to add the ability to upload a file to an Azure Storage account. The first step is to install the appropriate library:

```bash
pip install azure-storage-blob
```

Next, import the library in your code:

```python
from azure.storage.blob import BlobClient
```

Finally, use the library's API to connect to and upload the data. In this example, the connection string and container name are already provisioned in your storage account. The blob name is the name you assign to the uploaded data:

```python
blob = BlobClient.from_connection_string("my_connection_string", container_name="mycontainer", blob_name="my_blob")

with open("./SampleSource.txt", "rb") as data:
    blob.upload_blob(data)
```

For details on working with each management library, see the *README.md* or *README.rst* file located in the library's project folder in the SDK's [GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). You can also find additional code snippets in the [reference documentation](/python/api?view=azure-python) and the [Azure Samples](https://docs.microsoft.com/samples/browse/?languages=python&products=azure).

### The Azure Core library

We are currently updating the Azure SDK for Python client libraries to share common cloud patterns such as authentication protocols, logging, tracing, transport protocols, buffered responses, and retries. This shared functionality is contained in the [azure-core](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/core/azure-core) library. The libraries that currently work with the Core library are listed on the [Azure SDK latest releases](https://azure.github.io/azure-sdk/releases/latest/#python-packages) page.

For details on the Azure Core Library and its guidelines, see the [Python Guidelines: Introduction](https://azure.github.io/azure-sdk/python_introduction.html).

## Get help and give feedback

- Visit the [Azure SDK for Python documentation](https://aka.ms/python-docs)
- Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-python)
- Open issues against the SDK on [GitHub](https://github.com/Azure/azure-sdk-for-python/issues)
- Mention [@AzureSDK](https://twitter.com/AzureSdk/) on Twitter
