---
title: Include file
description: Include file
ms.topic: include
ms.date: 08/10/2021
---

Using your Azure authentication information, set the appropriate environment variables so that your code can authenticate to Azure.

#### [Bash](#tab/bash)

Set the following environment variables. Replace the placeholders with the appropriate values from the previous section.

```bash
export AZURE_SUBSCRIPTION_ID="<azure_subscription_id>"
export AZURE_TENANT_ID="<active_directory_tenant_id>"
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_SECRET="<service_principal_password>"
```

#### [Windows](#tab/windows)

Add the following environment variables to your Windows system with their appropriate values from the previous section.

- AZURE_SUBSCRIPTION_ID
- AZURE_TENANT_ID
- AZURE_CLIENT_ID
- AZURE_CLIENT_SECRET

----
