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

    ```nodejs
    const { MongoClient } = require('mongodb');
    const ObjectId = require('mongodb').ObjectID;
    require('dotenv').config();
    
    const fs = require('fs');
    const parse = require('csv-parser')
    const { finished } = require('stream/promises');
    
    const DATABASE_URL = process.env.DATABASE_URL
        ? process.env.YOUR_RESOURCE_PRIMARY_CONNECTION_STRING
        : 'mongodb://localhost:27017';
    const DATABASE_NAME = process.env.DATABASE_NAME || 'my-tutorial-db';
    const DATABASE_COLLECTION_NAME =
        process.env.DATABASE_COLLECTION_NAME || 'my-collection';
    
    let mongoConnection = null;
    let db = null;
    let collection = null;
    
    
    // insert each row into MongoDB
    const insertData = async (readable) =>{
        
        let i = 0;
        
        for await (const row of readable) {
            console.log(`${i++} = ${JSON.stringify(row.goodreads_book_id)}`);
            await collection.insertOne(row);
        }
    }
    const bulkInsert = async () => {
        
        mongoConnection = await MongoClient.connect(DATABASE_URL, { useUnifiedTopology: true });
        db = mongoConnection.db(DATABASE_NAME);
        collection = await db.collection(DATABASE_COLLECTION_NAME);
        
        // read file, parse CSV, each row is a chunk
        const readable = fs
        .createReadStream('./books.csv')
        .pipe(parse());
    
        // Pipe rows to insert function
        await insertData(readable)
        await mongoConnection.close();
    }
    
    bulkInsert().then(() => {
        console.log('done');
    
    }).catch(err => {
        console.log(`done +  failed ${err}`)
    })
    ```

1. Replace the following in the script with your Redis resource information:

    * YOUR_RESOURCE_PRIMARY_CONNECTION_STRING

1. Run the script.

    ```bash
    node bulk_insert.js
    ```

## Create JavaScript code to use MongoDB

1. In Visual Studio Code, create a `index.js` file.

1. Copy the following JavaScript code into `index.js`:

    ```nodejs
    const { MongoClient } = require('mongodb');
    const ObjectId = require('mongodb').ObjectID;
    
    // read .env file
    require('dotenv').config();
    
    /* eslint no-return-await: 0 */
    
    const DATABASE_URL = process.env.DATABASE_URL
        ? process.env.DATABASE_URL
        : 'mongodb://localhost:27017';
    const DATABASE_NAME = process.env.DATABASE_NAME || 'my-tutorial-db';
    const DATABASE_COLLECTION_NAME =
        process.env.DATABASE_COLLECTION_NAME || 'my-collection';
    
    let mongoConnection = null;
    let db = null;
    
    /* eslint no-console: 0 */
    console.log(`DB:${DATABASE_URL}`);
    
    const insertDocuments = async (
        documents = [{ a: 1 }, { a: 2 }, { a: 3 }]
    ) => {
        // check params
        if (!db || !documents)
            throw Error('insertDocuments::missing required params');
    
        // Get the collection
        const collection = await db.collection(DATABASE_COLLECTION_NAME);
    
        // Insert some documents
        return await collection.insertMany(documents);
    };
    const findDocuments = async (
        query = { a: 3 }
    ) => {
        
        // check params
        if (!db)
            throw Error('findDocuments::missing required params');
    
        // Get the collection
        const collection = await db.collection(DATABASE_COLLECTION_NAME );
    
        // find documents
        return await collection.find(query).toArray();
    };
    
    const removeDocuments = async (
        docFilter = {}
    ) => {
        
        // check params
        if (!db )
            throw Error('removeDocuments::missing required params');
    
        // Get the documents collection
        const collection = await db.collection(DATABASE_COLLECTION_NAME);
    
        // Delete document
        return await collection.deleteMany(docFilter);
    };
    
    const connect = async (url) => {
        
        // check params
        if (!url) throw Error('connect::missing required params');
    
        return MongoClient.connect(url, { useUnifiedTopology: true });
    };
    /* 
    eslint consistent-return: [0, { "treatUndefinedAsUnspecified": false }]
    */
    const connectToDatabase = async () => {
        try {
            if (!DATABASE_URL || !DATABASE_NAME) {
                console.log('DB required params are missing');
                console.log(`DB required params DATABASE_URL = ${DATABASE_URL}`);
                console.log(`DB required params DATABASE_NAME = ${DATABASE_NAME}`);
            }
    
            mongoConnection = await connect(DATABASE_URL);
            db = mongoConnection.db(DATABASE_NAME);
    
            console.log(`DB connected = ${!!db}`);
            
            return !!db;
    
        } catch (err) {
            console.log('DB not connected - err');
            console.log(err);
        }
    };
    module.exports = {
        insertDocuments,
        findDocuments,
        removeDocuments,
        ObjectId,
        connectToDatabase
    };
    ```nodejs

1. Replace the following in the script with your Redis resource information:

    * YOUR-RESOURCE-NAME
    * YOUR-RESOURCE-PASSWORD

1. Run the script.

    ```bash
    node index.js
    ```