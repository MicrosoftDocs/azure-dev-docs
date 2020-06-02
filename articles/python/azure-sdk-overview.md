---
title: Use the Azure SDK for Python
description: Overview of the features and capabilities of the Azure SDK for Python that helps developers be more productive when provisioning, using, and managing Azure resources.
ms.date: 05/13/2020
ms.topic: conceptual
---

# Use the Azure SDK for Python

The open-source Azure SDK for Python simplifies provisioning, managing, and using Azure resources from Python application code.

## The details you really want to know

- The SDK supports Python 2.7 and Python 3.5.3 or later, and it tested also with PyPy 5.4+.

- The SDK is composed of over 180 individual Python libraries that relate to specific Azure services.

- You install the libraries you need with `pip install <library_name>`, using the library names on the [release list](https://azure.github.io/azure-sdk/releases/latest/all/python.html). For further details, see [Install Azure SDK libraries](azure-sdk-install.md).

- There are distinct "management" and "client" libraries (sometimes referred to as "management plane" and "data plane" libraries). Each set serves different purposes and are used by different kinds of code. For more details, see the following sections later in this article:
  - [Provision and manage Azure resources with management libraries](#provision-and-manage-azure-resources-with-management-libraries)
  - [Connect to and use Azure resources with client libraries](#connect-to-and-use-azure-resources-with-client-libraries)

- Documentation for the SDK is found on the [Azure SDK for Python Reference](/python/api/overview/azure/?view=azure-python), which is organized by Azure Service, or the [Python API browser](/python/api/?view=azure-python), which is organized by package name. At present, you often need to click to a number of layers to get to the classes and methods you care about. Allow us to apologize in advance for this sub-par experience. We're working to improve it!

- To try the libraries for yourself, we first recommend [setting up your local dev environment](configure-local-development-environment.md). Then you can try any of the following standalone examples (in any order): [Example: Provision a resource group](azure-sdk-example-resource-group.md), [Example: Provision and use Azure Storage](azure-sdk-example-storage.md), [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md), [Example: Provision and use a MySQL database](azure-sdk-example-database.md), and [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md).

### Non-essential but still interesting details

- Because the Azure CLI is written in Python using the SDK management libraries, anything you can do with Azure CLI commands you can also do from a Python script. That said, the CLI commands provide many helpful features such as performing multiple tasks together, automatically handling asynchronous operations, formatting output like connection strings, and so on. Consequently, using the CLI (or its equivalent, Azure PowerShell) for automated provisioning and management scripts can be significantly more convenient than writing the equivalent Python code, unless you want to have a much more exacting degree of control over the process.

- The Azure SDK for Python is a Python layer on top of the underlying Azure REST API, allowing you to use those APIs through familiar Python paradigms. However, you can always use the REST API directly from Python code, if desired.

- You can find the source code for the SDK on [https://github.com/Azure/azure-sdk-for-python](https://github.com/Azure/azure-sdk-for-python). As an open source project, contributions are welcome!

- Although you can use the SDK with interpreters such as IronPython and Jython that we don't test against, you may encounter isolated issues and incompatibilities.

- The source repo for the SDK documentation is found on [https://github.com/MicrosoftDocs/azure-docs-sdk-python/](https://github.com/MicrosoftDocs/azure-docs-sdk-python/).

- We're currently updating the Azure SDK for Python libraries to share common cloud patterns such as authentication protocols, logging, tracing, transport protocols, buffered responses, and retries.

  - This shared functionality is contained in the [azure-core](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/core/azure-core) library.

  - The libraries that currently work with the Core library are listed on [Azure SDK for Python latest releases](https://azure.github.io/azure-sdk/releases/latest/#python). These libraries, primarily the client libraries, are sometimes referred to as "track 2".

  - The management libraries, which are not yet updated, are sometimes referred to as "track 1".

- For details on the guidelines we apply to the SDK, see the [Python Guidelines: Introduction](https://azure.github.io/azure-sdk/python_introduction.html).

## Provision and manage Azure resources with management libraries

The SDK's *management* (or "management plane") libraries, the names of which all begin with `azure-mgmt-`, help you create, provision and otherwise manage Azure resources from Python scripts. All Azure services have corresponding management libraries.

With the management libraries, you can write configuration and deployment scripts to perform the same tasks that can you through the [Azure portal](https://portal.azure.com) or the [Azure CLI](/cli/azure/install-azure-cli). (As noted earlier, the Azure CLI is written in Python and uses the management libraries to implement its various commands.)

For details on working with each management library, see the *README.md* or *README.rst* file located in the library's project folder in the SDK's [GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). You can also find additional code snippets in the [reference documentation](/python/api?view=azure-python) and the [Azure Samples](https://docs.microsoft.com/samples/browse/?languages=python&products=azure).

## Connect to and use Azure resources with client libraries

The SDK's *client* (or "data plane") libraries help you write Python application code to interact with already-provisioned services. The SDK provides client libraries only for those services that support a client API.

For details on working with each client library, see the *README.md* or *README.rst* file located in the library's project folder in the SDK's [GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). You can also find additional code snippets in the [reference documentation](/python/api?view=azure-python) and the [Azure Samples](https://docs.microsoft.com/samples/browse/?languages=python&products=azure).

## Inline JSON pattern for object arguments

Many operations within the Azure SDK support a common pattern that allows you to express object arguments as discrete objects or as inline JSON.

For example, suppose you have a [`ResourceManagementClient`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2019_10_01.resourcemanagementclient?view=azure-python) object through which you create a resource group with its [`create_or_update`](/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2019_10_01.operations.resourcegroupsoperations?view=azure-python#create-or-update-resource-group-name--parameters--custom-headers-none--raw-false----operation-config-)) method. The second argument to this method is of type [`ResourceGroup`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2019_10_01.models.resourcegroup?view=azure-python).

To call `create_or_update` you can create a discrete instance of `ResourceGroup` directly with its required arguments (`location` in this case):

```python
rg_result = resource_client.resource_groups.create_or_update(
    "PythonSDKExample-rg",
    ResourceGroup(location="centralus")
)
```

Alternately, you can pass the same parameters as inline JSON:

```python
rg_result = resource_client.resource_groups.create_or_update(
    "PythonSDKExample-rg",
    {
      "location": "centralus"
    }
)
```

When using JSON, the SDK automatically converts the inline JSON to the appropriate object type for the argument in question.

Objects can also have nested object arguments, in which case you can also use nested JSON.

For example, suppose you have an instance of the [`KeyVaultManagementClient`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.keyvaultmanagementclient?view=azure-python) object, and are calling its [`create_or_update`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.operations.vaultsoperations?view=azure-python#create-or-update-resource-group-name--vault-name--parameters--custom-headers-none--raw-false--polling-true----operation-config-) method. In this case, the third argument is of type [`VaultCreateOrUpdateParameters`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.vaultcreateorupdateparameters?view=azure-python), which itself contains an argument of type [`VaultProperties`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.vaultproperties?view=azure-python). `VaultProperties`, in turn, contains object arguments of type [`Sku`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.sku?view=azure-python) and [`list[AccessPolicyEntry`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.accesspolicyentry?view=azure-python). A `Sku` contains a [`SkuName`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.skuname?view=azure-python) object, and each `AccessPolicyEntry` contains a [`Permissions`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.permissions?view=azure-python) object.

To call `create_or_update` with embedded objects uses code like the following (assuming `tenant_id` and `object_id` are already defined):

```python
operation = keyvault_client.vaults.create_or_update(
    "PythonSDKExample-rg",
    "keyvault01",
    VaultCreateOrUpdateParameters(
        location="centralus",
        properties=VaultProperties(
            tenant_id=tenant_id,
            sku=Sku(name="standard"),
            access_policies=[
                AccessPolicyEntry(
                    tenant_id=tenant_id,
                    object_id=object_id,
                    permissions=Permissions(keys=['all'], secrets=['all'])
                )
            ]
        )
    )
)
```

The same call using inline JSON appears as follows:

```python
operation = keyvault_client.vaults.create_or_update(
    "PythonSDKExample-rg",
    "keyvault01",
    {
        'location': 'centralus',
        'properties': {
            'sku': {
                'name': 'standard'
            },
            'tenant_id': tenant_id,
            'access_policies': [{
                'object_id': object_id,
                'tenant_id': tenant_id,
                'permissions': {
                    'keys': ['all'],
                    'secrets': ['all']
                }
            }]
        }
    }
)
```

Because both forms are entirely equivalent, you can either whichever you prefer and even intermix them.

If your JSON isn't formed properly, you typically get the error, "DeserializationError: Unable to deserialize to object: type, AttributeError: 'str' object has no attribute 'get'". A common cause of this error is that you're providing a single string for a property when the SDK expects a nested JSON object. For example, using `"sku": "standard"` in the previous example generates this error because the `sku` parameter is a `Sku` object that expects inline object JSON, in this case `{ "name": "standard"}`, which maps to the expected `SkuName` type.

## Next step

> [!div class="nextstepaction"]
> [Install SDK libraries >>>](azure-sdk-install.md)

## Get help and connect with the SDK team

- Visit the [Azure SDK for Python documentation](https://aka.ms/python-docs)
- Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-python)
- Open issues against the SDK on [GitHub](https://github.com/Azure/azure-sdk-for-python/issues)
- Mention [@AzureSDK](https://twitter.com/AzureSdk/) on Twitter
