---
title: Authenticate to Azure resources from Python apps hosted on-premises
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for Python in on-premises hosted applications.
ms.date: 02/11/2026
ms.topic: how-to
ms.custom: devx-track-python
---

# Authenticate to Azure resources from Python apps hosted on-premises

Apps hosted outside of Azure (for example, on-premises or at a third-party data center) should use an application service principal to authenticate to Azure when accessing Azure resources. Application service principal objects are created using the app registration process in Azure. When an application service principal is created, a client ID and client secret will be generated for your app. You then store the client ID, client secret, and your tenant ID in environment variables so the Azure SDK for Python can use them to authenticate your app to Azure at runtime.

A different app registration should be created for each environment the app is hosted in. This allows environment-specific resource permissions to be configured for each service principal and ensures that an app deployed to one environment doesn't talk to Azure resources that are part of another environment.

[!INCLUDE [Register the app in Azure](<../../../includes/authentication/create-app-registration.md>)]

[!INCLUDE [Assign roles to the application service principal](<../../../includes/authentication/includes/authentication-assign-service-principal-roles.md>)]

---

## Set the app environment variables

At runtime, certain credentials from the [Azure Identity library](https://pypi.org/project/azure-identity/), such as `DefaultAzureCredential`, `EnvironmentCredential`, and `ClientSecretCredential`, search for service principal information by convention in the environment variables. There are multiple ways to configure environment variables when working with Python, depending on your tooling and environment.

Regardless of the approach you choose, configure the following environment variables for a service principal:

- `AZURE_CLIENT_ID`: Used to identify the registered app in Azure.
- `AZURE_TENANT_ID`: The ID of the Microsoft Entra tenant.
- `AZURE_CLIENT_SECRET`: The secret credential that was generated for the app.

### [VS Code](#tab/vscode)

When running locally in Visual Studio Code, environment variables can be set in the `launch.json` file located in the `.vscode` folder of your project:

```json
{
    "configurations": [
        {
            "env": {
                "AZURE_CLIENT_ID": "<your-client-id>",
                "AZURE_TENANT_ID": "<your-tenant-id>",
                "AZURE_CLIENT_SECRET": "<your-client-secret>"
            }
        }
    ]
}
```

### [Windows](#tab/windows)

From the Windows command line, you can set user-level environment variables using the following commands:

```cmd
setx AZURE_CLIENT_ID "<your-client-id>"
setx AZURE_TENANT_ID "<your-tenant-id>"
setx AZURE_CLIENT_SECRET "<your-client-secret>"
```

System-level environment variables can also be set if you run the command prompt as an administrator and add the `/m` flag:

```cmd
setx AZURE_CLIENT_ID "<your-client-id>" /m
setx AZURE_TENANT_ID "<your-tenant-id>" /m
setx AZURE_CLIENT_SECRET "<your-client-secret>" /m
```

### [PowerShell](#tab/powershell)

Use the following commands to set the environment variables at the user level using PowerShell:

```powershell
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_ID", "<your-client-id>", "User")
[Environment]::SetEnvironmentVariable("AZURE_TENANT_ID", "<your-tenant-id>", "User")
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_SECRET", "<your-client-secret>", "User")
```

System-level environment variables can also be set using PowerShell if you open it with the 'Run as Administrator' option:

```powershell
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_ID", "<your-client-id>", "Machine")
[Environment]::SetEnvironmentVariable("AZURE_TENANT_ID", "<your-tenant-id>", "Machine")
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_SECRET", "<your-client-secret>", "Machine")
```

### [Gunicorn](#tab/gunicorn)

When using [Gunicorn](https://gunicorn.org/) to run Python web apps in a UNIX server environment, environment variables for an app can be specified by using the `EnvironmentFile` directive in the `gunicorn.service` file as shown below:

```ini
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=www-user
Group=www-data
WorkingDirectory=/path/to/python-app
EnvironmentFile=/path/to/python-app/py-env/app-environment-variables
ExecStart=/path/to/python-app/py-env/bin/gunicorn --config config.py wsgi:app

[Install]
WantedBy=multi-user.target
```

The file specified in the `EnvironmentFile` directive should contain a list of environment variables with their values as shown below:

```bash
AZURE_CLIENT_ID=<your-client-id>
AZURE_TENANT_ID=<your-tenant-id>
AZURE_CLIENT_SECRET=<your-client-secret>
```

---

## Authenticate to Azure services from your app

To authenticate Azure SDK client objects to Azure, your application should use the `ClientSecretCredential` class from the `azure-identity` package.

Start by adding the [azure-identity](https://pypi.org/project/azure-identity/) package to your application.

```terminal
pip install azure-identity
```

Next, for any Python code that creates an Azure SDK client object in your app, you should:

1. Import the `ClientSecretCredential` class from the `azure.identity` module.
1. Import the `os` module to read environment variables.
1. Read the environment variables to get the client ID, tenant ID, and client secret.
1. Create a `ClientSecretCredential` object passing the tenant ID, client ID, and client secret.
1. Pass the `ClientSecretCredential` object to the Azure SDK client object constructor.

An example of this approach is shown in the following code segment.

```python
import os
from azure.identity import ClientSecretCredential
from azure.storage.blob import BlobServiceClient

tenant_id = os.environ.get("AZURE_TENANT_ID")
client_id = os.environ.get("AZURE_CLIENT_ID")
client_secret = os.environ.get("AZURE_CLIENT_SECRET")

credential = ClientSecretCredential(tenant_id, client_id, client_secret)

blob_service_client = BlobServiceClient(
    account_url="https://<my_account_name>.blob.core.windows.net",
    credential=credential)
```
