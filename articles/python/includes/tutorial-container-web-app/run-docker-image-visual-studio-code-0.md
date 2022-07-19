---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---

In the *.vscode* folder of the sample apps, edit the *tasks.json* and *settings.json* file for your situation.

* The *settings.json* file is used to define what happens when you use with the Docker extension UI and select **Run** or **Run Interactive**. There are templates for MongoDB local and MongoDB Azure.  Edit the file and for MongoDB local, specify "<YOUR-IP-ADDRESS>". For MongoDB Azure", specify "<CONNECTION_STRING>".  

* Both the database name and collection name are assumed to be "restaurants_reviews".
