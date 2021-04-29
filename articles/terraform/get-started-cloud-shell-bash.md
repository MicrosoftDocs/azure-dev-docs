---
title: Quickstart - Configure Terraform in Azure Cloud Shell using Bash
description: In this quickstart, you learn how to configure Terraform in Azure Cloud Shell using Bash
keywords: terraform azure cli devops install configure portal interactive login rbac service principal automated script
ms.topic: quickstart
ms.date: 04/28/2021
ms.custom: devx-track-terraform
adobe-target: true
# Customer intent: As someone new to Terraform and Azure, I want configure Terraform in Azure Cloud Shell using the Bash environment.
---

# Quickstart: Configure Terraform in Azure Cloud Shell using Bash
 
[!INCLUDE [terraform-intro.md](includes/terraform-intro.md)]

This article shows how to get started with [Terraform on Azure](https://www.terraform.io/docs/providers/azurerm/index.html) using Cloud Shell and Bash.

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

1. Select the Bash environment.

    :::image type="content" source="media/install-configure/choose-cloudshell-cli.png" alt-text="Select the CLI you want to use in Cloud Shell.":::

## 2. Authenticate to Azure

When you log in to the Azure portal with a Microsoft account, you automatically use the default Azure subscription for that account.

Terraform automatically uses information from the default Azure subscription.

Run [az account show](/cli/azure/account?#az_account_show) to verify the current Microsoft account and Azure subscription.

```azurecli
az account show
```

If want to use the displayed default subscription, you can skip the rest of this section.

If you want to authenticate using either a different Microsoft account or Azure subscription, this rest of this section shows you how.

Terraform supports several options for authenticating to Azure. The following options are covered:

- [Option #1: Authenticate via a Microsoft account](#option-1-authenticate-via-a-microsoft-account) - Recommended when using Terraform interactively.
- [Option #2: Authenticate via an Azure service principal](#option-2-authenticate-with-an-azure-service-principal) - Recommended when using Terraform from code.

### Option #1: Authenticate via a Microsoft account

1. Run [az login](/cli/azure/account#az_login) without any parameters and follow the instructions to log in to Azure.

    ```azurecli
    az login
    ```
    
1. Upon successful login, `az login` displays a list of the Azure subscriptions associated with the logged-in Microsoft account, including the default subscription. If you want to use the default Azure subscription, skip the rest of this section. If you want to use one of the non-default Azure subscriptions, continue to the next step.

1. To view the Azure subscription names and IDs for a specific Microsoft account, run the following command. Replace the placeholder with the Microsoft account email address whose Azure subscriptions you want to list.

    ```azurecli
    az account list --query "[?user.name=='<microsoft_account_email>'].{Name:name, ID:id}" --output Table
    ```

1. To use a specific Azure subscription for the current Cloud Shell session, use [az account set](/cli/azure/account#az_account_set). Replace the placeholder with the ID (or name) of the subscription you want to use:

    ```azurecli
    az account set --subscription="<subscription_id_or_subscription_name>"
    ```

    **Notes**:

    - Calling `az account set` doesn't display the results of switching to the specified Azure subscription. However, you can use `az account show` to confirm that the current Azure subscription has changed.

### Option #2: Authenticate with an Azure service principal

There are two steps to authenticate with an Azure service principal:

- [Step 1: Create an Azure service principal](#step-1-create-an-azure-service-principal)
- [Step 2: Log in using an Azure service principal](#step-2-log-in-using-an-azure-service-principal)

#### Step 1: Create an Azure service principal

To log into an Azure subscription using a service principal, you first need access to a service principal. If you already have a service principal you want to use, you can skip to [Step 2: Log in using an Azure service principal](#step-2-log-in-using-an-azure-service-principal).

Automated tools that deploy or use Azure services - such as Terraform - should always have restricted permissions. Instead of having applications log in as a fully privileged user, Azure offers service principals. But, what if you don't have a service principal with which to log in? In that scenario, you can log in using your user credentials and then create a service principal. Once the service principal is created, you can use the service principal for future logins.

There are many options when [creating a service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?). For this article, we'll create use [az ad sp create-for-rbac](/cli/azure/ad/sp?#az_ad_sp_create_for_rbac) to create a service principal with a **Contributor** role. The **Contributor** role (the default) has full permissions to read and write to an Azure account. For more information about Role-Based Access Control (RBAC) and roles, see [RBAC: Built-in roles](/azure/active-directory/role-based-access-built-in-roles).

Replace the placeholders as appropriate for your environment.

```azurecli
az ad sp create-for-rbac --name <service_principal_name> --role="Contributor" --scopes="/subscriptions/<azure_subscription_id>"
```

**Notes**:

- Upon successful completion, `az ad sp create-for-rbac` displays several values. The `appId`, `password`, and `tenant` values are used in the next step.
- The password can't be retrieved if lost. As such, you should store your password in a safe place. If you forget your password, you'll need to [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).

#### Step 2: Log in using an Azure service principal

Run [az login](/cli/azure/account#az_login), replacing the placeholders with the information from your service principal and Azure subscription.

```azurecli
az login --service-principal -u "<service_principal_appid>" -p "<service_principal_password" --tenant "subscription_tenant_id"
```

## 3. Install the latest version of Terraform

Cloud Shell automatically updates to the latest version of Terraform within a couple of weeks of its release. However, if you need the most recent version sooner, this section shows you how to download and install the current version of Terraform.

1. Determine the version of Terraform being used in Cloud Shell.

    ```bash
    terraform version
    ```

1. If the Terraform version installed in Cloud Shell isn't the latest version, you'll see information similar to the following:

    :::image type="content" source="media/install-configure/terraform-version-not-current-bash.png" alt-text="Message displayed in Bash terminal when installed Terraform version is not the current version.":::

1. If you're fine working with the indicated version, skip to the next section. Otherwise, continue with the following steps.

1. Browse to the [Terraform downloads page](https://www.terraform.io/downloads.html).

1. Scroll down to the **Linux** download links.

1. Move your mouse over the **64-bit** link. This is the link for the latest 64-bit Linux AMD version, which is appropriate for Cloud Shell.

    :::image type="content" source="media/install-configure/latest-terraform-version-for-linux-64-bit-amd.png" alt-text="Link to latest 64-bit Linux AMD version of Terraform.":::

1. Copy the URL.

1. Run `curl`, replacing the placeholder with the URL from the previous step.

    ```bash
    curl -O <terraform_download_url>
    ```

1. Unzip the file.

    ```bash
    unzip <zip_file_downloaded_in_previous_step>
    ```

1. If the directory doesn't exist, create a directory named `bin`.

    ```bash
    mkdir bin
    ```

1. Move the `terraform` file into the `bin` directory.

    ```bash
    mv terraform bin/    
    ```

1. Verify that the downloaded version of Terraform is first in the path.

    ```bash
    terraform version
    ```

    :::image type="content" source="media/install-configure/terraform-version-is-latest-version-bash.png" alt-text="Output in Bash when the current version of Terraform is current.":::

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group using Terraform](create-resource-group.md)