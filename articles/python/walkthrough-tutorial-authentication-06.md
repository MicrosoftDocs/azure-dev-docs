---
title: "Walkthrough, Part 6: Authenticate Python apps with Azure services"
description: An examination of the main app's startup code, which sets up the DefaultAzureCredential object and client objects needed by the API endpoint.
ms.date: 08/24/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Part 6: Main app startup code

[Previous part: Dependencies, import statements, and environment variables](walkthrough-tutorial-authentication-05.md)

The app's startup code, which follows the `import` statements, initializes different variables used in the functions that handle HTTP requests.

First, we create the Flask app object and retrieve the third-party API endpoint URL from the environment variable:

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="8-11":::

Next, we obtain the [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential
) object, which is the recommended credential to use when authenticating with Azure services. See [Authenticate Azure hosted applications with DefaultAzureCredential](azure-sdk-authenticate-hosted-applications.md).

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="14":::

When run locally, `DefaultAzureCredential` looks for the `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET` environment variables that contain information for your local service principal. When run in the cloud, `DefaultAzureCredential` automatically uses the service principal registered for the app, which is typically contained within the managed identity.

The code next retrieves the third-party API's access key from Azure Key Vault. In the provisioning script, the Key Vault is created using [`az keyvault create`](/cli/azure/keyvault#az_keyvault_create), and the secret is stored with [`az keyvault secret set`](/cli/azure/keyvault/secret#az_keyvault_secret_set).

The Key Vault resource itself is accessed through a URL, which is loaded from the `KEY_VAULT_URL` environment variable.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="18":::

To connect to the key vault, we must create a suitable client object. Because we want to retrieve a secret, we use the [`SecretClient`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient), which requires the key vault URL and the credential object that represents the identity under which the app is running.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="19":::

Creating the `SecretClient` object doesn't authenticate the credential in any way. The `SecretClient` is simply a client-side construct that internally manages the resource URL and the credential. Authentication and authorization happen only when you invoke an operation through the client, such as [`get_secret`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient#get-secret-name--version-none----kwargs-), which generates a REST API call to the Azure resource.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="23-28":::

Even if the app identity is authorized to access the key vault, it must still be specifically authorized to access secrets.  Otherwise, the `get_secret` call fails. For this reason, the provisioning script sets a "get secrets" access policy for the app using the Azure CLI command, [`az keyvault set-policy`](/cli/azure/keyvault#az_keyvault_set_policy). For more information, see [Key Vault Authentication](/azure/key-vault/general/authentication) as well as [Grant your app access to Key Vault](/azure/key-vault/general/managed-identity#grant-your-app-access-to-key-vault). The latter article shows how to set an access policy using the Azure portal. (The article is also written for managed identity, but applies equally to a local service principle used in development.)

Finally, the app code sets up the client object through which we can write messages to an Azure Storage Queue. The Queue's URL is in the environment variable `STORAGE_QUEUE_URL`.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="31-32":::

As with Key Vault, we use a specific client object from the Azure libraries, [`QueueClient`](/python/api/azure-storage-queue/azure.storage.queue.queueclient), and its [`from_queue_url`](/python/api/azure-storage-queue/azure.storage.queue.queueclient#from-queue-url-queue-url--credential-none----kwargs-) method to connect to the resource located at the URL in question. Once again, attempting to create this client object validates that the app identity represented by the credential is authorized to access the queue. As noted earlier, this authorization was granted by assigning the "Storage Queue Data Contributor" role to the main app.

Assuming all this startup code succeeds, the app has all its internal variables in place to support its */api/v1/getcode* API endpoint.

> [!div class="nextstepaction"]
> [Part 7 - Main app API endpoint >>>](walkthrough-tutorial-authentication-07.md)
