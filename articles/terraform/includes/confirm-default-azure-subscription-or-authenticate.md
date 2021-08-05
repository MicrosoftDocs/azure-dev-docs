---
title: include file
description: include file
ms.topic: how-to
ms.date: 08/01/2021
ms.custom: devx-track-terraform
ms.author: tarcher
---

When you log in to the Azure portal with a Microsoft account, the default Azure subscription for that account is used.

Terraform automatically authenticates using information from the default Azure subscription.

Run [az account show](/cli/azure/account?#az_account_show) to verify the current Microsoft account and Azure subscription.

```azurecli
az account show
```

Any changes you make via Terraform will be against the displayed Azure subscription. If that's what you want, skip the rest of this article.
