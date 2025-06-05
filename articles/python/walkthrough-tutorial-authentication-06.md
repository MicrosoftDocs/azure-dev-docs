---
title: "Walkthrough, Part 6: Authenticate Python apps with Azure services"
description: An examination of the main app's startup code, which sets up the DefaultAzureCredential object and client objects needed by the API endpoint.
ms.date: 05/28/2025
ms.topic: article
ms.custom: devx-track-python
---

# Part 6: Main app startup code

[Previous part: Dependencies and environment variables](walkthrough-tutorial-authentication-05.md)

Immediately following the `import` statements, the app's startup code initializes key variables used throughout the request-handling functions.

First, the application creates the Flask app object, which serves as the foundation for defining routes and handling incoming HTTP requests. Next, it retrieves the third-party API endpoint URL from an environment variable. This allows the endpoint to be easily configured without modifying the codebase:

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="8-11":::

Next, it obtains the [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential
) object, which is the recommended credential to use when authenticating with Azure services. See [Authenticate Azure hosted applications with DefaultAzureCredential](./sdk/authentication-azure-hosted-apps.md).

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="14":::

When run locally, `DefaultAzureCredential` looks for the `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET` environment variables that contain information for the service principal that you're using for local development. When run in Azure, `DefaultAzureCredential` defaults to using the system-assigned managed identity enabled on the app. It's possible to override the default behavior with application settings, but in this example scenario, we use the default behavior.

The code next retrieves the third-party API's access key from Azure Key Vault. In the provisioning script, the Key Vault is created using [`az keyvault create`](/cli/azure/keyvault#az-keyvault-create), and the secret is stored with [`az keyvault secret set`](/cli/azure/keyvault/secret#az-keyvault-secret-set).

The Key Vault resource itself is accessed through a URL, which is loaded from the `KEY_VAULT_URL` environment variable.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="18":::

To retrieve a secret from Azure Key Vault, the application must create a client object that communicates with the Key Vault service. Since the goal is to read a secret, the app uses the [`SecretClient`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient) class from the `azure.keyvault.secrets` library. This client requires two inputs:

* The Key Vault URL – typically retrieved from an environment variable
* A credential object – such as the `DefaultAzureCredential` instance created earlier, which represents the identity under which the app is running.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="19":::

Creating a `SecretClient` object does not immediately authenticate the application. The client is simply a local construct that stores the Key Vault URL and the credential object. Authentication and authorization happen only when you invoke an operation through the client, such as [`get_secret`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient#azure-keyvault-secrets-secretclient-get-secret), which generates a REST API call to the Azure resource.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="23-28":::

Even if an application's identity is authorized to access Azure Key Vault, it must also be explicitly authorized to perform specific operations—such as reading secrets. Without this permission, a call to `get_secret()` fails, even if the identity is otherwise valid. To address this, the provisioning script sets a "get secrets" access policy for the app using the Azure CLI command, [`az keyvault set-policy`](/cli/azure/keyvault#az-keyvault-set-policy). For more information, see [Key Vault Authentication](/azure/key-vault/general/authentication) and [Grant your app access to Key Vault](/azure/key-vault/general/managed-identity#grant-your-app-access-to-key-vault). The latter article shows how to set an access policy using the Azure portal. (The article is also written for managed identity, but applies equally to a service principle used in local development.)

Finally, the app code sets up the client object through which it can write messages to an Azure Storage Queue. The Queue's URL is in the environment variable `STORAGE_QUEUE_URL`.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="31-32":::

As with Azure Key Vault, the application uses a specific client object from the Azure SDK to interact with Azure Queue Storage. In this case, it uses the [`QueueClient`](/python/api/azure-storage-queue/azure.storage.queue.queueclient) class from the azure-storage-queue library.

To initialize the client, the app uses the [`from_queue_url`](/python/api/azure-storage-queue/azure.storage.queue.queueclient#azure-storage-queue-queueclient-from-queue-url) method, providing the queue’s fully qualified URL and a credential object. This credential object is again the `DefaultAzureCredential` instance created earlier, which represents the identity under which the app is running.

As noted earlier in this guide, that authorization is granted by assigning the “Storage Queue Data Contributor” role to the application's identity - either a managed identity in Azure or a service principal during local development.
This role assignment is done in the provisioning script using the Azure CLI command [`az role assignment create`](/cli/azure/role/assignment#az-role-assignment-create).

Assuming all this startup code succeeds, the app has all its internal variables in place to support its */api/v1/getcode* API endpoint.

> [!div class="nextstepaction"]
> [Part 7 - Main app endpoint >>>](walkthrough-tutorial-authentication-07.md)
