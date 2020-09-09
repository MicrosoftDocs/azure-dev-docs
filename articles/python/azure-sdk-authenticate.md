---
title: How to authenticate Python applications with Azure services
description: How to acquire the necessary credential objects to authenticate a Python app with Azure services by using the Azure libraries
ms.date: 08/18/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# How to authenticate and authorize Python apps on Azure

Most cloud applications deployed to Azure need to access other Azure resources such as storage, databases, stored secrets, and so on. To access those resources, the application must be both authenticated and authorized:

- **Authentication** verifies the app's identity with Azure Active Directory.

- **Authorization** determines which operations the authenticated app can perform on any given resource. The authorized operations are defined by the **roles** assigned to the app identity for that resource. In a few cases, such as Azure Key Vault, authorization is also determined by additional **access policies** that are assigned to the app identity.

This article explains the details of authentication and authorization:

- How to assign an app identity
- How to grant permissions to an identity
- How and when authentication and authorization occur
- The different means through which an app authenticates with Azure using the Azure libraries. Using `DefaultAzureCredential` is recommended, but not required.

## How to assign an app identity

On Azure, an app identity is defined by a **service principal**. (A service principal is a specific type of "security principal" that's used to identify an app or service, which is to say, a piece of code, as opposed to a human user or group of users.)

The service principal involved depends on where the app is running, as described in the following sections.

### Identity when running the app on Azure

When running in the cloud (for example, in production), an app most commonly uses a **system-assigned managed identity**. With a [managed identity](/azure/active-directory/managed-identities-azure-resources/overview), you use the app's name when assigning roles and permissions for resources. Azure automatically manages the underlying service principal and automatically authenticates the app with those other Azure resources. As a result, you don't need to handle the service principal directly. Furthermore, your app code never needs to handle access tokens, secrets, or connection strings for Azure resources, which reduces the risk that any such information might be leaked or otherwise compromised.

Configuring managed identity depends on the service you use to host your app. Refer to the article, [Services that support managed identity](/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities) for links to instructions for each service. For web apps deployed to Azure App Service, for example, you enable managed identity through the **Identity** > **System assigned** option in the Azure portal, or by using the `az webapp identity assign` command in the Azure CLI.

If you can't use managed identity, you instead manually register the application with Azure Active Directory. Registration assigns a service principal to the app, which you use when assigning roles and permissions. For more information, see [Register an application](/azure/active-directory/develop/quickstart-register-app).

### Identity when running the app locally

During development, you often want to run and debug your app code on a developer workstation while still having that code access Azure resources in the cloud. In this case, you create a separate service principal through Azure Active Directory specifically for local development. You again assign roles and permissions to this service principal for the resources in question. Typically, you authorize this development identity to access only non-production resources.

For details on creating the local service principal and making it available to the Azure libraries, see [Configure your local development environment](configure-local-development-environment.md). Once you've completed this one-time configuration, you can run the same app code locally and in the cloud without any environment-specific modifications.

Each developer should have his or her own service principal that's secured within their user account on their workstation and never stored in a source control repository. If any one service principal is ever stolen or compromised, you can easily delete it to revoke all of its permissions, and then recreate the service principal for that developer. For more information, see [How to manage service principals](how-to-manage-service-principals.md).

> [!NOTE]
> Although it's possible to run an app using your own Azure user credential, doing so doesn't help you establish the specific resource permissions that your app needs when deployed to the cloud. It's much better to set up a service principal for development and assign it the necessary roles and permissions, which you can then replicate using with the deployed app's managed identity or service principal.

## Assign roles and permissions to an identity

Once you know the identities for the app both on Azure and when running locally, you use role-based access control (RBAC) to grant permissions through the Azure portal or the Azure CLI. For full details, see [How to assign role permissions to an app identity or service principal](how-to-assign-role-permissions.md)

## When does authentication and authorization occur?

When writing app code using the Azure libraries (SDK) for Python, you use the following pattern to access Azure resources:

1. Acquire a credential, which describes the app identity, using one of the methods described later in this article.

1. Use the credential to acquire a client object for the resource of interest. (Each type of resource has its own client object in the Azure libraries, to which you provide the resource's URL.)

1. Attempt to access or modify the resource through the client object, which generates an HTTP request to the resource's REST API. The API call is the point at which Azure then both authenticates the app identity and checks authorization.

The following code describes and demonstrates these steps by attempting to access Azure Key Vault.

```python
import os
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

# Acquire the resource URL. In this code we assume the resource URL is in an
# environment variable, KEY_VAULT_URL in this case.

vault_url = os.environ["KEY_VAULT_URL"]


# Acquire a credential object for the app identity. When running in the cloud,
# DefaultAzureCredential uses the app's managed identity or user-assigned service principal.
# When run locally, DefaultAzureCredential relies on environment variables named
# AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, and AZURE_TENANT_ID.

credential = DefaultAzureCredential()


# Acquire an appropriate client object for the resource identified by the URL. The
# client object only stores the given credential at this point but does not attempt
# to authenticate it.
#
# **NOTE**: SecretClient here is only an example; the same process applies to all
# other Azure client libraries.

secret_client = SecretClient(vault_url=vault_url, credential=credential)

# Attempt to perform an operation on the resource using the client object (in
# this case, retrieve a secret from Key Vault). The operation fails for any of
# the following reasons:
#
# 1. The information in the credential object is invalid (for example, the AZURE_CLIENT_ID
#    environment variable cannot be found).
# 2. The app identity cannot be authenticated using the information in the credential object.
# 3. The app identity is not authorized to perform the requested operation on the
#    resource (identified in this case by the vault_url.

retrieved_secret = secret_client.get_secret("secret-name-01")
```

Again, no authentication or authorization takes place until your code makes a specific request to the Azure REST API through a client object. The statement to create the `DefaultAzureCredential` [see the next section) only creates a client-side object in memory, but performs no other checks. 

Creating the SDK [`SecretClient`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient) object also involves no communication with the resource in question. The `SecretClient` object is just a wrapper around the underlying Azure REST API and exists only in the app's runtime memory. 

It's only when the code calls the [`get_secret`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient#get-secret-name--version-none----kwargs-) method that the client object generates the appropriate REST API call to Azure. Azure's endpoint for `get_secret` then authenticates the caller's identity and checks authorization.

## Authenticate with DefaultAzureCredential

For most applications, the [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential) class from the [`azure-identity`](/python/api/azure-identity/azure.identity) library provides the simplest and recommended means of authentication. `DefaultAzureCredential` automatically uses the app's managed identity in the cloud, and automatically loads a local service principal from environment variables when running locally.

```python
import os
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

# Acquire the resource URL
vault_url = os.environ["KEY_VAULT_URL"]

# Aquire a credential object
credential = DefaultAzureCredential()

# Acquire a client object
secret_client = SecretClient(vault_url=vault_url, credential=credential)

# Attempt to perform an operation
retrieved_secret = secret_client.get_secret("secret-name-01")
```

The preceding code uses a `DefaultAzureCredential` object when accessing Azure Key Vault, where the URL of the Key Vault is available in an environment variable named `KEY_VAULT_URL`. The code clearly implements the typical library usage pattern: acquire a credential object, create an appropriate client object for the Azure resource, then attempt to perform an operation on that resource using that client object. Again, authentication and authorization don't happen until this final step.

When code is deployed to and running on Azure, `DefaultAzureCredential` automatically uses the system-assigned managed identity that you can enable for the app within whatever service is hosting it. Permissions for specific resources, such as Azure Storage or Azure Key Vault, are assigned to that identity using the Azure portal or the Azure CLI. In these cases, this Azure-managed identity maximizes security because you don't ever deal with an explicit service principal in your code.

When you run your code locally, `DefaultAzureCredential` automatically uses the service principal described by the environment variables named `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET`. The client object then includes these values (securely) in the HTTP request header when calling the API endpoint. No code changes are necessary when running locally or in the cloud. For details on creating the service principal and setting up the environment variables, see [Configure your local Python dev environment for Azure - Configure authentication](configure-local-development-environment.md#configure-authentication).

In both cases, the identity involved must be assigned permissions for the appropriate resource. The general process is described on [How to assign role permissions](how-to-assign-role-permissions.md); specifics can be found in the documentation for the individual services. For details on Key Vault permissions, for example, as would be needed for the previous code, see [Provide Key Vault authentication with an access control policy](/azure/key-vault/general/group-permissions-for-apps).

<a name="cli-auth-note"></a>
> [!IMPORTANT]
> In the future, `DefaultAzureCredential` will use the identity signed into the Azure CLI through `az login` if service principal environment variables aren't available. If you're the owner or administrator of your subscription, the practical upshot of this feature is that your code has inherent access to most resources in that subscription without having to assign any specific permissions. This behavior is convenient for experimentation. However, we highly recommend that you use specific service principals and assign specific permissions when you start writing production code because you'll learn how to assign exact permissions to different identities and can accurately validate those permissions in test environments before deploying to production.

### Using DefaultAzureCredential with SDK management libraries

```python
# WARNING: this code presently fails with current release libraries!

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

At present, `DefaultAzureCredential` works only with Azure SDK client ("data plane") libraries and preview versions of the Azure SDK management libraries (that is, the latest preview version of libraries whose names begin with `azure-mgmt`), as shown in this code example. That is, with current release libraries, the call to `subscription_client.subscriptions.list()` fails with the rather vague error, "'DefaultAzureCredential' object has no attribute 'signed_session'". This error happens because the current SDK management libraries assume that the credential object contains a `signed_session` property, which `DefaultAzureCredential` lacks.

You can work around the error by using preview management libraries, as described in the blog post, [Introducing new previews for Azure management libraries](https://devblogs.microsoft.com/azure-sdk/introducing-new-previews-for-azure-management-libraries/).

Alternately, you can use the following methods:

1. Use one of the other authentication methods describe in subsequent sections of this article, which can work well for code that uses *only* SDK management libraries and that won't be deployed to the cloud, in which case you can rely on local service principals only.

1. Instead of `DefaultAzureCredential`, use the [CredentialWrapper class (cred_wrapper.py)](https://gist.github.com/lmazuel/cc683d82ea1d7b40208de7c9fc8de59d) that's provided by a member of the Azure SDK engineering team. Once the updated management libraries are out of preview, you can simply switch back to `DefaultAzureCredential`. This method has the advantage that you can use the same credential with both SDK client and management libraries, and it works both locally and in the cloud.

    Assuming that you've downloaded a copy of *cred_wrapper.py* into your project folder, the previous code would appear as follows:

    ```python
    from cred_wrapper import CredentialWrapper
    from azure.mgmt.resource import SubscriptionClient

    credential = CredentialWrapper()
    subscription_client = SubscriptionClient(credential)
    subscription = next(subscription_client.subscriptions.list())
    print(subscription.subscription_id)
    ```

    Again, once the updated management libraries are out of preview, you can use `DefaultAzureCredential` directly.

## Other authentication methods

Although `DefaultAzureCredential` is the recommended authentication method for most scenarios, other methods are available with the following caveats:

- Most of the methods work with explicit service principals and don't take advantage of managed identity for code that's deployed to the cloud. When used with production code, then, you must manage and maintain distinct service principals for your cloud applications.

- Some methods, such as CLI-based authentication, work only with local scripts and cannot be used with production code.

Service principals for applications deployed to the cloud are managed in your subscriptions Active Directory. For more information, see [How to manage service principals](how-to-manage-service-principals.md).

In all cases, the appropriate service principal or user must have appropriate permissions for the resources and operation in question.

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

1. Use the [get_client_from_auth_file](/python/api/azure-common/azure.common.client_factory#get-client-from-auth-file-client-class--auth-path-none----kwargs-) method to create the client object:

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

Instead of using a file, as described in the previous section, you can build the necessary JSON data in a variable and call [get_client_from_json_dict](/python/api/azure-common/azure.common.client_factory#get-client-from-json-dict-client-class--config-dict----kwargs-). This code assumes that you've created the environment variables described in [Configure your local dev environment](configure-local-development-environment.md#create-a-service-principal-and-environment-variables-for-development). For code deployed to the cloud, you can create these environment variables on your server VM or as application settings when using platform service like Azure App Service and Azure Functions.

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

In this method, you create a [`ServicePrincipalCredentials`](/python/api/msrestazure/msrestazure.azure_active_directory.serviceprincipalcredentials) object using credentials obtained from secure storage such as Azure Key Vault or environment variables. The previous code assumes that you've created the environment variables described in [Configure your local dev environment](configure-local-development-environment.md#create-a-service-principal-and-environment-variables-for-development).

With this method, you can use an [Azure sovereign or national cloud](/azure/active-directory/develop/authentication-national-cloud) rather than the Azure public cloud by specifying a `base_url` argument for the client object:

```python
from msrestazure.azure_cloud import AZURE_CHINA_CLOUD

#...

subscription_client = SubscriptionClient(credentials, base_url=AZURE_CHINA_CLOUD.endpoints.resource_manager)
```

Sovereign cloud constants are found in the [msrestazure.azure_cloud library](https://github.com/Azure/msrestazure-for-python/blob/master/msrestazure/azure_cloud.py).

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

If you need the ADAL library, run `pip install adal`.

With this method, you can use an [Azure sovereign or national cloud](/azure/active-directory/develop/authentication-national-cloud) rather than the Azure public cloud.

```python
from msrestazure.azure_cloud import AZURE_CHINA_CLOUD

# ...

LOGIN_ENDPOINT = AZURE_CHINA_CLOUD.endpoints.active_directory
RESOURCE = AZURE_CHINA_CLOUD.endpoints.active_directory_resource_id
```

Simply replace `AZURE_PUBLIC_CLOUD` with the appropriate sovereign cloud constant from the [msrestazure.azure_cloud library](https://github.com/Azure/msrestazure-for-python/blob/master/msrestazure/azure_cloud.py).

### CLI-based authentication (development purposes only)

```python
from azure.common.client_factory import get_client_from_cli_profile
from azure.mgmt.resource import SubscriptionClient

subscription_client = get_client_from_cli_profile(SubscriptionClient)

subscription = next(subscription_client.subscriptions.list())
print(subscription.subscription_id)
```

In this method, you create a client object using the credentials of the user signed in with the Azure CLI command `az login`. The application will be authorized for any and all operations as the user.

The SDK uses the default subscription ID, or you can set the subscription prior to running the code using [`az account`](https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli). If you need to refer to different subscriptions in the same script, then use the ['get_client_from_auth_file'](#authenticate-with-a-json-file) or  [`get_client_from_json_dict`](#authenticate-with-a-json-dictionary) methods described earlier in this article.

The `get_client_from_cli_profile` function should be used only for early experimentation and development purposes because a signed-in user typically has owner or administrator privileges and can access most resources without any additional permissions. For more information, see the previous note about [using CLI credentials with `DefaultAzureCredential`](#cli-auth-note).

### Deprecated: Authenticate with UserPassCredentials

Before the [Azure Active Directory Authentication Library (ADAL) for Python](https://github.com/AzureAD/azure-activedirectory-library-for-python) was available, you has to use the now-deprecated [`UserPassCredentials`](/python/api/msrestazure/msrestazure.azure_active_directory.userpasscredentials) class. This class doesn't support two-factor authentication and should no longer be used.

## See also

- [Configure your local Python dev environment for Azure](configure-local-development-environment.md)
- [How to assign role permissions](how-to-assign-role-permissions.md)
- [Example: Provision a resource group](azure-sdk-example-resource-group.md)
- [Example: Provision and use Azure Storage](azure-sdk-example-storage.md)
- [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md)
- [Example: Provision and use a MySQL database](azure-sdk-example-database.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
