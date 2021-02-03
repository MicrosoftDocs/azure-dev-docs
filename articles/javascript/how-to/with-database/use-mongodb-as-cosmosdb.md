---
title: Use JavaScript on Azure Cosmos DB with MongoDB
description: To create or move your mongoDB database to Azure, you need a Cosmos DB resource. 
ms.topic: how-to
ms.date: 02/02/2021
ms.custom: devx-track-js
---

# Develop a JavaScript application with MongoDB on Azure

To create, move, or use a mongoDB database to Azure, you need a Cosmos DB resource. Learn how to create the resource and use your database.

## Create a Cosmos DB resource for a MongoDB database

You can create a resource with:

* Azure CLI
* [Azure portal](https://portal.azure.com)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-mongodb.md)]

## View and use your mongoDB on Azure CosmosDB

While developing your mongoDB database with JavaScript, use [Cosmos explorer](https://cosmos.azure.com/) to work with your database. 

:::image type="content" source="../../media/howto-database/cosmos-explorer.png" alt-text="Use the Cosmos explorer, found at https://cosmos.azure.com/, to view and work with your mongoDB database.":::


The Cosmos explorer is also available in the Azure portal, for your resource, as the **Data Explorer**.


:::image type="content" source="../../media/howto-database/cosmos-explorer-azure-portal.png" alt-text="The Cosmos explorer is also available in the Azure portal, for your resource, as the `Data Explorer`.":::

## Use native SDK packages to connect to MongoDB on Azure

The mongoDB database on Cosmos DB uses npm packages already available, such as:

* [mongoose](https://www.npmjs.com/package/mongoose)
* [mongodb](https://www.npmjs.com/package/mongodb)

## Use mongoose SDK to connect to MongoDB on Azure

To connect and use your mongoDB on Azure Cosmos DB with JavaScript and mongoose, use the following procedure.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir mongooseDemo && \
        cd mongooseDemo && \
        npm init -y && \
        npm install mongoose && \
        touch index.js && \
        code .
    ```

    The command:
    * creates a project folder named `mongooseDemo`
    * changes the Bash terminal into that folder
    * initializes the project, which creates the `package.json` file
    * creates the `index.js` script file
    * opens the project in Visual Studio Code

1. Copy the following JavaScript code into `index.js`:

    ```nodejs
    // install mongoose SDK
    // run at command line
    // npm install mongoose

    // get mongoose SDK
    const mongoose = require("mongoose");

    const run = async () => {
      // connect to mongoose
      await mongoose.connect(
        "YOUR-CONNECTION-STRING",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
        }
      );

      // define a schema
      const Schema = mongoose.Schema;
      const ObjectId = Schema.ObjectId;

      const JobSchema = new Schema({
        id: ObjectId,
        name: String,
        job: String,
      });

      // Create model for database collection `Job`
      const JobModel = mongoose.model("Job", JobSchema);

      // Add data to doc and save
      const doc1 = new JobModel();
      doc1.name = "Joan Smith";
      doc1.job = "Developer";
      await doc1.save();

      const doc2 = new JobModel();
      doc2.name = "Bob Jones";
      doc2.job = "Quality Assurance";
      await doc2.save();

      const doc3 = new JobModel();
      doc3.name = "Michelle Roberts";
      doc3.job = "Program Manager";
      await doc3.save();

      // find all docs in collection
      console.log("find all");
      const jobs = await JobModel.find({});

      //iterate over docs
      for (var job of jobs) {
        console.log(`loop ` + JSON.stringify(job));
      }

      // close connection
      mongoose.connection.close();

      return "succeeded";
    };

    run()
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });
    ```
 
1. Replace `YOUR-CONNECTION-STRING` in the script with your Cosmos DB your connection string. 
1. Run the script.

    ```bash
    node index.js
    ```

    The results are:

    ```console
    find all
    loop {"_id":"6019a68a6ecddc35d536c92c","name":"Joan Smith","job":"Developer","__v":0}
    loop {"_id":"6019a68e6ecddc35d536c92d","name":"Bob Jones","job":"Quality Assurance","__v":0}
    loop {"_id":"6019a6916ecddc35d536c92e","name":"Michelle Roberts","job":"Program Manager","__v":0}
    succeeded
    ```

## Next steps

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Cosmos DB for mongoDB documentation](/azure/cosmos-db/mongodb-introduction)
* [Cosmos DB for mongoDB quickstart](/azure/cosmos-db/create-mongodb-nodejs)
* [Migration guide to move to Cosmos DB for mongoDB](/azure/cosmos-db/mongodb-pre-migration)