---
title: include file
description: include file
ms.topic: how-to
ms.date: 07/24/2021
ms.custom: devx-track-terraform
ms.author: tarcher
---

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

1.  To use a specific Azure subscription for the current Cloud Shell session, use [az account set](/cli/azure/account#az_account_set). Replace the placeholder with the ID (or name) of the subscription you want to use:

```azurecli
az account set --subscription "<subscription_id_or_subscription_name>"
```

**Key points**:

- Calling `az account set` doesn't display the results of switching to the specified Azure subscription. However, you can use `az account show` to confirm that the current Azure subscription has changed.
- If you run the `az account list` command from the previous step, you see that the default Azure subscription has changed to the subscription you specified with `az account set`.
