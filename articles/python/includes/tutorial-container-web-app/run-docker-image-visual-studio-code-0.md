---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 08/03/2022
---

In the *\.vscode* folder of the sample app, edit the *settings.json* file for your database scenario.

* The *settings.json* file defines what happens when you use the Docker extension UI and select **Run** or **Run Interactive**. There are templates for the "MongoDB local" and "MongoDB Azure" scenarios.  Edit the file and for the "MongoDB local" setting, specify \<YOUR-IP-ADDRESS>. For the "MongoDB Azure" setting, specify \<CONNECTION_STRING>.  

* Both the database name and collection name are assumed to be "restaurants_reviews".
