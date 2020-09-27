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

## Create a Terraform configuration file

In this section, you'll code a Terraform configuration file that creates an Azure resource group.

1. Create a directory to hold the Terraform files for this demo.

    ```powershell
    mkdir QuickstartTerraformTest
    ```

1. Change directories to the demo directory.

    ```powershell
    cd QuickstartTerraformTest
    ```

1. Using your favorite editor, create a Terraform configuration file. This article uses [Visual Studio Code](https://code.visualstudio.com/Download).

    ```powershell
    code QuickstartTerraformTest.tf
    ```

1. Paste the following HCL code into the new file. See the notes after the code listing for more details.

    ```hcl
    provider "azurerm" {
      # The "feature" block is required for AzureRM provider 2.x.
      # If you're using version 1.x, the "features" block isn't allowed.
      version = "~>2.0"
      features {}
    }

    resource "azurerm_resource_group" "rg" {
      name     = "QuickstartTerraformTest-rg"
      location = "eastus"
    }
    ```

    **Notes**:
    - The provider block specifies that the [Azure provider (azurerm)](https://www.terraform.io/docs/providers/azurerm/index.html) is used.
    - Within the `azurerm` provider block, `version` and `features` attributes are set. As the comment states, their usage is version-specific. For more information about setting these attributes, see [v2.0 of the AzureRM Provider](https://www.terraform.io/docs/providers/azurerm/guides/2.0-upgrade-guide.html).
    - The only [resource declaration](https://www.terraform.io/docs/configuration/resources.html) is for a resource type of [azurerm_resource_group](https://www.terraform.io/docs/providers/azurerm/r/resource_group.html). The two required arguments for azure_resource_group are name and location.

## Create and apply a Terraform execution plan

In this section, you create an *execution plan* and apply it to your cloud infrastructure.

1. Initialize the Terraform deployment with [terraform init](https://www.terraform.io/docs/commands/init.html). This step downloads the Azure modules required to create an Azure resource group.

    ```powershell
    terraform init
    ```

1. Run [terraform plan](https://www.terraform.io/docs/commands/plan.html) to create an execution plan from your Terraform configuration file.

    ```powershell
    terraform plan -out QuickstartTerraformTest.tfplan
    ```

    **Notes:**
    - The `terraform plan` command creates an execution plan, but doesn't execute it. Instead, it determines what actions are necessary to create the configuration specified in your configuration files. This pattern allows you to verify whether the execution plan matches your expectations before making any changes to actual resources.
    - The optional `-out` parameter allows you to specify an output file for the plan. Using the `-out` parameter ensures that the plan you reviewed is exactly what is applied.
    - To read more about persisting execution plans and security, see the [security warning section](https://www.terraform.io/docs/commands/plan.html#security-warning).

1. Run [terraform apply](https://www.terraform.io/docs/commands/apply.html) to apply the execution plan.

    ```powershell
    terraform apply QuickstartTerraformTest.tfplan
    ```

1. Once the execution plan is applied, you can test that the resource group was successfully created using [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup).

    ```powershell
    Get-AzResourceGroup -Name QuickstartTerraformTest-rg
    ```

    **Notes**:

    - If successful, the command displays various properties of the newly created resource group.

## Clean up resources

When no longer needed, delete the resources created in this article.

1. Run [terraform plan](https://www.terraform.io/docs/commands/plan.html) to create an execution plan to destroy the resources indicated in the Terraform configuration file.

    ```powershell
    terraform plan -destroy -out QuickstartTerraformTest.destroy.tfplan
    ```

    **Notes:**
    - The `terraform plan` command creates an execution plan, but doesn't execute it. Instead, it determines what actions are necessary to create the configuration specified in your configuration files. This pattern allows you to verify whether the execution plan matches your expectations before making any changes to actual resources.
    - The `-destroy` parameter generates a plan to destroy the resources.
    - The optional `-out` parameter allows you to specify an output file for the plan. Using the `-out` parameter ensures that the plan you reviewed is exactly what is applied.
    - To read more about persisting execution plans and security, see the [security warning section](https://www.terraform.io/docs/commands/plan.html#security-warning).

1. Run [terraform apply](https://www.terraform.io/docs/commands/apply.html) to apply the execution plan.

    ```powershell
    terraform apply QuickstartTerraformTest.destroy.tfplan
    ```

1. Verify that the resource group was deleted by using [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup).

    ```powershell
    Get-AzResourceGroup -Name QuickstartTerraformTest-rg
    ```

    **Notes**:
    - If successful, `Get-AzResourceGroup` displays the fact that the resource group doesn't exist.

1. Change directories to the parent directory and remove the demo directory. The `-r` parameter removes the directory contents before removing the directory. The directory contents include the configuration file you created earlier and the Terraform state files.

    ```powershell
    cd .. && rm -r QuickstartTerraformTest
    ```

[!INCLUDE [terraform-troubleshooting.md](includes/terraform-troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create a Linux VM using Terraform](create-linux-virtual-machine-with-infrastructure.md)