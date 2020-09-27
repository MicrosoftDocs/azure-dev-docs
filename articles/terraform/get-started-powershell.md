---
title: Quickstart - Configure Terraform using Azure PowerShell
description: In this quickstart, you learn how to install and configure Terraform using Azure PowerShell.
keywords: azure devops terraform install configure windows init plan apply execution login rbac service principal automated script powershell
ms.topic: quickstart
ms.date: 09/25/2020
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
> * Log into Azure using the service principal 
> * Set environment variables so that Terraform correctly authenticates to your Azure subscription
> * Write a Terraform script to create an Azure resource group
> * Create and apply a Terraform execution plan
> * Use the `terraform plan -destroy` flag to reverse an execution plan

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

## Create an Azure service principal

When using PowerShell and Terraform, you must log in using a service principal.

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

## Log in to Azure using a service principal

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

## Creating a base Terraform configuration file

A Terraform configuration file starts off with the specification of the provider. When using Azure, you'll specify the [Azure provider (azurerm)](https://www.terraform.io/docs/providers/azurerm/index.html) in the `provider` block.

```terraform
provider "azurerm" {
  version = "~>2.0"
  features {}
}

resource "azurerm_resource_group" "rg" {
  name = "<your_resource_group_name>"
  location = "<your_resource_group_location>"
}

# Your Terraform code goes here...

```

**Notes**:

- While the `version` attribute is optional, HashiCorp recommends pinning to a given version of the provider. 
- If you are using Azure provider 1.x, the `features` block is not allowed.
- If you are using Azure provider 2.x, the `features` block is required.
- The [resource declaration](https://www.terraform.io/docs/configuration/resources.html) of [azurerm_resource_group](https://www.terraform.io/docs/providers/azurerm/r/resource_group.html) has two arguments: `name` and `location`. Set the placeholders to the appropriate values for your environment.
- The [local named value](https://www.terraform.io/docs/configuration/expressions.html#references-to-named-values) of `rg` for the resource group is used throughout the how-to and tutorial articles when referencing the resource group. This is independent of the resource group name and only refers to the variable name in your code. If you change this value in the resource group definition, you'll need to also change it in the code that references it.

## Creating and applying a Terraform execution plan

In this section, you learn how to create an *execution plan* and apply it to your cloud infrastructure.

1. To initialize the Terraform deployment, run [terraform init](https://www.terraform.io/docs/commands/init.html). This command downloads the Azure modules required to create an Azure resource group.

    ```cmd
    terraform init
    ```

1. After initialization, you create an execution plan by running [terraform plan](https://www.terraform.io/docs/commands/plan.html).

    ```cmd
    terraform plan -out <terraform_plan>.tfplan
    ```

    [!INCLUDE [terraform-plan-notes.md](includes/terraform-plan-notes.md)]

1. Once you're ready to apply the execution plan to your cloud infrastructure, you run [terraform apply](https://www.terraform.io/docs/commands/apply.html).

    ```cmd
    terraform apply <terraform_plan>.tfplan
    ```

## Reversing a Terraform execution plan

1. To reverse, or undo, the execution plan, you run [terraform plan](https://www.terraform.io/docs/commands/plan.html) and specify the `destroy` flag as follows:

    ```cmd
    terraform plan -destroy -out <terraform_plan>.destroy.tfplan
    ```

    [!INCLUDE [terraform-plan-notes.md](includes/terraform-plan-notes.md)]

1. Run [terraform apply](https://www.terraform.io/docs/commands/apply.html) to apply the execution plan.

    ```cmd
    terraform apply <terraform_plan>.destroy.tfplan
    ```

[!INCLUDE [terraform-troubleshooting.md](includes/terraform-troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create a Linux VM using Terraform](create-linux-virtual-machine-with-infrastructure.md)
