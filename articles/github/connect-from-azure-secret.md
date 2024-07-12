--- 
title: Authenticate to Azure from GitHub Action by Client Secret
description: Securely authenticate to Azure services from GitHub Actions workflows using Azure Login Action with a client secret.
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use the Azure login action with a client secret

This article teaches you how to create a service principal with a client secret and securely authenticate to Azure services from GitHub Actions workflows using [Azure Login Action](https://github.com/marketplace/actions/azure-login). 

In this tutorial, you:

> [!div class="checklist"]
> * Create a GitHub secret for the service principal
> * Set up Azure Login for service principal secret in GitHub Action workflows

> [!WARNING]
> To use this method, carefully manage your secret to prevent any leaks.

## Prerequisites 

- Create a Microsoft Entra application with a service principal assigned an appropriate role by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-1), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#create-a-service-principal).
- Create a client secret for your service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-2?branch=main#create-a-service-principal-containing-a-password), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps?#password-based-authentication).

## Create a GitHub secret for the service principal

1. Open your GitHub repository and go to **Settings**.
::image type="content" source="media/github-repo-settings.png" alt-text="Select settings in GitHub repo.":::

1. Select **Security > Secrets and variables > Actions > New repository secret**.
::image type="content" source="media/github-repo-secrets.png" alt-text="Select Secrets.":::

1. Create a GitHub Action secret `AZURE_CREDENTIALS` in the following format:

  ```json
    {
        "clientId": "<GUID>",
        "clientSecret": "<secret>",
        "subscriptionId": "<GUID>",
        "tenantId": "<GUID>",
        (...)
    }
  ```

|GitHub secret  |Service principal  |
|---------|---------|
|clientId |    Client ID    |
|clientSecret    |    Client Secret   |
|subscriptionId    |    Subscription ID     |
|tenantId   |    Directory (tenant) ID  |

## Set up Azure Login in GitHub Action workflows

To authenticate to Azure in GitHub Action workflows using the service principal secret, you need to use the [Azure Login action](https://github.com/Azure/login). Once you have a working Azure login step, you can use the [Azure PowerShell](https://github.com/Azure/PowerShell) or [Azure CLI](https://github.com/Azure/CLI) actions. You can also use other Azure actions, like [Azure webapp deploy](https://github.com/Azure/webapps-deploy) and [Azure functions](https://github.com/Azure/functions-action).

### Use the Azure login action

In this workflow, you authenticate using the Azure login action with the service principal details stored in `secrets.AZURE_CREDENTIALS`. For more information about referencing GitHub secrets in a workflow file, see [Using secrets in a workflow](https://docs.github.com/actions/security-guides/using-secrets-in-github-actions#using-secrets-in-a-workflow) in GitHub Docs.

```yaml
name: Run Azure Login With a Service Principal Secret
on: [push]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:

    - name: Azure Login Action
      uses: azure/login@v2
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
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

      - name: Azure Login Action
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
          enable-AzPSSession: true

      - name: Azure PowerShell Action
        uses: azure/powershell@v2
        with:
          inlineScript: Get-AzResourceGroup -Name "<YOUR RESOURCE GROUP>"
          azPSVersion: latest
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

      - name: Azure Login Action
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Azure CLI script
        uses: azure/cli@v2
        with:
          azcliversion: latest
          inlineScript: |
            az group show --name "<YOUR RESOURCE GROUP>"
```

### Connect to Azure Government and Azure Stack Hub clouds

To log in to one of the Azure Government clouds, set the optional parameter environment with supported cloud names `AzureUSGovernment` or `AzureChinaCloud`. If this parameter isn't specified, it takes the default value `AzureCloud` and connects to the Azure Public Cloud.

```yaml       
   - name: Login to Azure US Gov Cloud with both Azure CLI and Azure Powershell
      uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_US_GOV_CREDENTIALS }}
          environment: 'AzureUSGovernment'
          enable-AzPSSession: true
```