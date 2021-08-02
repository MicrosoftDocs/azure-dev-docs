---
title: include file
description: include file
ms.topic: how-to
ms.date: 08/01/2021
ms.custom: devx-track-terraform
ms.author: jduffney
---

### Terraform and Azure authentication scenarios

Terraform only supports authenticating to Azure via the Azure CLI. Authenticating using Azure PowerShell is not supported. Therefore, while you can use the Azure PowerShell module when doing your Terraform work, you first need to authenticate to Azure using the Azure CLI.

This article explains how to authenticate Terraform to Azure for the following scenarios. For more information about options to authenticate Terraform to Azure, see [Authenticating using the Azure CLI](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs/guides/azure_cli).

- [Authenticating via a Microsoft account using Cloud Shell (with Bash or PowerShell) and ](#authenticate-to-azure-via-a-microsoft-account)
- [Authenticating via a Microsoft account using Windows (with Bash or PowerShell)](#authenticate-to-azure-via-a-microsoft-account)
- Authenticating via a service principal:
    1. If you don't have a service principal, [create a service principal](#create-a-service-principal).
    1. [Authenticate to Azure using environment variables](#specify-service-principal-credentials-in-environment-variables) or [authenticate to Azure using the Terraform provider block](#specify-service-principal-credentials-in-a-terraform-provider-block)

### Authenticate to Azure via a Microsoft account

A Microsoft account is a username (associated with an email and its credentials) that is used to log in to Microsoft services - such as Azure. A Microsoft account can be associated with one or more Azure subscriptions, with one of those subscriptions being the default.

The following steps show you how to log in to Azure interactively using a Microsoft account, list the account's associated Azure subscriptions (including the default), and set the current subscription.

1. Open a command line that has access to the Azure CLI.

1. Run [az login](/cli/azure/account#az_login) without any parameters and follow the instructions to log in to Azure.

    ```azurecli
    az login
    ```

    **Key points:**

    - Upon successful login, `az login` displays a list of the Azure subscriptions associated with the logged-in Microsoft account, including the default subscription.

1. To confirm the current Azure subscription, run [az account show](/cli/azure/account#az_account_show).

    ```azurecli
    az account show
    ```

1. To view all the Azure subscription names and IDs for a specific Microsoft account, run [az account list](/cli/azure/account#az_account_list). 

    ```azurecli
    az account list --query "[?user.name=='<microsoft_account_email>'].{Name:name, ID:id, Default:isDefault}" --output Table
    ```

    **Key points:**

    - Replace the `<microsoft_account_email>` placeholder with the Microsoft account email address whose Azure subscriptions you want to list.
    - With a Live account - such as a hotmail or outlook - you might need to specify the fully qualified email address. For example, if your email address is `admin@hotmail.com`, you might need to replace the placeholder with `live.com#admin@hotmail.com`.

1.  To use a specific Azure subscription, run [az account set](/cli/azure/account#az_account_set).

    ```azurecli
    az account set --subscription "<subscription_id_or_subscription_name>"
    ```
    
    **Key points:**
    
    - Replace the `<subscription_id_or_subscription_name>` placeholder with the ID or name of the subscription you want to use.
    - Calling `az account set` doesn't display the results of switching to the specified Azure subscription. However, you can use `az account show` to confirm that the current Azure subscription has changed.
    - If you run the `az account list` command from the previous step, you see that the default Azure subscription has changed to the subscription you specified with `az account set`.
    
### Create a service principal

Automated tools that deploy or use Azure services - such as Terraform - should always have restricted permissions. Instead of having applications log in as a fully privileged user, Azure offers service principals.

The most common pattern is to interactively log in to Azure, create a service principal, test the service principal, and then use that service principal for future authentication (either interactively or from your scripts).

#### [Bash](#tab/bash)

1. To create a service principal, log in to Azure. After [authenticating to Azure via a Microsoft account](#authenticate-to-azure-via-a-microsoft-account), return here.

1. If you're creating a service principal from Git Bash, set the `MSYS_NO_PATHCONV` environment variable. (This step is not necessary if you're using Cloud Shell.)

    ```bash
    export MSYS_NO_PATHCONV=1    
    ```

    **Key points:**

    - You can set the `MSYS_NO_PATHCONV` environment variable globally (for all terminal sessions) or locally (for just the current session). As creating a service principal is not something you do often, the sample sets the value for the current session. To set this environment variable globally, add the setting to the `~/.bashrc` file.

1. To create a service principal, run [az ad sp create-for-rbac](/cli/azure/ad/sp?#az_ad_sp_create_for_rbac).

    ```azurecli
    az ad sp create-for-rbac --name <service_principal_name>
    ```

    **Key points:**

    - You can replace the `<service-principal-name` with a custom name for your environment or omit the parameter entirely. If you omit the parameter, the service principal name is generated based on the current date and time.
    - Upon successful completion, `az ad sp create-for-rbac` displays several values. The `appId`, `password`, and `tenant` values are used in the next step.
    - The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you can [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).
    - The **Contributor** role is the default role and has full permissions to read and write to an Azure account. For this article, a service principal with a **Contributor** role is being used. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).
    - The output from creating the service principal includes sensitive credentials. Be sure that you don't include these credentials in your code or check the credentials into your source control.
    - For more information about options when creating creating a service principal with the Azure CLI, see the article [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?).

#### [Azure PowerShell](#tab/azure-powershell)

1. Open a PowerShell prompt.

1. Run [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount).

    ```powershell
    Connect-AzAccount
    ```

    **Key points:**

    - Upon successful login, `Connect-AzAccount` displays information about the default subscription.
    - Make note of the `TenantId` as it's needed to use the service principal.

1. To confirm the current Azure subscription, run [Get-AzContext](/powershell/module/az.accounts/get-azcontext).

    ```powershell
    Get-AzContext
    ```

1. To view all enabled Azure subscriptions for the logged-in Microsoft account, run [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription).

    ```azurecli
    Get-AzSubscription
    ```

1. To use a specific Azure subscription, run [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

    ```powershell
    Set-AzContext -Subscription "<subscription_id_or_subscription_name>"
    ```
    
    **Key points:**
    
    - Replace the `<subscription_id_or_subscription_name>` placeholder with the ID or name of the subscription you want to use.

1. Run [New-AzADServicePrincipal](/powershell/module/az.resources/new-azadserviceprincipal) to create a new service principal.

    ```powershell
    $sp = New-AzADServicePrincipal -DisplayName <service_principal_name>    
    ```

    **Key points:**

    - You can replace the `<service-principal-name` with a custom name for your environment or omit the parameter entirely. If you omit the parameter, the service principal name is generated based on the current date and time.
    - The **Contributor** role is the default role and has full permissions to read and write to an Azure account. For this article, a service principal with a **Contributor** role is being used. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).

1. Display the service principal ID.

    ```powershell
    $sp.ApplicationId
    ```

    **Key points:**

    - Make note of the service principal application ID as it's needed to use the service principal.

1. Convert the autogenerated password to text.

    ```powershell
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp.Secret)
    $UnsecureSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    $UnsecureSecret
    ```

    **Key points:**
    
    - Make note of the password as it's needed to use the service principal.
    - The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you can [reset the service principal credentials](/powershell/azure/create-azure-service-principal-azureps#reset-credentials).

---

### Specify service principal credentials in environment variables

Once you create a service principal, you can specify its credentials to Terraform via environment variables.

#### [Bash](#tab/bash)

1. Edit the `~/.bashrc` file by adding the following environment variables.

    ```bash
    export ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
    export ARM_TENANT_ID="<azure_subscription_tenant_id"
    export ARM_CLIENT_ID="<service_principal_appid>"
    export ARM_CLIENT_SECRET="<service_principal_password>"
    ```

1. To execute the `~/.bashrc` script, run `source ~/.bashrc` (or its abbreviated equivalent `. ~/.bashrc`). You can also exit and reopen Cloud Shell for the script to run automatically.

    ```bash
    . ~/.bashrc
    ```

1. Once the environment variables have been set, you can verify their values as follows:

    ```bash
    printenv | grep ^ARM*
    ```

[!INCLUDE [environment-variables-notes.md](environment-variables-notes.md)]

#### [Azure PowerShell](#tab/azure-powershell)

1. To set the environment variables within a specific PowerShell session, use the following code. Replace the placeholders with the appropriate values for your environment.

    ```powershell
    $env:ARM_CLIENT_ID="<service_principal_app_id>"
    $env:ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
    $env:ARM_TENANT_ID="<azure_subscription_tenant_id>"
    $env:ARM_CLIENT_SECRET="<service_principal_password>"
    ```

1. Run the following PowerShell command to verify the Azure environment variables:

    ```powershell
    gci env:ARM_*
    ```

1. To set the environment variables for every PowerShell session, [create a PowerShell profile](/powershell/module/microsoft.powershell.core/about/about_profiles) and set the environment variables within your profile.

[!INCLUDE [environment-variables-notes.md](environment-variables-notes.md)]

---

### Specify service principal credentials in a Terraform provider block

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
