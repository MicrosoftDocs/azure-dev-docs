---
title: Authenticate Python apps to Azure services during local development using service principals
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for Python during local development using dedicated application service principals.
ms.date: 02/11/2026
ms.topic: how-to
ms.custom: devx-track-python, devx-track-azurecli
---

# Authenticate Python apps to Azure services during local development using service principals

During local development, applications need to authenticate to Azure to access various Azure services. This article explains how to use an application service principal as one of two common approaches for local authentication.

:::image type="content" source="../../../includes/authentication/media/mermaidjs/local-service-principal-authentication.svg" alt-text="A diagram showing how an app running in local developer obtains the application service principal from an .env file and then uses that identity to connect to Azure resources.":::

### Key learning objectives

- How to register an application with Microsoft Entra to create a service principal
- How to use Microsoft Entra groups to efficiently manage permissions
- How to assign roles to scope permissions
- How to authenticate using a service principal from your app code

### Benefits of service principals

Using dedicated application service principals allows you to adhere to the principle of least privilege when accessing Azure resources. Permissions are limited to the specific requirements of the app during development, preventing accidental access to Azure resources intended for other apps or services.

### Best practices

- Create a separate app registration for each developer working on the app to ensure each developer has their own application service principal
- Create a separate app registration for each app to limit the app's permissions to only what is necessary

[!INCLUDE [Register the app in Azure](<../../../includes/authentication/create-app-registration.md>)]

<a name='2---create-an-azure-ad-security-group-for-local-development'></a>

[!INCLUDE [Create a Microsoft Entra group for local development](<../../../includes/authentication/create-entra-group.md>)]

[!INCLUDE [Assign roles to the group](<../../../includes/authentication/assign-group-roles.md>)]

## Set the app environment variables

The Azure Identity library reads environment variables to authenticate the service principal to Azure at runtime. Configure the following environment variables:

- `AZURE_CLIENT_ID`: The application ID of the registered app in Azure.
- `AZURE_TENANT_ID`: The ID of the Microsoft Entra tenant.
- `AZURE_CLIENT_SECRET`: The client secret credential for the app.

### [.env file](#tab/env-file)

Since most developers work on multiple applications, using a package like [python-dotenv](https://pypi.org/project/python-dotenv/) is recommended to access environment variables from a `.env` file stored in the application's directory during development. This approach scopes the environment variables so that only this application can use them.

The `.env` file is never checked into source control since it contains the application secret key for Azure. The standard [.gitignore](https://github.com/github/gitignore/blob/main/Python.gitignore#L115) file for Python automatically excludes the `.env` file from check-in.

To use the python-dotenv package, first install the package in your application.

```terminal
pip install python-dotenv
```

Then, create a `.env` file in your application root directory. Set the environment variable values with values obtained from the app registration process:

```bash
AZURE_CLIENT_ID=<your-client-id>
AZURE_TENANT_ID=<your-tenant-id>
AZURE_CLIENT_SECRET=<your-client-secret>
```

Finally, in the startup code for your application, use the `python-dotenv` library to read the environment variables from the `.env` file on startup.

```python
from dotenv import load_dotenv

load_dotenv()
```

### [Visual Studio Code](#tab/vscode)

Set variables in `.vscode/launch.json` in your project:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Current File",
            "type": "debugpy",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "env": {
                "AZURE_CLIENT_ID": "<your-client-id>",
                "AZURE_TENANT_ID": "<your-tenant-id>",
                "AZURE_CLIENT_SECRET": "<your-client-secret>"
            }
        }
    ]
}
```

### [Windows Command Line](#tab/windows-cmd)

```bash
setx AZURE_CLIENT_ID "<your-client-id>"
setx AZURE_TENANT_ID "<your-tenant-id>"
setx AZURE_CLIENT_SECRET "<your-client-secret>"
```

After running these commands, restart any open terminals or applications to pick up the new environment variables.

### [PowerShell](#tab/powershell)

```powershell
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_ID", "<your-client-id>", "User")
[Environment]::SetEnvironmentVariable("AZURE_TENANT_ID", "<your-tenant-id>", "User")
[Environment]::SetEnvironmentVariable("AZURE_CLIENT_SECRET", "<your-client-secret>", "User")
```

After running these commands, restart any open terminals or applications to pick up the new environment variables.

### [Linux / macOS](#tab/linux-macos)

```bash
export AZURE_CLIENT_ID="<your-client-id>"
export AZURE_TENANT_ID="<your-tenant-id>"
export AZURE_CLIENT_SECRET="<your-client-secret>"
```

To make these environment variables persistent across terminal sessions, add these lines to your shell profile file (such as `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`).

---

## Authenticate to Azure services from your app

The [azure-identity](https://pypi.org/project/azure-identity/) library provides various *credentials*—classes adapted to supporting different scenarios and Microsoft Entra authentication flows. The steps ahead demonstrate how to use [ClientSecretCredential](/python/api/azure-identity/azure.identity.clientsecretcredential) when working with service principals locally and in production.

### Implement the code

Install the [azure-identity](https://pypi.org/project/azure-identity/) package:

```terminal
pip install azure-identity
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. In your application code, complete the following steps to configure a client class for token-based authentication:

1. Import the `ClientSecretCredential` class from the `azure.identity` module.
1. Import the `os` module to read environment variables.
1. Configure `ClientSecretCredential` with the `tenant_id`, `client_id`, and `client_secret`.
1. Pass the `ClientSecretCredential` instance to the Azure SDK client object constructor.

```python
import os
from azure.identity import ClientSecretCredential
from azure.storage.blob import BlobServiceClient

tenant_id = os.environ.get("AZURE_TENANT_ID")
client_id = os.environ.get("AZURE_CLIENT_ID")
client_secret = os.environ.get("AZURE_CLIENT_SECRET")

credential = ClientSecretCredential(
    tenant_id=tenant_id,
    client_id=client_id,
    client_secret=client_secret
)

blob_service_client = BlobServiceClient(
    account_url="https://<my_account_name>.blob.core.windows.net",
    credential=credential
)
```

An alternative to `ClientSecretCredential` is to use `DefaultAzureCredential`, which automatically detects the `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` environment variables and uses them to authenticate:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

credential = DefaultAzureCredential()

blob_service_client = BlobServiceClient(
    account_url="https://<my_account_name>.blob.core.windows.net",
    credential=credential
)
```
