---
ms.custom: devx-track-js
ms.topic: include
ms.date: 03/04/2021
---

## Install mongodb SDK 

To connect and use your mongoDB on Azure Cosmos DB with JavaScript and mongodb, use the following procedure.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir DataDemo && \
        cd DataDemo && \
        npm init -y && \
        npm install mongodb &&
        code .
    ```

    The command:
    * Creates a project folder named `DataDemo`
    * Changes the Bash terminal into that folder
    * Initializes the project, which creates the `package.json` file
    * Installs the SDK
    * Opens the project in Visual Studio Code

## Create JavaScript file to bulk insert data into MongoDB database

1. In Visual Studio Code, create a `bulk_insert.js` file.

1. Download the [MOCK_DATA.csv](https://github.com/Azure-Samples/js-e2e/blob/main/database/redis/MOCK_DATA.csv) file and place it in the same directory as `bulk_insert.js`.

1. Copy the following JavaScript code into `bulk_insert.js`:

    :::code language="javascript" source="~/../js-e2e//database/mongodb/bulk_insert_mongodb.js" :::

1. Replace the following in the script with your resource information:

    * YOUR_RESOURCE_PRIMARY_CONNECTION_STRING

1. Run the script.

    ```bash
    node bulk_insert.js
    ```

## Create JavaScript code to use MongoDB

1. In Visual Studio Code, create a `index.js` file.

1. Copy the following JavaScript code into `index.js`:

    :::code language="javascript" source="~/../js-e2e//database/mongodb/index_mongodb.js" :::

1. Replace the following in the script with your resource information:

    * YOUR_RESOURCE_PRIMARY_CONNECTION_STRING

1. Run the script.

    ```bash
    node index.js
    ```