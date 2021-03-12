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
1. 
    :::code language="javascript" source="~/../js-e2e//database/mongodb/index_mongoose.js" :::
 
1. Replace `YOUR-CONNECTION-STRING` in the script with your resource connection string. 
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