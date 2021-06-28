---
title: "4: Add MongoDB to Static web app API"
titleSuffix: Azure Developer Center
description: In this article, learn to add a MongoDB database to the Static web app's API. 
ms.topic: how-to
ms.date: 06/28/2021
ms.custom: devx-track-js
---

# Store custom app user information in MongoDB

In this article, learn to add a MongoDB database to the Static web app's API. Up to this point, the user information came from the Microsoft Identity platform using the MSAL.js libraries, or from Microsoft Graph. This article adds a common step of storing user information custom to the web app, that shouldn't be stored in the Identity account. 

To store this web app data, specific to a user, create a CosmosDB for the MongoDB API, and use that database with the mongoose.js npm package.  

## Create the CosmosDB resource for the MongoDB API

Use the VS Code extension, Azure Databases, to create the CosmosDB. 

1. In VS Code, select the Azure icon to open the Azure explorer.
1. From the Azure explorer, select **+** in the Azure Databases section.

    :::image type="content" source="../../../media/how-to-with-authentication-static-web-app-msal/vscode-create-azure-database.png" alt-text="A VS Code screenshot of the button to create a new CosmosDB.":::

1. Follow the prompts using the following table to understand how to create your **Azure CosmosDB** resource.

    |Prompt|Value|
    |--|--|
    |Select an Azure Database Server|Azure Cosmos DB for MongoDB API.|
    |Account name|Enter an account name, which will become part of the connection string, such as `cosmosdb-mongodb-api-YOUR-ALIAS`, replacing `YOUR-ALIAS` with your email or company alias. |
    |Select a capacity model.|For this simple, low-use tutorial, select **Serverless** [throughput](/azure/cosmos-db/throughput-serverless)|
    |Select a resource group for new resources.|Create a new resource group.|
    |Enter the name of the new resource group.|Accept the default value.| 
    |Select a location for new resources.|Select a location in your geographical area.|

## Secure database by limiting firewall access

1. In the Azure explorer, right-click the new database resource, and select **Open in portal**.
1. From the **Settings** section, select the **Firewall and virtual networks** menu item.
1. Select **Selected networks**, then select **+ Add my current IP**.
1. Select **Accept connections from within public Azure datacenters**. This will allow the Static web app, when it is created, to access your database.

    :::image type="content" source="../../../media/how-to-with-authentication-static-web-app-msal/azure-portal-cosmosdb-firewall-settings.png" alt-text="A screenshot of the Azure portal for a Cosmos DB resource's firewall settings.":::

1. Select **Save**. Your database is now only accessible to your workstation. 

    You can leave the browser open to the database resource. When you add database to your database, use the **Data Explorer** to see that data. 


## React client: Add page and form for new user input

Create a new file, `./src/pages/FavoriteColor.jsx`, and copy the following code into it to capture the user's favorite color. 

```javascript
import { useEffect, useState } from "react";
import { callOwnApiWithToken } from "../fetch";

export const FavoriteColor = ({ accessToken, endpoint, user, changeFunctionData }) => {

    const [color, setColor] = useState("");

    useEffect(() => {
            if(user && user.favoriteColor) {
                setColor(user.favoriteColor);
            }
    }, [user]);

    const onColorChange = (event) => {
        setColor(event.target.value);
    }

    const updateUserOnServer = async () => {
        const updateUser = await callOwnApiWithToken(accessToken, endpoint, {favoriteColor: color});
        changeFunctionData(updateUser);
    }

    const onFormSubmit = async (event) => {
        event.preventDefault();
        console.log('An color was submitted: ' + color);
        updateUserOnServer().then(response => setUserData(response)).catch(error => console.log(error));
    }

    return (
        <>
            <center>
                <form onSubmit={onFormSubmit}>
                    <input type="text" value={color} onChange={onColorChange} name="favoriteColor" placeholder="fav color?" />
                    <input type="submit" value="Submit" />
                </form>
            </center>
        </>
    );
}

```

## React client: Add FavoriteColor component to Function component

Add the FavoriteColor component to the Function component and hold the accessToken, returned from the MSAL SDK, in local state. 

1. Open the file, `./src/pages/Function.jsx`, and replace the code with the following code to include the new FavoriteColor component.

```javascript
import { useEffect, useState } from "react";
import { MsalAuthenticationTemplate, useMsal, useAccount } from "@azure/msal-react";
import { InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { loginRequest, protectedResources } from "../authConfig";
import { callOwnApiWithToken } from "../fetch";
import { FunctionData } from "../components/DataDisplay";
import { FavoriteColor } from "./FavoriteColor";

const FunctionContent = () => {
    /**
     * useMsal is hook that returns the PublicClientApplication instance, 
     * an array of all accounts currently signed in and an inProgress value 
     * that tells you what msal is currently doing. For more, visit: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const { instance, accounts, inProgress } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [functionData, setFunctionData] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        if (account && inProgress === "none" && !functionData) {
            instance.acquireTokenSilent({
                scopes: protectedResources.functionApi.scopes,
                account: account
            }).then((response) => {

                setAccessToken(response.accessToken);
                callOwnApiWithToken(response.accessToken, protectedResources.functionApi.endpoint)
                    .then(response => setFunctionData(response));
            }).catch((error) => {
                // in case if silent token acquisition fails, fallback to an interactive method
                if (error instanceof InteractionRequiredAuthError) {
                    if (account && inProgress === "none") {
                        instance.acquireTokenPopup({
                            scopes: protectedResources.functionApi.scopes,
                        }).then((response) => {
                            setAccessToken(response.accessToken);
                            callOwnApiWithToken(response.accessToken, protectedResources.functionApi.endpoint)
                                .then(response => setFunctionData(response));
                        }).catch(error => console.log(error));
                    }
                }
            });
        }
    }, [account, inProgress, instance]);
  
    const changeFunctionData = (data) =>{
        setFunctionData(data);
    }

    return (
        <>
            { functionData ? <FunctionData functionData={functionData} /> : null }

            <FavoriteColor 
            changeFunctionData={changeFunctionData} 
            accessToken={accessToken} 
            user={(functionData && functionData.response)? functionData.response: null} 
            endpoint={protectedResources.functionApi.endpoint}
            />
        </>
    );
};
export const Function = () => {
    const authRequest = {
        ...loginRequest
    };

    return (
        <MsalAuthenticationTemplate 
            interactionType={InteractionType.Redirect} 
            authenticationRequest={authRequest}
        >
            <FunctionContent />
        </MsalAuthenticationTemplate>
      )
};
```

## React client: Add new fetch method with favoriteColor

Open the file, `./src/fetch.js`, and replace the `callOwnApiWithToken` method at the bottom of the file with the following method.

```javascript
export const callOwnApiWithToken = async(accessToken, apiEndpoint, user) => {
    return fetch(apiEndpoint, {
        method: "POST",
        body: JSON.stringify({
            ssoToken: accessToken,
            user
        })
    }).then(response => response.json())
        .catch(error => console.log(error));
}
```

This method calls the Function API and passes user information specific to the web app, such as favoriteColor. 

## Function API: Adding mongoose files

The sample uses the mongoose npm package and the required schema and utility methods to insert, update, and find information in the Cosmos DB database. 

1. In VS Code, right-click the `API` directory from the file explorer, then select **Open in integrated terminal**. 
1. In the terminal, enter the following command to install the mongoose npm package. 

    ```bash
    npm install mongoose
    ```

1. Create a new mongoose schema file in the `API` directory named `user.model.js` and copy the following code into it:

    ```javascript
    const mongoose = require('mongoose');
    const validator = require('validator');

    const deleteAtPath = (obj, path, index) => {
        if (index === path.length - 1) {
            delete obj[path[index]];
            return;
        }
        deleteAtPath(obj[path[index]], path, index + 1);
    }
    const toJson = (schema) => {
        let transform;
        if (schema.options.toJSON && schema.options.toJSON.transform) {
            transform = schema.options.toJSON.transform;
        }

        schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
            transform(doc, ret, options) {
                Object.keys(schema.paths).forEach((path) => {
                    if (schema.paths[path].options && schema.paths[path].options.private) {
                        deleteAtPath(ret, path.split('.'), 0);
                    }
                });

                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                delete ret.createdAt;
                if (transform) {
                    return transform(doc, ret, options);
                }
            },
        });
    }

    const paginate = (schema) => {
        schema.statics.paginate = async function (filter, options) {
        let sort = '';
        if (options.sortBy) {
            const sortingCriteria = [];
            options.sortBy.split(',').forEach((sortOption) => {
            const [key, order] = sortOption.split(':');
            sortingCriteria.push((order === 'desc' ? '-' : '') + key);
            });
            sort = sortingCriteria.join(' ');
        } else {
            sort = 'createdAt';
        }
    
        const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
        const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
        const skip = (page - 1) * limit;
    
        const countPromise = this.countDocuments(filter).exec();
        let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);
    
        if (options.populate) {
            options.populate.split(',').forEach((populateOption) => {
            docsPromise = docsPromise.populate(
                populateOption
                .split('.')
                .reverse()
                .reduce((a, b) => ({ path: b, populate: a }))
            );
            });
        }
    
        docsPromise = docsPromise.exec();
    
        return Promise.all([countPromise, docsPromise]).then((values) => {
            const [totalResults, results] = values;
            const totalPages = Math.ceil(totalResults / limit);
            const result = {
            results,
            page,
            limit,
            totalPages,
            totalResults,
            };
            return Promise.resolve(result);
        });
        };
    };
    const userSchema = mongoose.Schema(
        {
            customAppId: {
                type: String,
                required: true,
                trim: true,
            },
            name: {
                type: String,
                required: true,
                trim: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
                trim: true,
                lowercase: true,
                validate(value) {
                    if (!validator.isEmail(value)) {
                        throw new Error('Invalid email');
                    }
                },
            },
            favoriteColor: {
                type: String,
                required: false,
                trim: true
            }
        },
        {
            timestamps: true,
        }
    );
    userSchema.plugin(toJson);
    userSchema.plugin(paginate);
    const User = mongoose.model('User', userSchema);
    module.exports = User;
    ```

1. Create a new file in the `API` directory named `user.service.js` and copy the following code into it. This file provides functionality the Function API's `index.js` calls to connect to the Cosmos DB with the mongoose SDK.

    ```javascript
    const mongoose = require('mongoose');
    const User = require('./user.model');

    let connected = false;
    let connection = null;

    const mongooseConfig = {
        url: process.env.MONGODB_URL,
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    }

    const connect = async () => {
        try {
            if (!connected && mongooseConfig && mongooseConfig.url && mongooseConfig.options) {

                // connect to DB
                connection = await mongoose.connect(mongooseConfig.url, mongooseConfig.options);
                connected = true;
                return connected;

            } else if (connected) {

                // already connected to DB
                console.log("Mongoose already connected");
                return connected;
            }
            else {
                // can't connect to DB
                throw Error("Mongoose URL needs to be added to Config settings as MONGODB_URL");
            }
        } catch (err) {
            console.log(`Mongoose connection error: ${err}`);
            throw Error({ name: "Sample-Mongoose", message: "connection error -" + error, status: 500 });
        }
    }
    const disconnect = () => {
        connection.disconnect();
    }

    const isConnected = () => {
        return connected;
    }

    const queryUsers = async (filter, options) => {
        const users = await User.paginate(filter, options);
        return users;
    }

    const getUserByEmail = async (email) => {
        if (email) {
            email = email.toLowerCase();
        }
        return await User.findOne({ email });
    }
    const upsertByEmail = async (email, mongodbUser) => {

        const query = { 'email': email };

        const tempUser = await User.findOneAndUpdate(query, mongodbUser, { upsert: true, new: true });
        return tempUser;

    }
    const getUserById = async (id) => {
        return await User.findById(id);
    };
    const deleteUserById = async (userId) => {

        const tempUser = await getUserById(userId);
        if (!tempUser) {
            throw new Error('User not found');
        }
        await User.remove();
        return tempUser;
    }

    module.exports = {
        connect,
        disconnect,
        isConnected,
        queryUsers,
        getUserById,
        getUserByEmail,
        upsertByEmail,
        deleteUserById
    }
    ```

## Function API: Update API to connect to database

Open the file, `./api/HelloUser/index.js`, and replace code with the following to capture the user's `favoriteColor` and the Active Directory's app's unique ID for the user, `customAppId`.

Do not change the `config` object at the top of the file. 

```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const msal = require('@azure/msal-node');
const fetch = require('node-fetch');
const UserService = require("../user.service");

// Before running the sample, you will need to replace the values in the .env file, 
const config = {
    auth: {
        clientId: process.env['CLIENT_ID'],
        authority: `https://login.microsoftonline.com/${process.env['TENANT_INFO']}`,
        clientSecret: process.env['CLIENT_SECRET'],
    }
};

// Create msal application object
const cca = new msal.ConfidentialClientApplication(config);

let aadAppUniqueUser=null;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
        // get ssoToken from client request
        const ssoToken = (req.body && req.body.ssoToken);
        if (!ssoToken) throw Error({ name: "Sample-Auth", message: "no ssoToken sent from client", "status": 401 });

        // get appUser from client request
        // this isn't passed in on first request
        const favoriteColor = (req.body && req.body.user && req.body.user.favoriteColor) ? req.body.user.favoriteColor : null;

        // validate client's ssoToken
        const isAuthorized = await validateAccessToken(ssoToken);
        if (!isAuthorized) throw Error({ name: "Sample-Auth", message: "can't validate access token", "status": 401 });

        // construct scope for API call - must match registered scopes
        const oboRequest = {
            oboAssertion: ssoToken,
            scopes: ['User.Read'],
        }

        // get token on behalf of user
        let response = await cca.acquireTokenOnBehalfOf(oboRequest);
        if (!response.accessToken) throw Error({ name: "Sample-Auth", message: "no access token acquired", "status": 401 });

        // call API on behalf of user
        let apiResponse = await callResourceAPI(response.accessToken, 'https://graph.microsoft.com/v1.0/me');
        if (!apiResponse) throw Error({ name: "Sample-Graph", message: "call to Graph failed", "status": 500 });

        // MongoDB (CosmosDB) connect
        const mongoDBConnected = await UserService.connect();
        if (!mongoDBConnected) throw Error({ name: "Sample-DBConnection", message: "couldn't connect to database", "status": 500 });

        let foundUser = await UserService.getUserByEmail(apiResponse.mail);

        let mongodbUser = {};
        let update = false;

        if (!foundUser) {
            // create user
            mongodbUser = {
                customAppId: aadAppUniqueUser.payload.sub,
                name: apiResponse.displayName || null,  //displayName from Graph is source of truth
                email: apiResponse.mail || null,        //email from Graph is the source of true
                favoriteColor: null
            };
            update = true;
        }
        else if (foundUser && favoriteColor){
            mongodbUser = {
                customAppId: aadAppUniqueUser.payload.sub,
                name: apiResponse.displayName || null,  //displayName from Graph is source of truth
                email: apiResponse.mail || null,        //email from Graph is the source of true
                favoriteColor: favoriteColor
            };
            update=true;
        } else {
            // don't update because user not passed into API
            console.log("nothing to update");
        }

        // Upsert to MongoDB (CosmosDB)
        if(update){
            foundUser = await UserService.upsertByEmail(apiResponse.mail, mongodbUser);
            if (!foundUser) throw Error({ name: "Sample-DBConnection", message: "no user returned from database", "status": 500 });
        }

        // Return to client
        return context.res = {
            status: 200,
            body: {
                response: foundUser.toJSON() || null,
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };

    } catch (error) {
        context.log(error);

        context.res = {
            status: error.status || 500,
            body: {
                response: error.message || JSON.stringify(error),
            }
        };
    }
}

/**
 * Makes an authorization bearer token request 
 * to given resource endpoint.
 */
callResourceAPI = async (newTokenValue, resourceURI) => {
    let options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${newTokenValue}`,
            'Content-type': 'application/json',
        },
    };

    let response = await fetch(resourceURI, options);
    let json = await response.json();
    return json;
}

/**
 * Validates the access token for signature 
 * and against a predefined set of claims
 */
validateAccessToken = async (accessToken) => {
    if (!accessToken || accessToken === "" || accessToken === "undefined") {
        console.log('No tokens found');
        return false;
    }

    // we will first decode to get kid parameter in header
    let decodedToken;

    try {
        decodedToken = jwt.decode(accessToken, { complete: true });
    } catch (error) {
        console.log('Token cannot be decoded');
        console.log(error);
        return false;
    }

    // obtains signing keys from discovery endpoint
    let keys;

    try {
        keys = await getSigningKeys(decodedToken.header);
    } catch (error) {
        console.log('Signing keys cannot be obtained');
        console.log(error);
        return false;
    }

    // verify the signature at header section using keys
    let verifiedToken;

    try {
        verifiedToken = jwt.verify(accessToken, keys);
    } catch (error) {
        console.log('Token cannot be verified');
        console.log(error);
        return false;
    }

    /**
     * Validates the token against issuer, audience, scope
     * and timestamp, though implementation and extent vary. For more information, visit:
     * https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validating-tokens
     */

    const now = Math.round((new Date()).getTime() / 1000); // in UNIX format

    const checkTimestamp = verifiedToken["iat"] <= now && verifiedToken["exp"] >= now ? true : false;
    const checkAudience = verifiedToken['aud'] === process.env['CLIENT_ID'] || verifiedToken['aud'] === 'api://' + process.env['CLIENT_ID'] ? true : false;
    const checkScope = verifiedToken['scp'] === process.env['EXPECTED_SCOPES'] ? true : false;
    const checkIssuer = verifiedToken['iss'].includes(process.env['TENANT_INFO']) ? true : false;

    if (checkTimestamp && checkAudience && checkScope && checkIssuer) {
        // capture decodedToken, because sub is user's unique ID
        // for the Active Directory app
        aadAppUniqueUser=decodedToken;
        return true;
    }
    return false;
}

/**
 * Fetches signing keys of an access token 
 * from the authority discovery endpoint
 */
getSigningKeys = async (header) => {
    // In single-tenant apps, discovery keys endpoint will be specific to your tenant
    const jwksUri = `https://login.microsoftonline.com/${process.env['TENANT_INFO']}/discovery/v2.0/keys`
    console.log(jwksUri);

    const client = jwksClient({
        jwksUri: jwksUri
    });

    return (await client.getSigningKeyAsync(header.kid)).getPublicKey();
};
```

## Function API: Update local.settings.json with your MongoDB connection string

1. In VS Code, select the Azure explorer, then right-click on your Cosmos DB resource and select **Copy Connection String**.
1. Open the file, `./api/local.settings.json`, and add a new property to the `Values` object and paste in your connection string. The following property is an example name/value pair:

    ```json
    "MONGODB_URL":"mongodb://YOUR-RESOURCE-NAME:..."
    ```

## Run the React client and Function API locally

1. Add a proxy to the React app to proxy to the Function API. Open the file, `./package.json` and add `"proxy": "http://localhost:7071",` just under the version property. 
1. Open an integrated terminal and run the React app with the following command:
   
   ```bash
   npm start
   ```

   This app starts on port 3000 and should open in a browser when the app is ready.

1. In VS Code, right-click the `api` directory and select **Open in Integrated Terminal** and run the following command:

   ```bash
   npm start
   ```

   This app starts on port 7071.

1. Use the app to sign into the app, and select **Function API** from the top menu. 

    The page connects to the Function API, gets the authenticated user's Graph information, then enters a user document into MongoDB including the following data: 

    ```JSON
    customAppId:    // user's unique ID for your Active Directory app
    name:           // user's name from Graph
    email:          // user's mail from Graph
    favoriteColor:  // user's favoriteColor send from React client form
    ```

    The `favoriteColor` will be null when you first come to the page. 

1. Enter your favorite color, such as `blue` or `green` and select the **Enter** button. 

    The page connects to the Function API, and adds the user's favoriteColor to the user's document.

1. In VS Code, select the Azure explorer, then right-click on the Cosmos DB resource, and select **Open in Portal**.
1. Go to the **Data Explorer** select the **test** catalog, then select the **users**. 
1. Select the **id** to see the user document is shown in the list.

## Design questions and issues

|Question|Answer|
|--|--|
|Why didn't you create a virtual network to secure the database?|This was a design decision to secure the database with the least amount of effort for this short-lived article series. If you plan to keep these resources for a longer duration, moving to a [virtual network](/azure/virtual-network/virtual-networks-overview) is the suggested security choice.| 

## Troubleshooting

|Question|Answer|
|--|--|
|I can't connect to the Cosmos DB database through the JavaScript code running locally on my workstation.|Verify your [local IP has been added to the database firewall.](#secure-database-by-limiting-firewall-access)| 

## Next steps

* [Deploy Static web app to Azure](./deploy-static-web-app-to-azure.md)
