---
title: Authenticate Terraform to Azure using a service principal
description: In this article, you learn how to authenticate to Azure with a Service Principal
keywords: terraform azure cli authenticate
ms.topic: how-to
ms.date: 07/20/2021
ms.custom: devx-track-terraform
# Customer intent: I want to authenticate to Azure from a script using a service principal.
---

# Authenticate Terraform to Azure using a service principal

Automated tools that deploy or use Azure services - such as Terraform - should always have restricted permissions. Instead of having applications log in as a fully privileged user, Azure offers service principals. But, what if you don't have a service principal with which to log in? In that scenario, you can log in using your user credentials and then create a service principal. Once the service principal is created, you can use the service principal for future logins.

The techniques illustrated in this article are how you generally authenticate from a script. For information on authenticating interactively, see [Authenticate Terraform to Azure with a Microsoft Account](authenticate-interactive.md).

In this article, you learn how to:
> [!div class="checklist"]
> * Configure Cloud Shell
> * Create a service principal
> * Store service principal credentials as environment variables
> * Specify service principal credentials in a code block
> * Log in to Azure using a service principal

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 1. Open Cloud Shell

[!INCLUDE [open-cloud-shell.md](../includes/open-cloud-shell.md)]

## 2. Create a service principal

1. You first need to authenticate to an Azure subscription to create a service principal for that subscription. Therefore, if you have not already logged in to the target subscription, follow the instructions in the article, [Authenticate interactively using a Microsoft account](./authenticate-interactive.md).

1. To log into an Azure subscription using a service principal, you first need access to a service principal. If you already have a service principal you want to use, you can skip to the next section. If you want to create a service principal, run [az ad sp create-for-rbac](/cli/azure/ad/sp?#az_ad_sp_create_for_rbac).
    
    ```azurecli
    az ad sp create-for-rbac --name <service_principal_name> --role="Contributor" --scopes="/subscriptions/<azure_subscription_id>"
    ```
    
    **Key points**:
    
    - Upon successful completion, `az ad sp create-for-rbac` displays several values. The `appId`, `password`, and `tenant` values are used in the next step.
    - The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).
    - For this article, a service principal with a **Contributor** role is being used.
    - The **Contributor** role (the default) has full permissions to read and write to an Azure account. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).
    - For more information about options when creating creating a service principal with the Azure CLI, see the article [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?). 
    
## 3. Use a service principal to authenticate to Azure

#### [Cloud Shell or Linux](#tab/linux)

The following options are some of the ways Terraform supports authenticating to Azure using a service principal:

- [Option 1: Store service principal credentials as environment variables](#store-service-principal-credentials-as-environment-variables)
- [Option 2: Specify service principal credentials in a code block](#specify-service-principal-credentials-in-a-code-block)

### Option 1: Store service principal credentials as environment variables

1. Edit the `~/.bashrc` file by adding the following environment variables.

    ```bash
    export ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
    export ARM_TENANT_ID="<azure_subscription_tenant_id"
    export ARM_CLIENT_ID="<service_principal_appid>"
    export ARM_CLIENT_SECRET="<service_principal_password>"
    ```

1. To access any of these values from within a Terraform script use the following syntax: `${env.<environment_variable>}`. For example: `${env.ARM_SUBSCRIPTION_ID}`.

1. Either execute the `~/.bashrc` script or exit and reopen Cloud Shell for the environment variables to be set.

**Key points**:

- Creating and applying Terraform execution plans makes changes on the Azure subscription associated with the service principal. This fact can sometimes be confusing if you're logged into one Azure subscription and the environment variables point to a second Azure subscription. Let's look at the following example to explain. Let's say you have two Azure subscriptions: SubA and SubB. If you're using an interactive command-line tool - such as Cloud Shell - and the current Azure subscription is SubA (determined via `az account show`) while the environment variables point to SubB, any changes made by Terraform are on SubB. Therefore, you would need to log in to your SubB subscription to run Azure CLI commands or Azure PowerShell commands to view your changes.

### Option 2: Specify service principal credentials in a code block

The Azure provider block defines syntax that allows you to specify your Azure subscription's authentication information.

```terraform
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~>2.0"
    }
  }
}

provider "azurerm" {
  features {}

  subscription_id   = "<azure_subscription_id>"
  tenant_id         = "<azure_subscription_tenant_id"
  client_id         = "<service_principal_appid>"
  client_secret     = "<service_principal_password>"
}

# Your code goes here
```

> [!CAUTION]
> The ability to specify your Azure subscription credentials in a Terraform configuration file can be convenient - especially when testing. However, it is not advisable to store credentials in a clear-text file that can be viewed by non-trusted individuals.

#### [Windows](#tab/windows)

Windows instructions

---

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group using Terraform](create-resource-group.md)