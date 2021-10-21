--- 
title: Connect GitHub and Azure
description: Resources to connect to GitHub from Azure and other services  
author: N-Usha 
ms.author: ushan 
ms.topic: reference
ms.service: azure 
ms.date: 10/21/2021
ms.custom: github-actions-azure, devx-track-azurecli
---

# Use GitHub Actions to connect to Azure

Learn how to use [Azure login](https://github.com/Azure/login) with either [Azure PowerShell](https://github.com/Azure/PowerShell) or [Azure CLI](https://github.com/Azure/CLI) to interact with your Azure resources. 

To use Azure PowerShell or Azure CLI in a GitHub Actions workflow, you need to first log in with the [Azure login](https://github.com/marketplace/actions/azure-login) action.

There are two versions of the Azure login action. The Open ID Connect (OIDC) version, which is in public beta, allows you to log in with federated identity credentials. The default version uses an [Azure AD service principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object).

By default, the login action logs in with the Azure CLI and sets up the GitHub action runner environment for Azure CLI. You can use Azure PowerShell with `enable-AzPSSession` property of the Azure login action. This sets up the GitHub action runner environment with the Azure PowerShell module.

You can use Azure login to connect to public or sovereign clouds including Azure Government and Azure Stack Hub.

## Use the Azure login action with a federated identity credential

> [!CAUTION]
> The OpenID Connect authentication feature for Azure Login is in public beta.

To set up an Azure Login with OpenID Connect and use it in a GitHub Actions workflow you'll need:

* An app registered with the Microsoft identity platform
* Federated (OpenID Connect credentials) generated in the Azure portal or with the Microsoft Graph REST API
* Secrets for X and Y added to your GitHub repository
* A GitHub Actions workflow with the `azure/login@oidc` action

### Register your application with the Microsoft identity platform

You'll need to register your [application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app).

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="/media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.
1. Enter a display **Name** for your application. Users of your application might see the display name when they use the app, for example during sign-in.
1. Select **Register** to complete the initial app registration.
1. Copy the values for `AZURE_CLIENTID` and`AZURE_TENANTID`. You'll use these later for GitHub secrets.


### Add Azure federated credentials

You can add federated credentials in the Azure portal or with the Microsoft Graph REST API.

# [Azure portal](#tab/azure-portal)
1. Go to **Certificates and secrets**.  In the **Federated credentials** tab, select **Add credential**.  
1. The **Add a credential** blade opens.
1. In the **Federated credential scenario** box select **GitHub actions deploying Azure resources**.
1. Specify the **Organization** and **Repository** for your GitHub Actions workflow.  
1. For **Entity type**, select **Environment**, **Branch**, **Pull request**, or **Tag** and specify the value.
1. Add a **Name** for the federated credential.
1. Click **Add** to configure the federated credential.
      
For a more detailed overview, see X. 
    
# [Microsoft Graph](#tab/microsoft-graph)

1. Launch [Azure Cloud Shell](https://portal.azure.com/#cloudshell/) and sign in to your tenant.
1. reate a federated identity credential
    
    Run the following command to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) on your app (specified by the object ID of the app). Substitute the values `APPLICATION-ID`, `CREDENTIAL-NAME`, `SUBJECT`. The options for subject refer to your request filter. These are the conditions that OpenID Connect uses to determine when to issue an authentication token.  
    * specific environment
    * pull_request events
    * specific branch
    * specific tag

        ```azurecli
        az rest --method POST --uri 'https://graph.microsoft.com/beta/applications/<APPLICATION-ID>/federatedIdentityCredentials' --body '{"name":"<CREDENTIAL-NAME>","issuer":"https://token.actions.githubusercontent.com/","subject":"repo:octo-org/octo-repo:environment:Production","description":"Testing","audiences":["api://AzureADTokenExchange"]}' 
        ```
    For a more detailed overview, see X. 
    ---
### Create GitHub secrets

Create secrets for `AZURE_CLIENTID`, `AZURE_TENANTID`, and `AZURE_SUBSCRIPTIONID`.

Get the *tenant-id* and *client-id* values of your app registration.  You can find these values in the Azure portal. Go to the list of [registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) and select your app registration.  In **Overview**->**Essentials**, find the **Application (client) ID** and **Directory (tenant) ID**. 


### Set up Azure Login with OpenID Connect authentication 

Your GitHub Actions workflow will use OpenID Connect to generate a unique access token from Azure each time the workflow runs. 

will get an access token from Microsoft identity provider to access Azure resources. 
Your GitHub Action uses 
To learn more about this interaction, see the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure).

In this example, ...

```yaml
name:  OpenID Connect Azure Login

on: [push]

permissions:
  id-token: write


jobs:
  build:
    runs-on: ubuntu-latest
      
    steps:

      - name: Installing CLI-beta for OIDC
        run: |
           CWD="$(pwd)"  
           python3 -m venv oidc-venv
           . oidc-venv/bin/activate
           echo "activated environment" 
           python3 -m pip install -q --upgrade pip
           echo "started installing cli beta" 
           pip install -q --extra-index-url https://azcliprod.blob.core.windows.net/beta/simple/ azure-cli 
           echo "***************installed cli beta*******************" 
           echo "$CWD/oidc-venv/bin" >> $GITHUB_PATH
 
        
      - name: 'Az CLI login'
        uses: azure/login@oidc-support
        with:
          client-id: ${{ secrets.AZURE_CLIENTID }}
          tenant-id: ${{ secrets.AZURE_TENANTID }}
          allow-no-subscriptions: true
```

## Use the Azure login action with a service principal

To use [Azure login](https://github.com/marketplace/actions/azure-login) with a service principal, you first need to add your Azure service principal as a secret to your GitHub repository. 

### Create a service principal and add it to GitHub secret

In this example, you will create a secret named `AZURE_CREDENTIALS` that you can use to authenticate with Azure.  

1. If you do not have an existing application, register a [new Active Directory application](/azure/active-directory/develop/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal&preserve-view=true) to use with your service principal.

    ```azurecli-interactive
        appName="myApp"

        az ad app create \
        --display-name $appName \
        --homepage "http://localhost/$appName" \
        --identifier-uris http://localhost/$appName
    ```

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview) in the Azure portal or [Azure CLI](/cli/azure/install-azure-cli) locally.

    > [!NOTE]
    > If you are using Azure Stack Hub, you'll need to set your SQL Management endpoint to `not supported`.
    > `az cloud update -n {environmentName} --endpoint-sql-management https://notsupported`

1. [Create a new service principal](/cli/azure/create-an-azure-service-principal-azure-cli) in the Azure portal for your app. The service principal must be assigned the Contributor role.

    ```azurecli-interactive
        az ad sp create-for-rbac --name "myApp" --role contributor \
                                    --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                                    --sdk-auth
    ```
    
1. Copy the JSON object for your service principal.

    ```json
    {
        "clientId": "<GUID>",
        "clientSecret": "<GUID>",
        "subscriptionId": "<GUID>",
        "tenantId": "<GUID>",
        (...)
    }
    ```

1. Open your GitHub repository and go to **Settings**.

    :::image type="content" source="media/github-repo-settings.png" alt-text="Select Settings in the navigation":::

1. Select **Secrets** and then **New Secret**.

    :::image type="content" source="media/select-secrets.png" alt-text="Choose to add a secret":::

1. Paste in your JSON object for your service principal with the name `AZURE_CREDENTIALS`. 

    :::image type="content" source="media/azure-secret-add.png" alt-text="Add a secret in GitHub":::

1. Save by selecting **Add secret**.

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
      - name: Log in with Azure
        uses: azure/login@v1
        with:
          creds: '${{ secrets.AZURE_CREDENTIALS }}'
```

### Use the Azure PowerShell action

In this example, you log in with the [Azure Login action](https://github.com/Azure/login) and then retrieve a resource group with the [Azure PowerShell action](https://github.com/azure/powershell).

```yaml
on: [push]

name: AzureLoginSample

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Log in with Azure
        uses: azure/login@v1
        with:
          creds: '${{ secrets.AZURE_CREDENTIALS }}'
          enable-AzPSSession: true
      - name: Azure PowerShell Action
        uses: Azure/powershell@v1
        with:
          inlineScript: Get-AzVM -ResourceGroupName "< YOUR RESOURCE GROUP >"
          azPSVersion: 3.1.0
```

### Use the Azure CLI action

In this example, you log in with the [Azure Login action](https://github.com/Azure/login) and then retrieve a resource group with the [Azure CLI action](https://github.com/Azure/CLI).


```yaml
on: [push]

name: AzureLoginSample

jobs:
build-and-deploy:
    runs-on: ubuntu-latest
    steps:

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

### Azure Active Directory 

- [Sign in to GitHub Enterprise with Azure AD (single sign-on)](/azure/active-directory/saas-apps/github-tutorial)   

### Power BI

- [Connect Power BI with GitHub](/power-bi/service-connect-to-github)   

### Connectors

- [GitHub connector for Azure Logic Apps, Power Automate and Power Apps](/connectors/github/)   

### Azure Databricks

- [Use GitHub as version control for notebooks](/azure/databricks/notebooks/github-version-control) 

> [!div class="nextstepaction"]
> [Deploy apps from GitHub to Azure](deploy-to-azure.md)
