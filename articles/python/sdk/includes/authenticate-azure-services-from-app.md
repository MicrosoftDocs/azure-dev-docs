---
ms.topic: include
ms.date: 03/02/2026
---

## Authenticate to Azure services from your app

The [azure-identity](https://pypi.org/project/azure-identity/) library provides various *credentials*—implementations of `TokenCredential` adapted to supporting different scenarios and Microsoft Entra authentication flows. The steps ahead demonstrate how to use [ClientSecretCredential](/python/api/azure-identity/azure.identity.clientsecretcredential) when working with service principals locally and in production.

### Implement the code

Start by adding the package to your application.

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
