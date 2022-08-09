---
author: jessmjohnson
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

```sql
SET aad_validate_oids_in_tenant = off;
CREATE ROLE webappuser 
    WITH LOGIN PASSWORD '<application-id-of-system-assigned-managed-identity>'
    IN ROLE azure_ad_user;
```

You'll use the user name *webappuser* as an App Service configuration setting in the next step.
