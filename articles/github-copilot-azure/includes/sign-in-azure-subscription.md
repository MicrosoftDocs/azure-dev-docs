---
author: rotabor
ms.service: github-copilot-for-azure
ms.topic: include
ms.date: 05/18/2026
---

If you work with multiple tenants and subscriptions, make sure you're signed in to the correct one:

```text
How do I log into my Azure tenant and choose an Azure subscription I want to work with?
```

GitHub Copilot responds with steps similar to:

1. Open a terminal.
1. Sign in to Azure: `az login`
1. List available subscriptions: `az account list --output table`
1. Set the subscription: `az account set --subscription "SUBSCRIPTION_NAME_OR_ID"`

Follow these instructions. If you're ever unsure about which tenant and subscription you're working with, you can ask:

```text
Which tenant and subscription am I working with?
```

When agent mode asks to execute a terminal command, select **Continue** or **Always allow** to let it proceed.
