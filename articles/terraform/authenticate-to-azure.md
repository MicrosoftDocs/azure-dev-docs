---
title: Authenticate Terraform to Azure
description: In this article, you learn the various options to authenticate to Azure with a Microsoft Account
keywords: azure devops terraform cli powershell interactive authentication microsoft account subscription
ms.topic: how-to
ms.date: 07/24/2021
ms.custom: devx-track-terraform
# Customer intent: I want to authenticate Terraform to Azure.
---

# Authenticate Terraform to Azure

 In this article, you learn how to do the following tasks:

> [!div class="checklist"]
> * Understand common Terraform and Azure authentication scenarios
> * 

## Terraform and Azure authentication scenarios

Terraform only supports authenticating to Azure via the Azure CLI. Authentication via Azure PowerShell is not supported. Therefore, while you can use the Azure PowerShell module when doing your Terraform work, you'll first need to authenticate to Azure using the Azure CLI.

- [Authenticating interactively using Cloud Shell (with Bash or PowerShell) and ](#authenticate-to-azure-interactively)
- [Authenticating interactively using Windows (with Bash or PowerShell)](#authenticate-to-azure-interactively)
- Authenticating interactively or from a script with a service principal:
    1. If you don't have a service principal, [create a service principal](#create-a-service-principal).
    1. [Authenticate to Azure using a service principal](#authenticate-to-azure-using-a-service-principal)

## Authenticate to Azure interactively

A Microsoft account is a username (associated with an email and its credentials) that is used to log in to Microsoft services - such as Azure. A Microsoft account can be associated with one or more Azure subscriptions, with one of those subscriptions being the default. The following steps show you how to log in to Azure interactively using a Microsoft account, list the account's associated Azure subscriptions (including the default), and set the current subscription.

1. Run [az login](/cli/azure/account#az_login) without any parameters and follow the instructions to log in to Azure.

    ```azurecli
    az login
    ```

    **Key points:**

    - Upon successful login, `az login` displays a list of the Azure subscriptions associated with the logged-in Microsoft account, including the default subscription.

1. To view all the Azure subscription names and IDs for a specific Microsoft account, run [az account list](/cli/azure/account#az_account_list). 

    ```azurecli
    az account list --query "[?user.name=='<microsoft_account_email>'].{Name:name, ID:id, Default:isDefault}" --output Table
    ```

    **Key points**:

    - Replace the `<microsoft_account_email>` placeholder with the Microsoft account email address whose Azure subscriptions you want to list.
    - With a Live account - such as a hotmail or outlook - you might need to specify the fully qualified email address. For example, if your email address is `admin@hotmail.com`, you might need to replace the placeholder with `live.com#admin@hotmail.com`.

1.  To use a specific Azure subscription, run [az account set](/cli/azure/account#az_account_set).

    ```azurecli
    az account set --subscription "<subscription_id_or_subscription_name>"
    ```
    
    **Key points**:
    
    - Replace the `<subscription_id_or_subscription_name>` placeholder with the ID or name of the subscription you want to use.
    - Calling `az account set` doesn't display the results of switching to the specified Azure subscription. However, you can use `az account show` to confirm that the current Azure subscription has changed.
    - If you run the `az account list` command from the previous step, you see that the default Azure subscription has changed to the subscription you specified with `az account set`.
    
## Create a service principal

Automated tools that deploy or use Azure services - such as Terraform - should always have restricted permissions. Instead of having applications log in as a fully privileged user, Azure offers service principals. 

The most common pattern is to interactively log in to Azure, create a service principal, test the service principal, and then use that service principal for future authentication (either interactive or from your scripts).

#### [Bash](#tab/bash)

1. [Log in to Azure](#authenticate-to-azure-interactively).

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
    - The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).
    - The **Contributor** role is the default role and has full permissions to read and write to an Azure account. For this article, a service principal with a **Contributor** role is being used. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).
    - The output from creating the service principal includes sensitive credentials. Be sure that you don't include these credentials in your code or check the credentials into your source control.
    - For more information about options when creating creating a service principal with the Azure CLI, see the article [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?).

#### [Azure PowerShell](#tab/azure-powershell)

1. Run [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount).

    ```powershell
    Connect-AzAccount
    ```

    **Key points:**

    - Upon successful login, `Connect-AzAccount` displays information about the default subscription.

1. To view all enabled Azure subscriptions for the logged-in Microsoft account, run [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription).

    ```azurecli
    Get-AzSubscription
    ```

1. To use a specific Azure subscription, run [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

    ```powershell
    Set-AzContext -Subscription "<subscription_id_or_subscription_name>"
    ```
    
    **Key points**:
    
    - Replace the `<subscription_id_or_subscription_name>` placeholder with the ID or name of the subscription you want to use.

1. Create a new service principal using [New-AzADServicePrincipal](/powershell/module/az.resources/new-azadserviceprincipal). Replace `<azure_subscription_id>` with the ID of the Azure subscription you want to use. Replace `<service_principal_name>` with the name you wish to give the principal.

    ```powershell
    $sp = New-AzADServicePrincipal -DisplayName <service_principal_name>    
    ```

    **Key points:**

    - You can replace the `<service-principal-name` with a custom name for your environment or omit the parameter entirely. If you omit the parameter, the service principal name is generated based on the current date and time.
    - The **Contributor** role is the default role and has full permissions to read and write to an Azure account. For this article, a service principal with a **Contributor** role is being used. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).

1. Convert the autogenerated password to text and display it.

    ```powershell
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp.Secret)
    $UnsecureSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    $UnsecureSecret
    ```

    **Key points**:
    
    - The service principal name and password value are needed to log into the subscription using your service principal.
    - The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/powershell/azure/create-azure-service-principal-azureps#reset-credentials).

---

## Authenticate to Azure via a service principal

#### [Bash](#tab/bash)

The following options are some of the ways Terraform supports authenticating to Azure using a service principal:

- [Option 1: Store service principal credentials as environment variables](#option-1-store-service-principal-credentials-as-environment-variables)
- [Option 2: Specify service principal credentials in a code block](#option-2-specify-service-principal-credentials-in-a-code-block)

#### Option 1: Store service principal credentials as environment variables

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

**Key points**:

- As with any environment variable, to access an Azure subscription value from within a Terraform script, use the following syntax: `${env.<environment_variable>}`. For example, to access the `ARM_SUBSCRIPTION_ID` value, specify `${env.ARM_SUBSCRIPTION_ID}`.
- Creating and applying Terraform execution plans makes changes on the Azure subscription associated with the service principal. This fact can sometimes be confusing if you're logged into one Azure subscription and the environment variables point to a second Azure subscription. Let's look at the following example to explain. Let's say you have two Azure subscriptions: SubA and SubB. If you're using an interactive command-line tool - such as Cloud Shell - and the current Azure subscription is SubA (determined via `az account show`) while the environment variables point to SubB, any changes made by Terraform are on SubB. Therefore, you would need to log in to your SubB subscription to run Azure CLI commands or Azure PowerShell commands to view your changes.

#### Option 2: Specify service principal credentials in a code block

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

#### [Azure PowerShell](#tab/azure-powershell)

To log into an Azure subscription using a service principal, call [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) specifying an object of type [PsCredential](/dotnet/api/system.management.automation.pscredential).

1. Get a [PsCredential](/dotnet/api/system.management.automation.pscredential) object using one of the following options:

    **Option #1 : Interactive**

    Run [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) and enter a service principal name and password when requested.

        ```powershell
        $spCredentials = Get-Credential
        ```
    
    **Option #2 : From script**

    Construct a `PsCredential` object in memory. Replace the placeholders with the appropriate values for your service principal. This pattern is how you would log in from a script.

        ```powershell
        $spApplicationId = "<service_principal_application_id"
        $spPassword = ConvertTo-SecureString "<service_principal_password>" -AsPlainText -Force
        $spCredentials = New-Object System.Management.Automation.PSCredential($spApplicationId , $spPassword)
        ```
    
1. Call `Connect-AzAccount`, passing the `PsCredential` object. Replace the `<azure_subscription_tenant_id>` placeholder with the Azure subscription tenant ID. If you don't know the tenant ID, see [How to find your Azure Active Directory tenant ID](/azure/active-directory/fundamentals/active-directory-how-to-find-tenant) for instructions.

    ```powershell
    Connect-AzAccount -ServicePrincipal -Credential $spCredentials -Tenant "<azure_subscription_tenant_id>" 
    ```

1. Log in to Azure using Azure CLI:

    ```azurecli
    az login
    ```

### Set environment variables

Setting environment variables helps Terraform use the intended Azure subscription without you having to insert the information in every Terraform configuration file.

1. To set the environment variables for every PowerShell instance, create the following environment variables. Replace the placeholders with the appropriate values for your environment.

    ```
    ARM_CLIENT_ID = "<service_principal_app_id>"
    ARM_SUBSCRIPTION_ID = "<azure_subscription_id>"
    ARM_TENANT_ID = "<azure_subscription_tenant_id>"
    ARM_CLIENT_SECRET = "<service_principal_password>"
    ```

    **Key points:**

    - If you have a PowerShell session open, close the session and reopen it after creating the environment variables.

1. To set the environment variables within a specific PowerShell session, use the following code. Replace the placeholders with the appropriate values for your environment.

    ```powershell
    $env:ARM_CLIENT_ID="<service_principal_app_id>"
    $env:ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
    $env:ARM_TENANT_ID="<azure_subscription_tenant_id>"
    $env:ARM_CLIENT_SECRET="<service_principal_password>"
    ```

1. To verify the environment variables, use the following PowerShell command:

    ```powershell
    gci env:ARM_*
    ```

---

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group](create-resource-group.md)