---
title: Quickstart - Getting started with Terraform using Windows
description: In this quickstart, you learn how to install and configure Terraform to create Azure resources.
keywords: azure devops terraform install configure windows init plan apply execution login rbac service principal automated script cli powershell
ms.topic: quickstart
ms.date: 06/11/2020
# Customer intent: As someone new to Terraform and Azure, I want learn the basics of deploying Azure resources using Terraform from Windows.
---

# Quickstart: Getting started with Terraform using Windows
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## Install latest version of PowerShell for Windows

PowerShell 7 (or later) is the recommended version of PowerShell for use with Azure PowerShell on all platforms, including Windows.

If you have PowerShell installed, you can verify the version by entering the following at a PowerShell prompt:

```powershell
$PSVersionTable.PSVersion
```

Follow the instructions in the article, [Installing PowerShell on Windows](https://docs.microsoft.com/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-7) to install the latest version of PowerShell.

## Install Azure PowerShell Az module

This article uses the [Azure PowerShell Az module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az).

Follow the instructions in the article, [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows?view=azure-cli-latest).

## Understand your Azure login options

There are several options that allow you to log into an Azure subscription.

- [Log into your Microsoft account](#log-into-your-microsoft-account)
- [Log in using an Azure service principal](#log-in-using-an-azure-service-principal)

## Log into your Microsoft account

If you have multiple Microsoft accounts with Azure subscriptions, you can log into one of those accounts by using [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/Connect-AzAccount). Running `Connect-AzAccount` without any parameters displays a URL and a code. Browse to the URL, enter the code, and follow the instructions to log into Azure using your Microsoft account. Once you're logged in, return to the portal.

    ```powershell
    Connect-AzAccount
    ```

**Notes**:
- Upon successful login, `Connect-AzAccount` displays the default Azure subscription associated with the logged-Microsoft account. To learn how to switch to another Azure subscription, see the section, [Specify the current Azure subscription](#specify-the-current-azure-subscription).

## Log into Azure using an Azure service principal

### Create an Azure service principal

To log into an Azure subscription using a service principal, you first need access to a service principal.

Automated tools that deploy or use Azure services - such as Terraform - should always have restricted permissions. Instead of having applications log in as a fully privileged user, Azure offers service principals. But, what if you don't have a service principal with which to log in? In that scenario, you can log in using your user credentials and then create a service principal. Once the service principal is created, you can use its information for future login attempts.

There are many options when [creating a service principal with PowerShell](https://docs.microsoft.com/powershell/azure/create-azure-service-principal-azureps). For this article, we'll create a service principal with a **Contributor** role (the default role). The **Contributor** role has full permissions to read and write to an Azure account. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).

Calling [New-AzADServicePrincipal](https://docs.microsoft.com/powershell/module/Az.Resources/New-AzADServicePrincipal) creates a service principal for the specified subscription. Upon successful completion, the service principal's information - such as its service principal names and display name - are displayed. When you call `New-AzADServicePrincipal` without specifying any authentication credentials, a password is automatically generated. However, this password is not displayed as it is returned in a type `SecureString`. Therefore, you need to call `New-AzADServicePrincipal` with the results going to a variable. You can then query the variable for the password. 

1. Enter the following command, replacing  `<subscription_id>` with the ID of the subscription account you want to use.

    ```powershell
    $sp = New-AzADServicePrincipal -Scope /subscriptions/<subscription_id>
    ```

1. Enter the following to display the names of the service principal:

    ```powershell
    $sp.ServicePrincipalNames
    ```

1. Call `ConvertFrom-SecureString` to display the password as text:

    ```powershell
    $UnsecureSecret = ConvertFrom-SecureString -SecureString $sp.Secret -AsPlainText
    ```

**Notes**:
- At this point, you know the service principal names and password. These values are needed to log into the subscription using your service principal.
- The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](https://docs.microsoft.com/powershell/azure/create-azure-service-principal-azureps#reset-credentials).

### Use an Azure service principal to log in

To log into an Azure subscription using a service principal, call `Connect-AzAccount` and pass in an object of type [PsCredential](https://docs.microsoft.com/dotnet/api/system.management.automation.pscredential). There are two options: interactive and script.

- **Iteractive pattern**: You call [Get-Credential](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/get-credential) and enter the credentials when asked for them. The call to `Get-Credential` returns a `PsCredential`object that you then pass to `Connect-AzAccount`.

    1. Call `Get-Credential` and manually enter a service principal name and password:

        ```powershell
        $Credential = Get-Credential
        ```

    2. Call `Connect-AzAccount`, passing the `PsCredential` object. (Replace the `<azureSubscriptionTenantId>` placeholder with the Azure subscription tenant ID.)

        ```powershell
        Connect-AzAccount -Credential $Credential -Tenant <azureSubscriptionTenantId> -ServicePrincipal
        ```

- **Script pattern**: You construct a `PsCredential` object and pass it to `Connect-AzConnect`.

    1. Construct a `Get-Credential`. (Replace the placeholders with the appropriate values for your Azure subscription and service principal.)

        ```powershell
        $spName = "<servicePrincipalName"
        $spPassword = ConvertTo-SecureString "<servicePrincipalPassword>" -AsPlainText -Force
        $psCredential = New-Object System.Management.Automation.PSCredential($spName , $spPassword)
        ```

    1. Call `Connect-AzAccount`, passing the constructed `PsCredential` object:

        ```powershell
        Connect-AzAccount -Credential $psCredential -TenantId "<azureSubscriptionTenantId>"  -ServicePrincipal
        ```

## Specify the current Azure subscription

As explained in the previous section, two of the ways to log into Azure are the following scenarios:

- **Log in using a Microsoft account**: A Microsoft account can be associated with multiple Azure subscriptions - one of which is the default subscription. The default subscription is the one you use if you log in and don't switch to another.
- **Log in using an Azure service principal**: A service principal is specific to an Azure subscription. Remember that the subscription information displays when you log in.

The following steps address the first scenario where you do the following tasks:

- Verify the current Azure subscription
- List all available Azure subscriptions for the current Microsoft account
- Switch to another Azure subscription

1. To view the current Azure subscription, use [Get-AzContext](https://docs.microsoft.com/powershell/module/az.accounts/get-azcontext).

    ```powershell
    Get-AzContext
    ```

1. If you have access to multiple available Azure subscriptions, use [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription) to display a list of subscription name ID values:

    ```powershell
    Get-AzSubscription
    ```

1. To use a specific Azure subscription for the current PowerShell session, use [Set-AzContext](https://docs.microsoft.com/powershell/module/az.accounts/set-azcontext). Replace the `<subscription_id>` placeholder with the ID of the subscription you want to use:

    ```powershell
    Set-AzContext -SubscriptionId "<subscription_id>"
    ```

## Install Terraform

1. [Download Terraform](https://www.terraform.io/downloads.html).

1. From the download, extract the executable to a directory of your choosing.

1. [Update your system's global path](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows) to the executable.

1. Verify the global path configuration with the `terraform` command. If the Terraform executable is found, a list of available Terraform options displays:

    ```powershell
    terraform
    ```

    If the Terraform executable is found, it will list the syntax and available commands:

    ```output
    Usage: terraform [-version] [-help] <command> [args]

    The available commands for execution are listed below.
    The most common, useful commands are shown first, followed by
    less common or more advanced commands. If you're just getting
    started with Terraform, stick with the common commands. For the
    other commands, please read the help and docs before usage.
    ...
    ```

## Create and run a sample script

1. Create a directory to hold the Terraform files for this demo.

1. Change directories to the demo directory.

1. Using your favorite editor, create a Terraform configuration file named `QuickstartTerraformTest.tf`.

1. Paste the following HCL into the new file.

    ```hcl
    provider "azurerm" {
      # The "feature" block is required for AzureRM provider 2.x.
      # If you are using version 1.x, the "features" block is not allowed.
      version = "~>2.0"
      features {}
    }
    resource "azurerm_resource_group" "rg" {
            name = "QuickstartTerraformTest-rg"
            location = "eastus"
    }
    ```

    **Notes**:
    - The provider block specifies that the [Azure provider (azurerm)](https://www.terraform.io/docs/providers/azurerm/index.html) is used.
    - Within the azurerm provider block, version and features attributes are set. As the comment states, their usage is version-specific. For more information about how to set these attributes for your environment, see [v2.0 of the AzureRM Provider](https://www.terraform.io/docs/providers/azurerm/guides/2.0-upgrade-guide.html).
    - The only [resource declaration](https://www.terraform.io/docs/configuration/resources.html) is for a resource type of [azurerm_resource_group](https://www.terraform.io/docs/providers/azurerm/r/resource_group.html). The two required arguments for azure_resource_group are name and location.

## Create and apply a Terraform execution plan

Cloud Shell automatically has the latest version of Terraform installed. Also, Terraform automatically uses information from the current Azure subscription. As a result, there's no installation or configuration required. Once you create your configuration files, you need only run a couple of Terraform commands to create an execution play. Once you create the execution plan, you can verify it and deploy it.

1. Initialize the Terraform deployment with [terraform init](https://www.terraform.io/docs/commands/init.html). This step downloads the Azure modules required to create an Azure resource group.

    ```powershell
    terraform init
    ```
    
1. Terraform allows you to preview the actions to be completed with [terraform plan](https://www.terraform.io/docs/commands/plan.html).

    ```powershell
    terraform plan
    ```

    **Notes:**
    - The `terraform plan` command creates an execution plan, but doesn't execute it. Instead, it determines what actions are necessary to create the configuration specified in your configuration files.
    - The `terraform plan` command enables you to verify whether the execution plan matches your expectations before making any changes to actual resources.
    - The optional `-out` parameter allows you to specify an output file for the plan. For more information on using the `-out` parameter, see the section [Persisting execution plans for later deployment](#persist-an-execution-plan-for-later-deployment).

1. Apply the execution plan with [terraform apply](https://www.terraform.io/docs/commands/apply.html).

    ```powershell
    terraform apply
    ```
    
1. Terraform shows you what will happen if you apply the execution plan and requires you to confirm running it. Confirm the command by entering `yes` and pressing the **Enter** key.

1. Once you confirm the execution of the play, test that the resource group was successfully created using [az group show](/cli/azure/group?view=azure-cli-latest#az-group-show).

    ```powershell
    Get-AzResourceGroup -Name QuickstartTerraformTest-rg
    ```

    If successful, the command displays various properties of the newly created resource group.

## Persist an execution plan for later deployment

In the previous section, you saw how to run [terraform plan](https://www.terraform.io/docs/commands/plan.html) to create an execution plan. You then saw that using [terraform apply](https://www.terraform.io/docs/commands/apply.html) applies that plan. This pattern works well when the steps are interactive and sequential.

For more complex scenarios, you can persist the execution plan to a file. Later - or even from a different machine - you can apply that execution plan.

If you use this feature, it'ss recommended that you read the article [Running Terraform in automation](https://learn.hashicorp.com/terraform/development/running-terraform-in-automation).

The following steps illustrate the basic pattern for using this feature:

1. Run [terraform init](https://www.terraform.io/docs/commands/init.html).

    ```powershell
    terraform init
    ```

1. Run `terraform plan` with the `-out` parameter.

    ```powershell
    terraform plan -out QuickstartTerraformTest.tfplan
    ```

1. Run `terraform apply`, specifying the name of the file from the previous step.

    ```powershell
    terraform apply QuickstartTerraformTest.tfplan
    ```

**Notes**:
- To enable use with automation, running `terraform apply <filename>` doesn't require confirmation.
- If you decide to use this feature, read the [security warning section](https://www.terraform.io/docs/commands/plan.html#security-warning).

## Clean up resources

When no longer needed, delete the resources created in this article.

1. Run the [terraform destroy](https://www.terraform.io/docs/commands/destroy.html) that will reverse the current execution plan.

    ```powershell
    terraform destroy
    ```

1. Terraform shows you what will happen if you reverse the execution plan and requires you to confirm. Confirm the command by entering `yes` and pressing the **Enter** key.

1. Once you confirm the execution of the play, the output is similar to the following example, verify that the resource group was deleted by using [az group show](/cli/azure/group?view=azure-cli-latest#az-group-show).

    ```powershell
    Get-AzResourceGroup -Name QuickstartTerraformTest-rg
    ```

    **Notes**:
    - If successful, `Get-AzResourceGroup` displays the fact that the resource group doesn't exist.

1. Change directories to the parent directory and remove the demo directory. The `-r` parameter removes the directory contents before removing the directory. The directory contents include the configuration file you created earlier and the Terraform state files.

    ```bash
    cd .. && rm -r QuickstartTerraformTest
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure VM with Terraform](create-linux-virtual-machine-with-infrastructure.md)