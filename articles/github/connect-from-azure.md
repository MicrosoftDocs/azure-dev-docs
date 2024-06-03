--- 
title: Authenticate to Azure from GitHub Action workflows
description: Resources to connect to GitHub from Azure and other services  
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 10/25/2022
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use GitHub Actions to connect to Azure

Learn how to use [Azure login](https://github.com/Azure/login) with either [Azure PowerShell](https://github.com/Azure/PowerShell) or [Azure CLI](https://github.com/Azure/CLI) to interact with your Azure resources.

To use Azure PowerShell or Azure CLI in a GitHub Actions workflow, you need to first log in with the [Azure login](https://github.com/marketplace/actions/azure-login) action.

The Azure login action supports two different ways of authenticating with Azure:
* [Service principal with secrets](#use-the-azure-login-action-with-a-service-principal-secret)
* [OpenID Connect (OIDC) with an Azure service principal using a Federated Identity Credential](#use-the-azure-login-action-with-openid-connect)
* [System-assigned Managed Identity](#use-the-azure-login-action-with-system-assigned-managed-identity)
* [User-assigned Managed Identity](#use-the-azure-login-action-with-user-assigned-managed-identity)

By default, the login action logs in with the Azure CLI and sets up the GitHub Actions runner environment for Azure CLI. You can use Azure PowerShell with `enable-AzPSSession` property of the Azure login action. This sets up the GitHub Actions runner environment with the Azure PowerShell module.

You can use Azure login to connect to public or sovereign clouds including Azure Government and Azure Stack Hub.

## Use the Azure login action with OpenID Connect

To set up an Azure Login with OpenID Connect and use it in a GitHub Actions workflow, you'll need:

* An [Microsoft Entra application](/azure/active-directory/develop/), with a service principal that has been assigned with an appropriate role to your subscription.
* A Microsoft Entra application configured with a federated credential to trust tokens issued by GitHub Actions to your GitHub repository. You can configure this in the Azure portal or with Microsoft Graph REST APIs.
* A GitHub Actions workflow that requests GitHub issue tokens to the workflow, and uses the Azure login action.

<a name='create-an-azure-active-directory-application-and-service-principal'></a>

### Create a Microsoft Entra application and service principal

You'll need to create a Microsoft Entra application and service principal and then assign a role on your subscription to your application so that your workflow has access to your subscription.

# [Azure portal](#tab/azure-portal)

1. If you do not have an existing application, register a [new Microsoft Entra application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). As part of this process, make sure to:

    * Register your application with Microsoft Entra ID and create a service principal
    * Assign a role to the application

1. Open **App registrations** in Azure portal and find your application. Copy the values for **Application (client) ID** and **Directory (tenant) ID** to use in your GitHub Actions workflow. 

1. Open **Subscriptions** in Azure portal and find your subscription. Copy the **Subscription ID**.

# [Azure CLI](#tab/azure-cli)

1. Create the Microsoft Entra application.

    ```azurecli-interactive
    az ad app create --display-name myApp
    ```

    This command will output JSON with an `appId` that is your `client-id`. The `id` is `application-object-id` and it will be used for creating federated credentials with Graph API calls.

1. Create a service principal. Replace the `$appID` with the appId from your JSON output. This command generates JSON output with a different `id` will be used in the next step. The new `id` is the `service-principal-object-id`. 

    ```azurecli-interactive
     az ad sp create --id $appId
    ```

1. Create a new role assignment by subscription and object. By default, the role assignment will be tied to your default subscription. Replace `$subscriptionId` with your subscription ID, `$resourceGroupName` with your resource group name, and `$assigneeObjectId` with generated `service-principal-object-id`.

    ```azurecli-interactive
    az role assignment create --role contributor --subscription $subscriptionId --assignee-object-id  $assigneeObjectId --assignee-principal-type ServicePrincipal --scope /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName
    ```

1. Copy the values for `clientId`, `subscriptionId`, and `tenantId` to use later in your GitHub Actions workflow.
### [Azure PowerShell](#tab/azure-powershell) 

1. Create the Microsoft Entra application.

    ```azurepowershell-interactive
    New-AzADApplication -DisplayName myApp
    ```

    This command will output the `AppId` property that is your `client-id`. The `Id` property is `application-object-id` and it will be used for creating federated credentials with Graph API calls.

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
### Add federated credentials

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

Run the following command to [create a new federated identity credential](/azure/active-directory/workload-identities/workload-identity-federation-create-trust?pivots=identity-wif-apps-methods-azcli) for your Microsoft Entra application.

* Replace `$applicationObjectId` with the **application-object-id (generated while creating app)** for your Microsoft Entra application.
* Set a value for `CREDENTIAL-NAME` to reference later.
* Set the `subject`. The value of this is defined by GitHub depending on your workflow:
  * Jobs in your GitHub Actions environment: `repo:<Organization/Repository>:environment:<env name>`
  * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:<Organization/Repository>:ref:<ref path>`.  For example, `repo:octo-org/octo-repo:ref:refs/heads/my-branch` or `repo:octo-org/octo-repo:ref:refs/tags/my-tag`.
  * For workflows triggered by a pull request event: `repo:<Organization/Repository>:pull_request`.

```azurecli
az ad app federated-credential create --id $applicationObjectId --parameters credential.json
("credential.json" contains the following content)
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

For a more detailed overview, see [Configure an app to trust an external identity provider](/azure/active-directory/develop/workload-identity-federation-create-trust-github).

### [Azure PowerShell](#tab/azure-powershell) 

Run  New-AzADAppFederatedCredential cmdlet to create a new federated identity credential for your Microsoft Entra application.

* Replace `$applicationObjectId` with the **application-object-id (generated while creating app)** for your Microsoft Entra application.
* Set a value for `CREDENTIAL-NAME` to reference later.
* Set the `subject`. The value of this is defined by GitHub depending on your workflow:
  * Jobs in your GitHub Actions environment: `repo:<Organization/Repository>:environment:<env name>`
  * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:<Organization/Repository>:ref:<ref path>`.  For example, `repo:octo-org/octo-repo:ref:refs/heads/my-branch` or `repo:octo-org/octo-repo:ref:refs/tags/my-tag`.
  * For workflows triggered by a pull request event: `repo:<Organization/Repository>:pull_request`.

```azurepowershell
New-AzADAppFederatedCredential -ApplicationObjectId $applicationObjectId -Audience api://AzureADTokenExchange -Issuer 'https://token.actions.githubusercontent.com/' -Name 'GitHub-Actions-Test' -Subject 'repo:octo-org/octo-repo:environment:Production'
```

For a more detailed overview, see [Configure an app to trust a GitHub repo](/azure/active-directory/workload-identities/workload-identity-federation-create-trust?pivots=identity-wif-apps-methods-powershell).

---

### Create GitHub secrets

[!INCLUDE [include](~/../articles/reusable-content/github-actions/create-login-action-secrets.md)]

### Set up Azure Login with OpenID Connect authentication

Your GitHub Actions workflow uses OpenID Connect to authenticate with Azure.
To learn more about this interaction, see the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure).

In this example, you'll use OpenID Connect Azure CLI to authenticate with Azure with the [Azure login](https://github.com/marketplace/actions/azure-login) action. The example uses GitHub secrets for the `client-id`, `tenant-id`, and `subscription-id` values. You can also pass these values directly in the login action.

The Azure login action includes an optional `audience` input parameter that defaults to `api://AzureADTokenExchange`. You can update this parameter for custom audience values.

# [Linux](#tab/linux)

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

# [Windows](#tab/windows)

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

---

### Verify successful Azure Login with OpenID 

Open the `Azure CLI login` action and verify that it ran successfully. You should see the message `Azure CLI login succeeds by using OIDC`. If your login is unsuccessful, you'll see the message `Login failed with Error: xxx`.

:::image type="content" source="media/github-actions-successful-login.png" alt-text="GitHub Actions Azure Login successful.":::
 
## Use the Azure login action with a service principal secret

To use [Azure login](https://github.com/marketplace/actions/azure-login) with a service principal, you first need to add your Azure service principal as a secret to your GitHub repository.

### Create a service principal

In this example, you will create a secret named `AZURE_CREDENTIALS` that you can use to authenticate with Azure.  

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview) in the Azure portal or [Azure CLI](/cli/azure/install-azure-cli) locally.

    > [!NOTE]
    > If you are using Azure Stack Hub, you'll need to set your SQL Management endpoint to `not supported`.
    > `az cloud update -n {environmentName} --endpoint-sql-management https://notsupported`

1. [Create a new service principal](/cli/azure/create-an-azure-service-principal-azure-cli) in the Azure portal for your app. The service principal must be assigned with an appropriate role.

    ```azurecli-interactive
        az ad sp create-for-rbac --name "myApp" --role contributor \
                                    --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                                    --json-auth
    ```
   The parameter `--json-auth` outputs the result dictionary accepted by the login action, accessible in Azure CLI versions >= 2.51.0. Versions prior to this use `--sdk-auth` with a deprecation warning.
1. Copy the JSON object for your service principal.

    ```json
    {
        "clientId": "<GUID>",
        "clientSecret": "<secret>",
        "subscriptionId": "<GUID>",
        "tenantId": "<GUID>",
        (...)
    }
    ```

### Add the service principal as a GitHub secret

[!INCLUDE [include](~/../articles/reusable-content/github-actions/create-secrets-service-principal.md)]

### Use the Azure login action

Use the service principal secret with the [Azure Login action](https://github.com/Azure/login) to authenticate to Azure.

In this workflow, you authenticate using the Azure login action with the service principal details stored in `secrets.AZURE_CREDENTIALS`. Then, you run an Azure CLI action. For more information about referencing GitHub secrets in a workflow file, see [Using encrypted secrets in a workflow](https://docs.github.com/en/actions/reference/encrypted-secrets#using-encrypted-secrets-in-a-workflow) in GitHub Docs.

Once you have a working Azure login step, you can use the [Azure PowerShell](https://github.com/Azure/PowerShell) or [Azure CLI](https://github.com/Azure/CLI) actions. You can also use other Azure actions, like [Azure webapp deploy](https://github.com/Azure/webapps-deploy) and [Azure functions](https://github.com/Azure/functions-action).

```yaml
on: [push]

name: AzureLoginSample

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Log in with Azure
        uses: azure/login@v1
        with:
          creds: '${{ secrets.AZURE_CREDENTIALS }}'
```

### Use the Azure PowerShell action

In this example, you log in with the [Azure Login action](https://github.com/Azure/login) and then retrieve a resource group with the [Azure PowerShell action](https://github.com/azure/powershell).

```yaml
name: AzureLoginSample

on: [push]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Log in with Azure
        uses: azure/login@v1
        with:
          creds: '${{ secrets.AZURE_CREDENTIALS }}'
          enable-AzPSSession: true

      - name: Azure PowerShell Action
        uses: Azure/powershell@v1
        with:
          inlineScript: Get-AzResourceGroup -Name "< YOUR RESOURCE GROUP >"
          azPSVersion: "latest"
```

### Use the Azure CLI action

In this example, you log in with the [Azure Login action](https://github.com/Azure/login) and then retrieve a resource group with the [Azure CLI action](https://github.com/Azure/CLI).


```yaml
name: AzureLoginSample

on: [push]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Log in with Azure
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Azure CLI script
        uses: azure/CLI@v1
        with:
          azcliversion: 2.0.72
          inlineScript: |
            az account show
            az storage -h
```

### Connect to Azure Government and Azure Stack Hub clouds

To log in to one of the Azure Government clouds, set the optional parameter environment with supported cloud names `AzureUSGovernment` or `AzureChinaCloud`. If this parameter is not specified, it takes the default value `AzureCloud` and connects to the Azure Public Cloud.

```yaml
   - name: Login to Azure US Gov Cloud with CLI
     uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_US_GOV_CREDENTIALS }}
          environment: 'AzureUSGovernment'
          enable-AzPSSession: false
   - name: Login to Azure US Gov Cloud with Az Powershell
      uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_US_GOV_CREDENTIALS }}
          environment: 'AzureUSGovernment'
          enable-AzPSSession: true
```

## Connect with other Azure services

The following articles provide details on connecting to GitHub from Azure and other services.  

<a name='azure-active-directory'></a>

### Microsoft Entra ID 

- [Sign in to GitHub Enterprise with Microsoft Entra ID (single sign-on)](/azure/active-directory/saas-apps/github-tutorial)

### Power BI

- [Connect Power BI with GitHub](/power-bi/service-connect-to-github)

### Connectors

- [GitHub connector for Azure Logic Apps, Power Automate and Power Apps](/connectors/github/)

### Azure Databricks

- [Use GitHub as version control for notebooks](/azure/databricks/notebooks/github-version-control) 

> [!div class="nextstepaction"]
> [Deploy apps from GitHub to Azure](deploy-to-azure.md)
