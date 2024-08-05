---
title: Include file
description: Include file
ms.topic: include
ms.date: 08/04/2024
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

Set the following environment variables. Replace the placeholders with the appropriate values from the previous section.

```cmd
set AZURE_SUBSCRIPTION_ID="<azure_subscription_id>"
set AZURE_TENANT_ID="<active_directory_tenant_id>"
set AZURE_CLIENT_ID="<service_principal_appid>"
set AZURE_CLIENT_SECRET="<service_principal_password>"
```

----
