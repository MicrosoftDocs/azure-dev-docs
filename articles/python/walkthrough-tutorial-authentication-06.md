---
title: "Walkthrough, Part 6: Authenticate Python apps with Azure services"
description: An examination of the main app's startup code, which sets up the DefaultAzureCredential object and client objects needed by the API endpoint.
ms.date: 02/20/2024
ms.topic: conceptual
ms.custom: devx-track-python
---

# Part 6: Main app startup code

[Previous part: Dependencies and environment variables](walkthrough-tutorial-authentication-05.md)

The app's startup code, which follows the `import` statements, initializes different variables used in the functions that handle HTTP requests.

First, it creates the Flask app object and retrieves the third-party API endpoint URL from the environment variable:

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="8-11":::

Next, it obtains the [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential
) object, which is the recommended credential to use when authenticating with Azure services. See [Authenticate Azure hosted applications with DefaultAzureCredential](./sdk/authentication-azure-hosted-apps.md).

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="14":::

When run locally, `DefaultAzureCredential` looks for the `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET` environment variables that contain information for the service principal that you're using for local development. When run in Azure, `DefaultAzureCredential` defaults to using the system-assigned managed identity enabled on the app. It's possible to override the default behavior with application settings, but in this example scenario, we use the default behavior.

The code next retrieves the third-party API's access key from Azure Key Vault. In the provisioning script, the Key Vault is created using [`az keyvault create`](/cli/azure/keyvault#az-keyvault-create), and the secret is stored with [`az keyvault secret set`](/cli/azure/keyvault/secret#az-keyvault-secret-set).

The Key Vault resource itself is accessed through a URL, which is loaded from the `KEY_VAULT_URL` environment variable.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="18":::

To connect to the key vault, we must create a suitable client object. Because we want to retrieve a secret, we use the [`SecretClient`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient), which requires the key vault URL and the credential object that represents the identity under which the app is running.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="19":::

Creating the `SecretClient` object doesn't authenticate the credential in any way. The `SecretClient` is simply a client-side construct that internally manages the resource URL and the credential. Authentication and authorization happen only when you invoke an operation through the client, such as [`get_secret`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient#azure-keyvault-secrets-secretclient-get-secret), which generates a REST API call to the Azure resource.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="23-28":::

Even if the app identity is authorized to access the key vault, it must still be authorized to access secrets.  Otherwise, the `get_secret` call fails. For this reason, the provisioning script sets a "get secrets" access policy for the app using the Azure CLI command, [`az keyvault set-policy`](/cli/azure/keyvault#az-keyvault-set-policy). For more information, see [Key Vault Authentication](/azure/key-vault/general/authentication) and [Grant your app access to Key Vault](/azure/key-vault/general/managed-identity#grant-your-app-access-to-key-vault). The latter article shows how to set an access policy using the Azure portal. (The article is also written for managed identity, but applies equally to a service principle used in local development.)

Finally, the app code sets up the client object through which it can write messages to an Azure Storage Queue. The Queue's URL is in the environment variable `STORAGE_QUEUE_URL`.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="31-32":::

As with Key Vault, we use a specific client object from the Azure libraries, [`QueueClient`](/python/api/azure-storage-queue/azure.storage.queue.queueclient), and its [`from_queue_url`](/python/api/azure-storage-queue/azure.storage.queue.queueclient#azure-storage-queue-queueclient-from-queue-url) method to connect to the resource located at the URL in question. Once again, attempting to create this client object validates that the app identity represented by the credential is authorized to access the queue. As noted earlier, this authorization was granted by assigning the "Storage Queue Data Contributor" role to the main app.

Assuming all this startup code succeeds, the app has all its internal variables in place to support its */api/v1/getcode* API endpoint.

> [!div class="nextstepaction"]
> [Part 7 - Main app endpoint >>>](walkthrough-tutorial-authentication-07.md)