---
title: Authenticate to Azure with service principal
description: Learn how to authenticate Terraform to Azure with a service principal
keywords: azure devops terraform cli powershell authentication microsoft account subscription environment variables provider block
ms.topic: how-to
ms.date: 06/20/2024
ms.custom: devx-track-terraform, devx-track-azurepowershell
# Customer intent: I want to authenticate Terraform to Azure.
---

# Authenticate to Azure with service principal

This article explains how to authenticate Terraform to Azure with a service principal.

In this article, you learn how to:

> [!div class="checklist"]
> * Create a service principal
> * Specifying service principal credentials in environment variables
> * Specify service principal credentials in a Terraform provider block

## Create a service principal

If you don't have access to a service principal, continue with this section to create a new service principal. If you have a service principal you can use, skip to the section, [Specify service principal credentials](#specify-service-principal-credentials).

Automated tools that deploy or use Azure services - such as Terraform - should always have restricted permissions. Instead of having applications sign in as a fully privileged user, Azure offers service principals.

The most common pattern is to interactively sign in to Azure, create a service principal, test the service principal, and then use that service principal for future authentication (either interactively or from your scripts).

### [Bash](#tab/bash)

1. To create a service principal, sign in to Azure. After [authenticating to Azure via a Microsoft account](authenticate-to-azure-with-microsoft-account.md), return here.

1. If you're creating a service principal from Git Bash, set the `MSYS_NO_PATHCONV` environment variable. (This step isn't necessary if you're using Cloud Shell.)

    ```bash
    export MSYS_NO_PATHCONV=1    
    ```

    **Key points:**

    - You can set the `MSYS_NO_PATHCONV` environment variable globally (for all terminal sessions) or locally (for just the current session). As creating a service principal isn't something you do often, the sample sets the value for the current session. To set this environment variable globally, add the setting to the `~/.bashrc` file.

1. To create a service principal, run [az ad sp create-for-rbac](/cli/azure/ad/sp?#az-ad-sp-create-for-rbac).

    ```azurecli
    az ad sp create-for-rbac --name <service_principal_name> --role Contributor --scopes /subscriptions/<subscription_id>
    ```

    **Key points:**

    - You can replace the `<service-principal-name>` with a custom name for your environment or omit the parameter entirely. If you omit the parameter, the service principal name is generated based on the current date and time.
    - Upon successful completion, `az ad sp create-for-rbac` displays several values. The `appId`, `password`, and `tenant` values are used in the next step.
    - The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you can [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).
    - For this article, a service principal with a **Contributor** role is being used. For more information about Role-Based Access Control (RBAC) roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).
    - The output from creating the service principal includes sensitive credentials. Be sure that you don't include these credentials in your code or check the credentials into your source control.
    - For more information about options when creating a service principal with the Azure CLI, see the article [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?).

### [Azure PowerShell](#tab/azure-powershell)

1. Open a PowerShell prompt.

1. Run [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount).

    ```powershell
    Connect-AzAccount
    ```

    **Key points:**

    - Upon successful sign in, `Connect-AzAccount` displays information about the default subscription.
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
    $sp = New-AzADServicePrincipal -DisplayName <service_principal_name> -Role "Contributor"
    ```

    **Key points:**

    - You can replace the `<service-principal-name>` with a custom name for your environment or omit the parameter entirely. If you omit the parameter, the service principal name is generated based on the current date and time.
    - The **Contributor** role is being used. For more information about Role-Based Access Control (RBAC) roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).

1. Display the service principal ID.

    ```powershell
    $sp.AppId
    ```

    **Key points:**

    - Make note of the service principal application ID as it's needed to use the service principal.

1. Get the autogenerated password to text.

    ```powershell
    $sp.PasswordCredentials.SecretText
    ```

    **Key points:**

    - Make note of the password as it's needed to use the service principal.
    - The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you can [reset the service principal credentials](/powershell/azure/create-azure-service-principal-azureps#reset-credentials).

---

## Specify service principal credentials

There are a couple of ways to specify your service principal credentials. However, for security reasons, we suggest not storing credentials in the provider block. That technique is shown only for completeness and testing purposes.

- [Specify service principal credentials in environment variables](#specify-service-principal-credentials-in-environment-variables)
- [Specify service principal credentials in a Terraform provider block](#specify-service-principal-credentials-in-a-terraform-provider-block)

### Specify service principal credentials in environment variables

Once you create a service principal, you can specify its credentials to Terraform via environment variables.

#### [Bash](#tab/bash)

1. Edit the `~/.bashrc` file by adding the following environment variables.

    ```bash
    export ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
    export ARM_TENANT_ID="<azure_subscription_tenant_id>"
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

    [!INCLUDE [environment-variables-notes.md](./includes/environment-variables-notes.md)]

1. Skip to the section, [Next steps](#next-steps)

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

    [!INCLUDE [environment-variables-notes.md](./includes/environment-variables-notes.md)]

1. Skip to the section, [Next steps](#next-steps)

---

### Specify service principal credentials in a Terraform provider block

> [!CAUTION]
> The ability to specify your Azure subscription credentials in a Terraform configuration file can be convenient - especially when testing. However, it isn't advisable to store credentials in a clear-text file that can be viewed by non-trusted individuals.

The Azure provider block defines syntax that allows you to specify your Azure subscription's authentication information.

```terraform
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}

  subscription_id   = "<azure_subscription_id>"
  tenant_id         = "<azure_subscription_tenant_id>"
  client_id         = "<service_principal_appid>"
  client_secret     = "<service_principal_password>"
}

# Your code goes here
```

## Next steps

> [!div class="nextstepaction"]
> [Verify the results](authenticate-to-azure.md#3-verify-the-results)
