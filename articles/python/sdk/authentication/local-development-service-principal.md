---
title: Authenticate Python apps to Azure services during local development using service principals
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for Python during local development using dedicated application service principals.
ms.date: 10/17/2024
ms.topic: how-to
ms.custom: devx-track-python, devx-track-azurecli
---

# Authenticate Python apps to Azure services during local development using service principals

When creating cloud applications, developers need to debug and test applications on their local workstation. When an application is run on a developer's workstation during local development, it still must authenticate to any Azure services used by the app. This article covers how to set up dedicated application service principal objects to be used during local development.

:::image type="content" source="../media/local-dev-service-principal-overview.png" alt-text="A diagram showing how an app running in local developer obtains the application service principal from an .env file and then uses that identity to connect to Azure resources.":::

Dedicated application service principals for local development allow you to follow the principle of least privilege during app development. Since permissions are scoped to exactly what is needed for the app during development, app code is prevented from accidentally accessing an Azure resource intended for use by a different app. This also prevents bugs from occurring when the app is moved to production because the app was overprivileged in the dev environment.

An application service principal is set up for the app when the app is registered in Azure. When registering apps for local development, it's recommended to:

- Create separate app registrations for each developer working on the app. This will create separate application service principals for each developer to use during local development and avoid the need for developers to share credentials for a single application service principal.
- Create separate app registrations per app. This scopes the app's permissions to only what is needed by the app.

During local development, environment variables are set with the application service principal's identity. The Azure SDK for Python reads these environment variables and uses this information to authenticate the app to the Azure resources it needs.

## 1 - Register the application in Azure

Application service principal objects are created with an app registration in Azure. This can be done using either the Azure portal or Azure CLI.

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

First, use the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command to create a new service principal for the app. The command also creates the app registration for the app at the same time.

```azurecli
az ad sp create-for-rbac --name <service-principal-name>
```

The output of this command will look like the following. Make note of these values or keep this window open as you'll need these values in the next steps and won't be able to view the password (client secret) value again. You can, however, add a new password later without invalidating the service principal or existing passwords if needed.

```json
{
  "appId": "00001111-aaaa-2222-bbbb-3333cccc4444",
  "displayName": "<service-principal-name>",
  "password": "Ee5Ff~6Gg7.-Hh8Ii9Jj0Kk1Ll2Mm3_Nn4Oo5Pp6",
  "tenant": "aaaabbbb-0000-cccc-1111-dddd2222eeee"
}
```

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app registration step 1](<../../../includes/sdk-auth-passwordless/local-dev-app-registration-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to find and navigate to the App registrations page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-1.png"::: |
| [!INCLUDE [Create app registration step 2](<../../../includes/sdk-auth-passwordless/local-dev-app-registration-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-2-240px.png" alt-text="A screenshot showing the location of the New registration button in the App registrations page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-2.png"::: |
| [!INCLUDE [Create app registration step 3](<../../../includes/sdk-auth-passwordless/local-dev-app-registration-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-3-240px.png" alt-text="A screenshot showing how to fill out the Register an application page by giving the app a name and specifying supported account types as accounts in this organizational directory only." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-3.png"::: |
| [!INCLUDE [Create app registration step 4](<../../../includes/sdk-auth-passwordless/local-dev-app-registration-azure-portal-4.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-4-240px.png" alt-text="A screenshot after the app registration has been completed with the location of the application ID, tenant ID." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-4.png"::: |
| [!INCLUDE [Create app registration step 5](<../../../includes/sdk-auth-passwordless/local-dev-app-registration-azure-portal-5.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-5-240px.png" alt-text="A screenshot showing the location of the link to use to create a new client secret on the certificates and secrets page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-5.png"::: |
| [!INCLUDE [Create app registration step 6](<../../../includes/sdk-auth-passwordless/local-dev-app-registration-azure-portal-6.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-6-240px.png" alt-text="A screenshot showing the page where a new client secret is added for the application service principal create by the app registration process." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-6.png"::: |
| [!INCLUDE [Create app registration step 7](<../../../includes/sdk-auth-passwordless/local-dev-app-registration-azure-portal-7.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-7-240px.png" alt-text="A screenshot showing the page with the generated client secret." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-registration-azure-portal-7.png"::: |

---

<a name='2---create-an-azure-ad-security-group-for-local-development'></a>

## 2 - Create a Microsoft Entra security group for local development

Since there are typically multiple developers who work on an application, it's recommended to create a Microsoft Entra security group to encapsulate the roles (permissions) the app needs in local development, rather than assigning the roles to individual service principal objects. This offers the following advantages:

- Every developer is assured to have the same roles assigned since roles are assigned at the group level.
- If a new role is needed for the app, it only needs to be added to the Microsoft Entra group for the app.
- If a new developer joins the team, a new application service principal is created for the developer and added to the group, assuring the developer has the right permissions to work on the app.

### [Azure CLI](#tab/azure-cli)

The [az ad group create](/cli/azure/ad/group#az-ad-group-create) command is used to create security groups in Microsoft Entra ID. The `--display-name` and `--main-nickname` parameters are required. The name given to the group should be based on the name of the application. It's also useful to include a phrase like 'local-dev' in the name of the group to indicate the purpose of the group.

```azurecli
az ad group create \
    --display-name MyDisplay \
    --mail-nickname MyDisplay  \
    --description "<group-description>"
```

Copy the value of the `id` property in the output of the command. This is the object ID for the group. You need it in later steps. You can also use the [az ad group show](/cli/azure/ad/group#az-ad-group-show) command to retrieve this property.

To add members to the group, you need the object ID of the application service principal, which is different than the application ID. Use the [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to list the available service principals. The `--filter` parameter command accepts OData style filters and can be used to filter the list as shown. The `--query` parameter limits to columns to only those of interest.

```azurecli
az ad sp list \
    --filter "startswith(displayName, 'msdocs')" \
    --query "[].{objectId:id, displayName:displayName}" \
    --output table
```

The [az ad group member add](/cli/azure/ad/group/member#az-ad-group-member-add) command can then be used to add members to groups.

```azurecli
az ad group member add \
    --group <group-name> \
    --member-id <object-id>
```

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app AD group step 1](<../../../includes/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to search for and navigate to the Microsoft Entra ID page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-1.png"::: |
| [!INCLUDE [Create app AD group step 2](<../../../includes/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-2-240px.png" alt-text="A screenshot showing the location of the Groups menu item in the left-hand menu of the Microsoft Entra ID Default Directory page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-2.png"::: |
| [!INCLUDE [Create app AD group step 3](<../../../includes/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-3-240px.png" alt-text="A screenshot showing the location of the New Group button in the All groups page." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-3.png"::: |
| [!INCLUDE [Create app AD group step 4](<../../../includes/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-4.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-4-240px.png" alt-text="A screenshot showing how to create a new Microsoft Entra group for the application.  " lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-4.png"::: |
| [!INCLUDE [Create app AD group step 5](<../../../includes/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-5.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-5-240px.png" alt-text="A screenshot of the Add members dialog box showing how to select application service principals to be included in the group." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-5.png"::: |
| [!INCLUDE [Create app AD group step 6](<../../../includes/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-6.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-6-240px.png" alt-text="A screenshot of the New Group page showing how to complete the process by selecting the Create button." lightbox="../../../includes/media/sdk-auth-passwordless/local-dev-app-ad-group-azure-portal-6.png"::: |

---

> [!NOTE]
> By default, the creation of Microsoft Entra security groups is limited to certain privileged roles in a directory. If you're unable to create a group, contact an administrator for your directory. If you're unable to add members to an existing group, contact the group owner or a directory administrator. To learn more, see [Manage Microsoft Entra groups and group membership](/entra/fundamentals/how-to-manage-groups).

## 3 - Assign roles to the application

Next, you need to determine what roles (permissions) your app needs on what resources and assign those roles to your app. In this example, the roles are assigned to the Microsoft Entra group created in step 2. Roles can be assigned at a resource, resource group, or subscription scope. This example shows how to assign roles at the resource group scope since most applications group all their Azure resources into a single resource group.

### [Azure CLI](#tab/azure-cli)

A user, group, or application service principal is assigned a role in Azure using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. You can specify a group with its object ID. You can specify an application service principal with its appId.

```azurecli
az role assignment create --assignee <appId or objectId> \
    --scope /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName> \
    --role "<roleName>" 
```

To get the role names that can be assigned, use the [az role definition list](/cli/azure/role/definition#az-role-definition-list) command.

```azurecli
az role definition list \
    --query "sort_by([].{roleName:roleName, description:description}, &roleName)" \
    --output table
```

For example, to allow the application service principal with the appId of `00001111-aaaa-2222-bbbb-3333cccc4444` read, write, and delete access to Azure Storage blob containers and data in all storage accounts in the *msdocs-python-sdk-auth-example* resource group in the subscription with ID `aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e`, you would assign the application service principal to the *Storage Blob Data Contributor* role using the following command.

```azurecli
az role assignment create --assignee 00001111-aaaa-2222-bbbb-3333cccc4444 \
    --scope /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/msdocs-python-sdk-auth-example \
    --role "Storage Blob Data Contributor"
```

For information on assigning permissions at the resource or subscription level using the Azure CLI, see the article [Assign Azure roles using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-1.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search box in the Azure portal to locate and navigate to the resource group you want to assign roles (permissions) to." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-1.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-2.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-2-240px.png" alt-text="A screenshot of the resource group page showing the location of the Access control (IAM) menu item." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-2.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-3.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-3-240px.png" alt-text="A screenshot showing how to navigate to the role assignments tab and the location of the button used to add role assignments to a resource group." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-3.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-4.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-4-240px.png" alt-text="A screenshot showing how to filter and select role assignments to be added to the resource group." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-4.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-5.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-5-240px.png" alt-text="A screenshot showing the radio button to select to assign a role to a Microsoft Entra group and the link used to select the group to assign the role to." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-5.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-6.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-6-240px.png" alt-text="A screenshot showing how to filter for and select the Microsoft Entra group for the application in the Select members dialog box." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-6.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<../../../includes/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-7.md>)] | :::image type="content" source="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-7-240px.png" alt-text="A screenshot showing the completed Add role assignment page and the location of the Review + assign button used to complete the process." lightbox="../../../includes/media/sdk-auth-passwordless/assign-local-dev-group-to-role-azure-portal-7.png"::: |

---

## 4 - Set local development environment variables

The [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential) object will look for the service principal information in a set of environment variables at runtime. Since most developers work on multiple applications, it's recommended to use a package like [python-dotenv](https://pypi.org/project/python-dotenv/) to access environment from a `.env` file stored in the application's directory during development. This scopes the environment variables used to authenticate the application to Azure such that they can only be used by this application.

The `.env` file is never checked into source control since it contains the application secret key for Azure. The standard [.gitignore](https://github.com/github/gitignore/blob/main/Python.gitignore#L115) file for Python automatically excludes the `.env` file from check-in.

To use the python-dotenv package, first install the package in your application.

```terminal
pip install python-dotenv
```

Then, create a `.env` file in your application root directory. Set the environment variable values with values obtained from the app registration process as follows:

- `AZURE_CLIENT_ID` &rarr; The app ID value.
- `AZURE_TENANT_ID` &rarr; The tenant ID value.
- `AZURE_CLIENT_SECRET` &rarr; The password/credential generated for the app.

```bash
AZURE_CLIENT_ID=00001111-aaaa-2222-bbbb-3333cccc4444
AZURE_TENANT_ID=aaaabbbb-0000-cccc-1111-dddd2222eeee
AZURE_CLIENT_SECRET=Ee5Ff~6Gg7.-Hh8Ii9Jj0Kk1Ll2Mm3_Nn4Oo5Pp6
```

Finally, in the startup code for your application, use the `python-dotenv` library to read the environment variables from the `.env` file on startup.

```python
from dotenv import load_dotenv

if ( os.environ['ENVIRONMENT'] == 'development'):
    print("Loading environment variables from .env file")
    load_dotenv(".env")
```

## 5 - Implement DefaultAzureCredential in your application

To authenticate Azure SDK client objects to Azure, your application should use the `DefaultAzureCredential` class from the `azure.identity` package. In this scenario, `DefaultAzureCredential` will detect the environment variables `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`,  and `AZURE_CLIENT_SECRET` are set and read those variables to get the application service principal information to connect to Azure with.

Start by adding the [azure.identity](https://pypi.org/project/azure-identity/) package to your application.

```terminal
pip install azure-identity
```

Next, for any Python code that creates an Azure SDK client object in your app, you'll want to:

1. Import the `DefaultAzureCredential` class from the `azure.identity` module.
1. Create a `DefaultAzureCredential` object.
1. Pass the `DefaultAzureCredential` object to the Azure SDK client object constructor.

An example of this is shown in the following code segment.

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

# Acquire a credential object
token_credential = DefaultAzureCredential()

blob_service_client = BlobServiceClient(
        account_url="https://<my_account_name>.blob.core.windows.net",
        credential=token_credential)
```
