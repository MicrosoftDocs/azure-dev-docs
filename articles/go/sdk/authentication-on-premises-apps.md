---
title: Authenticate to Azure resources from Go apps hosted on-premises
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for Go in on-premises hosted applications. 
ms.date: 08/20/2024
ms.topic: how-to
ms.custom: devx-track-go
---

# Authenticate to Azure resources from Python apps hosted on-premises

Apps hosted outside of Azure (for example on-premises or at a third-party data center) should use an application service principal to authenticate to Azure when accessing Azure resources. Application service principal objects are created using the app registration process in Azure. When an application service principal is created, a client ID and client secret will be generated for your app. The client ID, client secret, and your tenant ID are then stored in environment variables so they can be used by the Azure SDK for Python to authenticate your app to Azure at runtime.

A different app registration should be created for each environment the app is hosted in. This allows environment specific resource permissions to be configured for each service principal and ensures that an app deployed to one environment doesn't talk to Azure resources that are part of another environment.

## 1 - Register the application in Azure

An app can be registered with Azure using either the Azure portal or the Azure CLI.

### [Azure CLI](#tab/azure-cli)

```azurecli
az ad sp create-for-rbac --name <app-name>
```

The output of the command will be similar to the following. Make note of these values or keep this window open as you'll need these values in the next steps and won't be able to view the password (client secret) value again.

```json
{
  "appId": "00000000-0000-0000-0000-000000000000",
  "displayName": "msdocs-python-sdk-auth-prod",
  "password": "abcdefghijklmnopqrstuvwxyz",
  "tenant": "33333333-3333-3333-3333-333333333333"
}
```

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app registration step 1](<../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-1.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-1-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-1.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to find and navigate to the App registrations page." ::: |
| [!INCLUDE [Create app registration step 2](<../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-2.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-2-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-2.png" alt-text="A screenshot showing the location of the New registration button in the App registrations page." ::: |
| [!INCLUDE [Create app registration step 3](<../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-3.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-3-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-3.png" alt-text="A screenshot to fill out Register by giving the app a name and specifying supported account types as accounts in this organizational directory only." ::: |
| [!INCLUDE [Create app registration step 4](<../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-4.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-4-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-4.png" alt-text="A screenshot of the App registration after completion.  This screenshot shows the application and tenant IDs, which will be needed in a future step. " ::: |
| [!INCLUDE [Create app registration step 5](<../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-5.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-5-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-5.png" alt-text="A screenshot showing the location of the link to use to create a new client secret on the certificates and secrets page." ::: |
| [!INCLUDE [Create app registration step 6](<../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-6.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-6-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-6.png" alt-text="A screenshot showing the page where a new client secret is added for the application service principal created by the app registration process." ::: |
| [!INCLUDE [Create app registration step 7](<../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-7.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-7-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-7.png" alt-text="A screenshot showing the page with the generated client secret." ::: |

---

## 2 - Assign roles to the application service principal

Next, you need to determine what roles (permissions) your app needs on what resources and assign those roles to your app. Roles can be assigned a role at a resource, resource group, or subscription scope. This example shows how to assign roles for the service principal at the resource group scope since most applications group all their Azure resources into a single resource group.

### [Azure CLI](#tab/azure-cli)

A service principal is assigned a role in Azure using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.

```azurecli
az role assignment create --assignee {appId} \
    --scope /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName} \
    --role "{roleName}" 
```

To get the role names that a service principal can be assigned to, use the [az role definition list](/cli/azure/role/definition#az-role-definition-list) command.

```azurecli
az role definition list \
    --query "sort_by([].{roleName:roleName, description:description}, &roleName)" \
    --output table
```

For example, to allow the service principal with the appId of `00000000-0000-0000-0000-000000000000` read, write, and delete access to Azure Storage blob containers and data in all storage accounts in the *msdocs-python-sdk-auth-example* resource group in the subscription with ID `11111111-1111-1111-1111-111111111111`, you would assign the application service principal to the *Storage Blob Data Contributor* role using the following command.

```azurecli
az role assignment create --assignee 00000000-0000-0000-0000-000000000000 \
    --scope /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/msdocs-python-sdk-auth-example \
    --role "Storage Blob Data Contributor"
```

For information on assigning permissions at the resource or subscription level using the Azure CLI, see the article [Assign Azure roles using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Assign service principal to role step 1](<../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-1.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-1-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-1.png" alt-text="A screenshot showing the top search box in the Azure portal to locate and navigate to the resource group you want to assign roles (permissions) to." ::: |
| [!INCLUDE [Assign service principal to role step 2](<../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-2.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-2-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-2.png" alt-text="A screenshot of the resource group page showing the location of the Access control (IAM) menu item." ::: |
| [!INCLUDE [Assign service principal to role step 3](<../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-3.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-3-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-3.png" alt-text="A screenshot showing how to navigate to the role assignments tab and the location of the button used to add role assignments to a resource group." ::: |
| [!INCLUDE [Assign service principal to role step 4](<../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-4.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-4-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-4.png" alt-text="A screenshot showing how to filter and select role assignments to be added to the resource group." ::: |
| [!INCLUDE [Assign service principal to role step 5](<../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-5.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-5-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-5.png" alt-text="A screenshot showing the radio button to select to assign a role to a Microsoft Entra group and the link used to select the group to assign the role to." ::: |
| [!INCLUDE [Assign service principal to role step 6](<../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-6.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-6-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-6.png" alt-text="A screenshot showing how to filter for and select the Microsoft Entra group for the application in the Select members dialog box." ::: |
| [!INCLUDE [Assign service principal to role step 7](<../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-7.md>)] | :::image type="content" source="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-7-240px.png" lightbox="../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-7.png" alt-text="A screenshot showing the completed Add role assignment page and the location of the Review + assign button used to complete the process." ::: |

---

## 3 - Configure environment variables for application

You must set the `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` environment variables for the process that runs your Go app to make the application service principal credentials available to your app at runtime. The [`DefaultAzureCredential`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) object looks for the service principal information in these environment variables.

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|Application ID of an Azure service principal
|`AZURE_TENANT_ID`|ID of the application's Microsoft Entra tenant
|`AZURE_CLIENT_SECRET`|Password of the Azure service principal

# [Bash](#tab/bash)

```bash
export AZURE_TENANT_ID="<active_directory_tenant_id>"
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_SECRET="<service_principal_password>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_TENANT_ID="<active_directory_tenant_id>"
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_CLIENT_SECRET="<service_principal_password>"
```

---

## 4 - Implement DefaultAzureCredential in application

To authenticate Azure SDK client objects to Azure, your application should use the [`DefaultAzureCredential`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) type from the [`azidentity`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package.

Start by adding the [`azidentity`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package to your application.

```terminal
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

Next, for any Go code that instantiates an Azure SDK client in your app, you'll want to:

1. Import the `azidentity` package.
1. Create an instance of `DefaultAzureCredential` type.
1. Pass the instance of `DefaultAzureCredential` type to the Azure SDK client constructor.

An example of this is shown in the following code segment.

n example of these steps is shown in the following code segment with an Azure Storage Blob client.

```go
import (
	"context"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
)

const (
	account       = "https://<replace_with_your_storage_account_name>.blob.core.windows.net/"
	containerName = "sample-container"
	blobName      = "sample-blob"
	sampleFile    = "path/to/sample/file"
)

func main() {
    // create a credential
    cred, err := azidentity.NewDefaultAzureCredential(nil)
    if err != nil {
      // TODO: handle error
    }
    
    // create a client for the specified storage account
    client, err := azblob.NewClient(account, cred, nil)
    if err != nil {
      // TODO: handle error
    }
    
    // TODO: perform some action with the azblob Client
    // _, err = client.DownloadFile(context.TODO(), <containerName>, <blobName>, <target_file>, <DownloadFileOptions>)
}
```

When the above code instantiates `DefaultAzureCredential`, then `DefaultAzureCredential` reads the environment variables `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET` for the application service principal information to connect to Azure with.
