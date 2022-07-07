---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---

### [Local MongoDB](#tab/mongodb-local)

**Step 1:** Check that [MongoDB](https://www.mongodb.com/docs/manual/installation/)  installed.

```
mongo --version
```

**Step 2:** Edit the `mongod.cfg` file to add current IP address.

The [mongod configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/) has a `bindIp` key that defines hostnames and IP addresses that MongoDB listens for client connections. Add the current IP of your local development computer. The sample app running locally in a Docker container will communicate to the host machine with this address as configured in the next step.

For example, part of the configuration file will look like this.
```
net:
  port: 27017
  bindIp: 127.0.0.1,<local-ip-address>
```

Restart MongoDB to pick up the changes. The local MongoDB connection string is `mongodb://127.0.0.1:27017/`. 

**Step 3:** Create a database and collection in that database.

Set the database name to "sample_db" and the collection name to "sample_coll". You can use the VS Code [MongoDB extension](https://code.visualstudio.com/docs/azure/mongodb), the [MonogoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/), or any other MondoDB-aware tool.

For the MongoDB shell, here are examples of commands to create the database and collection:

```
> help
> use sample_db
> db.sample_coll.insertOne()
> show dbs
> exit
```

### [Azure Cosmos DB MongoDB](#tab/mongodb-azure)

**Step 1:** Get connection information from an existing MongoDB database.

You can create an Azure Cosmos DB for MongoDB with [Azure portal](/azure/cosmos-db/mongodb/create-mongodb-python), [Azure CLI](/azure/cosmos-db/scripts/cli/mongodb/create), [PowerShell](/azure/cosmos-db/scripts/powershell/mongodb/create), or [VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb). 

For the steps below, you'll need a connection string, a database name, and a collection name to use.

**Step 2:** Create or ensure that a database and collection exists in the database.

Set the database name to "sample_db" and the collection name to "sample_coll". You can do this using the [Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/quickstart) and the Azure CLI. For more information, see [Create a database and collection for MongoDB for Azure Cosmos DB using Azure CLI](/azure/cosmos-db/scripts/cli/mongodb/create).

----
