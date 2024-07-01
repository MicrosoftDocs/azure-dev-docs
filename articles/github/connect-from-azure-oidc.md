--- 
title: Authenticate to Azure from GitHub Action workflows by OpenID Connect
description: Connect to GitHub from Azure with OpenID Connect
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use the Azure login action with OpenID Connect

Before you use [Azure Login Action](https://github.com/marketplace/actions/azure-login) with OIDC, you need to configure a federated identity credential on a Microsoft Entra application or a user-assigned managed identity.

To use Azure Login Action with OIDC, you need:

* A [Microsoft Entra application](/azure/active-directory/develop/), with a service principal assigned  withwith an appropriate role to your subscription.
* A Microsoft Entra application configured with a federated credential to trust tokens issued by GitHub Actions to your GitHub repository. 
* A GitHub Actions workflow that requests GitHub issue tokens to the workflow, and uses the Azure login action.

Or 

* A [user-assigned managed identity](/entra/identity/managed-identities-azure-resources) assigned with an appropriate role to your subscription.
* A user-assigned managed identity configured with a federated credential to trust tokens issued by GitHub Actions to your GitHub repository. 
* A GitHub Actions workflow that requests GitHub issue tokens to the workflow, and uses the Azure login action.

<a name='create-an-azure-active-directory-application-and-service-principal'></a>


## Use OIDC with a Microsoft Entra application

To use OIDC with a Microsoft Entra application, you need to:

1. [Create a Microsoft Entra application and service principal](#create-a-microsoft-entra-application-and-service-principal)

1. [Add federated credentials for Microsoft Entra application](#add-federated-credentials-for-a-microsoft-entra-application)

1. [Create GitHub secrets](#create-github-secrets)

1. [Set up Azure Login with OpenID Connect authentication](#set-up-azure-login-with-openid-connect-authentication)

1. [Verify successful Azure Login with OIDC](#verify-successful-azure-login-with-oidc)

### Create a Microsoft Entra application and service principal

Create a Microsoft Entra application and service principal, then assign a role to it on your subscription to give your workflow access.

# [Azure portal](#tab/azure-portal)

1. If you don't have an existing application, register a [new Microsoft Entra application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). As part of this process, make sure to:

    * Register your application with Microsoft Entra ID and create a service principal
    * Assign a role to the application

1. Open **App registrations** in Azure portal and find your application. Copy the values for **Application (client) ID** and **Directory (tenant) ID** to use in your GitHub Actions workflow. 

1. Open **Subscriptions** in Azure portal and find your subscription. Copy the **Subscription ID**.

# [Azure CLI](#tab/azure-cli)

1. Create the Microsoft Entra application.

    ```azurecli-interactive
    az ad app create --display-name myApp
    ```

    This command outputs JSON with an `appId` that is your `client-id`.

1. Create a service principal. Replace the `$appID` with the appId from your JSON output. This command generates JSON output with a different `id` will be used in the next step. The new `id` is the `service-principal-object-id`. 

    ```azurecli-interactive
     az ad sp create --id $appId
    ```

1. Create a new role assignment by subscription and object. By default, the role assignment is tied to your default subscription. Replace `$subscriptionId` with your subscription ID, `$resourceGroupName` with your resource group name, and `$assigneeObjectId` with generated `service-principal-object-id`.

    ```azurecli-interactive
    az role assignment create --role contributor --subscription $subscriptionId --assignee-object-id $assigneeObjectId --assignee-principal-type ServicePrincipal --scope /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName
    ```

1. Copy the values for `clientId`, `subscriptionId`, and `tenantId` to use later in your GitHub Actions workflow.

# [Azure PowerShell](#tab/azure-powershell) 

1. Create the Microsoft Entra application.

    ```azurepowershell-interactive
    New-AzADApplication -DisplayName myApp
    ```

    This command outputs the `AppId` property that is your `client-id`. The `Id` property is `application-object-id` and it's used for creating federated credentials with Graph API calls.

1. Create a service principal. Replace the `$clientId` with the AppId from your output. This command generates output with a different `Id` and will be used in the next step. The new `Id` is the `service-principal-object-id`. 

    ```azurepowershell-interactive
    $clientId = (Get-AzADApplication -DisplayName myApp).AppId
    New-AzADServicePrincipal -ApplicationId $clientId
    ```

1. Create a new role assignment. Beginning with Az PowerShell module version 7.x, `New-AzADServicePrincipal` no longer assigns the `Contributor` role to the service principal by default. Replace `$resourceGroupName` with your resource group name, and `$objectId` with generated `service-principal-object-id`.

    ```azurepowershell-interactive
    $objectId = (Get-AzADServicePrincipal -DisplayName myApp).Id
    New-AzRoleAssignment -ObjectId $objectId -RoleDefinitionName Contributor -ResourceGroupName $resourceGroupName
    ```

1. Get the values for `clientId`, `subscriptionId`, and `tenantId` to use later in your GitHub Actions workflow.

    ```azurepowershell-interactive
    $clientId = (Get-AzADApplication -DisplayName myApp).AppId
    $subscriptionId = (Get-AzContext).Subscription.Id
    $tenantId = (Get-AzContext).Subscription.TenantId
    ```

---
### Add federated credentials for a Microsoft Entra application

You can add federated credentials in the Azure portal or with the Microsoft Graph REST API.

# [Azure portal](#tab/azure-portal)

1. Go to **App registrations** in the <a href="https://portal.azure.com/" target="_blank">Azure portal</a> and open the app you want to configure.
1. Within the app, go to **Certificates and secrets**.  
    :::image type="content" source="media/federated-certificates-secrets.png" alt-text="Select Certificates & secrets.":::
1. In the **Federated credentials** tab, select **Add credential**.
    :::image type="content" source="media/add-federated-credential.png" alt-text="Add the federated credential":::
1. Select the credential scenario **GitHub Actions deploying Azure resources**. Generate your credential by entering your credential details.
    
|Field  |Description  |Example  |
|---------|---------|---------|
|Organization     |    Your GitHub organization name or GitHub username.     |     `contoso`    |
|Repository     |     Your GitHub Repository name.    |    `contoso-app`     |
|Entity type     |     The filter used to scope the OIDC requests from GitHub workflows. This field is used to generate the `subject` claim.   |     `Environment`, `Branch`, `Pull request`, `Tag`    |
|GitHub name     |     The name of the environment, branch, or tag.    |     `main`    |
|Name     |     Identifier for the federated credential.    |    `contoso-deploy`     |

For a more detailed overview, see [Configure an app to trust a GitHub repo](/azure/active-directory/develop/workload-identity-federation-create-trust-github).

# [Azure CLI](#tab/azure-cli)

First, create a `credential.json` file with the following content: 

* Set a value for `CREDENTIAL-NAME` to reference later.
* Set the `subject`, as GitHub defines the value of the `subject` depending on your workflow:
  * Jobs in your GitHub Actions environment: `repo:<Organization/Repository>:environment:<env name>`
  * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:<Organization/Repository>:ref:<ref path>`. For example, `repo:octo-org/octo-repo:ref:refs/heads/my-branch` or `repo:octo-org/octo-repo:ref:refs/tags/my-tag`.
  * For workflows triggered by a pull request event: `repo:<Organization/Repository>:pull_request`.
  
```json  
{  
    "name": "<CREDENTIAL-NAME>",  
    "issuer": "https://token.actions.githubusercontent.com",  
    "subject": "repo:octo-org/octo-repo:environment:Production",  
    "description": "Testing",  
    "audiences": [  
        "api://AzureADTokenExchange"  
    ]  
}  
```

Then, run the following command to [create a new federated identity credential](/azure/active-directory/workload-identities/workload-identity-federation-create-trust?pivots=identity-wif-apps-methods-azcli) for your Microsoft Entra application.

* Replace `$clientId` with the **client-id** for your Microsoft Entra application.

```azurecli
az ad app federated-credential create --id $clientId --parameters credential.json 
```

For a more detailed overview, see [Configure an app to trust an external identity provider](/azure/active-directory/develop/workload-identity-federation-create-trust-github).

# [Azure PowerShell](#tab/azure-powershell) 

Run `New-AzADAppFederatedCredential` cmdlet to create a new federated identity credential for your Microsoft Entra application.

* Replace `$applicationObjectId` with the **application-object-id (generated while creating app)** for your Microsoft Entra application.
* Set a value for `CREDENTIAL-NAME` to reference later.
* Set the `subject`, as GitHub defines the value of the `subject` depending on your workflow:
  * Jobs in your GitHub Actions environment: `repo:<Organization/Repository>:environment:<env name>`
  * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:<Organization/Repository>:ref:<ref path>`. For example, `repo:octo-org/octo-repo:ref:refs/heads/my-branch` or `repo:octo-org/octo-repo:ref:refs/tags/my-tag`.
  * For workflows triggered by a pull request event: `repo:<Organization/Repository>:pull_request`.

```azurepowershell
New-AzADAppFederatedCredential -ApplicationObjectId $applicationObjectId -Audience api://AzureADTokenExchange -Issuer 'https://token.actions.githubusercontent.com/' -Name 'GitHub-Actions-Test' -Subject 'repo:octo-org/octo-repo:environment:Production'
```

For a more detailed overview, see [Configure an app to trust a GitHub repo](/azure/active-directory/workload-identities/workload-identity-federation-create-trust?pivots=identity-wif-apps-methods-powershell).

---
<a name='create-github-secrets'></a>

### Create GitHub secrets

[!INCLUDE [include](~/../articles/reusable-content/github-actions/create-login-action-secrets.md)]

### Set up Azure Login with OpenID Connect authentication

Your GitHub Actions workflow uses OpenID Connect to authenticate with Azure.
To learn more about this interaction, see the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure).

In this example, you use OpenID Connect Azure CLI to authenticate with Azure with the [Azure login](https://github.com/marketplace/actions/azure-login) action. The example uses GitHub secrets for the `client-id`, `tenant-id`, and `subscription-id` values. You can also pass these values directly in the login action.

The Azure login action includes an optional `audience` input parameter that defaults to `api://AzureADTokenExchange`. You can update this parameter for custom audience values.

#### The workflow sample to only run Azure CLI

This workflow authenticates with OpenID Connect and uses Azure CLI to get the details of the connected subscription.

```yaml
name: Run Azure CLI Login with OpenID Connect
on: [push]

permissions:
  id-token: write
  contents: read
      
jobs: 
  build-and-deploy:
    runs-on: ubuntu-latest
    environment: Production
    steps:
    - name: Azure CLI login
      uses: azure/login@v2
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
  
    - name: Azure CLI script
      uses: azure/cli@v2
      with:
        azcliversion: latest
        inlineScript: |
          az account show
```

#### The workflow sample to run both Azure CLI and Azure PowerShell

This workflow authenticates with OpenID Connect and uses Azure PowerShell to get the details of the connected subscription.

```yaml
name: Run Azure PowerShell Login with OpenID Connect
on: [push]

permissions:
  id-token: write
  contents: read
      
jobs: 
  Windows-latest:
    runs-on: windows-latest
    environment: Production
    steps:
      - name: Azure PowerShell Login
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }} 
          enable-AzPSSession: true

      - name: Azure PowerShell script
        uses: azure/powershell@v2
        with:
          azPSVersion: latest
          inlineScript: |
            Get-AzContext     
```

### Verify successful Azure Login with OIDC

Open the `Az CLI login` action and verify that it ran successfully. You should see the message `Azure CLI login succeeds by using OIDC`. If your login is unsuccessful, you see the message `Login failed with Error: xxx`.


## Use OIDC with a user-assigned managed identity

To use OIDC with a user-assigned managed identity, you need to:

1. [Create a user-assigned managed identity](#create-a-user-assigned-managed-identity)

1. [Add federated credentials for a user-assigned managed identity](#add-federated-credentials-for-a-user-assigned-managed-identity)

1. [Create GitHub secrets](#create-github-secrets)

1. [Set up Azure Login with OpenID Connect authentication](#set-up-azure-login-with-openid-connect-authentication)

1. [Verify successful Azure Login with OIDC](#verify-successful-azure-login-with-oidc)


### Create a user-assigned managed identity

If you'd like to use a user-assigned managed identity instead of a Microsoft Entra application. You need to create a user-assigned managed identity and then assign a role on your subscription to your managed identity so that your workflow has access to your subscription.

# [Azure portal](#tab/azure-portal)

1. If you don't have an existing user-assigned managed identity, [create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity). As part of this process, make sure to:

    * Create a user-assigned managed identity
    * Assign a role to the managed identity

1. Open **Managed Identities** in Azure portal and find your user-assigned managed identity. Copy the values for **Client ID** and **Subscription ID** to use in your GitHub Actions workflow. 

1. Find **Properties** on the left panel in Azure portal. Copy the **Tenant ID**.

# [Azure CLI](#tab/azure-cli)

1. Create a user-assigned managed identity.

    ```azurecli-interactive
    az identity create --resource-group <RESOURCE GROUP> --name <USER ASSIGNED IDENTITY NAME>
    ```

    This command outputs JSON with a `clientId`. The `principalId` in the output is `service-principal-object-id` and it's used for role assignment. Copy the values for `clientId`, `subscriptionId`, and `tenantId` to use later in your GitHub Actions workflow.


1. Create a new role assignment by subscription and object. By default, the role assignment is tied to your default subscription. Replace `$subscriptionId` with your subscription ID, `$resourceGroupName` with your resource group name, and `$assigneeObjectId` with generated `service-principal-object-id`.

    ```azurecli-interactive
    az role assignment create --role contributor --subscription $subscriptionId --assignee-object-id $assigneeObjectId --assignee-principal-type ServicePrincipal --scope /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName
    ```


# [Azure PowerShell](#tab/azure-powershell) 

1. Create a user-assigned managed identity.

    ```azurepowershell-interactive
    New-AzUserAssignedIdentity -ResourceGroupName <RESOURCEGROUP> -Name <USER ASSIGNED IDENTITY NAME> -Location <LOCATION>
    ```

    This command outputs JSON with a `clientId`. The `principalId` is `service-principal-object-id` and it's used for role assignment. Copy the values for `clientId`, `subscriptionId`, and `tenantId` to use later in your GitHub Actions workflow.

1. Create a new role assignment. Beginning with Az PowerShell module version 7.x, `New-AzADServicePrincipal` no longer assigns the `Contributor` role to the service principal by default. Replace `$resourceGroupName` with your resource group name, and `$objectId` with generated `service-principal-object-id`.

    ```azurepowershell-interactive
    New-AzRoleAssignment -ObjectId $objectId -RoleDefinitionName Contributor -ResourceGroupName $resourceGroupName
    ```

---
### Add federated credentials for a user-assigned managed identity

You can add federated credentials in the Azure portal or with the Microsoft Graph REST API.

# [Azure portal](#tab/azure-portal)

1. Go to **Managed Identities** in the <a href="https://portal.azure.com/" target="_blank">Azure portal</a> and open the user-assigned managed identity you want to configure.
1. Within the managed identity, go to **Federated credentials**.  
1. In the **Federated credentials** tab, select **Add credential**.
1. Select the credential scenario **GitHub Actions deploying Azure resources**. Generate your credential by entering your credential details.
    
|Field  |Description  |Example  |
|---------|---------|---------|
|Organization     |    Your GitHub organization name or GitHub username.     |     `contoso`    |
|Repository     |     Your GitHub Repository name.    |    `contoso-app`     |
|Entity type     |     The filter used to scope the OIDC requests from GitHub workflows. This field is used to generate the `subject` claim.   |     `Environment`, `Branch`, `Pull request`, `Tag`    |
|GitHub name     |     The name of the environment, branch, or tag.    |     `main`    |
|Name     |     Identifier for the federated credential.    |    `contoso-deploy`     |

For a more detailed overview, see [Configure a user-assigned managed identity to trust an external identity provider](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity?pivots=identity-wif-mi-methods-azp).

# [Azure CLI](#tab/azure-cli)

Run the following command to create a new federated identity credential for your user-assigned managed identity.

* Replace `$identityName` with the name of your user-assigned managed identity.
* Replace `$rg` with the name of your resource group.
* Set a value for `CREDENTIAL-NAME` to reference later.
* Set the `subject`, as GitHub defines the value of the `subject` depending on your workflow:
  * Jobs in your GitHub Actions environment: `repo:<Organization/Repository>:environment:<env name>`
  * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:<Organization/Repository>:ref:<ref path>`. For example, `repo:octo-org/octo-repo:ref:refs/heads/my-branch` or `repo:octo-org/octo-repo:ref:refs/tags/my-tag`.
  * For workflows triggered by a pull request event: `repo:<Organization/Repository>:pull_request`.

```azurecli
az identity federated-credential create --name '<CREDENTIAL-NAME>'--identity-name $identityName --resource-group $rg --issuer 'https://token.actions.githubusercontent.com' --subject 'repo:octo-org/octo-repo:environment:Production' --audiences 'api://AzureADTokenExchange'
```

For a more detailed overview, see [Configure a user-assigned managed identity to trust an external identity provider](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity?pivots=identity-wif-mi-methods-azcli).

# [Azure PowerShell](#tab/azure-powershell) 

Run `New-AzFederatedCredential` cmdlet to create a new federated identity credential for your user-assigned managed identity.

* Replace `$identityName` with the name of your user-assigned managed identity.
* Set a value for `CREDENTIAL-NAME` to reference later.
* Set the `subject`, as GitHub defines the value of the `subject` depending on your workflow:
  * Jobs in your GitHub Actions environment: `repo:<Organization/Repository>:environment:<env name>`
  * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:<Organization/Repository>:ref:<ref path>`. For example, `repo:octo-org/octo-repo:ref:refs/heads/my-branch` or `repo:octo-org/octo-repo:ref:refs/tags/my-tag`.
  * For workflows triggered by a pull request event: `repo:<Organization/Repository>:pull_request`.

```azurepowershell
New-AzFederatedCredential -IdentityName $identityName -Audience api://AzureADTokenExchange -Issuer 'https://token.actions.githubusercontent.com/' -Name '<CREDENTIAL-NAME>' -Subject 'repo:octo-org/octo-repo:environment:Production'
```

For a more detailed overview, see [Configure a user-assigned managed identity to trust an external identity provider](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity?pivots=identity-wif-mi-methods-powershell).

---