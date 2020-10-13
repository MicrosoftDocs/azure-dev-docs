---
title: include file tutorial-azure-web-app-mongodb-00.md 
description: include file tutorial-azure-web-app-mongodb-00.md
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---

In this tutorial, use a Node.js app with a MongoDB database using the MongoDB native API. Deploy the Node.js application to Azure App Service (on Linux) then verify the cloud-based app works. 

The programming work is done for you, this tutorial focuses on using the local and remote Azure environments successfully from inside Visual Studio Code with Azure extensions.

## Top tasks

This tutorial includes several **top Azure tasks** for JavaScript developers:

* Use a local MongoDB database
* Use app with container
* Deploy app to cloud
* Configure cloud-hosted app settings 
* Connect local app to a remote database

## Sample application

The [sample Node.js app](https://github.com/Azure-Samples/js-e2e-express-mongo), available on GitHub, consists of the following elements:

* **Express.js server** hosted on port 8080
* Simple **React.js server-side view** engine
* **MongoDB native API** functions to insert, delete, and find data

:::image type="content" source="../media/tutorial-end-to-end-app-cosmos/nodejs-app-connected-mongodb-form.png" alt-text="Simple Node.js app connected to MongoDB database.":::

## The MongoDB connection

If the database connection can't be made, the app displays the message, `No database found.`. This will be the initial state of the app.

When the database connection is made, the app consists of two text fields in a form with a submit button with the contents of the Mongo collection displayed under the form.

## Limited time to work on the tutorial?

In the tutorial, you create an Azure resource for Cosmos DB, which is how Azure hosts MongoDB databases. This resource creation process can take up to 20 minutes. You can [start that process now](tutorial-azure-web-app-mongodb.yml?tutorial-step=5) if your time is limited, then the resource should be available when you need it. 

## Want to know more? 

Each step of the tutorial includes a **Want to know more?** section. This is _optional information_ to allow you to explore in depth. You can read as you go through the tutorial, or return to the tutorial later. 