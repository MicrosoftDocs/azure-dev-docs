---
ms.author: jkodroff
ms.topic: include
ms.date: 12/30/2022
ms.custom: devx-track-pulumi
---

When you log in to the Azure portal with a Microsoft account, the default Azure subscription for that account is used.

Pulumi automatically authenticates using information from the default Azure subscription.

Run [az account show](/cli/azure/account?#az-account-show) to verify the current Microsoft account and Azure subscription.

```azurecli
az account show
```

Any changes you make via Pulumi will be against the displayed Azure subscription. If that's what you want, skip the rest of this article.
