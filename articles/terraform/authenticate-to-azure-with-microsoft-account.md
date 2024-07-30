---
title: Authenticate to Azure with a Microsoft account
description: Learn how to authenticate Terraform to Azure with a Microsoft account
keywords: azure devops terraform cli powershell authentication microsoft account subscription environment variables provider block
ms.topic: how-to
ms.date: 06/20/2024
ms.custom: devx-track-terraform
# Customer intent: I want to authenticate Terraform to Azure.
---

# Authenticate to Azure with a Microsoft account

A Microsoft account is a username (associated with an email and its credentials) that is used to sign in to Microsoft services - such as Azure. A Microsoft account can be associated with one or more Azure subscriptions, with one of those subscriptions being the default.

In this article, you learn how to:

> [!div class="checklist"]
> * Sign in to Azure interactively using a Microsoft account
> * List the account's associated Azure subscriptions (including the default)
> * Set the current subscription

## Steps to authenticate with Microsoft account

1. Open a command line that has access to the Azure CLI.

1. Run [az login](/cli/azure/account#az-login) without any parameters and follow the instructions to sign in to Azure.

    ```azurecli
    az login
    ```

    **Key points:**

    - Upon successful sign in, `az login` displays a list of the Azure subscriptions associated with the logged-in Microsoft account, including the default subscription.

1. To confirm the current Azure subscription, run [az account show](/cli/azure/account#az-account-show).

    ```azurecli
    az account show
    ```

1. To view all the Azure subscription names and IDs for a specific Microsoft account, run [az account list](/cli/azure/account#az-account-list). 

    ```azurecli
    az account list --query "[?user.name=='<microsoft_account_email>'].{Name:name, ID:id, Default:isDefault}" --output Table
    ```

    **Key points:**

    - Replace the `<microsoft_account_email>` placeholder with the Microsoft account email address whose Azure subscriptions you want to list.
    - With a Live account - such as a Hotmail or Outlook - you might need to specify the fully qualified email address. For example, if your email address is `admin@hotmail.com`, you might need to replace the placeholder with `live.com#admin@hotmail.com`.

1. To use a specific Azure subscription, run [az account set](/cli/azure/account#az-account-set).

    ```azurecli
    az account set --subscription "<subscription_id_or_subscription_name>"
    ```

    **Key points:**

    - Replace the `<subscription_id_or_subscription_name>` placeholder with the ID or name of the subscription you want to use.
    - Calling `az account set` doesn't display the results of switching to the specified Azure subscription. However, you can use `az account show` to confirm that the current Azure subscription has changed.
    - If you run the `az account list` command from the previous step, you see that the default Azure subscription has changed to the subscription you specified with `az account set`.

## Next steps

> [!div class="nextstepaction"]
> [Verify the results](./authenticate-to-azure.md#3-verify-the-results)
