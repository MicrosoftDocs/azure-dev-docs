--- 
title:  Authenticate to Azure from GitHub Action workflows by Secret
description: Connect to GitHub from Azure with a service principal secret
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use the Azure login action with a service principal secret

To use [Azure login](https://github.com/marketplace/actions/azure-login) with a service principal, you first need to add your Azure service principal as a secret to your GitHub repository. 

> [!WARNING]
> To use this method, carefully manage your secret to prevent any leaks.

## Create a service principal

In this example, you create a secret named `AZURE_CREDENTIALS` that you can use to authenticate with Azure.

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview) in the Azure portal or [Azure CLI](/cli/azure/install-azure-cli) locally.

    > [!NOTE]
    > If you are using Azure Stack Hub, you need to set your SQL Management endpoint to `not supported`.
    > ```azurecli
    > az cloud update -n {environmentName} --endpoint-sql-management https://notsupported`
    > ```

1. [Create a new service principal](/cli/azure/create-an-azure-service-principal-azure-cli) in the Azure portal for your app. The service principal must be assigned with an appropriate role.

    ```azurecli-interactive
        az ad sp create-for-rbac --name "myApp" --role contributor \
                                    --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                                    --json-auth
    ```
   The parameter `--json-auth` outputs the result dictionary accepted by the login action, accessible in Azure CLI versions >= 2.51.0. Earlier versions use `--sdk-auth` with a deprecation warning.
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

## Add the service principal as a GitHub secret

[!INCLUDE [include](~/../articles/reusable-content/github-actions/create-secrets-service-principal.md)]

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
          inlineScript: Get-AzResourceGroup -Name "< YOUR RESOURCE GROUP >"
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
            az group show --name "< YOUR RESOURCE GROUP >"
```

### Connect to Azure Government and Azure Stack Hub clouds

To log in to one of the Azure Government clouds, set the optional parameter environment with supported cloud names `AzureUSGovernment` or `AzureChinaCloud`. If this parameter isn't specified, it takes the default value `AzureCloud` and connects to the Azure Public Cloud.

```yaml
   - name: Login to Azure US Gov Cloud with Azure CLI
     uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_US_GOV_CREDENTIALS }}
          environment: 'AzureUSGovernment'
          enable-AzPSSession: false
          
   - name: Login to Azure US Gov Cloud with Azure Powershell
      uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_US_GOV_CREDENTIALS }}
          environment: 'AzureUSGovernment'
          enable-AzPSSession: true
```