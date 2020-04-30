---
title: How to authenticate Python applications with Azure services
description: Authenticate a Python app with Azure services by using the Azure management SDK libraries
ms.date: 04/29/2020
ms.topic: conceptual
---

# How to authenticate Python apps with Azure services

When writing app code using the Azure SDK for Python, you use the following pattern to access Azure resources:

1. Acquire a credential (a one-time operation).
1. Use the credential to acquire an SDK-provided client object for a resource.
1. Attempt to access or modify the resource through the client object.

When your code attempts to access the resource in the last step, Azure first authenticates the app's identity that's described by the credential object, and then checks whether that identity is authorized to perform the requested action. If the identity does not have authorization, the operation fails. (The process of granting such permissions depends on the type of resource, such as Azure Key Vault, Azure Storage, etc. For more information, see the documentation for that resource type.)

For apps running in the cloud, Azure uses the identity assigned to the app within whatever service is hosting it. For example, a web app deployed to Azure App Service is assigned a unique name, which serves as its identity within Azure. Permissions for specific resources, such as Azure Storage or Azure Key Vault, are assigned to that identity using the Azure portal or the Azure CLI. Because authentication and authorization happens automatically, Azure in this case is using what is called *managed identity*.

When running app code locally, the Azure SDK relies on specific environment variables that contain properties of the service principal to use as the app's identity. For instructions on acquiring the necessary service principal and creating the environment variables, see [Configure your local Python dev environment for Azure](configure-local-development-environment.md).

This article explains the different methods you can use with the Azure SDK for authentication.

[!INCLUDE [chrome-note](includes/chrome-note.md)]

## Authenticate with DefaultAzureCredential

```python
import os
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

# Obtain the credential object
credential = DefaultAzureCredential()

# Create the SDK client object to access Key Vault secrets.
vault_url = os.environ["KEY_VAULT_URL"]
secret_client = SecretClient(vault_url=vault_url, credential=credential)

# Attempt to retrieve a secret value. The operation fails if the service principal
# cannot be authenticated or is not authorized for the operation in question.
retrieved_secret = client.get_secret("secret-name-01")
```

The [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python) class from the [`azure.identity`](/python/api/azure-identity/azure.identity?view=azure-python) library provides the simplest and recommended means of authentication.

The code uses the `DefaultAzureCredential` when accessing Azure Key Vault, where the URL of the Key Vault is available in an environment variable named `KEY_VAULT_URL`. The code clearly implements the pattern described at the beginning of the article: acquire a credential object, create an SDK client object, then attempt to perform an operation using that client object.

Authentication and authorization don't happen until the final step because creating the SDK [`SecretClient`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient?view=azure-python) object involves no communication with the resource in question. That is, the SDK client object is essentially a wrapper around the REST API of the service it represents, and exists only in the app's runtime environment. It's only when you call a method like [`get_secret`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient?view=azure-python#get-secret-name--version-none----kwargs-) that the client object generates the appropriate REST API call to Azure. The code for that endpoint is what then authenticates the caller's identity and checks authorization.

When your code runs in the cloud, using `DefaultAzureCredential` tells Azure to use managed identity for authentication, which happens entirely within Azure and involves no sending of credentials to the API endpoint. When you run your code locally, on the other hand, `DefaultAzureCredential` uses the service principal described by the environment variables named `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` (see [Configure your local dev environment - environment variables](configure-local-development-environment.md)). The SDK client object then includes these values (securely) in the HTTP request header when calling the API endpoint.

In both cases, the identity involved must be assigned permissions for the appropriate resource, which is describes in the documentation for the individual services. For details on Key Vault permissions, for example, see [Provide Key Vault authentication with a managed identity](/azure/key-vault/managed-identity).

> [!NOTE]
> In the future, you'll be able to sign into the Azure CLI using `az login` and `DefaultAzureCredential` will user your user credentials if environment variables for a service principal are not available. If you're the owner or administrator of your subscription, the practical upshot of this feature is that your code has inherent access to most resources in that subscription without having to assign any specific permissions. Although this behavior will be convenient for experimentation, we highly recommend that you begin using specific service principals and assigning specific permissions when you start writing production code. In the process you'll learn exactly what permissions you also need to assign to different identities and can accurately validate those permissions in test environments before deploying to production.

### Using DefaultAzureCredential with SDK management libraries

```python
from azure.identity import DefaultAzureCredential

# azure.mgmt.resource is an Azure SDK management library
from azure.mgmt.resource import SubscriptionClient

credential = DefaultAzureCredential()
subscription_client = SubscriptionClient(credential)

# The following line produces a "no attribute 'signed_session'" error:
subscription = next(subscription_client.subscriptions.list())

print(subscription.subscription_id)
```

At present, `DefaultAzureCredential` works only with Azure SDK client ("data plane") libraries, and does not work with Azure SDK management libraries whose names begin with `azure-mgmt`, as show in this code example.

This code attempts to retrieve your subscription ID but produces the rather vague error, "'DefaultAzureCredential' object has no attribute 'signed_session'". This error happens because the current SDK management libraries assume that the credential object contains a `signed_session` property, which `DefaultAzureCredential` lacks.

Until those libraries are updated later in 2020, you can work around the error in two ways:

1. Instead of `DefaultAzureCredential`, use the sample [CredentialWrapper class](https://gist.github.com/lmazuel/cc683d82ea1d7b40208de7c9fc8de59d) that's provided by a member of the Azure SDK engineering team. Once Microsoft releases the updated management libraries, you can simply switch back to `DefaultAzureCredential`. This method has the advantage that you can use the same credential with both SDK client and management libraries, and it works both locally and in the cloud.

1. Use one of the other authentication methods describe in subsequent sections of this article, which can work well for code that uses *only* SDK management libraries and code that won't ever be deployed to the cloud and can thus rely on local service principals only.

## Other authentication methods

Although `DefaultAzureCredential` is the recommended method for authentication that should work for most scenarios, you can use several other methods if needed.

These methods have two caveats:

- Most of the methods work with explicit service principals and don't take advantage of managed identity for code that's deployed to the cloud. When used with production code, then, you must manage and maintain distinct service principals for your cloud applications.

- Some methods, such as CLI-based authentication, work only with local scripts and cannot be used with production code.

### Authenticate with a JSON file

In this method, you create a JSON file that contains the necessary credentials for the service principal, then create the SDK client object using the information in the file. This method can be used both locally and in the cloud.

1. Create a JSON file (with whatever name you want, such as *app_credentials.json*) with the following format:

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
    > As explained in [Configure your local dev environment](configure-local-development-environment.md#create-a-local-service-principal), you can use the [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command with the `--sdk-auth` parameter to generate this JSON format directly.

1. Save this file in a secure location where your code can access it.

    Do not add the file to source control, as access to the tenant ID, client ID, and client secret of a service principal should always remain isolated on your development workstation.

1. Create an environment variable named `AZURE_AUTH_LOCATION` with the path to the JSON file as the value. For example, if the JSON file is named *creds.json*, then you would set the environment variable as follows:

    # [bash](#tab/bash)

    ```bash
    AZURE_AUTH_LOCATION="./creds.json"
    ```

    # [Cmd](#tab/cmd)

    ```cmd
    set AZURE_AUTH_LOCATION=./creds.json
    ```

    ---

1. Use the [get_client_from_auth_file](/python/api/azure-common/azure.common.client_factory?view=azure-python#get-client-from-auth-file-client-class--auth-path-none----kwargs-) method to create the client object:

    ```python
    from azure.common.client_factory import get_client_from_auth_file
    from azure.mgmt.resource import SubscriptionClient

    subscription_client = get_client_from_auth_file(SubscriptionClient)

    subscription = next(subscription_client.subscriptions.list())
    print(subscription.subscription_id)
    ```

1. Instead of using an environment variable, you can directly provide the path to the JSON file by using the `auth_path` argument:

    ```python
    subscription_client = get_client_from_auth_file(SubscriptionClient, auth_path=<path_to_file>)
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

Instead of using a file, as described in the previous section, you can build the necessary JSON data in a variable and call [get_client_from_json_dict](/python/api/azure-common/azure.common.client_factory?view=azure-python#get-client-from-json-dict-client-class--config-dict----kwargs-).

In this case, you should always store the ID and secret values in secure locations such as server-side environment variables or Azure Key Vault.

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

credentials = ServicePrincipalCredentials(tenant=tenant_id, client_id=client_id, secret=client_secret)

subscription_client = SubscriptionClient(credential)

subscription = next(subscription_client.subscriptions.list())
print(subscription.subscription_id)
```

In this method, you create a [`ServicePrincipalCredentials`](/python/api/msrestazure/msrestazure.azure_active_directory.serviceprincipalcredentials?view=azure-python) object using credentials obtained from secure storage (such as server-side environment variables of Azure Key Vault).

If you need more control, use the [Azure Active Directory Authentication Library (ADAL) for Python](https://github.com/AzureAD/azure-activedirectory-library-for-python) and the SDK ADAL wrapper:

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

credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
    RESOURCE, client_id, client_secret)

subscription_client = SubscriptionClient(credential)

subscription = next(subscription_client.subscriptions.list())
print(subscription.subscription_id)
```

> [!TIP]
> When using an Azure sovereign cloud, specify the appropriate base URL (using a constant in `msrestazure.azure_cloud`) when creating the management client:
>
> ```python
> subscription_client = SubscriptionClient(credentials, base_url=AZURE_CHINA_CLOUD.endpoints.resource_manager)
> ```

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

This option should be used for development purposes only because a signed-in user typically has owner or administrator privileges and can access most resources without any additional permissions.

### Deprecated: Authenticate with UserPassCredentials

Before the [Azure Active Directory Authentication Library (ADAL) for Python](https://github.com/AzureAD/azure-activedirectory-library-for-python) was available, you has to use the now-deprecated [`UserPassCredentials`](/python/api/msrestazure/msrestazure.azure_active_directory.userpasscredentials?view=azure-python) class. This class doesn't support two-factor authentication and should no longer be used.

## See also

- [Configure your local Python dev environment for Azure](configure-local-development-environment.md)
- [Example: Use the Azure SDK with Azure Storage](azure-sdk-example-storage.md)
