---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

On the **Single server** page, fill out the form as follows:

1. **Resource group** &rarr; Select and use a name of *msdocs-web-app-rg*.

2. **Server name** &rarr; Enter a name such as *msdocs-web-app-postgres-database-\<unique-id>*. The name must be unique across Azure with the database server's URL `https://<server-name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`.

3. **Data source** &rarr; **None**

4. **Region** &rarr; Same Azure region used for the App Service.

5. **Version** &rarr; Keep the default (which is the latest version).

6. **Compute + storage** &rarr; Select **Configure server** to select a different Compute + storage plan, which is discussed below.

7. **Admin username** &rarr; Enter an admin username following the portal suggestion.

8. **Password** &rarr; Enter the admin password.

9. **Confirm password** &rarr;