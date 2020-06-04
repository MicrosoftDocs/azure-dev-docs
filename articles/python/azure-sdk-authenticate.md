---
title: How to authenticate Python applications with Azure services
description: How to acquire the necessary credential objects to authenticate a Python app with Azure services by using the Azure libraries
ms.date: 05/12/2020
ms.topic: conceptual
---

# How to authenticate Python apps with Azure services

When writing app code using the Azure libraries for Python, you use the following pattern to access Azure resources:

1. Acquire a credential (typically a one time operation).
1. Use the credential to acquire the appropriate client object for a resource.
1. Attempt to access or modify the resource through the client object, which generates an HTTP request to the resource's REST API.

The request to the REST API is the point at which Azure authenticates the app's identity as described by the credential object. Azure then checks whether that identity is authorized to perform the requested action. If the identity does not have authorization, the operation fails. (Granting permissions depends on the type of resource, such as Azure Key Vault, Azure Storage, etc. For more information, see the documentation for that resource type.)

The identity involved in these processes, that is, the identity described by the credentials object, is generally defined by a *security principal* that represents a user, group, service, or app. A number of authentication methods described in this article use an explicit principal, which is typically referred to as a *service principal*.

For most cloud applications, however, we recommend using the `DefaultAzureCredential` object as explained in the first section, because it completely relieves you from handling a service principal for the application.

[!INCLUDE [chrome-note](includes/chrome-note.md)]

## Authenticate with DefaultAzureCredential

```python
import os
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

# Obtain the credential object. When run locally, DefaultAzureCredential relies
# on environment variables named AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, and AZURE_TENANT_ID.
credential = DefaultAzureCredential()

# Create the client object using the credential
#
# **NOTE**: SecretClient here is only an example; the same process
# applies to all other Azure client libraries.

vault_url = os.environ["KEY_VAULT_URL"]
secret_client = SecretClient(vault_url=vault_url, credential=credential)

# Attempt to retrieve a secret value. The operation fails if the principal
# cannot be authenticated or is not authorized for the operation in question.
retrieved_secret = client.get_secret("secret-name-01")
```

The [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python) class from the [`azure-identity`](/python/api/azure-identity/azure.identity?view=azure-python) library provides the simplest and recommended means of authentication.

The previous code uses the `DefaultAzureCredential` when accessing Azure Key Vault, where the URL of the Key Vault is available in an environment variable named `KEY_VAULT_URL`. The code clearly implements the pattern described at the beginning of the article: acquire a credential object, create an SDK client object, then attempt to perform an operation using that client object.

Again, authentication and authorization don't happen until the final step. Creating the SDK [`SecretClient`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient?view=azure-python) object involves no communication with the resource in question; the `SecretClient` object is just a wrapper around the underlying Azure REST API and exists only in the app's runtime memory. It's only when you call the [`get_secret`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient?view=azure-python#get-secret-name--version-none----kwargs-) method that the client object generates the appropriate REST API call to Azure. Azure's endpoint for `get_secret` then authenticates the caller's identity and checks authorization.

When code is deployed to and running on Azure, `DefaultAzureCredential` automatically uses the system-assigned ("managed") identity assigned that you can enable for the app within whatever service is hosting it. For example, for a web app deployed to Azure App Service, you enable its managed identity through the **Identity** > **System assigned** option in the Azure portal, or by using the `az webapp identity assign` command in the Azure CLI. Permissions for specific resources, such as Azure Storage or Azure Key Vault, are also assigned to that identity using the Azure portal or the Azure CLI. In these cases, this Azure-managed identity maximizes security because you don't ever deal with an explicit service principal in your code.

When you run your code locally, `DefaultAzureCredential` automatically uses the service principal described by the environment variables named `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET`. The SDK client object then includes these values (securely) in the HTTP request header when calling the API endpoint. No code changes are necessary. For details on creating the service principal and setting up the environment variables, see [Configure your local Python dev environment for Azure - Configure authentication](configure-local-development-environment.md#configure-authentication).

In both cases, the identity involved must be assigned permissions for the appropriate resource, which is described in the documentation for the individual services. For details on Key Vault permissions, as would be needed for the previous code, see [Provide Key Vault authentication with an access control policy](/azure/key-vault/general/group-permissions-for-apps).

<a name="cli-auth-note"></a>
> [!IMPORTANT]
> In the future, `DefaultAzureCredential` will use the identity signed into the Azure CLI through `az login` if service principal environment variables aren't available. If you're the owner or administrator of your subscription, the practical upshot of this feature is that your code has inherent access to most resources in that subscription without having to assign any specific permissions. This behavior is convenient for experimentation. However, we highly recommend that you use specific service principals and assign specific permissions when you start writing production code because you'll learn how to assign exact permissions to different identities and can accurately validate those permissions in test environments before deploying to production.

### Using DefaultAzureCredential with SDK management libraries

```python
# WARNING: this code presently fails!

from azure.identity import DefaultAzureCredential

# azure.mgmt.resource is an Azure SDK management library
from azure.mgmt.resource import SubscriptionClient

# Attempt to retrieve the subscription ID
credential = DefaultAzureCredential()
subscription_client = SubscriptionClient(credential)

# The following line produces a "no attribute 'signed_session'" error:
subscription = next(subscription_client.subscriptions.list())

print(subscription.subscription_id)
```

At present, `DefaultAzureCredential` works only with Azure SDK client ("data plane") libraries, and does not work with Azure SDK management libraries whose names begin with `azure-mgmt`, as show in this code example. The call to `subscription_client.subscriptions.list()` fails with the rather vague error, "'DefaultAzureCredential' object has no attribute 'signed_session'". This error happens because the current SDK management libraries assume that the credential object contains a `signed_session` property, which `DefaultAzureCredential` lacks.

Until those libraries are updated later in 2020, you can work around the error in two ways:

1. Use one of the other authentication methods describe in subsequent sections of this article, which can work well for code that uses *only* SDK management libraries and that won't be deployed to the cloud, in which case you can rely on local service principals only.

1. Instead of `DefaultAzureCredential`, use the [CredentialWrapper class (cred_wrapper.py)](https://gist.github.com/lmazuel/cc683d82ea1d7b40208de7c9fc8de59d) that's provided by a member of the Azure SDK engineering team. Once Microsoft releases the updated management libraries, you can simply switch back to `DefaultAzureCredential`. This method has the advantage that you can use the same credential with both SDK client and management libraries, and it works both locally and in the cloud.

    Assuming that you've downloaded a copy of *cred_wrapper.py* into your project folder, the previous code would appear as follows:

    ```python
    from cred_wrapper import CredentialWrapper
    from azure.mgmt.resource import SubscriptionClient

    credential = CredentialWrapper()
    subscription_client = SubscriptionClient(credential)
    subscription = next(subscription_client.subscriptions.list())
    print(subscription.subscription_id)
    ```

    Once the management libraries are updated, you can use `DefaultAzureCredential` directly.

## Other authentication methods

Although `DefaultAzureCredential` is the recommended authentication method for most scenarios, other methods are available with the following caveats:

- Most of the methods work with explicit service principals and don't take advantage of managed identity for code that's deployed to the cloud. When used with production code, then, you must manage and maintain distinct service principals for your cloud applications.

- Some methods, such as CLI-based authentication, work only with local scripts and cannot be used with production code.

Service principals for applications deployed to the cloud are managed in your subscriptions Active Directory. For more information, see [How to manage service principals](how-to-manage-service-principals.md).

### Authenticate with a JSON file

In this method, you create a JSON file that contains the necessary credentials for the service principal. You then create an SDK client object using that file. This method can be used both locally and in the cloud. 

1. Create a JSON file with the following format:

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

    Replace the four placeholders with your Azure subscription ID, tenant ID, the client ID, and the client secret.

    > [!TIP]
    > As explained in [Configure your local dev environment](configure-local-development-environment.md#create-a-service-principal-and-environment-variables-for-development), you can use the [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command with the `--sdk-auth` parameter to generate this JSON format directly.

1. Save the file with a name like *credentials.json* in a secure location that your code can access. To keep your credentials secure, be sure to omit this file from source control and don't share it with other developers. That is, the tenant ID, client ID, and client secret of a service principal should always remain isolated on your development workstation.

1. Create an environment variable named `AZURE_AUTH_LOCATION` with the path to the JSON file as the value:

    # [cmd](#tab/cmd)

    ```cmd
    set AZURE_AUTH_LOCATION=../credentials.json
    ```

    # [bash](#tab/bash)

    ```bash
    AZURE_AUTH_LOCATION="../credentials.json"
    ```

    ---

    These examples assume the JSON file is named *credentials.json* and is located in the parent folder of your project.


1. Use the [get_client_from_auth_file](/python/api/azure-common/azure.common.client_factory?view=azure-python#get-client-from-auth-file-client-class--auth-path-none----kwargs-) method to create the client object:

    ```python
    from azure.common.client_factory import get_client_from_auth_file
    from azure.mgmt.resource import SubscriptionClient

    # This form of get_client_from_auth_file relies on the AZURE_AUTH_LOCATION
    # environment variable.
    subscription_client = get_client_from_auth_file(SubscriptionClient)

    subscription = next(subscription_client.subscriptions.list())
    print(subscription.subscription_id)
    ```

You can alternately specify the path directly in code by using the `auth_path` argument, in which case the environment variable isn't needed:

```python
subscription_client = get_client_from_auth_file(SubscriptionClient, auth_path="../credentials.json")
```

### Authenticate with a JSON dictionary

```python
import os
from azure.common.client_factory import get_client_from_json_dict
from azure.mgmt.resource import SubscriptionClient

# Retrieve the IDs and secret to use in the JSON dictionary
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]
tenant_id = os.environ["AZURE_TENANT_ID"]
client_id = os.environ["AZURE_CLIENT_ID"]
client_secret = os.environ["AZURE_CLIENT_SECRET"]

config_dict = {
   "subscriptionId": subscription_id,
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

subscription_client = get_client_from_json_dict(SubscriptionClient, config_dict)

subscription = next(subscription_client.subscriptions.list())
print(subscription.subscription_id)
```

Instead of using a file, as described in the previous section, you can build the necessary JSON data in a variable and call [get_client_from_json_dict](/python/api/azure-common/azure.common.client_factory?view=azure-python#get-client-from-json-dict-client-class--config-dict----kwargs-). This code assumes that you've created the environment variables described in [Configure your local dev environment](configure-local-development-environment.md#create-a-service-principal-and-environment-variables-for-development). For code deployed to the cloud, you can create these environment variables on your server VM or as application settings when using platform service like Azure App Service and Azure Functions.

You can also store values in Azure Key Vault and retrieve them at run time rather than using environment variables.

### Authenticate with token credentials

```python
import os
from azure.mgmt.resource import SubscriptionClient
from azure.common.credentials import ServicePrincipalCredentials

# Retrieve the IDs and secret to use with ServicePrincipalCredentials
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]
tenant_id = os.environ["AZURE_TENANT_ID"]
client_id = os.environ["AZURE_CLIENT_ID"]
client_secret = os.environ["AZURE_CLIENT_SECRET"]

credential = ServicePrincipalCredentials(tenant=tenant_id, client_id=client_id, secret=client_secret)

subscription_client = SubscriptionClient(credential)

subscription = next(subscription_client.subscriptions.list())
print(subscription.subscription_id)
```

In this method, you create a [`ServicePrincipalCredentials`](/python/api/msrestazure/msrestazure.azure_active_directory.serviceprincipalcredentials?view=azure-python) object using credentials obtained from secure storage such as Azure Key Vault or environment variables. The previous code assumes that you've created the environment variables described in [Configure your local dev environment](configure-local-development-environment.md#create-a-service-principal-and-environment-variables-for-development).

With this method, you can use an [Azure sovereign or national cloud](/azure/active-directory/develop/authentication-national-cloud) rather than the Azure public cloud by specifying a `base_url` argument for the client object:

```python
from msrestazure.azure_cloud import AZURE_CHINA_CLOUD

#...

subscription_client = SubscriptionClient(credentials, base_url=AZURE_CHINA_CLOUD.endpoints.resource_manager)
```

Sovreign cloud constants are found in the [msrestazure.azure_cloud library](https://github.com/Azure/msrestazure-for-python/blob/master/msrestazure/azure_cloud.py).

### Authenticate with token credentials and an ADAL context

If you need more control when using token credentials, use the [Azure Active Directory Authentication Library (ADAL) for Python](https://github.com/AzureAD/azure-activedirectory-library-for-python) and the SDK ADAL wrapper:

```python
import os, adal
from azure.mgmt.resource import SubscriptionClient
from msrestazure.azure_active_directory import AdalAuthentication
from msrestazure.azure_cloud import AZURE_PUBLIC_CLOUD

# Retrieve the IDs and secret to use with ServicePrincipalCredentials
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]
tenant_id = os.environ["AZURE_TENANT_ID"]
client_id = os.environ["AZURE_CLIENT_ID"]
client_secret = os.environ["AZURE_CLIENT_SECRET"]

LOGIN_ENDPOINT = AZURE_PUBLIC_CLOUD.endpoints.active_directory
RESOURCE = AZURE_PUBLIC_CLOUD.endpoints.active_directory_resource_id

context = adal.AuthenticationContext(LOGIN_ENDPOINT + '/' + tenant_id)

credential = AdalAuthentication(context.acquire_token_with_client_credentials,
    RESOURCE, client_id, client_secret)

subscription_client = SubscriptionClient(credential)

subscription = next(subscription_client.subscriptions.list())
print(subscription.subscription_id)
```

If you need the adal library, run `pip install adal`.

With this method, you can use an [Azure sovereign or national cloud](/azure/active-directory/develop/authentication-national-cloud) rather than the Azure public cloud.

```python
from msrestazure.azure_cloud import AZURE_CHINA_CLOUD

# ...

LOGIN_ENDPOINT = AZURE_CHINA_CLOUD.endpoints.active_directory
RESOURCE = AZURE_CHINA_CLOUD.endpoints.active_directory_resource_id
```

Simply replace `AZURE_PUBLIC_CLOUD` with the appropriate sovreign cloud constant from the [msrestazure.azure_cloud library](https://github.com/Azure/msrestazure-for-python/blob/master/msrestazure/azure_cloud.py).

### CLI-based authentication (development purposes only)

```python
from azure.common.client_factory import get_client_from_cli_profile
from azure.mgmt.resource import SubscriptionClient

subscription_client = get_client_from_cli_profile(SubscriptionClient)

subscription = next(subscription_client.subscriptions.list())
print(subscription.subscription_id)
```

In this method, you create a client object using the credentials of the user signed in with the Azure CLI command `az login`.

The SDK uses the default subscription ID, or you can set the subscription using [`az account`](https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli)

This method should be used only for early experimentation and development purposes because a signed-in user typically has owner or administrator privileges and can access most resources without any additional permissions. For more information, see the previous note about [using CLI credentials with `DefaultAzureCredential`](#cli-auth-note).

### Deprecated: Authenticate with UserPassCredentials

Before the [Azure Active Directory Authentication Library (ADAL) for Python](https://github.com/AzureAD/azure-activedirectory-library-for-python) was available, you has to use the now-deprecated [`UserPassCredentials`](/python/api/msrestazure/msrestazure.azure_active_directory.userpasscredentials?view=azure-python) class. This class doesn't support two-factor authentication and should no longer be used.

## See also

- [Configure your local Python dev environment for Azure](configure-local-development-environment.md)
- [Example: Provision a resource group](azure-sdk-example-resource-group.md)
- [Example: Provision and use Azure Storage](azure-sdk-example-storage.md)
- [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Provision and use a MySQL database](azure-sdk-example-database.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
