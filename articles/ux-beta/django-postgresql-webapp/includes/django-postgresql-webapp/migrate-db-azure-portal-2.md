---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/21/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

In the console, run database migrations: <br />

```bash
python manage.py migrate
```
<br />

If you encounter any errors related to connecting to the database, check the values of the application settings created in [Connect the database](#connect-the-app-to-the-database).
