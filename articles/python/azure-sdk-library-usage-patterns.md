---
title: Usage patterns with the Azure libraries for Python
description: An overview of common usage patterns with the Azure SDK libraries for Python
ms.date: 09/21/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Azure libraries for Python usage patterns

The Azure SDK for Python is composed solely of many independent libraries, which are listed on the [Python SDK package index](azure-sdk-library-package-index.md).

All the libraries share certain common characteristics and usage patterns, such as installation and the use of inline JSON for object arguments.

## Library installation

To install a specific library package, just use `pip install`:

```cmd
# Install the management library for Azure Storage
pip install azure-mgmt-storage
```

```cmd
# Install the client library for Azure Storage
pip install azure-storage-blob
```

`pip install` retrieves the latest version of a library in your current Python environment.

You can also use `pip` to uninstall libraries and install specific versions, including preview versions. For more information, see [How to install Azure library packages for Python](azure-sdk-install.md).

## Asynchronous operations

Many operations that you invoke through client and management client objects (such as [`WebSiteManagementClient.web_apps.create_or_update`](/python/api/azure-mgmt-web/azure.mgmt.web.v2019_08_01.operations.webappsoperations#create-or-update-resource-group-name--name--site-envelope--custom-headers-none--raw-false--polling-true----operation-config-)) return an object of type `AzureOperationPoller[<type>]` where `<type>` is specific to the operation in question.

An [`AzureOperationPoller`](/python/api/msrestazure/msrestazure.azure_operation.azureoperationpoller) return type means that the operation is asynchronous. Accordingly, you must call that poller's `result` method to wait for the actual result of the operation to become available.

The following code, taken from [Example: Provision and deploy a web app](azure-sdk-example-web-app.md), shows an example of using the poller to wait for a result:

```python
poller = app_service_client.web_apps.create_or_update(RESOURCE_GROUP_NAME,
    WEB_APP_NAME,
    {
        "location": LOCATION,
        "server_farm_id": plan_result.id,
        "site_config": {
            "linux_fx_version": "python|3.8"
        }
    }
)

web_app_result = poller.result()
```

In this case, the return value of `create_or_update` is of type `AzureOperationPoller[Site]`, which means that the return value of `poller.result()` is a [Site](/python/api/azure-mgmt-web/azure.mgmt.web.v2019_08_01.models.site) object.

## Exceptions

In general, the Azure libraries raise exceptions when operations fail to perform as intended, including failed HTTP requests to the Azure REST API. For app code, then, you can use `try...except` blocks around library operations.

For more information on the type of exceptions that may be raised, consult the documentation for the operation in question.

## Logging

The most recent Azure libraries use the Python standard `logging` library to generate log output. You can set the logging level for individual libraries, groups of libraries, or all libraries. Once you register a logging stream handler, you can then enable logging for a specific client object or a specific operation. For more information, see [Logging in the Azure libraries](azure-sdk-logging.md).

## Proxy configuration

To specify a proxy you can use environment variables or optional arguments. For more information, see [How to configure proxies](azure-sdk-configure-proxy.md).

## Optional arguments for client objects and methods

In the library reference documentation, you often see a `**kwargs` or `**operation_config**` argument in the signature of a client object constructor or a specific operation method. These placeholders indicate that the object or method in question may support additional named arguments. Typically, the reference documentation indicates the specific arguments you can use. There are also some general arguments that are often supported as described in the following sections.

### Arguments for libraries based on azure.core

These arguments apply to those libraries listed on [Python - New Libraries](https://azure.github.io/azure-sdk/releases/latest/#python).

| Name                       | Type | Default     | Description |
| ---                        | ---  | ---         | ---         |
| logging_enable             | bool | False       | Enables logging. For more information, see [Logging in the Azure libraries](azure-sdk-logging.md). |
| proxies                    | dict | {}          | Proxy server URLs. For more information, see [How to configure proxies](azure-sdk-configure-proxy.md). |
| use_env_settings           | bool | True        | If True, allows use of `HTTP_PROXY` and `HTTPS_PROXY` environment variables for proxies. If False, the environment variables are ignored. For more information, see [How to configure proxies](azure-sdk-configure-proxy.md). |
| connection_timeout         | int  | 300         | The timeout in seconds for making a connection to Azure REST API endpoints. |
| read_timeout               | int  | 300         | The timeout in seconds for completing an Azure REST API operation (that is, waiting for a response). |
| retry_total                | int  | 10          | The number of allowable retry attempts for REST API calls. Use `retry_total=0` to disable retries. |
| retry_mode                 | enum | exponential | Applies retry timing in a linear or exponential manner. If 'single', retries are made at regular intervals. If 'exponential', each retry waits twice as long as the previous retry. |

Individual libraries are not obligated to support any of these arguments, so always consult the reference documentation for each library for exact details.

### Arguments for non-core libraries

| Name               | Type | Default | Description |
| ---                | ---  | ---     | ---         |
| verify             | bool | True    | Verify the SSL certificate. |
| cert               | str  | None    | Path to local certificate for client-side verification. |
| timeout            | int  | 30      | Timeout for establishing a server connection in seconds. |
| allow_redirects    | bool | False   | Enable redirects. |
| max_redirects      | int  | 30      | Maximum number of allowed redirects. |
| proxies            | dict | {}      | Proxy server URL. For more information, see [How to configure proxies](azure-sdk-configure-proxy.md). |
| use_env_proxies    | bool | False   | Enable reading of proxy settings from local environment variables. |
| retries            | int  | 10      | Total number of allowable retry attempts. |
| enable_http_logger | bool | False   | Enable logs of HTTP in debug mode. |

## Inline JSON pattern for object arguments

Many operations within the Azure libraries allow you to express object arguments either as discrete objects or as inline JSON.

For example, suppose you have a [`ResourceManagementClient`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2019_10_01.resourcemanagementclient) object through which you create a resource group with its [`create_or_update`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2019_10_01.operations.resourcegroupsoperations#create-or-update-resource-group-name--parameters--custom-headers-none--raw-false----operation-config-)) method. The second argument to this method is of type [`ResourceGroup`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2019_10_01.models.resourcegroup).

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

When using JSON, the Azure libraries automatically convert the inline JSON to the appropriate object type for the argument in question.

Objects can also have nested object arguments, in which case you can also use nested JSON.

For example, suppose you have an instance of the [`KeyVaultManagementClient`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.keyvaultmanagementclient) object, and are calling its [`create_or_update`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.operations.vaultsoperations#create-or-update-resource-group-name--vault-name--parameters--custom-headers-none--raw-false--polling-true----operation-config-) method. In this case, the third argument is of type [`VaultCreateOrUpdateParameters`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.vaultcreateorupdateparameters), which itself contains an argument of type [`VaultProperties`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.vaultproperties). `VaultProperties`, in turn, contains object arguments of type [`Sku`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.sku) and [`list[AccessPolicyEntry]`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.accesspolicyentry). A `Sku` contains a [`SkuName`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.skuname) object, and each `AccessPolicyEntry` contains a [`Permissions`](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault.v2019_09_01.models.permissions) object.

To call `create_or_update` with embedded objects, you use code like the following (assuming `tenant_id` and `object_id` are already defined). You can also create the necessary objects before the function call.

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

Because both forms are equivalent, you can choose whichever you prefer and even intermix them.

If your JSON isn't formed properly, you typically get the error, "DeserializationError: Unable to deserialize to object: type, AttributeError: 'str' object has no attribute 'get'". A common cause of this error is that you're providing a single string for a property when the library expects a nested JSON object. For example, using `"sku": "standard"` in the previous example generates this error because the `sku` parameter is a `Sku` object that expects inline object JSON, in this case `{ "name": "standard"}`, which maps to the expected `SkuName` type.

## Next steps

Now that you understand the common patterns for using the Azure libraries for Python, see the following standalone examples to explore specific management and client library scenarios:

- [Example: Create a resource group](azure-sdk-example-resource-group.md)
- [Example: Use Azure Storage](azure-sdk-example-storage.md)
- [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Provision and query a database](azure-sdk-example-database.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)

You can try these examples in any order as they are neither sequential nor interdependent.
