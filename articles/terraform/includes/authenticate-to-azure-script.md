---
title: include file
description: include file
ms.topic: how-to
ms.date: 07/24/2021
ms.custom: devx-track-terraform
ms.author: tarcher
---

Automated tools that deploy or use Azure services - such as Terraform - should always have restricted permissions. Instead of having applications log in as a fully privileged user, Azure offers service principals. But, what if you don't have a service principal with which to log in? In that scenario, you can log in using your user credentials and then create a service principal. Once the service principal is created, you can use the service principal for future logins.

The techniques illustrated in this article are how you generally authenticate from a script. For information on authenticating interactively, see [Authenticate Terraform to Azure with a Microsoft Account](authenticate-interactive.md).

#### [Bash](#tab/bash)

### Create a service principal

1. You first need to authenticate to an Azure subscription to create a service principal for that subscription. Therefore, if you have not already logged in to the target subscription, follow the instructions in the article, [Authenticate interactively using a Microsoft account](./authenticate-interactive.md#2-log-in-to-azure-using-a-microsoft-account).

1. To log into an Azure subscription using a service principal, you first need access to a service principal. If you already have a service principal you want to use, you can skip to the next section.

1. If you're creating a service principal from Git Bash, set the `MSYS_NO_PATHCONV` environment variable. (This step is not necessary if you're using Cloud Shell.)

    ```bash
    export MSYS_NO_PATHCONV=1    
    ```

    **Key points:**

    - You can set the `MSYS_NO_PATHCONV` environment variable globally (for all terminal sessions) or locally (for just the current session). As creating a service principal is not something you do often, the sample sets the value for the current session. To set this environment variable globally, add the setting to the `~/.bashrc` file.

1. To create a service principal, run [az ad sp create-for-rbac](/cli/azure/ad/sp?#az_ad_sp_create_for_rbac).
    
    ```azurecli
    az ad sp create-for-rbac --name <service_principal_name> --role="Contributor" --scopes="/subscriptions/<azure_subscription_id>"
    ```
    
    **Key points:**
    
    - Upon successful completion, `az ad sp create-for-rbac` displays several values. The `appId`, `password`, and `tenant` values are used in the next step.
    - The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).
    - For this article, a service principal with a **Contributor** role is being used.
    - The **Contributor** role (the default) has full permissions to read and write to an Azure account. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).
    - The output from creating the service principal includes sensitive credentials. Be sure that you don't include these credentials in your code or check the credentials into your source control.
    - For more information about options when creating creating a service principal with the Azure CLI, see the article [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?).
    
### Use a service principal to authenticate to Azure

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

#### [Azure-PowerShell](#tab/azure-powershell)

### Create a service principal

To log into an Azure subscription using a service principal, you first need access to a service principal. If you already have a service principal, you can skip this section.

[!INCLUDE [authenticate-to-azure-interactive.md](includes/authenticate-to-azure-interactive.md)]

1. Create a new service principal using [New-AzADServicePrincipal](/powershell/module/az.resources/new-azadserviceprincipal). Replace `<azure_subscription_id>` with the ID of the Azure subscription you want to use. Replace `<service_principal_name>` with the name you wish to give the principal.

    ```powershell
    $sp = New-AzADServicePrincipal -Scope /subscriptions/<azure_subscription_id> -DisplayName <service_principal_name>
    ```

1. Convert the autogenerated password to text and display it.

    ```powershell
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp.Secret)
    $UnsecureSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    $UnsecureSecret
    ```

    **Key points**:
    
    - The service principal names and password values are needed to log into the subscription using your service principal.
    - The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/powershell/azure/create-azure-service-principal-azureps#reset-credentials).

### Use a service principal to authenticate to Azure

To log into an Azure subscription using a service principal, call [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) specifying an object of type [PsCredential](/dotnet/api/system.management.automation.pscredential).

1. Get a [PsCredential](/dotnet/api/system.management.automation.pscredential) object using one of the following techniques.

1. Call [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) and enter a service principal name and password when requested:

    ```powershell
    $spCredentials = Get-Credential
    ```

1. Construct a `PsCredential` object in memory. Replace the placeholders with the appropriate values for your service principal. This pattern is how you would log in from a script.

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
