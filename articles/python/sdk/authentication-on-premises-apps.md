---
title: Azure authentication in Python apps hosted on-premises
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for Python in on-premises hosted applications. 
ms.date: 03/31/2022
ms.topic: how-to
ms.custom: devx-track-python
---

# Azure authentication in Python apps hosted on-premises

Apps hosted outside of Azure (for example on-premises or at a third-party data center) should use an application service principal to authenticate to Azure when accessing Azure resources.  Application service principal objects are created using the app registration process in Azure.  When an application service principal is created, a client ID and client secret will be generated for your app.  The client ID, client secret, and your tenant ID are then stored in environment variables so they can be used by the Azure SDK for Python to authenticate your app to Azure at runtime.

A different app registration should be created for each environment the app is hosted in.  This allows environment specific resource permissions to be configured for each service principal and make sure an app deployed to one environment does not talk to Azure resources that are part of another environment.

## 1 - Register the application in Azure

An app can be registered with Azure using either the Azure portal or the Azure CLI.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app registration step 1](<./includes/on-premises-app-registration-azure-portal-1.md>)] | :::image type="content" source="./media/on-premises-app-registration-azure-portal-1-240px.png" lightbox="./media/on-premises-app-registration-azure-portal-1.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to find and navigate to the App registrations page." ::: |
| [!INCLUDE [Create app registration step 2](<./includes/on-premises-app-registration-azure-portal-2.md>)] | :::image type="content" source="./media/on-premises-app-registration-azure-portal-2-240px.png" lightbox="./media/on-premises-app-registration-azure-portal-2.png" alt-text="A screenshot showing the location of the New registration button in the App registrations page." ::: |
| [!INCLUDE [Create app registration step 3](<./includes/on-premises-app-registration-azure-portal-3.md>)] | :::image type="content" source="./media/on-premises-app-registration-azure-portal-3-240px.png" lightbox="./media/on-premises-app-registration-azure-portal-3.png" alt-text="A screenshot showing how to fill out the Register an application page by giving the app a name and specifying supported account types as accounts in this organizational directory only." ::: |
| [!INCLUDE [Create app registration step 4](<./includes/on-premises-app-registration-azure-portal-4.md>)] | :::image type="content" source="./media/on-premises-app-registration-azure-portal-4-240px.png" lightbox="./media/on-premises-app-registration-azure-portal-4.png" alt-text="A screenshot of the App registration page after the app registration has been completed.  This screenshot shows the location of the application ID and tenant ID which will be needed in a future step.  It also shows the location of the link to use to add an application secret for the app." ::: |
| [!INCLUDE [Create app registration step 5](<./includes/on-premises-app-registration-azure-portal-5.md>)] | :::image type="content" source="./media/on-premises-app-registration-azure-portal-5-240px.png" lightbox="./media/on-premises-app-registration-azure-portal-5.png" alt-text="A screenshot showing the location of the link to use to create a new client secret on the certificates and secrets page." ::: |
| [!INCLUDE [Create app registration step 6](<./includes/on-premises-app-registration-azure-portal-6.md>)] | :::image type="content" source="./media/on-premises-app-registration-azure-portal-6-240px.png" lightbox="./media/on-premises-app-registration-azure-portal-6.png" alt-text="A screenshot showing the page where a new client secret is added for the application service principal create by the app registration process." ::: |
| [!INCLUDE [Create app registration step 7](<./includes/on-premises-app-registration-azure-portal-7.md>)] | :::image type="content" source="./media/on-premises-app-registration-azure-portal-7-240px.png" lightbox="./media/on-premises-app-registration-azure-portal-7.png" alt-text="A screenshot showing the page with the generated client secret." ::: |

### [Azure CLI](#tab/azure-cli)

```azurecli
az ad sp create-for-rbac --name <app-name>
```

The output of the command will be similar to the following.  Make note of these values or keep this window open as you will need these values in the next step and will not be able to view the password (client secret) value again.

```json
{
  "appId": "00000000-1111-2222-3333-444444444444",
  "displayName": "msdocs-python-sdk-auth-prod",
  "password": "abcdefghijklmnopqrstuvwxyz",
  "tenant": "00000000-0000-0000-0000-000000000000"
}
```

---

## 2 - Assign roles to the application service principal

### [Azure portal](#tab/azure-portal)


### [Azure CLI](#tab/azure-cli)


---


## 3 - Configure environment variables for application



## 4 - Implement DefaultAzureCredential in application

To authenticate Azure SDK client objects to Azure, your application should use the `DefaultAzureCredential` class from the `azure.identity` package.

Start by adding the [azure.identity](https://pypi.org/project/azure-identity/) package to your application.

```terminal
pip install azure-identity
```

Next, for any Python code that creates an Azure SDK client object in your app, you will want to:

1. Import the `DefaultAzureCredential` class from the `azure.identity` module.
1. Create a `DefaultAzureCredential` object.
1. Pass the `DefaultAzureCredential` object to the Azure SDK client object constructor.

An example of this is shown in the following code segment.

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

# Acquire a credential object
credential = DefaultAzureCredential()

blob_service_client = BlobServiceClient(
        account_url="https://<my_account_name>.blob.core.windows.net",
        credential=token_credential)
```

When the above code instantiates the `DefaultAzureCredential` object, `DefaultAzureCredential` reads the environment variables `AZURE_SUBSCRIPTION_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET` for the application service principal information to connect to Azure with.
