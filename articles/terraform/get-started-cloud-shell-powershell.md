---
title: Quickstart - Configure Terraform in Azure Cloud Shell with PowerShell
description: In this quickstart, you learn how to configure Terraform in Azure Cloud Shell with PowerShell
keywords: terraform azure cli devops install configure portal interactive login rbac service principal automated script
ms.topic: quickstart
ms.date: 05/04/2021
ms.custom: devx-track-terraform
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want configure Terraform in Azure Cloud Shell using the PowerShell environment.
---

# Quickstart: Configure Terraform in Azure Cloud Shell with PowerShell
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article shows how to get started with [Terraform on Azure](https://www.terraform.io/docs/providers/azurerm/index.html) using Cloud Shell and PowerShell.

In this article, you learn how to:
> [!div class="checklist"]
> * Configure Cloud Shell
> * Authenticate to Azure using a Microsoft account
> * Switch from the default Azure subscription
> * Create a service principal
> * Authenticate using a service principal
> * Install the latest version of Terraform in Cloud Shell

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 1. Configure Cloud Shell

1. Browse to the [Azure portal](https://portal.azure.com).

1. Open Cloud Shell.

    :::image type="content" source="media/install-configure/portal-cloud-shell.png" alt-text="Open Cloud Shell from the top menu in the Azure portal.":::

1. If you haven't previously used Cloud Shell, configure the environment and storage settings.

1. Select the PowerShell environment.

    :::image type="content" source="media/install-configure/choose-cloudshell-cli.png" alt-text="Select the CLI you want to use in Cloud Shell.":::

## 2. Authenticate to Azure

When you log in to the Azure portal with a Microsoft account, you automatically use the default Azure subscription for that account.

Terraform automatically uses information from the default Azure subscription.

1. Run [Get-AzContext](/powershell/module/az.accounts/get-azcontext) to verify the current Microsoft account and Azure subscription.

1. If want to use the displayed default subscription, you can skip the rest of this section.

1. To authenticate using a different Microsoft account, run []().



















When in PowerShell and Terraform, you must log in using a service principal. The next two sections will illustrate the following tasks:

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

## 3. Install the latest version of Terraform

Cloud Shell automatically updates to the latest version of Terraform within a couple of weeks of each release. However, if you need the most recent version sooner, this section shows you how download and install that latest version of Terraform.

#### [Azure CLI](#tab/install-latest-version-azure-cli)

1. Verify the current version of Terraform.

    ```azurecli
    terraform version
    ```

1. If the Terraform version installed in Cloud Shell isn't the latest version, you'll see information similar to the following:

    :::image type="content" source="media/install-configure/terraform-version-not-current-bash.png" alt-text="Message displayed in Bash terminal when installed Terraform version is not the most current version.":::
                                                            
1. If you're fine working with the indicated version, skip to the next section. Otherwise, continue with the following steps. want to download a different version

1. Browse to the [Terraform downloads page](https://www.terraform.io/downloads.html).

1. Scroll down to the **Linux** download links.

1. Move your mouse over the **64-bit** link. This is the link for the latest 64-bit Linux AMD version, which is appropriate for Cloud Shell.

    :::image type="content" source="media/latest-terraform-version-for-linux-64-bit-amd.png" alt-text="Link to latest 64-bit Linux AMD version of Terraform.":::

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

#### [Azure PowerShell](#tab/install-latest-version-azure-powershell)

1. Verify the current version of Terraform.

    ```powershell
    terraform version
    ```

1. If the Terraform version installed in Cloud Shell isn't the latest version, you'll see information similar to the following:

    :::image type="content" source="media/install-configure/terraform-version-not-current-powershell.png" alt-text="Message displayed when installed Terraform version is not the most current version.":::

1. If you're fine working with the indicated version, skip to the next section. Otherwise, continue with the following steps. want to download a different version

1. Browse to the [Terraform downloads page](https://www.terraform.io/downloads.html).

1. Scroll down to the **Linux** download links.

1. Move your mouse over the **64-bit** link. This is the link for the latest 64-bit Linux AMD version, which is appropriate for Cloud Shell.

    :::image type="content" source="media/latest-terraform-version-for-linux-64-bit-amd.png" alt-text="Link to latest 64-bit Linux AMD version of Terraform.":::

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

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group using Teerraform](create-resource-group.md)