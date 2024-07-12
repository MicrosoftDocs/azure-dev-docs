--- 
title: Authenticate to Azure from GitHub Action workflows
description: Securely authenticate to Azure services from GitHub Actions workflows using Azure Login Action and manage your Azure resources.
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use GitHub Actions to connect to Azure

Learn how to use [Azure Login Action](https://github.com/Azure/login) with either [Azure PowerShell Action](https://github.com/Azure/PowerShell) or [Azure CLI Action](https://github.com/Azure/CLI) to interact with your Azure resources.

To use Azure PowerShell or Azure CLI in a GitHub Actions workflow, you need to first log in with the [Azure Login Action](https://github.com/marketplace/actions/azure-login) action.

The Azure Login Action supports different ways of authenticating with Azure:

* [Sign in with OpenID Connect](connect-from-azure-oidc.md) 
* [Sign in with a managed Identity configured on a VM](connect-from-azure-identity.md)
* [Sign in with a service principal and secret](connect-from-azure-secret.md) (Not recommended)

By default, the Azure Login Action logs in with the Azure CLI and sets up the GitHub Actions runner environment for Azure CLI. You can use Azure PowerShell with `enable-AzPSSession` property of the Azure Login Action. This property sets up the GitHub Actions runner environment with the Azure PowerShell module.

You can also use Azure login to connect to public or sovereign clouds including Azure Government and Azure Stack Hub.

## Connect with other Azure services

The following articles provide details on connecting from GitHub to Azure and other services.  

| Service | Tutorial |
|-|-|
| Microsoft Entra ID | [Sign in to GitHub Enterprise with Microsoft Entra ID (single sign-on)](/azure/active-directory/saas-apps/github-tutorial)
| Power BI | [Connect Power BI with GitHub](/power-bi/service-connect-to-github)
| GitHub Connectors | [GitHub connector for Azure Logic Apps, Power Automate and Power Apps](/connectors/github/)
| Azure Databricks | [Use GitHub as version control for notebooks](/azure/databricks/notebooks/github-version-control) 

> [!div class="nextstepaction"]
> [Deploy apps from GitHub to Azure](deploy-to-azure.md)
