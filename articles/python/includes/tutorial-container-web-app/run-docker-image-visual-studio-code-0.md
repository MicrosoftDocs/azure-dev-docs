---
ms.topic: include
ms.date: 10/09/2023
---

In the *.vscode* folder of the sample app, the *settings.json* file defines what happens when you use the Docker extension and select **Run** or **Run Interactive** from the context menu of a Tag. The *settings.json* file contains two templates each for the `(MongoDB local)` and `(Mongo DB Azure)` scenarios.</br></br>If you're using a local MongoDB database:

* Replace both instances of `<YOUR_IP_ADDRESS>` with your IP address.

* Replace both instances of `<CONNECTION_STRING>` with the connection string for your MongoDB database.

If you're using an Azure Cosmos DB for MongoDB database:

* Replace both instances of `<CONNECTION_STRING>` with the Azure Cosmos DB for MongoDB connection string.

Set the `docker.dockerPath` configuration setting used by the templates. To set `docker.dockerPath`, open the VS Code **Command Palette** (**Ctrl+Shift+P**), enter "Preferences: Open Workspace Settings", then enter "docker.dockerPath" in the **Search settings** box. Enter "docker" (without the quotes) for the value of the setting.

> [!NOTE]
> Both the database name and collection name are assumed to be `restaurants_reviews`.
