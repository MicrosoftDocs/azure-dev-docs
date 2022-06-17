---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

```sql
SET aad_validate_oids_in_tenant = off;
CREATE ROLE <user-name> 
    WITH LOGIN PASSWORD '<application-id-of-system-assigned-managed-identity>'
    IN ROLE azure_ad_user;

```

The name you choose for *\<user-name>* should be different than the Azure Active Directory user that was set as admin when you created the PostgreSQL server. For example, set the user name to *webappuser*. This user name will be what you'll use as an App Service configuration setting in the next step.
