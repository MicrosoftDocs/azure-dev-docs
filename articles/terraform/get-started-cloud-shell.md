---
title: Quickstart - Configure Terraform using Azure Cloud Shell
description: In this quickstart, you learn how to install and configure Terraform to create Azure resources.
keywords: azure devops terraform install configure cloud shell init plan apply execution portal login rbac service principal automated script
ms.topic: quickstart
ms.date: 09/25/2020
ms.custom: devx-track-terraform
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

## Creating a Terraform configuration file

A Terraform configuration file starts off with the specification of the provider. When using Azure, you'll specify the [Azure provider (azurerm)](https://www.terraform.io/docs/providers/azurerm/index.html) in the `provider` block.

```terraform
provider "azurerm" {
  version = "~>2.0"
  features {}
}

# Your Terraform code goes here...

```

**Notes**:

- While the `version` attribute is optional, HashiCorp recommends pinning to a given version of the provider. 
- If you are using Azure provider 1.x, the `features` block is not allowed.
- If you are using Azure provider 2.x, the `features` block is required.

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

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group using Terraform](create_resource_group.md)