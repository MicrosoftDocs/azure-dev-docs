---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/28/2022
---

In the *.vscode* folder, edit the *tasks.json* and *settings.json* file to include connection information.

* The Docker extension tasks in *tasks.json* are called when your run or debug. What task is called depends on what launch configuration you have set. The sample apps have two configurations, "Docker: Python (MongoDB local)" and "Docker: Python (MongoDB Azure)". In the *tasks.json* file find the case that matches your situation and fill the task info. For "Docker: Python (MongoDB local)" specify "\<YOUR-IP-ADDRESS>". For "Docker: Python (MongoDB Azure)", specify "\<CONNECTION_STRING>", "\<DB_NAME>", and "\<COLLECTION_NAME>".

* The *settings.json* file is used to define what happens when you work with the Docker extension UI and select **Run** or **Run Interactive**. Similar to *tasks.json*, there are templates for MongoDB local and MongoDB Azure. For MongoDB local, specify "\<YOUR-IP-ADDRESS>". For MongoDB Azure", specify "\<CONNECTION_STRING>", "\<DB_NAME>", and "\<COLLECTION_NAME>".
