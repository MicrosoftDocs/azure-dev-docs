---
title: Quickstart - Get started with Terraform using Windows
description: In this quickstart, you learn how to install and configure Terraform to create Azure resources.
keywords: azure devops terraform install configure windows init plan apply execution login rbac service principal automated script cli powershell
ms.topic: quickstart
ms.date: 06/14/2020
# Customer intent: As someone new to Terraform and Azure, I want learn the basics of deploying Azure resources using Terraform from Windows.
---

# Quickstart: Get started with Terraform using Windows
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article describes how to get started with [Terraform on Azure](https://www.terraform.io/docs/providers/azurerm/index.html).

[!INCLUDE [hashicorp-support.md](includes/hashicorp-support.md)]

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## Configure your environment

1. PowerShell 7 (or later) is the recommended version of PowerShell for use with Azure PowerShell on all platforms, including Windows. If you have PowerShell installed, you can verify the version by entering the following command at a PowerShell prompt.

    ```powershell
    $PSVersionTable.PSVersion
    ```

1. [Install PowerShell](https://docs.microsoft.com/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-7). (This demo was tested using PowerShell 7.0.2 on Windows 10)

1. [Download Terraform](https://www.terraform.io/downloads.html).

1. From the download, extract the executable to a directory of your choosing.

1. [Update your system's global path](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows) to the executable.

1. Verify the global path configuration with the `terraform` command.

    ```powershell
    terraform
    ```

    Notes:
    - If the Terraform executable is found, it will list the syntax and available commands.

1. Terraform uses the Azure CLI to [authenticate to Azure](https://www.terraform.io/docs/providers/azurerm/guides/azure_cli.html). As such, need to [install the Azure CLI](/cli/azure/install-azure-cli-windows). (This demo was tested using Azure CLI 2.7.0)

## Authenticate to Azure

Terraform supports several options for authenticating to Azure. The following techniques are covered in this article:

- [Authenticate via Microsoft account](#authenticate-via-microsoft-account): This is the recommended way to authenticate when using Terraform interactively.
- [Authenticate via Azure service principal](#authenticate-via-azure-service-principal): This is one preferred way to authenticate when using Terraform from code.

### Authenticate via Microsoft account

As mentioned earlier, Terraform only supports authentication to Azure via the Azure CLI. Neither the PowerShell AzureRM module nor the new PowerShell Az module are supported for the purpose of authenticating to Azure.

Calling `az login` without any parameters displays a URL and a code. Browse to the URL, enter the code, and follow the instructions to log into Azure using your Microsoft account. Once you're logged in, return to the portal.

```azurecli
az login
```

Notes:

- Upon successful login, `az login` displays a list of the Azure subscriptions associated with the logged-in Microsoft account.
- A list of properties displays for each available Azure subscription. The `isDefault` property identifies which Azure subscription you're using. To learn how to switch to another Azure subscription, see the section, [Set the current Azure subscription](#set-the-current-azure-subscription).

### Authenticate via Azure service principal

**Create an Azure service principal**: To log into an Azure subscription using a service principal, you first need access to a service principal. If you already have a service principal, you can skip this part of the section.

Automated tools that deploy or use Azure services - such as Terraform - should always have restricted permissions. Instead of having applications log in as a fully privileged user, Azure offers service principals. But, what if you don't have a service principal with which to log in? In that scenario, you can log in using your user credentials and then create a service principal. Once the service principal is created, you can use its information for future login attempts.

There are many options when [creating a service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?). For this article, we'll create use [az ad sp create-for-rbac](/cli/azure/ad/sp?#az-ad-sp-create-for-rbac) to create a service principal with a **Contributor** role. The **Contributor** role (the default) has full permissions to read and write to an Azure account. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).

Enter the following command, replacing `<subscription_id>` with the ID of the subscription account you want to use.

```azurecli
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscription_id>"
```

Notes:

- Upon successful completion, `az ad sp create-for-rbac` displays several values. The `appId`, `password`, and `tenant` values are used in the next step.
- The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).

**Specifying the service principal information**: Terraform doesn't support logging into Azure with a service principal via the `az login` command. Instead, you use environment variables to hold the values needed to authenticate to Azure. Create the following environment variables, replacing the placeholders with the appropriate values.

```powershell
$env:ARM_SUBSCRIPTION_ID="<subscription_id>"
$env:ARM_CLIENT_ID="<service_principal_app_id>"
$env:ARM_CLIENT_SECRET="<service_principal_password>"
$env:ARM_TENANT_ID="<service_principal_tenant_id>"
```

## Set the current Azure subscription

A Microsoft account can be associated with multiple Azure subscriptions. The following steps outline how to switch between subscriptions:

1. To view the current Azure subscription, use [az account show](/cli/azure/account#az-account-show).

    ```azurecli
    az account show
    ```

1. If you have access to multiple available Azure subscriptions, use [az account list](/cli/azure/account#az-account-list) to display a list of subscription name ID values:

    ```azurecli
    az account list --query "[].{name:name, subscriptionId:id}"
    ```

1. To use a specific Azure subscription for the current Cloud Shell session, use [az account set](/cli/azure/account#az-account-set). Replace the `<subscription_id>` placeholder with the ID (or name) of the subscription you want to use:

    ```azurecli
    az account set --subscription="<subscription_id>"
    ```

    Notes:

    - Calling `az account set` doesn't display the results of switching to the specified Azure subscription. However, you can use `az account show` to confirm that the current Azure subscription has changed.

## Create a Terraform configuration file

In this section, you learn how to create a Terraform configuration file that creates an Azure resource group.

1. Change directories to the directory where you create the demo directory to hold your Terraform files.

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

    Notes:

    - The provider block specifies that the [Azure provider (azurerm)](https://www.terraform.io/docs/providers/azurerm/index.html) is used.
    - Within the azurerm provider block, version and features attributes are set. As the comment states, their usage is version-specific. For more information about how to set these attributes for your environment, see [v2.0 of the AzureRM Provider](https://www.terraform.io/docs/providers/azurerm/guides/2.0-upgrade-guide.html).
    - The only [resource declaration](https://www.terraform.io/docs/configuration/resources.html) is for a resource type of [azurerm_resource_group](https://www.terraform.io/docs/providers/azurerm/r/resource_group.html). The two required arguments for azure_resource_group are name and location.

1. Save the file (**&lt;Ctrl>S**).

1. Exit the editor (**&lt;Ctrl>&lt;F4>**).

## Create and apply a Terraform execution plan

Once you create your configuration files, this section explains how to create an *execution plan* and apply it to your cloud infrastructure.

1. Initialize the Terraform deployment with [terraform init](https://www.terraform.io/docs/commands/init.html). This step downloads the Azure modules required to create an Azure resource group.

    ```powershell
    terraform init
    ```
    
1. Terraform allows you to preview the actions to be completed with [terraform plan](https://www.terraform.io/docs/commands/plan.html).

    ```powershell
    terraform plan
    ```

    Notes:

    - The `terraform plan` command creates an execution plan, but doesn't execute it. Instead, it determines what actions are necessary to create the configuration specified in your configuration files.
    - The `terraform plan` command enables you to verify whether the execution plan matches your expectations before making any changes to actual resources.
    - The optional `-out` parameter allows you to specify an output file for the plan. For more information on using the `-out` parameter, see the section [Persisting execution plans for later deployment](#persist-an-execution-plan-for-later-deployment).

1. Apply the execution plan with [terraform apply](https://www.terraform.io/docs/commands/apply.html).

    ```powershell
    terraform apply
    ```

1. Terraform shows you what will happen if you apply the execution plan and requires you to confirm running it. Confirm the command by entering `yes` and pressing the **Enter** key.

1. Once you confirm the execution of the plan, test that the resource group was successfully created using [az group show](/cli/azure/group?#az-group-show).

    ```azurecli
    az group show -n "QuickstartTerraformTest-rg"
    ```

    Notes:

    - If successful, `az group show` displays various properties of the newly created resource group.

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

Notes:

- To enable use with automation, running `terraform apply <filename>` doesn't require confirmation.
- If you decide to use this feature, read the [security warning section](https://www.terraform.io/docs/commands/plan.html#security-warning).

## Clean up resources

When no longer needed, delete the resources created in this article.

1. Run the [terraform destroy](https://www.terraform.io/docs/commands/destroy.html) that will reverse the current execution plan.

    ```bash
    terraform destroy
    ```

1. Terraform shows you what will happen if you reverse the execution plan and requires you to confirm. Confirm by entering `yes` and pressing the **Enter** key.

1. Once you confirm the execution of the plan, the output is similar to the following example, verify that the resource group was deleted by using [az group show](/cli/azure/group?#az-group-show).

    ```azurecli
    az group show -n "QuickstartTerraformTest-rg"
    ```

    Notes:
    - If successful, `az group show` displays the fact that the resource group doesn't exist.

1. Change directories to the parent directory and remove the demo directory. The `-r` parameter removes the directory contents before removing the directory. The directory contents include the configuration file you created earlier and the Terraform state files.

    ```bash
    cd .. && rm -r QuickstartTerraformTest
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure VM with Terraform](create-linux-virtual-machine-with-infrastructure.md)