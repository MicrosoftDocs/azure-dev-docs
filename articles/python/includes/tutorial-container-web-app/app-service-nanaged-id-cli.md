---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/12/2022
---

**Step 1.** Set the service to use managed identity.

```bash
az webapp config set -g $RESOURCE_GROUP -n $SITE_NAME \
  --generic-configurations '{"acrUseManagedIdentityCreds": true}'
```

**Step 2.** Confirm setting.

```bash
az webapp config show -g $RESOURCE_GROUP -n $SITE_NAME 
```
