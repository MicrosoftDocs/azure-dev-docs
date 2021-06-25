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

## Next steps

* [Deploy Static web app to Azure](./deploy-static-web-app-to-azure.md)
