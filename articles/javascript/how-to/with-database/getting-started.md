---
title: Getting started with Azure Databases 
description: Learn the common tasks to use any database hosted on Azure.  
ms.topic: how-to
ms.date: 10/05/2021
ms.custom: devx-track-js, devx-graphql
---

# Getting started with databases on Azure

The Azure cloud platform allows you to use any of the Azure databases (as services) or bring your own database. Once your server and database are set up, your existing code will only need to change the connection settings. 

When you do use a database on Azure, there are several common tasks you need to accomplish to use the database from your JavaScript app. Learn more about getting and using your database on Azure. 

## Select a database to use on Azure

Microsoft provides managed services for the following databases:

|Database|Azure Service|
|--|--|
|[Cassandra](use-cassandra-as-cosmos-db.md)|[Azure Cosmos DB](/azure/cosmos-db/)|
|Gremlin|[Azure Cosmos DB](/azure/cosmos-db/)|
|[MongoDB](use-mongodb-as-cosmosdb.md)|[Azure Cosmos DB](/azure/cosmos-db/)|
|MariaDB/MySQL|[Azure Database for MariaDB](/azure/mariadb/)|
|[PostgreSQL](use-postgresql-db.md)|[Azure Database for PostgreSQL](/azure/postgresql/)|
|[Redis](use-azure-cache-for-redis-db.md)|[Azure Cache for Redis](/azure/azure-cache-for-redis/)|
|[SQL](use-sql-api-as-cosmos-db.md)|[Azure Cosmos DB](/azure/cosmos-db/)|
|Tables|[Azure Cosmos DB](/azure/cosmos-db/)|

**Need help with choosing?** 
* Select your database based on [what you want to do](https://azure.microsoft.com/product-categories/databases/)
* Use the [Azure Database Migration Service](/azure/dms/) to move to Azure. 

**Didn't find your database?**
Bring your database as either a container or a virtual machine. You can bring any database type with these services and have high-availability and security to your other Azure resources. The trade-off is that you have to manage the infrastructure (container or VM) yourself. The rest of this document may help you with your container or VM but is more helpful when choosing an Azure database service. 

## Create the server

Creating a server is completed by creating a resource for the specific Azure service on your subscription where your database is hosted. 

Creating a resource is accomplished with:

|Tool|Purpose|
|--|--|
|Azure portal|Use for first or infrequently used database is the Azure portal.|
|Azure CLI|Use for repeatable/scriptable scenarios.|
|Visual Studio Code extension (for that service)|Use to stay within the development IDE.|
|npm ARM library (for that service)|Use to stay within the JavaScript language.| 

Once you create the server, depending on the service, you may still need to:

* Configure security settings such as firewall and SSL enforcement
* Get your connection information
* Create the database

## Configure security settings for your database

Common security settings to configure for your service include:

* Opening the firewall for your client IP address
* Configuring SSL enforcement
* Accepting public requests or requiring all requests to come from another Azure service

## Create a database on the Azure server

You can get your connection information using the same tool as you created your server. Use the connection information to access your server. You still need to create your database specific to your application. 

Access your server: 

* Use a tool specific to that database type such as pgAdmin, SQL Server Management Studio, and MySQL Workbench. 
* Continue to use Microsoft tools
    * [Azure Cloud Shell](https://shell.azure.com) includes many database CLIs such as psql and mysql.
    * Visual Studio Code extensions
    * npm packages for JavaScript
    * Azure portal

## Programmatically access the server and database with JavaScript

Once you have your connection information, you can access your server with industry-standard npm packages and JavaScript. 

After you create or migrate a database, only your connection information to the new server and database should need to change. 

## Configure an Azure web app's connection to database

If your Azure web app connects to your database, you need to change the App setting for the connection information. 

## Database-agnostic query languages

Data query languages, agnostic of a specific database, allow you to use the query languages features with your data. Database-agnostic query languages can be used on Azure and require you to bring the translation layer.

## GraphQL data layer

GraphQL is a database-agnostic query language. It allows a client to describe the data schema along with the data requested from the data source.

|Summary|
|--|
|GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.
|

Learn more about developing GraphQL for [Azure Functions](../with-web-app/graphql/azure-function-hello-world.md).


## Next steps

* [Develop a JavaScript application with MongoDB on Azure](use-mongodb-as-cosmosdb.md)