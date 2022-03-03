---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/27/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

**Step 2.** In the SSH session, run the following commands (you can paste commands using **Ctrl**+**Shift**+**V**): <br/>

### [Flask](#tab/flask)

```bash
# Create database tables
flask db init
```

### [Django](#tab/django)

```bash
# Create database tables
python manage.py migrate
```

---

If you encounter any errors related to connecting to the database, check the values of the application settings created in the previous section.
