--- 
title: Connect GitHub and Azure
description: Resources to connect to GitHub from Azure and other services  
author: N-Usha 
ms.author: ushan 
ms.topic: reference
ms.service: azure 
ms.date: 08/31/2020
---

# Use GitHub Actions to connect to Azure

You can use [Azure login](https://github.com/Azure/login), [Azure PowerShell](https://github.com/Azure/PowerShell), or [Azure CLI](https://github.com/Azure/CLI) to connect GitHub actions to Azure.

* Azure login authenticates your Azure subscription using a service principal.
* Azure CLI sets up the GitHub action runner environment for Azure CLI.
* Azure PowerShell sets up the GitHub action runner environment with the Azure PowerShell module.

## Azure login

To use Azure login, you first need to add your Azure Service Principal as a secret to your GitHub repository. In this example, we will create a secret named `AZURE_CREDENTIALS` that you can use to authenticate with Azure.  

### Create a service principal and add it as a GitHub secret

1. [Create a new service principal](https://docs.microsoft.com/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest) in the Azure Portal.

    ```azurecli
       az ad sp create-for-rbac -n "MyAppName"
    ```

2. Copy the JSON object for your service principal.

    ```json
        # The command should output a JSON object similar to this:

    {
        "clientId": "<GUID>",
        "clientSecret": "<GUID>",
        "subscriptionId": "<GUID>",
        "tenantId": "<GUID>",
        (...)
    }
    ```

3. Open your GitHub repository and go to **Settings**.

    :::image type="content" source="media/github-repo-settings.png" alt-text="Select Settings in the navigation":::

4. Select **Secrets** and then **New Secret**.

    :::image type="content" source="media/select-secrets.png" alt-text="Choose to add a secret":::

5. Paste in your JSON object for your service principal with the name `AZURE_CREDENTIALS`. 

    :::image type="content" source="media/azure-secret-add.png" alt-text="Add a secret in GitHub":::

6. Save by selecting **Add secret**.

### Azure PowerShell

### Azure CLI

## Connect to GitHub from other Azure services

The following articles provide details on connecting to GitHub from Azure and other services.  

## Azure Active Directory 

- [Sign in to GitHub Enterprise with Azure AD (single sign-on)](https://docs.microsoft.com/azure/active-directory/saas-apps/github-tutorial)   

## Power BI

- [Connect Power BI with GitHub](https://docs.microsoft.com/power-bi/service-connect-to-github)   
## Connectors

- [GitHub connector for Azure Logic Apps, Power Automate and Power Apps](https://docs.microsoft.com/connectors/github/)   

## Azure Databricks

- [Use GitHub as version control for notebooks](https://docs.microsoft.com/azure/databricks/notebooks/github-version-control) 