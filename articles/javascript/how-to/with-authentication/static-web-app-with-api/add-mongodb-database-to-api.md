---
title: "4: Add MongoDB to Static web app API"
titleSuffix: Azure Developer Center
description: In this article, learn to add a MongoDB database to the Static web app's API. 
ms.topic: how-to
ms.date: 06/28/2021
ms.custom: devx-track-js
---

# Store custom app user information in MongoDB

In this article, learn to add a MongoDB database to the Static web app's API. Up to this point, the user information came from the Microsoft Identity platform using the MSAL.js libraries, or from Microsoft Graph. This article adds an common step of storing user information custom to the web app, that shouldn't be stored in the Identity account. 

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


## Add page and form for new user input

Create a new file, `./src/pages/FavoriteColor.jsx`, to capture the user's favorite color. 

The `userData` structure will be passed to the Function API to have the Cosmos DB store that. The custom

```javascript
import { useEffect, useState } from "react";
import { callOwnApiWithToken } from "../fetch";

export const FavoriteColor = ({ accessToken, endpoint, user, changeFunctionData }) => {

    // The custom USER for this app
    const [userData, setUserData] = useState(
        { 
            customAppId:null, 
            name: null, 
            email: null, 
            favoriteColor: null 
        });

    useEffect(() => {
            if(user) {
                setUserData(user);
            }
    }, [user]);

    const onColorChange = (event) => {
        setUserData({
            ...userData,
            favoriteColor: event.target.value
        });
    }

    const updateUserOnServer = async () => {
        const updateUser = await callOwnApiWithToken(accessToken, endpoint, userData);
        changeFunctionData(updateUser);
    }

    const onFormSubmit = async (event) => {
        event.preventDefault();
        console.log('An color was submitted: ' + userData.favoriteColor);
        updateUserOnServer().then(response => setUserData(response)).catch(error => console.log(error));
    }

    return (
        <>
            <center>
                <form onSubmit={onFormSubmit}>
                    <input type="text" value={userData.favoriteColor} onChange={onColorChange} name="favoriteColor" placeholder="fav color?" />
                    <input type="submit" value="Submit" />
                </form>
            </center>
        </>
    );

}
```

## Add FavoriteColor component to Function component

The Function component calls the Azure Function API, so this is a great place to easily add the FavoriteColor component. 

Open the file, `./src/pages/Function.jsx`, and replace the code with the following code to include the new FavoriteColor component.

```javascript
import { useEffect, useState } from "react";
import { MsalAuthenticationTemplate, useMsal, useAccount } from "@azure/msal-react";
import { InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { loginRequest, protectedResources } from "../authConfig";
import { callOwnApiWithToken } from "../fetch";
import { FunctionData } from "../components/DataDisplay";
import { FavoriteColor } from "./FavoriteColor";

const FunctionContent = () => {

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

## Add route for new user input page

Add a route and form to the React app to capture a user's **favorite color**. This user input is symbolic of any data from the user you want to capture and store that is custom to your app.

Open the `./src.App.jsx` file and replace the file with the contents below to add the new **color** route.

```javascript
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PageLayout } from "./components/PageLayout";
import { Profile } from "./pages/Profile";
import { Function } from "./pages/Function";
import { FavoriteColor } from "./pages/FavoriteColor";
import "./styles/App.css";

const Pages = (props) => {
  return (
    <Switch>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/function">
        <Function />
      </Route>
      <Route path="/color">
        <FavoriteColor />
      </Route>
    </Switch>
  )
}
const App = ({ instance }) => {
  return (
    <Router>
      <MsalProvider instance={instance}>
        <PageLayout>
          <Pages />
        </PageLayout>
      </MsalProvider>
    </Router>
  );
}

export default App;
```


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
