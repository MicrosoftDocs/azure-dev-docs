---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

Create application settings.

Use the **New application setting** button to create settings for each of the following values (which are expected by the djangoapp sample):

* *DBHOST* &rarr; Use the server name you used earlier when created the database, for example, (msdocs-tutorial-django-postgresql-db-\<unique id>*.
The code in azuresite/production.py automatically appends .postgres.database.azure.com to create the full Postgres server URL.
* *DBNAME* &rarr;  Enter `restaurant`, the name of the application database.
* *DBUSER* &rarr; The administrator user name used when you provisioned the database.
* *DBPASS* &rarr; The administrator **secure password** you created earlier.

Select **Save** and then **Continue** to apply the settings.
