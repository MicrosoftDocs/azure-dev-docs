---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---

In the *.vscode* folder of the sample app, edit the *settings.json* file for your database situation.

* The *settings.json* file defines what happens when you use the Docker extension UI and select **Run** or **Run Interactive**. There are templates for MongoDB local and MongoDB Azure.  Edit the file and for MongoDB local, specify "<YOUR-IP-ADDRESS>". For MongoDB Azure", specify "<CONNECTION_STRING>".  

* Both the database name and collection name are assumed to be "restaurants_reviews".
