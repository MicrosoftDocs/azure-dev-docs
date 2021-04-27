---
title: Quickstart - Configure Terraform in Azure Cloud Shell
description: In this quickstart, you learn how to configure Terraform in Azure Cloud Shell.
keywords: terraform azure cli devops install configure portal interactive login rbac service principal automated script
ms.topic: quickstart
ms.date: 04/21/2021
ms.custom: devx-track-terraform, devx-track-azurecli, devx-track-powershell
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want configure Terraform in Azure Cloud Shell
---

# Quickstart: Configure Terraform in Azure Cloud Shell
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article describes how to get started with [Terraform on Azure](https://www.terraform.io/docs/providers/azurerm/index.html).

In this article, you learn how to:
> [!div class="checklist"]
> * Authenticate to Azure
> * Create an Azure service principal
> * Authenticate to Azure using a service principal
> * Set the current Azure subscription - for use if you have multiple subscriptions

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 1. Configure your environment

1. Browse to the [Azure portal](https://portal.azure.com).

1. Open Cloud Shell.

    :::image type="content" source="media/install-configure/portal-cloud-shell.png" alt-text="Open Cloud Shell from the top menu in the Azure portal.":::

1. If you haven't previously used Cloud Shell, configure the environment and storage settings.

1. Select the CLI - either PowerShell or Bash (for the Azure CLI) - that you want to use.

    :::image type="content" source="media/install-configure/choose-cloudshell-cli.png" alt-text="Select the CLI you want to use in Cloud Shell.":::

## 2. Install the latest version of Terraform

Cloud Shell automatically updates to the latest version of Terraform within a couple of weeks. However, if you need the most recent (or any specific) version sooner, this section shows you how download and install a specific version of Terraform.

#### [Azure CLI](#tab/azure-cli)

1. Verify the current version of Terraform.

    ```azurecli
    terraform version
    ```

1. If the Terraform version installed in Cloud Shell isn't the latest version, you'll see information similar to the following:

    :::image type="content" source="media/install-configure/terraform-version-not-current-bash" alt-text="Message displayed in Bash terminal when installed Terraform version is not the most current version.":::

1. If you're fine working with the indicated version, skip to the next section. Otherwise, continue with the following steps. want to download a different version

1. Browse to the [Terraform downloads page](https://www.terraform.io/downloads.html).

1. Scroll down to the **Linux** download links.

1. Move your mouse over the **64-bit** link. This is the link for the latest 64-bit Linux AMD version, which is appropriate for Cloud Shell.

    :::image type="content" source="latest-terraform-version-for-linux-64-bit-amd.png" alt-text="Link to latest 64-bit Linux AMD version of Terraform.":::

1. Copy the URL.

1. Run `curl`, replacing the placeholder with the URL from the previous step.

    ```azurecli
    curl -O <terraform_download_url>
    ```

1. Unzip the file.

    ```azurecli
    unzip <zip_file_downloaded_in_previous_step>
    ```

1. If it doesn't exist, create a directory named `bin`.

    ```azurecli
    mkdir
    ```

1. Move the `terraform` file into the `bin` directory.

    ```azurecli
    mv terraform bin/    
    ```

1. Verify that the current version of Terraform is the downloaded version.

    ```azurecli
    terraform version
    ```

---


#### [Azure PowerShell](#tab/azure-powershell)

1. Verify the current version of Terraform.

    ```powershell
    terraform version
    ```

1. If the Terraform version installed in Cloud Shell isn't the latest version, you'll see information similar to the following:

    :::image type="content" source="media/install-configure/terraform-version-not-current-powershell" alt-text="Message displayed when installed Terraform version is not the most current version.":::

1. If you're fine working with the indicated version, skip to the next section. Otherwise, continue with the following steps. want to download a different version

1. Browse to the [Terraform downloads page](https://www.terraform.io/downloads.html).

1. Scroll down to the **Linux** download links.

1. Move your mouse over the **64-bit** link. This is the link for the latest 64-bit Linux AMD version, which is appropriate for Cloud Shell.

    :::image type="content" source="latest-terraform-version-for-linux-64-bit-amd.png" alt-text="Link to latest 64-bit Linux AMD version of Terraform.":::

1. Copy the URL.

1. Run `curl`, replacing the placeholder with the URL from the previous step.

    ```powershell
    curl -O <terraform_download_url>
    ```

1. Unzip the file.

    ```powershell
    unzip <zip_file_downloaded_in_previous_step>
    ```

1. If it doesn't exist, create a directory named `bin`.

    ```powershell
    mkdir
    ```

1. Move the `terraform` file into the `bin` directory.

    ```powershell
    mv terraform bin/    
    ```

1. Verify that the current version of Terraform is the downloaded version.

    ```powershell
    terraform version
    ```

---

## 3. Authenticate to Azure

Also, Terraform automatically uses information from the current Azure subscription. As a result, there's no installation or configuration required.

#### [Azure CLI](#tab/azure-cli)

Terraform supports several options for authenticating to Azure. The following options are covered in this article:

- [Option #1: Authenticate via Microsoft account](#option-1-authenticate-via-microsoft-account) - Recommended when using Terraform interactively.
- [Option #2: Authenticate via Azure service principal](#option-2-authenticate-via-azure-service-principal) - Recommended when using Terraform from code.

### Option #1: Authenticate via Microsoft account

Calling `az login` without any parameters displays a URL and a code. Browse to the URL, enter the code, and follow the instructions to authenticate to Azure using your Microsoft account. Once you're logged in, return to the portal.

```azurecli
az login
```

**Notes**:

- Upon successful login, `az login` displays a list of the Azure subscriptions associated with the logged-in Microsoft account.
- A list of properties displays for each available Azure subscription. The `isDefault` property identifies which Azure subscription you're using. To learn how to switch to another Azure subscription, see the section, [Set the current Azure subscription](#3-set-the-current-azure-subscription).

### Option #2: Authenticate via Azure service principal

**Create an Azure service principal**: To log into an Azure subscription using a service principal, you first need access to a service principal. If you already have a service principal, you can skip this part of the section.

Automated tools that deploy or use Azure services - such as Terraform - should always have restricted permissions. Instead of having applications log in as a fully privileged user, Azure offers service principals. But, what if you don't have a service principal with which to log in? In that scenario, you can log in using your user credentials and then create a service principal. Once the service principal is created, you can use its information for future login attempts.

There are many options when [creating a service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?). For this article, we'll create use [az ad sp create-for-rbac](/cli/azure/ad/sp?#az_ad_sp_create_for_rbac) to create a service principal with a **Contributor** role. The **Contributor** role (the default) has full permissions to read and write to an Azure account. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).

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

#### [Azure PowerShell](#tab/azure-powershell)

When using PowerShell and Terraform, you must log in using a service principal. The next two sections will illustrate the following tasks:

- [Create an Azure service principal](#create-an-azure-service-principal)
- [Log in to Azure using a service principal](#log-in-to-azure-using-a-service-principal)


### Create an Azure service principal

To log into an Azure subscription using a service principal, you first need access to a service principal. If you already have a service principal, you can skip this section.

1. Get the subscription ID for the Azure subscription you want to use.

    ```powershell
    $subId = (Get-AzContext).Subscription.id
    ```

1. Create a [PSCredential](/dotnet/api/system.management.automation.pscredential) object to define the service principal password. The password must meet various critera. Therefore, it's recommended to use a [GUID generator](http://www.guidgen.com) to generate a unique GUID to use as the password.

    ```powershell
    $credentials = New-Object Microsoft.Azure.Commands.ActiveDirectory.PSADPasswordCredential `
    -Property @{ StartDate=Get-Date; EndDate=Get-Date -Year 2024; Password='<password>'};
    ```

1. Create the service principal by calling [New-AzAdServiciePrincipal](/powershell/module/az.resources/new-azadserviceprincipal). Replace `<service_principal_name>` with the name you want to give the service principal.

    ```powershell
    $spSplat = @{
        DisplayName = '<service_principal_name>'
        PasswordCredential = $credentials
    }
    
    $sp = New-AzAdServicePrincipal @spSplat
    ```

1. Assign the **Contributor** role to the service principal.

    ```powershell
    $roleAssignmentSplat = @{
        ObjectId = $sp.id
        RoleDefinitionName = 'Contributor'
        Scope = "/subscriptions/$subId"
    }
    
    New-AzRoleAssignment @roleAssignmentSplat
    ```

**Notes**:

- The service principal password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/powershell/azure/create-azure-service-principal-azureps#reset-credentials).
- The **Contributor** role has full permissions to read and write to an Azure account. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).

### Log in to Azure using a service principal

1. 



---

## 4. Set the current Azure subscription

A Microsoft account can be associated with multiple Azure subscriptions. The following steps outline how you can switch between your subscriptions:

1. To view the current Azure subscription, use [az account show](/cli/azure/account#az_account_show).

    ```azurecli
    az account show
    ```

1. If you have access to multiple available Azure subscriptions, use [az account list](/cli/azure/account#az_account_list) to display a list of subscription name ID values:

    ```azurecli
    az account list --query "[].{name:name, subscriptionId:id}"
    ```

1. To use a specific Azure subscription for the current Cloud Shell session, use [az account set](/cli/azure/account#az_account_set). Replace the `<subscription_id>` placeholder with the ID (or name) of the subscription you want to use:

    ```azurecli
    az account set --subscription="<subscription_id>"
    ```

    **Notes**:

    - Calling `az account set` doesn't display the results of switching to the specified Azure subscription. However, you can use `az account show` to confirm that the current Azure subscription has changed.

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group using Teerraform](create-resource-group.md)