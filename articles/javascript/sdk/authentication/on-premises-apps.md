---
title: Authenticate on-premises JavaScript apps to Azure resources
description: This article describes how to authenticate your on-premises JavaScript application to Azure services with the Azure SDK for JavaScript. 
ms.date: 08/09/2024
ms.topic: how-to
ms.custom: devx-track-js
---


# Authenticate to Azure resources from on-premises JavaScript apps

Apps running outside of Azure (for example on-premises or at a third-party data center) should use an application service principal to authenticate to Azure when accessing Azure resources.  Application service principal objects are created using the app registration process in Azure.  When an application service principal is created, a client ID and client secret are generated for your app. You store the client ID, client secret, and your tenant ID in environment variables so that the Azure SDK for JavaScript uses the environment variables to authenticate your app to Azure at runtime.

A different app registration should be created for each environment (such as test, stage, production) the app is running in.  This allows environment-specific resource permissions to be configured for each service principal and make sure an app deployed to one environment doesn't talk to Azure resources that are part of another environment.

## 1 - Register the application in Azure

An app can be registered with Azure using either the Azure portal or the Azure CLI.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app registration step 1](<../../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-1-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-1.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to find and navigate to the App registrations page." ::: |
| [!INCLUDE [Create app registration step 2](<../../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-2-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-2.png" alt-text="A screenshot showing the location of the New registration button in the App registrations page." ::: |
| [!INCLUDE [Create app registration step 3](<../../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-3-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-3.png" alt-text="A screenshot to fill out Register by giving the app a name and specifying supported account types as accounts in this organizational directory only." ::: |
| [!INCLUDE [Create app registration step 4](<../../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-4.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-4-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-4.png" alt-text="A screenshot of the App registration after completion.  This screenshot shows the application and tenant IDs, which will be needed in a future step. " ::: |
| [!INCLUDE [Create app registration step 5](<../../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-5.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-5-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-5.png" alt-text="A screenshot showing the location of the link to use to create a new client secret on the certificates and secrets page." ::: |
| [!INCLUDE [Create app registration step 6](<../../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-6.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-6-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-6.png" alt-text="A screenshot showing the page where a new client secret is added for the application service principal created by the app registration process." ::: |
| [!INCLUDE [Create app registration step 7](<../../../includes/sdk-auth-passwordless/on-premises-app-registration-azure-portal-7.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-7-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/on-premises-app-registration-azure-portal-7.png" alt-text="A screenshot showing the page with the generated client secret." ::: |

### [Azure CLI](#tab/azure-cli)

```azurecli
az ad sp create-for-rbac --name <app-name>
```

The output of the command will be similar to the following.  Make note of these values or keep this window open as you'll need these values in the next step and won't be able to view the password (client secret) value again.

```json
{
  "appId": "00001111-aaaa-2222-bbbb-3333cccc4444",
  "displayName": "msdocs-sdk-auth-prod",
  "password": "Aa1Bb~2Cc3.-Dd4Ee5Ff6Gg7Hh8Ii9_Jj0Kk1Ll2",
  "tenant": "aaaabbbb-0000-cccc-1111-dddd2222eeee"
}
```

---

## 2 - Assign roles to the application service principal

Next, you need to determine what roles (permissions) your app needs on what resources and assign those roles to your app. Roles can be assigned a role at a resource, resource group, or subscription scope.  This example will show how to assign roles for the service principal at the resource group scope since most applications group all their Azure resources into a single resource group.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Assign service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-1-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-1.png" alt-text="A screenshot showing the top search box in the Azure portal to locate and navigate to the resource group you want to assign roles (permissions) to." ::: |
| [!INCLUDE [Assign service principal to role step 2](<../../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-2-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-2.png" alt-text="A screenshot of the resource group page showing the location of the Access control (IAM) menu item." ::: |
| [!INCLUDE [Assign service principal to role step 3](<../../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-3-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-3.png" alt-text="A screenshot showing how to navigate to the role assignments tab and the location of the button used to add role assignments to a resource group." ::: |
| [!INCLUDE [Assign service principal to role step 4](<../../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-4.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-4-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-4.png" alt-text="A screenshot showing how to filter and select role assignments to be added to the resource group." ::: |
| [!INCLUDE [Assign service principal to role step 5](<../../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-5.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-5-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-5.png" alt-text="A screenshot showing the radio button to select to assign a role to a Microsoft Entra group and the link used to select the group to assign the role to." ::: |
| [!INCLUDE [Assign service principal to role step 6](<../../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-6.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-6-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-6.png" alt-text="A screenshot showing how to filter for and select the Microsoft Entra group for the application in the Select members dialog box." ::: |
| [!INCLUDE [Assign service principal to role step 7](<../../../includes/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-7.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-7-240px.png" lightbox="../../../includes/media/sdk-auth-passwordless/assign-service-principal-to-role-azure-portal-7.png" alt-text="A screenshot showing the completed Add role assignment page and the location of the Review + assign button used to complete the process." ::: |

### [Azure CLI](#tab/azure-cli)

A service principal is assigned a role in Azure using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.

```azurecli
az role assignment create --assignee "{appId}" \
    --role "{roleName}" \
    --scope /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName} 
```

To get the role names that a service principal can be assigned to, use the [az role definition list](/cli/azure/role/definition#az-role-definition-list) command.

```azurecli
az role definition list \
    --query "sort_by([].{roleName:roleName, description:description}, &roleName)" \
    --output table
```

For example, to allow the service principal with the appId of `00001111-aaaa-2222-bbbb-3333cccc4444` read, write, and delete access to Azure Storage blob containers and data to all storage accounts in the *msdocs-sdk-auth-example* resource group, you would assign the application service principal to the *Storage Blob Data Contributor* role using the following command.

```azurecli
az role assignment create --assignee "00001111-aaaa-2222-bbbb-3333cccc4444" \
    --role "Storage Blob Data Contributor" \
    --scope /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/msdocs-javascript-sdk-auth-example \
```

For information on assigning permissions at the resource or subscription level using the Azure CLI, see the article [Assign Azure roles using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

---

## 3 - Configure environment variables for application

You must set the `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` environment variables for the process that runs your JavaScript app to make the application service principal credentials available to your app at runtime.  The `DefaultAzureCredential` object looks for the service principal information in these environment variables.

```bash
AZURE_CLIENT_ID=<value>
AZURE_TENANT_ID=<value>
AZURE_CLIENT_SECRET=<value>
```

## 4 - Implement DefaultAzureCredential in application

To authenticate Azure SDK client objects to Azure, your application should use the `DefaultAzureCredential` class from the **@azure/identity** package.

First, add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to your application.

```terminal
npm install @azure/identity
```

Next, for any JavaScript code that creates an Azure SDK client object in your app, you'll want to:

1. Import the `DefaultAzureCredential` class from the `@azure/identity` module.
1. Create a `DefaultAzureCredential` object.
1. Pass the `DefaultAzureCredential` object to the Azure SDK client object constructor.

An example of this is shown in the following code segment.

```javascript
// connect-with-default-azure-credential.js
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import 'dotenv/config'

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error('Azure Storage accountName not found');

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new DefaultAzureCredential()
);
```

When the above code instantiates the `DefaultAzureCredential` object, `DefaultAzureCredential` reads the environment variables `AZURE_SUBSCRIPTION_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET` for the application service principal information to connect to Azure with.
