---
title: Authenticate apps using the Azure management libraries for Python
description: Authenticate a Python app with Azure services by using the Azure management SDK libraries
ms.date: 01/16/2020
ms.topic: conceptual
ms.custom: seo-python-october2019
---

# Authenticate by using the Azure management libraries for Python

In this article, you learn how to use the Python SDK management libraries to authenticate an application with Azure Active Directory (Azure AD) using a service principal. The service principal is an identity for an application that's registered with Azure AD and allows the application to access or modify resources according to its permissions.

To register applications, you must first create an Active Directory with an appropriate tenant for your organization. You can do this by following the instructions in [Create a new tenant in Azure Active Directory](/azure/active-directory/fundamentals/active-directory-access-create-new-tenant). Once the Active Directory is in place, follow the article, [How to: Use the portal to create an Azure AD application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal), in which you register an application, [retrieve the tenant and application (client) IDs for the service principal](/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in)), and set up an [application secret](/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret) with which you authenticate from Python code.

Once you have these values, you can use those credentials to authenticate in several ways using the Python SDK libraries. The result of each method is the SDK client object that you use when accessing other resources from code.

We highly recommend storing the tenant ID, client ID, and secret in [Azure KeyVault](/azure/key-vault/), so that those values aren't present anywhere on your systems or in source control. You can easily retrieve the values whenever you need them.

[!INCLUDE [chrome-note](includes/chrome-note.md)]

## <a name="mgmt-auth-file"></a>Authenticate with a JSON file

In this method, you create a JSON file that contains the necessary credentials for the service principal, then create the SDK client object using the information in the file.

1. Create a JSON file (with whatever name you want, such as *app_credentials.json*) with the following format. Replace the four placeholders with your Azure subscription ID, the Azure AD tenant ID, the application (client)) ID, and the secret:

    ```json
    {
        "subscriptionId": "<azure_aubscription_id>",
        "tenantId": "<tenant_id>",
        "clientId": "<application_id>",
        "clientSecret": "<application_secret>",
        "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
        "resourceManagerEndpointUrl": "https://management.azure.com/",
        "activeDirectoryGraphResourceId": "https://graph.windows.net/",
        "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
        "galleryEndpointUrl": "https://gallery.azure.com/",
        "managementEndpointUrl": "https://management.core.windows.net/"
    }
    ```

    > [!TIP]
    > You can retrieve a credentials file with your subscription ID already in place by signing in to Azure using the [az login](/cli/azure/group#az-login) command followed by the [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command:
    >
    > ```azurecli
    > az login
    > az ad sp create-for-rbac --sdk-auth > credentials.json
    > ```
    >
    > You can then replace the `tenantId`, `clientId`, and `clientSecret` values for your specific application rather than using the general-use values.

1. Save this file in a secure location where your code can access it.

1. Use the [get_client_from_auth_file](/python/api/azure-common/azure.common.client_factory?view=azure-python#get-client-from-auth-file-client-class--auth-path-none----kwargs-) method to create the client object, replacing `<path_to_file>` with the path to the JSON file:

    ```python
    from azure.common.client_factory import get_client_from_auth_file
    from azure.mgmt.compute import ComputeManagementClient

    client = get_client_from_auth_file(ComputeManagementClient, auth_path=<path_to_file>)
    ```

1. You can alternately store the path to the file in an environment variable called `AZURE_AUTH_LOCATION` and omit the `auth_path` argument.

## Authenticate with a JSON dictionary

Instead of using a file, as described in the previous section, you can build the necessary JSON in a variable and call [get_client_from_json_dict](/python/api/azure-common/azure.common.client_factory?view=azure-python#get-client-from-json-dict-client-class--config-dict----kwargs-) instead. In this case, you should always store the tenant ID, client ID, and secret in a secure location like [Azure KeyVault](/azure/key-vault/).

```python
   from azure.common.client_factory import get_client_from_auth_file
   from azure.mgmt.compute import ComputeManagementClient

    # Retrieve tenant_id, client_id, and client_secret from Azure KeyVault

   config_dict = {
       "subscriptionId": "bfc42d3a-65ca-11e7-95cf-ecb1d756380e",
        "tenantId": tenant_id,
       "clientId": client_id,
       "clientSecret": client_secret,
       "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
       "resourceManagerEndpointUrl": "https://management.azure.com/",
       "activeDirectoryGraphResourceId": "https://graph.windows.net/",
       "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
       "galleryEndpointUrl": "https://gallery.azure.com/",
       "managementEndpointUrl": "https://management.core.windows.net/"
   }
   client = get_client_from_json_dict(ComputeManagementClient, config_dict)
```

## <a name="mgmt-auth-token"></a>Authenticate with token credentials

Assuming that you retrieve the credentials from secure storage, such as [Azure KeyVault](/azure/key-vault/), first create a [ServicePrincipalCredentials] object, then create an instance of the client using those credentials and your subscription ID:

```python
from azure.mgmt.compute import ComputeManagementClient
from azure.common.credentials import ServicePrincipalCredentials

# Retrieve credentials from secure storage. Never hard-code credentials into code.

credentials = ServicePrincipalCredentials(tenant = <tenant_id>,
    client_id = <client_id>, secret = <secret>)

client = ComputeManagementClient(credentials, <subscription_id>)
```

If you need more control, use the [Azure Active Directory Authentication Library (ADAL) for Python](https://github.com/AzureAD/azure-activedirectory-library-for-python) and the SDK ADAL wrapper:

```python
from azure.mgmt.compute import ComputeManagementClient
import adal
from msrestazure.azure_active_directory import AdalAuthentication
from msrestazure.azure_cloud import AZURE_PUBLIC_CLOUD

# Retrieve credentials from secure storage. Never hard-code credentials into code.

LOGIN_ENDPOINT = AZURE_PUBLIC_CLOUD.endpoints.active_directory
RESOURCE = AZURE_PUBLIC_CLOUD.endpoints.active_directory_resource_id

context = adal.AuthenticationContext(LOGIN_ENDPOINT + '/' + TENANT_ID)

credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
    RESOURCE, <client_id>, <secret>)

client = ComputeManagementClient(credentials, <subscription_id>)
```

> [!NOTE]
> When using an Azure sovereign cloud, specify the appropriate base URL (using a constant in `msrestazure.azure_cloud`) when creating the management client:
>
> ```python
> client = ComputeManagementClient(credentials, subscription_id,
>     base_url=AZURE_CHINA_CLOUD.endpoints.resource_manager)
> ```

### <a name="mgmt-auth-legacy"></a>Authenticate with token credentials (deprecated)

Before the [Azure Active Directory Authentication Library (ADAL) for Python](https://github.com/AzureAD/azure-activedirectory-library-for-python) was available, you used the `UserPassCredentials` class. Using this class is considered deprecated and should not be used anymore as it doesn't support two-factor authentication.

```python
from azure.common.credentials import UserPassCredentials

# DEPRECATED - legacy purposes only - use ADAL instead
credentials = UserPassCredentials(
    'user@domain.com',
    'my_smart_password'
)
```

## <a name="mgmt-auth-msi"></a>Authenticate with Azure Managed Identities

Azure Managed Identity is a simple way for a resource in Azure to authenticate without using  specific credentials.

To use managed identities, you must be connecting to Azure from another Azure resource, such as an Azure Function or a virtual machine. To learn how to configure a managed identity for a resource, see [Configure managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm) and [How to use managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/how-to-use-vm-sign-in).

```python
from msrestazure.azure_active_directory import MSIAuthentication
from azure.mgmt.resource import ResourceManagementClient, SubscriptionClient

# Create MSI Authentication
credentials = MSIAuthentication()

# Create a Subscription Client
subscription_client = SubscriptionClient(credentials)
subscription = next(subscription_client.subscriptions.list())
subscription_id = subscription.subscription_id

# Create a Resource Management client
client = ResourceManagementClient(credentials, subscription_id)

# List resource groups as an example. The only limit is what role and policy are assigned to this MSI token.
for resource_group in resource_client.resource_groups.list():
    print(resource_group.name)
```

## <a name="mgmt-auth-cli"></a>CLI-based authentication (development purposes only)

The SDK is able to create a client using the Azure CLI's active subscription, after you've run `az login`. The SDK uses the default subscription ID, or you can set the subscription using [az account](https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli)

This option should be used for development purposes only.

```python
from azure.common.client_factory import get_client_from_cli_profile
from azure.mgmt.compute import ComputeManagementClient

client = get_client_from_cli_profile(ComputeManagementClient)
```
