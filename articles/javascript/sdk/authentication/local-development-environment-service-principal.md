---
title: "Local dev: Auth JS apps to Azure services with service principal"
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for JavaScript during local development using dedicated application service principals.
ms.date: 12/01/2022
ms.topic: how-to
ms.custom: dexx-track-js, devx-track-azurecli, devx-track-js
---

# Authenticate JavaScript apps to Azure services during local development using service principals

When creating cloud applications, developers need to debug and test applications on their local workstation. When an application is run on a developer's workstation during local development, it still must authenticate to any Azure services used by the app.  This article covers how to set up dedicated application service principal objects to be used during local development.

:::image type="content" source="media/local-dev-service-principal-overview.png" alt-text="A diagram showing how a JavaScript app during local development will use the developer's credentials to connect to Azure by obtaining those credentials locally installed development tools.":::

Dedicated application service principals for local development allow you to follow the principle of least privilege during app development. Since permissions are scoped to exactly what is needed for the app during development, app code is prevented from accidentally accessing an Azure resource intended for use by a different app. This also prevents bugs from occurring when the app is moved to production because the app was overprivileged in the dev environment.

An application service principal is set up for the app when the app is registered in Azure.  When registering apps for local development, it's recommended to:

- Create separate app registrations for each developer working on the app. This will create separate application service principals for each developer to use during local development and avoid the need for developers to share credentials for a single application service principal.
- Create separate app registrations per app. This scopes the app's permissions to only what is needed by the app.

During local development, environment variables are set with the application service principal's identity.  The Azure SDK for JavaScript reads these environment variables and uses this information to authenticate the app to the Azure resources it needs.

## 1 - Register the application in Azure

Application service principal objects are created with an app registration in Azure.  This can be done using either the Azure portal or Azure CLI.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app registration step 1](<./includes/local-dev-app-registration-azure-portal-1.md>)] | :::image type="content" source="./media/local-dev-app-registration-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to find and navigate to the App registrations page." lightbox="./media/local-dev-app-registration-azure-portal-1.png"::: |
| [!INCLUDE [Create app registration step 2](<./includes/local-dev-app-registration-azure-portal-2.md>)] | :::image type="content" source="./media/local-dev-app-registration-azure-portal-2-240px.png" alt-text="A screenshot showing the location of the New registration button in the App registrations page." lightbox="./media/local-dev-app-registration-azure-portal-2.png"::: |
| [!INCLUDE [Create app registration step 3](<./includes/local-dev-app-registration-azure-portal-3.md>)] | :::image type="content" source="./media/local-dev-app-registration-azure-portal-3-240px.png" alt-text="A screenshot showing how to fill out the Register an application page by giving the app a name and specifying supported account types as accounts in this organizational directory only." lightbox="./media/local-dev-app-registration-azure-portal-3.png"::: |
| [!INCLUDE [Create app registration step 4](<./includes/local-dev-app-registration-azure-portal-4.md>)] | :::image type="content" source="./media/local-dev-app-registration-azure-portal-4-240px.png" alt-text="A screenshot after the app registration has been completed with the location of the application ID, tenant ID." lightbox="./media/local-dev-app-registration-azure-portal-4.png"::: |
| [!INCLUDE [Create app registration step 5](<./includes/local-dev-app-registration-azure-portal-5.md>)] | :::image type="content" source="./media/local-dev-app-registration-azure-portal-5-240px.png" alt-text="A screenshot showing the location of the link to use to create a new client secret on the certificates and secrets page." lightbox="./media/local-dev-app-registration-azure-portal-5.png"::: |
| [!INCLUDE [Create app registration step 6](<./includes/local-dev-app-registration-azure-portal-6.md>)] | :::image type="content" source="./media/local-dev-app-registration-azure-portal-6-240px.png" alt-text="A screenshot showing the page where a new client secret is added for the application service principal create by the app registration process." lightbox="./media/local-dev-app-registration-azure-portal-6.png"::: |
| [!INCLUDE [Create app registration step 7](<./includes/local-dev-app-registration-azure-portal-7.md>)] | :::image type="content" source="./media/local-dev-app-registration-azure-portal-7-240px.png" alt-text="A screenshot showing the page with the generated client secret." lightbox="./media/local-dev-app-registration-azure-portal-7.png"::: |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

First, use the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command to create a new service principal for the app.  This will also create the app registration for the app at the same time.

```azurecli
az ad sp create-for-rbac --name {service-principal-name}
```

The output of this command will look like the following.  It's recommended to copy this output into a temporary file in a text editor as you'll need these values in a future step as this is the only place you ever see the client secret (password) for the service principal.  You can, however, add a new password later without invalidating the service principal or existing passwords if need be.

```json
{
  "appId": "00000000-0000-0000-0000-000000000000",
  "displayName": "{service-principal-name}",
  "password": "abcdefghijklmnopqrstuvwxyz",
  "tenant": "11111111-1111-1111-1111-111111111111"
}
```

---

## 2 - Create an Azure AD security group for local development

Since there typically multiple developers who work on an application, it's recommended to create an Azure AD group to encapsulate the roles (permissions) the app needs in local development rather than assigning the roles to individual service principal objects.  This offers the following advantages.

- Every developer is assured to have the same roles assigned since roles are assigned at the group level.
- If a new role is needed for the app, it only needs to be added to the Azure AD group for the app.
- If a new developer joins the team, a new application service principal is created for the developer and added to the group, assuring the developer has the right permissions to work on the app.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app AD group step 1](<./includes/local-dev-app-ad-group-azure-portal-1.md>)] | :::image type="content" source="./media/local-dev-app-ad-group-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search bar in the Azure portal to search for and navigate to the Azure Active Directory page." lightbox="./media/local-dev-app-ad-group-azure-portal-1.png"::: |
| [!INCLUDE [Create app AD group step 2](<./includes/local-dev-app-ad-group-azure-portal-2.md>)] | :::image type="content" source="./media/local-dev-app-ad-group-azure-portal-2-240px.png" alt-text="A screenshot showing the location of the Groups menu item in the left-hand menu of the Azure Active Directory Default Directory page." lightbox="./media/local-dev-app-ad-group-azure-portal-2.png"::: |
| [!INCLUDE [Create app AD group step 3](<./includes/local-dev-app-ad-group-azure-portal-3.md>)] | :::image type="content" source="./media/local-dev-app-ad-group-azure-portal-3-240px.png" alt-text="A screenshot showing the location of the New Group button in the All groups page." lightbox="./media/local-dev-app-ad-group-azure-portal-3.png"::: |
| [!INCLUDE [Create app AD group step 4](<./includes/local-dev-app-ad-group-azure-portal-4.md>)] | :::image type="content" source="./media/local-dev-app-ad-group-azure-portal-4-240px.png" alt-text="A screenshot showing how to create a new Azure Active Directory group for the application.  " lightbox="./media/local-dev-app-ad-group-azure-portal-4.png"::: |
| [!INCLUDE [Create app AD group step 5](<./includes/local-dev-app-ad-group-azure-portal-5.md>)] | :::image type="content" source="./media/local-dev-app-ad-group-azure-portal-5-240px.png" alt-text="A screenshot of the Add members dialog box showing how to select application service principals to be included in the group." lightbox="./media/local-dev-app-ad-group-azure-portal-5.png"::: |
| [!INCLUDE [Create app AD group step 6](<./includes/local-dev-app-ad-group-azure-portal-6.md>)] | :::image type="content" source="./media/local-dev-app-ad-group-azure-portal-6-240px.png" alt-text="A screenshot of the New Group page showing how to complete the process by selecting the Create button." lightbox="./media/local-dev-app-ad-group-azure-portal-6.png"::: |

### [Azure CLI](#tab/azure-cli)

The [az ad group create](/cli/azure/ad/group#az-ad-group-create) command is used to create groups in Azure Active Directory.  The `--display-name` and `--main-nickname` parameters are required.  The name given to the group should be based on the name of the application.  It's also useful to include a phrase like 'local-dev' in the name of the group to indicate the purpose of the group.

```azurecli
az ad group create \
    --display-name MyDisplay \
    --mail-nickname MyDisplay  \
    --description \<group-description>
```

To add members to the group, you'll need the object ID of the application service principal, which is different that the application ID.  Use the [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to list the available service principals.  The `--filter` parameter command accepts OData style filters and can be used to filter the list as shown.  The `--query` parameter limits to columns to only those of interest.

```azurecli
az ad sp list \
    --filter "startswith(displayName, 'msdocs')" \
    --query "[].{objectId:objectId, displayName:displayName}" \
    --output table
```

The [az ad group member add](/cli/azure/ad/group/member#az-ad-group-member-add) command can then be used to add members to groups.  

```azurecli
az ad group member add \
    --group \<group-name> \
    --member-id \<object-id>  \
```

---

## 3 - Assign roles to the application

Next, you need to determine what roles (permissions) your app needs on what resources and assign those roles to your app.  In this example, the roles will be assigned to the Azure Active Directory group created in step 2.  Roles can be assigned a role at a resource, resource group, or subscription scope.  This example will show how to assign roles at the resource group scope since most applications group all their Azure resources into a single resource group.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Assign dev service principal to role step 1](<./includes/assign-local-dev-group-to-role-azure-portal-1.md>)] | :::image type="content" source="./media/assign-local-dev-group-to-role-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the top search box in the Azure portal to locate and navigate to the resource group you want to assign roles (permissions) to." lightbox="./media/assign-local-dev-group-to-role-azure-portal-1.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<./includes/assign-local-dev-group-to-role-azure-portal-2.md>)] | :::image type="content" source="./media/assign-local-dev-group-to-role-azure-portal-2-240px.png" alt-text="A screenshot of the resource group page showing the location of the Access control (IAM) menu item." lightbox="./media/assign-local-dev-group-to-role-azure-portal-2.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<./includes/assign-local-dev-group-to-role-azure-portal-3.md>)] | :::image type="content" source="./media/assign-local-dev-group-to-role-azure-portal-3-240px.png" alt-text="A screenshot showing how to navigate to the role assignments tab and the location of the button used to add role assignments to a resource group." lightbox="./media/assign-local-dev-group-to-role-azure-portal-3.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<./includes/assign-local-dev-group-to-role-azure-portal-4.md>)] | :::image type="content" source="./media/assign-local-dev-group-to-role-azure-portal-4-240px.png" alt-text="A screenshot showing how to filter and select role assignments to be added to the resource group." lightbox="./media/assign-local-dev-group-to-role-azure-portal-4.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<./includes/assign-local-dev-group-to-role-azure-portal-5.md>)] | :::image type="content" source="./media/assign-local-dev-group-to-role-azure-portal-5-240px.png" alt-text="A screenshot showing the radio button to select to assign a role to an Azure AD group and the link used to select the group to assign the role to." lightbox="./media/assign-local-dev-group-to-role-azure-portal-5.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<./includes/assign-local-dev-group-to-role-azure-portal-6.md>)] | :::image type="content" source="./media/assign-local-dev-group-to-role-azure-portal-6-240px.png" alt-text="A screenshot showing how to filter for and select the Azure AD group for the application in the Select members dialog box." lightbox="./media/assign-local-dev-group-to-role-azure-portal-6.png"::: |
| [!INCLUDE [Assign dev service principal to role step 1](<./includes/assign-local-dev-group-to-role-azure-portal-7.md>)] | :::image type="content" source="./media/assign-local-dev-group-to-role-azure-portal-7-240px.png" alt-text="A screenshot showing the completed Add role assignment page and the location of the Review + assign button used to complete the process." lightbox="./media/assign-local-dev-group-to-role-azure-portal-7.png"::: |

### [Azure CLI](#tab/azure-cli)

An application service principal is assigned a role in Azure using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.

```azurecli
az role assignment create --assignee "{appId}" \
    --scope /subscriptions/"{subscriptionName}" \
    --role "{roleName}" \
    --resource-group "{resourceGroupName}"
```

To get the role names that a service principal can be assigned to, use the [az role definition list](/cli/azure/role/definition#az-role-definition-list) command.

```azurecli
az role definition list \
    --query "sort_by([].{roleName:roleName, description:description}, &roleName)" \
    --output table
```

For example, to allow the application service principal with the appId of `00000000-0000-0000-0000-000000000000` read, write, and delete access to Azure Storage blob containers and data to all storage accounts in the *msdocs-sdk-auth-example* resource group, you would assign the application service principal to the *Storage Blob Data Contributor* role using the following command.

```azurecli
az role assignment create --assignee "00000000-0000-0000-0000-000000000000" \
    --scope /subscriptions/"Storage Blob Data Subscriber" \
    --role "Storage Blob Data Contributor" \
    --resource-group "msdocs-sdk-auth-example"
```

For information on assigning permissions at the resource or subscription level using the Azure CLI, see the article [Assign Azure roles using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

---

## 4 - Set local development environment variables

The `DefaultAzureCredential` object will look for the service principal information in a set of environment variables at runtime.  Since most developers work on multiple applications, it's recommended to use a package like [dotenv](https://www.npmjs.com/package/dotnet) to access environment from a `.env` file stored in the application's directory during development.  This scopes the environment variables used to authenticate the application to Azure such that they can only be used by this application.

The `.env` file is never checked into source control since it contains the application secret key for Azure.  The standard [.gitignore](https://github.com/github/gitignore/blob/main/Node.gitignore#L76) file for JavaScript automatically excludes the `.env` file from check-in.

To use the `dotnet package`, first install the package in your application.

```bash
npm install dotenv
```

Then, create a `.env` file in your application root directory.  Set the environment variable values with values obtained from the app registration process as follows: 

- `AZURE_CLIENT_ID` &rarr; The app ID value.
- `AZURE_TENANT_ID` &rarr; The tenant ID value.
- `AZURE_CLIENT_SECRET` &rarr; The password/credential generated for the app.

```bash
AZURE_CLIENT_ID=00000000-0000-0000-0000-000000000000
AZURE_TENANT_ID=11111111-1111-1111-1111-111111111111
AZURE_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyz
```

Finally, in the startup code for your application, use the `dotenv` library to read the environment variables from the `.env` file on startup.

```JavaScript
require("dotenv").config();
```

## 5 - Implement DefaultAzureCredential in your application

To authenticate Azure SDK client objects to Azure, your application should use the `DefaultAzureCredential` class from the `@azure/identity` package.  In this scenario, `DefaultAzureCredential` will detect the environment variables `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`,  and `AZURE_CLIENT_SECRET` are set and read those variables to get the application service principal information to connect to Azure with.

Start by adding the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to your application.

```bash
npm install @azure/identity
```

Next, for any JavaScript code that creates an Azure SDK client object in your app, you'll want to:

1. Import the `DefaultAzureCredential` class from the `@azure/identity` module.
1. Create a `DefaultAzureCredential` object.
1. Pass the `DefaultAzureCredential` object to the Azure SDK client object constructor.

An example of this is shown in the following code segment.

```JavaScript
// Azure authentication dependency
const { DefaultAzureCredential } = require('@azure/identity');

// Azure resource management dependency
const { SubscriptionClient } = require("@azure/arm-subscriptions");

// Acquire credential
const tokenCredential = DefaultAzureCredential();

async function listSubscriptions() {
  try {

    // use credential to authenticate with Azure SDKs
    const client = new SubscriptionClient(tokenCredential);

    // get details of each subscription
    for await (const item of client.subscriptions.list()) {
      const subscriptionDetails = await client.subscriptions.get(
        item.subscriptionId
      );
      /* 
        Each item looks like:
      
        {
          id: '/subscriptions/123456',
          subscriptionId: '123456',
          displayName: 'YOUR-SUBSCRIPTION-NAME',
          state: 'Enabled',
          subscriptionPolicies: {
            locationPlacementId: 'Internal_2014-09-01',
            quotaId: 'Internal_2014-09-01',
            spendingLimit: 'Off'
          },
          authorizationSource: 'RoleBased'
        },
    */
      console.log(subscriptionDetails);
    }
  } catch (err) {
    console.error(JSON.stringify(err));
  }
}

listSubscriptions()
  .then(() => {
    console.log("done");
  })
  .catch((ex) => {
    console.log(ex);
  });
```

`DefaultAzureCredential` will automatically detect the authentication mechanism configured for the app and obtain the necessary tokens to authenticate the app to Azure. If an application makes use of more than one SDK client, the same credential object can be used with each SDK client object.
