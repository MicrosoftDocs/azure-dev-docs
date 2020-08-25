---
title: "Walkthrough, Part 5: Authenticate Python apps with Azure services"
description: A discussion of the main app's dependencies (mainly Azure SDK libraries), the necessary import statements, and the environment variables it expects to have set.
ms.date: 08/24/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Part 5: Main app dependencies, import statements, and environment variables

[Previous part: Example main app implementation](walkthrough-tutorial-authentication-04.md)

The app code requires on a number of libraries: Flask, the standard HTTP requests library, and the Azure libraries for Active Directory ([azure.identity](/python/api/overview/azure/identity-readme?view=azure-python)), Key Vault ([azure.keyvault.secrets](/python/api/overview/azure/keyvault-secrets-readme?view=azure-python)), and queue storage ([azure.storage.queue](/python/api/overview/azure/storage-queue-readme?view=azure-python)). These libraries are included in the app's *requirements.txt* file:

```txt
flask
requests
azure.identity
azure.keyvault.secrets
azure.storage.queue
```

When your deploy the app to Azure App Service, Azure automatically installs these requirements on the host server. When running locally, you install them in your environment with `pip install -r requirements.txt`.

At the top of the code, then, are the required import statements for the parts we're using from libraries:

```python
from flask import Flask, request, jsonify
import requests, random, string, os
from datetime import datetime
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.queue import QueueClient
```

## Environment variables

The app code depends on four environment variables:

| Variable | Value |
| --- | --- |
| THIRD_PARTY_API_ENDPOINT | The URL of the third-party API, such as `https://msdocs-api-example.azurewebsites.net/api/RandomNumber` described in [Part 3](walkthrough-tutorial-authentication-03.md). |
| KEY_VAULT_URL | The URL of the Azure Key Vault in which you've stored the access key for the third-party API. |
| THIRD_PARTY_API_SECRET_NAME | The name of the secret in Key Vault that contains the access key for the third-party API. |
| STORAGE_QUEUE_URL | The URL of an Azure Storage Queue that's been configured in Azure, such as `https://msdocsmainappexample.queue.core.windows.net/code-requests` (see [Part 4](walkthrough-tutorial-authentication-04.md)). Because the queue name is in included at the end of the URL, you don't see the name anywhere in the code. |

When running the locally, you create these variables within whatever command shell you're using. If you deploy the app to a virtual machine, you would create similar server-side variables.

When deploying to Azure App Service, however, you don't have access to the server itself. In this case, you create *application settings* with the same names, which then appear to the app as environment variables. 

The provisioning scripts create these settings using the Azure CLI command, [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set). All four variables are set with a single command.

To create settings through the Azure portal, see [Configure an App Service app in the Azure portal](/azure/app-service/configure-common).

> [!div class="nextstepaction"]
> [Part 6 - Main app startup code >>>](walkthrough-tutorial-authentication-06.md)
