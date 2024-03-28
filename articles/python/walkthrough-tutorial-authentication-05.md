---
title: "Walkthrough, Part 5: Authenticate Python apps with Azure services"
description: A discussion of the main app's dependencies (mainly Azure SDK libraries), the necessary import statements, and the environment variables it expects to have set.
ms.date: 02/20/2024
ms.topic: conceptual
ms.custom: devx-track-python
---

# Part 5: Main app dependencies, import statements, and environment variables

[Previous part: Main app implementation](walkthrough-tutorial-authentication-04.md)

This part examines the Python libraries brought into the main app and the environment variables required by the code. When deployed to Azure, you use application settings in Azure App Service to provide environment variables.

## Dependencies and import statements

The app code requires on the following libraries: Flask, the standard HTTP requests library, and the Azure libraries for Microsoft Entra ID token authentication ([azure.identity](/python/api/overview/azure/identity-readme)), Key Vault ([azure.keyvault.secrets](/python/api/overview/azure/keyvault-secrets-readme)), and Queue Storage ([azure.storage.queue](/python/api/overview/azure/storage-queue-readme)). These libraries are included in the app's *requirements.txt* file:

:::code language="txt" source="~/../python-integrated-authentication/main_app/requirements.txt"

When you deploy the app to Azure App Service, Azure automatically installs these requirements on the host server. When running locally, you install them in your environment with `pip install -r requirements.txt`.

The code file starts with the required import statements for the parts of the libraries used in the code:

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py" range="1-6":::

## Environment variables

The app code depends on four environment variables:

| Variable | Value |
| --- | --- |
| THIRD_PARTY_API_ENDPOINT | The URL of the third-party API, such as `https://msdocs-example-api.azurewebsites.net/api/RandomNumber` described in [Part 3](walkthrough-tutorial-authentication-03.md). |
| KEY_VAULT_URL | The URL of the Azure Key Vault in which you've stored the access key for the third-party API. |
| THIRD_PARTY_API_SECRET_NAME | The name of the secret in Key Vault that contains the access key for the third-party API. |
| STORAGE_QUEUE_URL | The URL of an Azure Storage Queue that's been configured in Azure, such as `https://msdocsexamplemainapp.queue.core.windows.net/code-requests` (see [Part 4](walkthrough-tutorial-authentication-04.md)). Because the queue name is included at the end of the URL, you don't see the name anywhere in the code. |

How you set these variables depends on where the code is running:

* When running the code locally, you create these variables within whatever command shell you're using.
(If you deploy the app to a virtual machine, you would create similar server-side variables.)  You can use a library like [python-dotenv](https://pypi.org/project/python-dotenv/), which reads key-value pairs from a *.env* file and sets them as environment variables

* When the code is deployed to Azure App Service as is shown in this walkthrough, you don't have access to the server itself. In this case, you create [*application settings*](/azure/app-service/configure-common) with the same names, which then appear to the app as environment variables.

The provisioning scripts create these settings using the Azure CLI command, [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set). All four variables are set with a single command.

To create settings through the Azure portal, see [Configure an App Service app in the Azure portal](/azure/app-service/configure-common).

When running the code locally, you also need to specify environment variables that contain information about your local service principal. `DefaultAzureCredential` looks for these values. When deployed to App Service, you do not need to set these values as the app's system-assigned managed identity will be used instead to authenticate.

| Variable | Value |
| --- | --- |
| AZURE_TENANT_ID | The Microsoft Entra tenant (directory) ID. |
| AZURE_CLIENT_ID | The client (application) ID of an App Registration in the tenant. |
| AZURE_CLIENT_SECRET  | A client secret that was generated for the App Registration. |

For more information,  see [Authenticate Python apps to Azure services during local development using service principals](./sdk/authentication-local-development-service-principal.md#4---set-local-development-environment-variables).

> [!div class="nextstepaction"]
> [Part 6 - Main app startup code >>>](walkthrough-tutorial-authentication-06.md)
