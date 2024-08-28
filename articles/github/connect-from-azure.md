--- 
title: Authenticate to Azure from GitHub Actions workflows
description: Securely authenticate to Azure services from GitHub Actions workflows using Azure Login action and manage your Azure resources.
author: MoChilia 
ms.author: shiyingchen 
ms.topic: reference
ms.service: azure 
ms.date: 07/01/2024
ms.custom: github-actions-azure, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Use GitHub Actions to connect to Azure

Learn how to use [Azure Login action](https://github.com/Azure/login) with either [Azure PowerShell action](https://github.com/Azure/PowerShell) or [Azure CLI action](https://github.com/Azure/CLI) to interact with your Azure resources.

To use Azure PowerShell or Azure CLI in a GitHub Actions workflow, you need to first log in with the [Azure Login action](https://github.com/marketplace/actions/azure-login) action.

The Azure Login action supports different ways of authenticating with Azure:

* [Sign in with OpenID Connect using a Microsoft Entra application or a user-assigned managed identity](connect-from-azure-openid-connect.md) 
* [Sign in with a managed identity configured on an Azure virtual machine](connect-from-azure-identity.md) (Only available for self-hosted GitHub runners)
* [Sign in with a service principal and secret](connect-from-azure-secret.md) (Not recommended)

By default, the Azure Login action logs in with the Azure CLI and sets up the GitHub Actions runner environment for Azure CLI. You can use Azure PowerShell with `enable-AzPSSession` property of the Azure Login action. This property sets up the GitHub Actions runner environment with the Azure PowerShell module.

You can also use the Azure Login action to connect to public or sovereign clouds including Azure Government and Azure Stack Hub.

## Connect with other Azure services

The following articles provide details on connecting from GitHub to Azure and other services.  

| Service | Tutorial |
|-|-|
| Microsoft Entra ID | [Sign in to GitHub Enterprise with Microsoft Entra ID (single sign-on)](/azure/active-directory/saas-apps/github-tutorial)
| Power BI | [Connect Power BI with GitHub](/power-bi/service-connect-to-github)
| GitHub Connectors | [GitHub connector for Azure Logic Apps, Power Automate, and Power Apps](/connectors/github/)
| Azure Databricks | [Use GitHub as version control for notebooks](/azure/databricks/notebooks/github-version-control) 

> [!div class="nextstepaction"]
> [Deploy apps from GitHub to Azure](deploy-to-azure.md)
