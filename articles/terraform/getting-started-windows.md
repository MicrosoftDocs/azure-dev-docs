---
title: Quickstart - Getting started with Terraform using Windows
description: In this quickstart, you learn how to install and configure Terraform to create Azure resources.
keywords: azure devops terraform install configure windows init plan apply execution login rbac service principal automated script cli powershell
ms.topic: quickstart
ms.date: 06/09/2020
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

## Log into your Microsoft account

if you have multiple Microsoft accounts with Azure subscriptions, you can log into one of those accounts by using [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/Connect-AzAccount). 

Based on your scenario, choose one of the following paths:

- **You want to log in as a user**: Running `Connect-AzAccount` without any parameters displays a URL and a code. Browse to the URL, enter the code, and follow the instructions to log into Azure using your Microsoft account. Once the command logs you in, return to the portal.

    ```powershell
    Connect-AzAccount
    ```

    **Notes**:
    - Upon successful login, `Connect-AzAccount` displays a list of the Azure subscriptions associated with the logged-in Microsoft account.
    - A list of properties displays for the default subscription associated with the logged-Microsoft account. To learn how to switch to another Azure subscription, see the section, [Specify the current Azure subscription](#specify-the-current-azure-subscription).

- **You want to use a service principal, but don't have one yet**: Automated tools that deploy or use Azure services - such as Terraform - should always have restricted permissions. Instead of having applications log in as a fully privileged user, Azure offers service principals. But, what if you don't have a service principal with which to log in? In that scenario, you can log in using your user credentials and then create a service principal. Once the service principal is created, you can use its information for future login attempts.

    There are many options when [creating a service principal with PowerShell](https://docs.microsoft.com/powershell/azure/create-azure-service-principal-azureps). For this article, we'll create a service principal with a **Contributor** role (the default role). The **Contributor** role has full permissions to read and write to an Azure account. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).

    Calling [New-AzADServicePrincipal](https://docs.microsoft.com/en-us/powershell/module/Az.Resources/New-AzADServicePrincipal) creates a service principal for the specified subscription. Upon successful completion, the service principal's information - such as its service principal names and display name - are displayed. When you call `New-AzADServicePrincipal` without specifying any authentication credentials, a password is automatically generated. However, this password is not displayed as it is returned in a type `SecureString`. Therefore, you need to call `New-AzADServicePrincipal` with the results going to a variable. You can then query the variable for the password. 

    Enter the following command, replacing  `<subscription_id>` with the ID of the subscription account you want to use.
    
    ```powershell
    $sp = New-AzADServicePrincipal -Scope /subscriptions/<subscription_id>
    ```

    Enter the following to display the names of the service principal:

    ```powershell
    $sp.ServicePrincipalNames
    ```

    Call `ConvertFrom-SecureString` to display the password as text:

    ```powershell
    $UnsecureSecret = ConvertFrom-SecureString -SecureString $sp.Secret -AsPlainText
    ```

    **Notes**:
    - At this point, you know the service principal names and password. These values are needed to log into the subscription using your service principal.
    - The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](https://docs.microsoft.com/en-us/powershell/azure/create-azure-service-principal-azureps#reset-credentials).

- **Log in using an Azure service principal**: You use `Connect-AzAccount` to log into a specific Azure subscription using a service principal. 


$Credential = Get-Credential
Connect-AzAccount -Credential $Credential -Tenant 'xxxx-xxxx-xxxx-xxxx' -ServicePrincipal





## Specify Azure subscription

Once you've installed the latest version of PowerShell and the Az module, you're ready to connect to Azure.

1. Open a PowerShell instance as Administrator.

1. Connect to Azure using [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/Connect-AzAccount).

    ```powershell
    Connect-AzAccount
    ```

    **Notes**:
    - Running this command will result in a URL and code being displayed. You'll need to browse to the URL and provide the code. At that point, you'll log into the Microsoft account associated with the active Azure subscription you want to use.
    - Once you've logged in, the command displays the default Azure subscription for the Microsoft account.
    
1. To view all the Azure subscriptions associated with the Microsoft account used to connect to Azure, run [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/Get-AzSubscription).

    ```powershell
    Get-AzSubscription
    ```

1. To use a specific Azure subscription for the current PowerShell session, use one of the two following examples of [Set-AzContext](https://docs.microsoft.com/powershell/module/az.accounts/set-azcontext).

    Replace the `<subscription_id>` placeholder with the ID of the subscription you want to use:

    ```powershell
    Set-AzContext -SubscriptionId "<subscription_id>"
    ```

    Replace the `<subscription_name>` placeholder with the name of the subscription you want to use:

    ```powershell
    Set-AzContext -SubscriptionName "<subscription_name>"
    ```

    **Notes**:
    - The preceding examples use the `-SubscriptionId` and `-SubscriptionName` parameters. Technically, they're both aliases for the `-Subscription` parameter. Therefore, they can all be used interchangeably. However, that could change in the future. Also, using the specifying the intended parameter is better for the clarity of your code

1. Once you set the context, a current context displays. However, if at anytime you want to verify the current Azure subscription, use the [Get-AzContext](https://docs.microsoft.com/powershell/module/az.accounts/get-azcontext).

    ```powershell
    Get-AzContext
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

    ```bash
    terraform init
    ```
    
1. Terraform allows you to preview the actions to be completed with [terraform plan](https://www.terraform.io/docs/commands/plan.html).

    ```bash
    terraform plan
    ```

    **Notes:**
    - The `terraform plan` command creates an execution plan, but doesn't execute it. Instead, it determines what actions are necessary to create the configuration specified in your configuration files.
    - The `terraform plan` command enables you to verify whether the execution plan matches your expectations before making any changes to actual resources.
    - The optional `-out` parameter allows you to specify an output file for the plan. For more information on using the `-out` parameter, see the section [Persisting execution plans for later deployment](#persist-an-execution-plan-for-later-deployment).

1. Apply the execution plan with [terraform apply](https://www.terraform.io/docs/commands/apply.html).

    ```bash
    terraform apply
    ```
    
1. Terraform shows you what will happen if you apply the execution plan and requires you to confirm running it. Confirm the command by entering `yes` and pressing the **Enter** key.

1. Once you confirm the execution of the play, test that the resource group was successfully created using [az group show](/cli/azure/group?view=azure-cli-latest#az-group-show).

    ```azurecli
    az group show -n "QuickstartTerraformTest-rg"
    ```

    If successful, the command displays various properties of the newly created resource group.

## Persist an execution plan for later deployment

In the previous section, you saw how to run [terraform plan](https://www.terraform.io/docs/commands/plan.html) to create an execution plan. You then saw that using [terraform apply](https://www.terraform.io/docs/commands/apply.html) applies that plan. This pattern works well when the steps are interactive and sequential.

For more complex scenarios, you can persist the execution plan to a file. Later - or even from a different machine - you can apply that execution plan.

If you use this feature, it'ss recommended that you read the article [Running Terraform in automation](https://learn.hashicorp.com/terraform/development/running-terraform-in-automation).

The following steps illustrate the basic pattern for using this feature:

1. Run [terraform init](https://www.terraform.io/docs/commands/init.html).

    ```bash
    terraform init
    ```

1. Run `terraform plan` with the `-out` parameter.

    ```bash
    terraform plan -out QuickstartTerraformTest.tfplan
    ```

1. Run `terraform apply`, specifying the name of the file from the previous step.

    ```bash
    terraform apply QuickstartTerraformTest.tfplan
    ```

**Notes**:
- To enable use with automation, running `terraform apply <filename>` doesn't require confirmation.
- If you decide to use this feature, read the [security warning section](https://www.terraform.io/docs/commands/plan.html#security-warning).

## Clean up resources

When no longer needed, delete the resources created in this article.

1. Run the [terraform destroy](https://www.terraform.io/docs/commands/destroy.html) that will reverse the current execution plan.

    ```bash
    terraform destroy
    ```

1. Terraform shows you what will happen if you reverse the execution plan and requires you to confirm. Confirm the command by entering `yes` and pressing the **Enter** key.

1. Once you confirm the execution of the play, the output is similar to the following example, verify that the resource group was deleted by using [az group show](/cli/azure/group?view=azure-cli-latest#az-group-show).

    ```azurecli
    az group show -n "QuickstartTerraformTest-rg"
    ```

    **Notes**:
    - If successful, the `az group show` command displays the fact that the resource group doesn't exist.

1. Change directories to the parent directory and remove the demo directory. The `-r` parameter removes the directory contents before removing the directory. The directory contents include the configuration file you created earlier and the Terraform state files.

    ```bash
    cd .. && rm -r QuickstartTerraformTest
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure VM with Terraform](create-linux-virtual-machine-with-infrastructure.md)