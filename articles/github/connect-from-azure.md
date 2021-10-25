--- 
title: Connect GitHub and Azure
description: Resources to connect to GitHub from Azure and other services  
author: N-Usha 
ms.author: ushan 
ms.topic: reference
ms.service: azure 
ms.date: 10/25/2021
ms.custom: github-actions-azure, devx-track-azurecli
---

# Use GitHub Actions to connect to Azure

Learn how to use [Azure login](https://github.com/Azure/login) with either [Azure PowerShell](https://github.com/Azure/PowerShell) or [Azure CLI](https://github.com/Azure/CLI) to interact with your Azure resources.

To use Azure PowerShell or Azure CLI in a GitHub Actions workflow, you need to first log in with the [Azure login](https://github.com/marketplace/actions/azure-login) action.

The Azure login action supports two different ways of authenticating with Azure:
* [Service principal with secrets](#use-the-azure-login-action-with-a-service-principal-secret)
* [(public beta) OpenID Connect (OIDC) with a Azure service principal using a Federated Identity Credential](#use-the-azure-login-action-with-openid-connect)

By default, the login action logs in with the Azure CLI and sets up the GitHub action runner environment for Azure CLI. You can use Azure PowerShell with `enable-AzPSSession` property of the Azure login action. This sets up the GitHub action runner environment with the Azure PowerShell module.

You can use Azure login to connect to public or sovereign clouds including Azure Government and Azure Stack Hub.

## Use the Azure login action with OpenID Connect

> [!NOTE]
> The OpenID Connect authentication feature for Azure Login is in public beta.

To set up an Azure Login with OpenID Connect and use it in a GitHub Actions workflow, you'll need:

* An [Active Directory application](/azure/active-directory/develop/), with a service principal that has contributor access to your subscription
* An Active Directory application configured with a federated credential to trust tokens issued by GitHub Actions to your GitHub repository. You can configure this in the Azure portal or with Microsoft Graph REST APIs
* A GitHub Actions workflow that requests GitHub issue tokens to the workflow, and uses the `azure/login@v1.4.0` action

### Create an active directory application and service principal

You'll need to create an Azure Active Directory application and service principal and then assign a role on your subscription to your application so that your workflow has access to your subscription.

# [Azure portal](#tab/azure-portal)

1. If you do not have an existing application, register a [new Active Directory application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). As part of this process, make sure to:

    * Register your application with Azure AD and create a service principal
    * Assign a role to the application

1. Open **App registrations** in Azure portal and find your application. Copy the values for **Application (client) ID** and **Directory (tenant) ID** to use in your GitHub Actions workflow. 

1. Open **Subscriptions** in Azure portal and find your subscription. Copy the **Subscription ID**.

# [Azure CLI](#tab/azure-cli)

1. Create the Active Directory application.

    ```azurecli-interactive
    az ad app create --display-name myApp
    ```

1. Create a service principal.

    ```azurecli-interactive
    az ad sp create --id
    ```

1. Create a new role assignment by subscription and object. By default, the role assignment will be tied to your default subscription. 

    ```azurecli-interactive
    az role assignment create --role contributor --subscription --assignee-object-id
    ```

1. Copy the values for `clientId`, `subscriptionId`, and `tenantId` to use later in your GitHub Actions workflow.

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

<!-- For a more detailed overview, see [Configure an app to trust a GitHub repo](/azure/active-directory/develop/workload-identity-federation-create-trust-github). -->
# [Azure CLI](#tab/azure-cli)

Run the following command to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) for your active directory application.

* Replace `APPLICATION-ID` with the **Application (client) ID** for your Active Directory application.
* Set a value for `CREDENTIAL-NAME` to reference later.
* Set the `subject`. The value of this is defined by GitHub depending on your workflow:
  * Jobs in your GitHub Actions environment: `repo:< Organization/Repository >:environment:< Name >`
  * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`.  For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
  * For workflows triggered by a pull request event: `repo:< Organization/Repository >:pull-request`.

```azurecli
az rest --method POST --uri 'https://graph.microsoft.com/beta/applications/<APPLICATION-ID>/federatedIdentityCredentials' --body '{"name":"<CREDENTIAL-NAME>","issuer":"https://token.actions.githubusercontent.com/","subject":"repo:organization/repository:environment:Production","description":"Testing","audiences":["api://AzureADTokenExchange"]}' 
```

<!-- For a more detailed overview, see [Configure an app to trust a GitHub repo](/azure/active-directory/develop/workload-identity-federation-create-trust-github) and [Security hardening with OpenID Connect](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect). -->

---
### Create GitHub secrets

You need to provide your application's **Client ID**, **Tenant ID** and **Subscription ID** to the login action. These values can either be provided directly in the workflow or can be stored in GitHub secrets and referenced in your workflow. Saving the values as GitHub secrets is the more secure option.

1. Open your GitHub repository and go to **Settings**.

    :::image type="content" source="media/github-repo-settings.png" alt-text="Select Settings in the navigation":::

1. Select **Secrets** and then **New Secret**.

    :::image type="content" source="media/select-secrets.png" alt-text="Choose to add a secret":::

1. Create secrets for `AZURE_CLIENTID`, `AZURE_TENANTID`, and `AZURE_SUBSCRIPTIONID`. Use these values from your Active Directory application for your GitHub secrets:

    |GitHub Secret  | Active Directory Application  |
    |---------|---------|
    |AZURE_CLIENTID     |      Application (client) ID   |
    |AZURE_TENANTID     |     Directory (tenant) ID    |
    |AZURE_SUBSCRIPTIONID     |     Subscription ID    |

1. Save each secret by selecting **Add secret**.

### Set up Azure Login with OpenID Connect authentication

Your GitHub Actions workflow uses OpenID Connect to authenticate with Azure.
<!-- To learn more about this interaction, see the [GitHub Actions documentation](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure). -->

In this example, you'll install the OpenID Connect Azure CLI beta and authenticate with Azure with the [Azure login](https://github.com/marketplace/actions/azure-login) action. The CLI-beta installation step is a temporary part of the beta release. The example uses GitHub secrets for the `client-id`, `tenant-id`, and `subscription-id` values. You can also pass these values directly in the login action.

# [Linux](#tab/linux)

```yaml
name: Run Azure Login with OpenID Connect
on: [push]

permissions:
      id-token: write
      
jobs: 
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
        
    - name: Installing CLI-beta for OpenID Connect
      run: |
        cd ../..
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
      uses: azure/login@v1.4.0
      with:
        client-id: ${{ secrets.AZURE_CLIENTID }}
        tenant-id: ${{ secrets.AZURE_TENANTID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTIONID }}
```

# [Windows](#tab/windows)

```yaml
name: Run Azure Login with OpenID Connect
on: [push]

permissions:
      id-token: write
      
jobs: 
  Windows-latest:
      runs-on: windows-latest
      steps:

        - name: Install CLI-beta
          run: |
              cd ../..
              $CWD = Convert-Path .
              echo $CWD
              python --version
              python -m venv oidc-venv
              . .\oidc-venv\Scripts\Activate.ps1
              python -m pip install -q --upgrade pip
              echo "started installing cli beta" 
              pip install -q --extra-index-url https://azcliprod.blob.core.windows.net/beta/simple/ azure-cli
              echo "installed cli beta" 
              echo "$CWD\oidc-venv\Scripts" >> $env:GITHUB_PATH

        - name: Installing Az.accounts for powershell
          shell: pwsh
          run: |
               Install-Module -Name Az.Accounts -Force -AllowClobber -Repository PSGallery
  
        - name: OIDC Login to Azure Public Cloud with AzPowershell (enableAzPSSession true)
          uses: azure/login@v1.4.0
          with:
            client-id: ${{ secrets.AZURE_CLIENTID }}
            tenant-id: ${{ secrets.AZURE_TENANTID }}
            subscription-id: ${{ secrets.AZURE_SUBSCRIPTIONID }} 
            enable-AzPSSession: true
```

---

## Use the Azure login action with a service principal secret

To use [Azure login](https://github.com/marketplace/actions/azure-login) with a service principal, you first need to add your Azure service principal as a secret to your GitHub repository.

### Create a service principal and add it as a GitHub secret

In this example, you will create a secret named `AZURE_CREDENTIALS` that you can use to authenticate with Azure.  

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
