---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/20/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

**Step 2.** Use the **New application setting** button to create settings for each of the following values (which are expected by the djangoapp sample):

| Setting | Value | Description |
| --- | --- | --- |
| DBHOST | msdocs-django-postgres-webapp-db | The URL of the database server from the previous section; that is, the `<server-name>.postgres.database.azure.com`. |
| DBNAME | `pollsdb` | Name of application database. |
| DBUSER | demoadmin | The administrator user name used when you provisioned the database. |
| DBPASS | **secure password**| The administrator password you created earlier. |

<br />

**Step 3.**  Select **Save** and then **Continue** to apply the settings.
