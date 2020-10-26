---
title: Quickstart - Configure Terraform using Azure PowerShell
description: In this quickstart, you learn how to install and configure Terraform using Azure PowerShell.
keywords: azure devops terraform install configure windows init plan apply execution login rbac service principal automated script powershell
ms.topic: quickstart
ms.date: 09/27/2020
ms.custom: devx-track-terraform
# Customer intent: As someone new to Terraform and Azure, I want learn the basics of deploying Azure resources using Terraform from Windows.
---

# Quickstart: Configure Terraform using Azure PowerShell
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article describes how to get started with [Terraform on Azure](https://www.terraform.io/docs/providers/azurerm/index.html) using PowerShell.

In this article, you learn how to:
> [!div class="checklist"]
> * Install the latest version of PowerShell
> * Install the new PowerShell Az Module
> * Install the Azure CLI
> * Install Terraform
> * Create an Azure service principal for authentication purposes
> * Log in to Azure using the service principal 
> * Set environment variables so that Terraform correctly authenticates to your Azure subscription
> * Create a base Terraform configuration file
> * Create and apply a Terraform execution plan
> * Reverse an execution plan

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## Configure your environment

1. The latest PowerShell module that allows interaction with Azure resources is called the [Azure PowerShell Az module](/powershell/azure/new-azureps-module-az). When using the Azure PowerShell Az module, PowerShell 7 (or later) is the recommended version on all platforms. If you have PowerShell installed, you can verify the version by entering the following command at a PowerShell prompt.

    ```powershell
    $PSVersionTable.PSVersion
    ```

1. [Install PowerShell](/powershell/scripting/install/installing-powershell-core-on-windows). This demo was tested using PowerShell 7.0.2 on Windows 10.

1. For [Terraform to authenticate to Azure](https://www.terraform.io/docs/providers/azurerm/guides/azure_cli.html), you need to [install the Azure CLI](/cli/azure/install-azure-cli-windows). This demo was tested using Azure CLI version 2.9.1.

1. [Download Terraform](https://www.terraform.io/downloads.html).

1. From the download, extract the executable to a directory of your choosing.

1. [Update your system's global path](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows) to the executable.

1. Verify the global path configuration with the `terraform` command.

    ```powershell
    terraform
    ```

    **Notes**:
    - If the Terraform executable is found, it will list the syntax and available commands.

## Authenticate to Azure

When using PowerShell and Terraform, you must log in using a service principal. The next two sections will illustrate the following tasks:

- [Create an Azure service principal](#create-an-azure-service-principal)
- [Log in to Azure using a service principal](#log-in-to-azure-using-a-service-principal)


### <span id="create-an-azure-service-principal"/>Create an Azure service principal

To log into an Azure subscription using a service principal, you first need access to a service principal. If you already have a service principal, you can skip this section.

There are many options when [creating a service principal with PowerShell](/powershell/azure/create-azure-service-principal-azureps). For this article, we'll create a service principal with a **Contributor** role. The **Contributor** role (the default role) has full permissions to read and write to an Azure account. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).

Calling [New-AzADServicePrincipal](/powershell/module/Az.Resources/New-AzADServicePrincipal) creates a service principal for the specified subscription. Upon successful completion, the service principal's information - such as its service principal names and display name - are displayed. When you call `New-AzADServicePrincipal` without specifying any authentication credentials, a password is automatically generated. However, this password isn't displayed as it's returned in a type `SecureString`. As such, you need to call `New-AzADServicePrincipal` with the results going to a variable. You can then convert the variable to plain text to display it.

1. Get the subscription ID for the Azure subscription you want to use. If you don't know the subscription ID, you can get the value from the [Azure portal](https://portal.azure.com/).

    1. Log into the [Azure portal](https://portal.azure.com/).
    1. Under **Azure services**, select **Subscriptions**.
    1. The table listing of subscriptions contains a column with each subscription's ID.

1. Start PowerShell.

1. Create a new service principal using [New-AzADServicePrincipal](/powershell/module/az.resources/new-azadserviceprincipal). Replace `<azure_subscription_id>` with the ID of the Azure subscription you want to use.

    ```powershell
    $sp = New-AzADServicePrincipal -Scope /subscriptions/<azure_subscription_id>
    ```

1. Display the names of the service principal.

    ```powershell
    $sp.ServicePrincipalNames
    ```

1. Display the autogenerated password as text, [ConvertFrom-SecureString](/powershell/module/microsoft.powershell.security/convertfrom-securestring).

    ```powershell
    $UnsecureSecret = ConvertFrom-SecureString -SecureString $sp.Secret -AsPlainText
    ```

**Notes**:

- The service principal names and password values are needed to log into the subscription using your service principal.
- The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/powershell/azure/create-azure-service-principal-azureps#reset-credentials).

### <span id="log-in-to-azure-using-a-service-principal"/>Log in to Azure using a service principal

To log into an Azure subscription using a service principal, call [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) specifying an object of type [PsCredential](/dotnet/api/system.management.automation.pscredential).

1. Start PowerShell.

1. Get a [PsCredential](/dotnet/api/system.management.automation.pscredential) object using one of the following techniques.

    1. Call [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) and enter a service principal name and password when requested:

        ```powershell
        $spCredential = Get-Credential
        ```

    1. Construct a `PsCredential` object in memory. Replace the placeholders with the appropriate values for your service principal. This pattern is how you would log in from a script.

        ```powershell
        $spName = "<service_principal_name>"
        $spPassword = ConvertTo-SecureString "<service_principal_password>" -AsPlainText -Force
        $spCredential = New-Object System.Management.Automation.PSCredential($spName , $spPassword)
        ```

1. Call `Connect-AzAccount`, passing the `PsCredential` object. Replace the `<azure_subscription_tenant_id>` placeholder with the Azure subscription tenant ID.

    ```powershell
    Connect-AzAccount -Credential $spCredential -Tenant "<azure_subscription_tenant_id>" -ServicePrincipal
    ```

## Set environment variables

In order for Terraform to use the intended Azure subscription, set environment variables. You can set the environment variables at the Windows system level or in within a specific PowerShell session. If you want to set the environment variables for a specific session, use the following code. Replace the placeholders with the appropriate values for your environment.

```powershell
$env:ARM_CLIENT_ID="<service_principal_app_id>"
$env:ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
$env:ARM_TENANT_ID="<azure_subscription_tenant_id>"
```

[!INCLUDE [terraform-create-base-config-file.md](includes/terraform-create-base-config-file.md)]

[!INCLUDE [terraform-create-and-apply-execution-plan.md](includes/terraform-create-and-apply-execution-plan.md)]

[!INCLUDE [terraform-reverse-execution-plan.md](includes/terraform-reverse-execution-plan.md)]

[!INCLUDE [terraform-troubleshooting.md](includes/terraform-troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create a Linux VM using Terraform](create-linux-virtual-machine-with-infrastructure.md)
