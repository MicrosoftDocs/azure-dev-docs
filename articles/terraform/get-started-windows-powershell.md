---
title: Quickstart - Configure Terraform in Windows with Azure PowerShell
description: In this quickstart, you learn how to configure Terraform in Windows with Azure PowerShell
keywords: terraform azure cli devops powershell install configure windows interactive login rbac service principal automated script
ms.topic: quickstart 
ms.date: 07/22/2021
ms.custom: devx-track-terraform
adobe-target: true
# Customer intent: As a Windows user new to Terraform and Azure, I want configure Terraform in Windows using Azure PowerShell.
---

# Quickstart: Configure Terraform in Windows with Azure PowerShell

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

## 1. Configure your environment

1. The latest PowerShell module that allows interaction with Azure resources is called the [Azure PowerShell Az module](/powershell/azure/new-azureps-module-az). When using the Azure PowerShell Az module, PowerShell 7 (or later) is the recommended version on all platforms. If you have PowerShell installed, you can verify the version by entering the following command at a PowerShell prompt.

    ```powershell
    $PSVersionTable.PSVersion
    ```

1. [Install PowerShell](/powershell/scripting/install/installing-powershell-core-on-windows). This demo was tested using PowerShell 7.1.2 on Windows 10.

1. For [Terraform to authenticate to Azure](https://www.terraform.io/docs/providers/azurerm/guides/azure_cli.html), you need to [install the Azure CLI](/cli/azure/install-azure-cli-windows). This demo was tested using Azure CLI version 2.26.1.

1. [Download Terraform](https://www.terraform.io/downloads.html). This demo was tested using Terraform version 1.0.3.

1. From the download, extract the executable to a directory of your choosing (for example, `c:\terraform`).

1. [Update your system's global path](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows) to the executable.

1. After setting the global path, close and reopen PowerShell.

1. Verify the global path configuration with the `terraform` command.

    ```powershell
    terraform -version
    ```

## 2. Authenticate to Azure

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

1. Create a new service principal using [New-AzADServicePrincipal](/powershell/module/az.resources/new-azadserviceprincipal). Replace `<azure_subscription_id>` with the ID of the Azure subscription you want to use. Replace `<service_principal_name>` with the name you wish to give the principal.

    ```powershell
    $sp = New-AzADServicePrincipal -Scope /subscriptions/<azure_subscription_id> -DisplayName <service_principal_name>
    ```

1. Convert the autogenerated password to text and display it.

    ```powershell
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp.Secret)
    $UnsecureSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    $UnsecureSecret
    ```

**Key points**:

- The service principal names and password values are needed to log into the subscription using your service principal.
- The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/powershell/azure/create-azure-service-principal-azureps#reset-credentials).

### <span id="log-in-to-azure-using-a-service-principal"/>Log in to Azure using a service principal

To log into an Azure subscription using a service principal, call [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) specifying an object of type [PsCredential](/dotnet/api/system.management.automation.pscredential).

1. Start PowerShell.

1. Get a [PsCredential](/dotnet/api/system.management.automation.pscredential) object using one of the following techniques.

    1. Call [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) and enter a service principal name and password when requested:

        ```powershell
        $spCredentials = Get-Credential
        ```

    1. Construct a `PsCredential` object in memory. Replace the placeholders with the appropriate values for your service principal. This pattern is how you would log in from a script.

        ```powershell
        $spApplicationId = "<service_principal_application_id"
        $spPassword = ConvertTo-SecureString "<service_principal_password>" -AsPlainText -Force
        $spCredentials = New-Object System.Management.Automation.PSCredential($spApplicationId , $spPassword)
        ```

1. Call `Connect-AzAccount`, passing the `PsCredential` object. Replace the `<azure_subscription_tenant_id>` placeholder with the Azure subscription tenant ID. If you don't know the tenant ID, see [How to find your Azure Active Directory tenant ID](/azure/active-directory/fundamentals/active-directory-how-to-find-tenant) for instructions.

    ```powershell
    Connect-AzAccount -ServicePrincipal -Credential $spCredentials -Tenant "<azure_subscription_tenant_id>" 
    ```

1. Log in to Azure using Azure CLI:

    ```azurecli
    az login
    ```

## 3. Set environment variables

Setting environment variables helps Terraform use the intended Azure subscription without you having to insert the information in every Terraform configuration file.

1. To set the environment variables for every PowerShell instance, create the following environment variables. Replace the placeholders with the appropriate values for your environment.

    ```
    ARM_CLIENT_ID = "<service_principal_app_id>"
    ARM_SUBSCRIPTION_ID = "<azure_subscription_id>"
    ARM_TENANT_ID = "<azure_subscription_tenant_id>"
    ARM_CLIENT_SECRET = "<service_principal_password>"
    ```

    **Key points:**

    - If you have a PowerShell session open, close the session and reopen it after creating the environment variables.

1. To set the environment variables within a specific PowerShell session, use the following code. Replace the placeholders with the appropriate values for your environment.

    ```powershell
    $env:ARM_CLIENT_ID="<service_principal_app_id>"
    $env:ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
    $env:ARM_TENANT_ID="<azure_subscription_tenant_id>"
    $env:ARM_CLIENT_SECRET="<service_principal_password>"
    ```

1. To verify the environment variables, use the following PowerShell command:

    ```powershell
    gci env:ARM_*
    ```

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group using Terraform](create-resource-group.md)