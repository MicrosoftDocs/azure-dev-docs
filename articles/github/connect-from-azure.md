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

## Use the Azure login action with a federated identity credential (public beta)

To set up an Azure Login with Open ID, you'll create a trust relationship between your application in Azure Active Directory (Azure AD) and your GitHub repo.  You'll then configure a GitHub Actions workflow to exchange a token from GitHub for an access token from Microsoft identity platform.

Your GitHub Actions workflow will get an access token from Microsoft identity provider and access Azure resources (described in the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure)).


1. If you do not have an existing application, register an [application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app).
    1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
    1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
    1. Search for and select **Azure Active Directory**.
    1. Under **Manage**, select **App registrations** > **New registration**.
    1. Enter a display **Name** for your application. Users of your application might see the display name when they use the app, for example during sign-in.
    1. Select **Register** to complete the initial app registration.

1. Add your federated credentials in the Azure portal or with the Microsoft Graph REST API.
    # [Azure portal](#tab/azure-portal)
    1. Go to **Certificates and secrets**.  In the **Federated credentials** tab, select **Add credential**.  
    1. The **Add a credential** blade opens.
    1. In the **Federated credential scenario** box select **GitHub actions deploying Azure resources**.
    1. Specify the **Organization** and **Repository** for your GitHub Actions workflow.  
    1. For **Entity type**, select **Environment**, **Branch**, **Pull request**, or **Tag** and specify the value.
    1. Add a **Name** for the federated credential.
    1. Click **Add** to configure the federated credential.

    # [Microsoft Graph](#tab/microsoft-graph)

    Launch [Azure Cloud Shell](https://portal.azure.com/#cloudshell/) and sign in to your tenant.

    ### Create a federated identity credential
    
    Run the following command to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) on your app (specified by the object ID of the app).  The *issuer* identifies GitHub as the external token issuer.  *subject* identifies the GitHub organization, repo, and environment for your GitHub Actions workflow.  When the GitHub Actions workflow requests Microsoft identity platform to exchange a GitHub token for an access token, the values in the federated identity credential are checked against the provided GitHub token.
    
    ```azurecli
    az rest --method POST --uri 'https://graph.microsoft.com/beta/applications/f6475511-fd81-4965-a00e-41e7792b7b9c/federatedIdentityCredentials' --body '{"name":"Testing","issuer":"https://token.actions.githubusercontent.com/","subject":"repo:octo-org/octo-repo:environment:Production","description":"Testing","audiences":["api://AzureADTokenExchange"]}' 
    ```
    
    And you get the response:
    ```azurecli
    {
      "@odata.context": "https://graph.microsoft.com/beta/$metadata#applications('f6475511-fd81-4965-a00e-41e7792b7b9c')/federatedIdentityCredentials/$entity",
      "audiences": [
        "api://AzureADTokenExchange"
      ],
      "description": "Testing",
      "id": "1aa3e6a7-464c-4cd2-88d3-90db98132755",
      "issuer": "https://token.actions.githubusercontent.com/",
      "name": "Testing",
      "subject": "repo:octo-org/octo-repo:environment:Production"
    }
    ```
    
    *name*: The name of your Azure application.
    
    *issuer*: The path to the GitHub OIDC provider: `https://token.actions.githubusercontent.com/`. This issuer will become trusted by your Azure application.
    
    *subject*: Before Azure will grant an access token, the request must match the conditions defined here.
    - For Jobs tied to an environment: `repo:< Organization/Repository >:environment:< Name >`
    - For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`.  For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
    - For workflows triggered by a pull request event: `repo:< Organization/Repository >:pull-request`.
    
    *audiences*: `api://AzureADTokenExchange` is the required value.
    
    > [!NOTE]
    > If you accidentally configure someone else's GitHub repo in the *subject* setting (enter a typo that matches someone elses repo) you can successfully create the federated identity credential.  But in the GitHub configuration, however, you would get an error because you aren't able to access another person's repo.
    
--- 





## Get the application (client) ID and tenant ID from the Azure portal

Before configuring your GitHub Actions workflow, get the *tenant-id* and *client-id* values of your app registration.  You can find these values in the Azure portal. Go to the list of [registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) and select your app registration.  In **Overview**->**Essentials**, find the **Application (client) ID** and **Directory (tenant) ID**. Set these values in your GitHub environment to use in the Azure login action for your workflow.  



### OLD
In this example, you'll create an OIDC-based federated identity credential. To get started, you'll need to register your application in the Azure portal. You'll then configure your federated identity credential.

1. [Register a new application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app). 

1. In the Azure portal, search for **App registrations**. Open your application and copy the **Application (client) ID** and **Directory (tenant) ID**.

1. Grant your app access to the Azure resources targeted by your GitHub workflow.

1. [Configure your app to trust your GitHub repo (preview)](/en-us/azure/active-directory/develop/workload-identity-federation-create-trust-github). 

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
