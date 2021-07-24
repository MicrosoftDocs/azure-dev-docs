---
title: Authenticate Terraform to Azure with a Microsoft Account
description: In this article, you learn how to authenticate to Azure with a Microsoft Account
keywords: azure devops terraform cli powershell interactive authentication microsoft account subscription
ms.topic: how-to
ms.date: 07/20/2021
ms.custom: devx-track-terraform
# Customer intent: I want to authenticate interactively to Azure using a Microsoft account.
---

# Authenticate to Azure with a Microsoft Account
 
This article shows how to authenticate to Azure using a Microsoft account using either the default Azure subscription or switching to another Azure subscription.

The techniques illustrated in this article are how you generally authenticate interactively. For information on authenticating from a script, see [Authenticate Terraform to Azure using a service principal](authenticate-script.md).

In this article, you learn how to:
> [!div class="checklist"]
> * Configure Cloud Shell
> * Authenticate to Azure using a Microsoft account
> * Switch from the default Azure subscription

> [!IMPORTANT]
> When using Terraform with PowerShell, you must log in using a service principal. For information on how to authenticate to Azure using a service principal, see [Authenticate Terraform to Azure using a service principal](authenticate-script.md).

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## 1. Open Cloud Shell

[!INCLUDE [open-cloud-shell.md](../includes/open-cloud-shell.md)]

## 2. Log in to Azure using a Microsoft account

1. Run [az login](/cli/azure/account#az_login) without any parameters and follow the instructions to log in to Azure.

    ```azurecli
    az login
    ```
    
1. Upon successful login, `az login` displays a list of the Azure subscriptions associated with the logged-in Microsoft account, including the default subscription. You can also view the Azure subscription names and IDs for a specific Microsoft account by running [az account list](/cli/azure/account#az_account_list). Replace the `<microsoft_account_email>` placeholder with the Microsoft account email address whose Azure subscriptions you want to list.

    ```azurecli
    az account list --query "[?user.name=='<microsoft_account_email>'].{Name:name, ID:id, Default:isDefault}" --output Table
    ```

    **Key points**:

    - With a Live account - such as a hotmail or outlook - you might need to specify the fully qualified email address. For example, if your email address is `admin@hotmail.com`, you might need to replace the placeholder with `live.com#admin@hotmail.com`.

1.  If you want to use the default Azure subscription, skip the rest of this article. If you want to use one of the non-default Azure subscriptions, continue to the next section.

## 3. Switch from the default Azure subscription

To use a specific Azure subscription for the current Cloud Shell session, use [az account set](/cli/azure/account#az_account_set). Replace the placeholder with the ID (or name) of the subscription you want to use:

```azurecli
az account set --subscription "<subscription_id_or_subscription_name>"
```

**Key points**:

- Calling `az account set` doesn't display the results of switching to the specified Azure subscription. However, you can use `az account show` to confirm that the current Azure subscription has changed.
- If you run the `az account list` command from the previous step, you see that the default Azure subscription has changed to the subscription you specified with `az account set`.

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group using Terraform](create-resource-group.md)