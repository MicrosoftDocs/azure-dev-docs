---
ms.custom: devx-track-js
ms.topic: include
ms.date: 03/04/2021
---

## Install mongoose SDK 

To connect and use your mongoDB on Azure Cosmos DB with JavaScript and mongoose, use the following procedure.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir DataDemo && \
        cd DataDemo && \
        npm init -y && \
        npm install mongoose &&
        code .
    ```

    The command:
    * Creates a project folder named `DataDemo`
    * Changes the Bash terminal into that folder
    * Initializes the project, which creates the `package.json` file
    * Installs the SDK
    * Opens the project in Visual Studio Code

## Use mongoose SDK to connect to MongoDB on Azure

1. Copy the following JavaScript code into `index.js`:

    ```nodejs
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