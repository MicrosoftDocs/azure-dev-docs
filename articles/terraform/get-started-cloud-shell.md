---
title: Quickstart - Configure Terraform using Azure Cloud Shell
description: In this quickstart, you learn how to install and configure Terraform to create Azure resources.
keywords: azure devops terraform install configure cloud shell init plan apply execution portal login rbac service principal automated script
ms.topic: quickstart
ms.date: 08/08/2020
# Customer intent: As someone new to Terraform and Azure, I want learn the basics of deploying Azure resources using Terraform from Cloud Shell.
---

# Quickstart: Configure Terraform using Azure Cloud Shell
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article describes how to get started with [Terraform on Azure](https://www.terraform.io/docs/providers/azurerm/index.html).

In this article, you learn how to:
> [!div class="checklist"]
> * Authenticate to Azure using `az login`
> * Create an Azure service principal using the Azure CLI
> * Authenticate to Azure using a service principal
> * Set the current Azure subscription - for use if you have multiple subscriptions
> * Write a Terraform script to create an Azure resource group
> * Create and apply a Terraform execution plan
> * Use the `terraform plan -destroy` flag to reverse an execution plan

[!INCLUDE [hashicorp-support.md](includes/hashicorp-support.md)]

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## Configure your environment

1. Browse to the [Azure portal](https://portal.azure.com).

1. If you aren't already logged in, the Azure portal displays a list of available Microsoft accounts. Select a Microsoft account associated with one or more active Azure subscriptions and enter your credentials to continue.

1. Open Cloud Shell.

    ![Accessing Cloud Shell](media/install-configure/portal-cloud-shell.png)

1. If you haven't previously used Cloud Shell, configure the environment and storage settings. This article uses the Bash environment.

**Notes**:
- Cloud Shell automatically has the latest version of Terraform installed. Also, Terraform automatically uses information from the current Azure subscription. As a result, there's no installation or configuration required.

## Authenticate to Azure

Cloud Shell is automatically authenticated under the Microsoft account you used to log into the Azure portal. If your account has multiple Azure subscriptions, you can [switch to one of your other subscriptions](#set-the-current-azure-subscription).

Terraform supports several options for authenticating to Azure. The following techniques are covered in this article:

- When using Terraform interactively, [authenticating via Microsoft account](#authenticate-via-microsoft-account) is recommended.
- When using Terraform from code, [authenticating via Azure service principal](#authenticate-via-azure-service-principal) is one recommended way.

### Authenticate via Microsoft account

Calling `az login` without any parameters displays a URL and a code. Browse to the URL, enter the code, and follow the instructions to log into Azure using your Microsoft account. Once you're logged in, return to the portal.

```azurecli
az login
```

**Notes**:

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

**Notes**:

- Upon successful completion, `az ad sp create-for-rbac` displays several values. The `name`, `password`, and `tenant` values are used in the next step.
- The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).

**Log in using an Azure service principal**: In the following call to `az login`, replace the placeholders with the information from your service principal.

```azurecli
az login --service-principal -u <service_principal_name> -p "<service_principal_password>" --tenant "<service_principal_tenant>"
```

## Set the current Azure subscription

A Microsoft account can be associated with multiple Azure subscriptions. The following steps outline how you can switch between your subscriptions:

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

    **Notes**:

    - Calling `az account set` doesn't display the results of switching to the specified Azure subscription. However, you can use `az account show` to confirm that the current Azure subscription has changed.

## Create a Terraform configuration file

In this section, you learn how to create a Terraform configuration file that creates an Azure resource group.

1. Change directories to the mounted file share where your work in Cloud Shell is persisted. For more information about how Cloud Shell persists your files, see [Connect your Microsoft Azure Files storage](/azure/cloud-shell/overview#connect-your-microsoft-azure-files-storage)

    ```bash
    cd clouddrive
    ```

1. Create a directory to hold the Terraform files for this demo.

    ```bash
    mkdir QuickstartTerraformTest
    ```

1. Change directories to the demo directory.

    ```bash
    cd QuickstartTerraformTest
    ```

1. Using your favorite editor, create a Terraform configuration file. This article uses the built-in [Cloud Shell editor](/azure/cloud-shell/using-cloud-shell-editor).

    ```bash
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

    **Notes**:

    - The `provider` block specifies that the [Azure provider (`azurerm`)](https://www.terraform.io/docs/providers/azurerm/index.html) is used.
    - Within the `azurerm` provider block, `version` and `features` attributes are set. As the comment states, their usage is version-specific. For more information about how to set these attributes for your environment, see [v2.0 of the AzureRM Provider](https://www.terraform.io/docs/providers/azurerm/guides/2.0-upgrade-guide.html).
    - The only [resource declaration](https://www.terraform.io/docs/configuration/resources.html) is for a resource type of [azurerm_resource_group](https://www.terraform.io/docs/providers/azurerm/r/resource_group.html). The two required arguments for `azure_resource_group` are `name` and `location`.

1. Save the file (**&lt;Ctrl>S**).

1. Exit the editor (**&lt;Ctrl>Q**).

## Create and apply a Terraform execution plan

In this section, you create an *execution plan* and apply it to your cloud infrastructure.

1. Initialize the Terraform deployment with [terraform init](https://www.terraform.io/docs/commands/init.html). This step downloads the Azure modules required to create an Azure resource group.

    ```bash
    terraform init
    ```

1. Run [terraform plan](https://www.terraform.io/docs/commands/plan.html) to create an execution plan from your Terraform configuration file.

    ```bash
    terraform plan -out QuickstartTerraformTest.tfplan
    ```

    **Notes:**
    - The `terraform plan` command creates an execution plan, but doesn't execute it. Instead, it determines what actions are necessary to create the configuration specified in your configuration files. This pattern allows you to verify whether the execution plan matches your expectations before making any changes to actual resources.
    - The optional `-out` parameter allows you to specify an output file for the plan. Using the `-out` parameter ensures that the plan you reviewed is exactly what is applied.
    - To read more about persisting execution plans and security, see the [security warning section](https://www.terraform.io/docs/commands/plan.html#security-warning).

1. Run [terraform apply](https://www.terraform.io/docs/commands/apply.html) to apply the execution plan.

    ```bash
    terraform apply QuickstartTerraformTest.tfplan
    ```

1. Once the execution plan is applied, you can test that the resource group was successfully created using [az group show](/cli/azure/group?#az-group-show).

    ```azurecli
    az group show -n "QuickstartTerraformTest-rg"
    ```

    **Notes**:

    - If successful, `az group show` displays various properties of the newly created resource group.

## Clean up resources

When no longer needed, delete the resources created in this article.

1. Run [terraform plan](https://www.terraform.io/docs/commands/plan.html) to create an execution plan to destroy the resources indicated in the Terraform configuration file.

    ```bash
    terraform plan -destroy -out QuickstartTerraformTest.destroy.tfplan
    ```

    **Notes**:
    - The `terraform plan` command creates an execution plan, but doesn't execute it. Instead, it determines what actions are necessary to create the configuration specified in your configuration files. This pattern allows you to verify whether the execution plan matches your expectations before making any changes to actual resources.
    - The `-destroy` parameter generates a plan to destroy the resources.
    - The optional `-out` parameter allows you to specify an output file for the plan. Using the `-out` parameter ensures that the plan you reviewed is exactly what is applied.
    - To read more about persisting execution plans and security, see the [security warning section](https://www.terraform.io/docs/commands/plan.html#security-warning).

1. Run [terraform apply](https://www.terraform.io/docs/commands/apply.html) to apply the execution plan.

    ```bash
    terraform apply QuickstartTerraformTest.destroy.tfplan
    ```

1. Verify that the resource group was deleted by using [az group show](/cli/azure/group?#az-group-show).

    ```azurecli
    az group show -n "QuickstartTerraformTest-rg"
    ```

    **Notes**:
    - If successful, `az group show` displays the fact that the resource group doesn't exist.

1. Change directories to the parent directory and remove the demo directory. The `-r` parameter removes the directory contents before removing the directory. The directory contents include the configuration file you created earlier and the Terraform state files.

    ```bash
    cd .. && rm -r QuickstartTerraformTest
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure VM with Terraform](create-linux-virtual-machine-with-infrastructure.md)