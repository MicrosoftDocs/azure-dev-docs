---
author: jessmjohnson
ms.author: jejohn
ms.topic: include
ms.date: 08/17/2022
---

In the *.vscode* folder of the sample app, the *settings.json* file defines what happens when you use the Docker extension and select **Run** or **Run Interactive** from the context menu of a Tag.

The *settings.json* file contains two templates each for the "(MongoDB local)" and "(Mongo DB Azure)" scenarios.

* Replace both instances of <YOUR_IP_ADDRESS> with your IP address.
* Replace both instances of <CONNECTION_STRING> with the connection string for your MongoDB database.

Note - Both the database name and collection name are assumed to be "restaurants_reviews".
