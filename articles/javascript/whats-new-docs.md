---
title: "What's new for JavaScript docs"
description: "What's new in JavaScript docs in the Developer Center"
ms.topic: how-to
ms.date: 11/03/2021

---

# JavaScript docs: What's new

Find new and updated content for JavaScript and TypeScript developers.

## 2021 November

### Updates in November

|Name|Description|
|---------------------------------------|--|
|[Virtual machine web app](tutorial/nodejs-virtual-machine-vm/introduction.md)|Updated article series.|

## 2021 October

### New in October

|Name|Description|
|---------------------------------------|--|
|[Use Azure SDKs](core/use-azure-sdk.md)|To programmatically access your Azure services, use the Azure SDKs for JavaScript. Typically, these SDKs are scoped with the @azure npm package scope published by azure-sdk. Learn how to:<ul><li>[provide authentication credentials](core/use-azure-sdk.md#provide-authentication-credentials)<li>[page through asynchronous results](core/use-azure-sdk.md#asynchronous-paging-of-results)<li>[wait for long running asynchronous tasks](core/use-azure-sdk.md#long-running-operations)|
|[Create virtual machine](how-to/with-azure-sdk/create-manage-virtual-machine.md)</ul>|An Azure Virtual machine requires several resources to support the virtual machine<ul><li>Resource group<li>Virtual machines<li>Storage<li>Virtual network<li>Network interface<li>Public IP address</ul><br>The best way to manage those resources is to create all the resources in a single resource group. The script creates the resource group and postpends a random number to make sure the resource group is unique, regardless of how many times you use the script.|
|[Manage virtual machines](how-to/with-azure-sdk/stop-start-virtual-machine.md)|An Azure Virtual machine programmatically managing your VM with the **@azure/arm-compute** SDK:<ul><li>Stop<li>Start<li>Get status<li>List details</ul>|
|[List recent operations](how-to/with-azure-sdk/list-resource-operation-history.md)|Use the Azure Monitor SDK to list the most recent resource operations in your subscription. Operations can be filtered by a date range (within the last 10 days), and a resource group. Examples of operations can include:<ul><li>Resource creation<li>Stopping<li>Starting a resource<li>Retrieve a connection string|

### Updates in October


|Name|Description|
|---------------------------------------|--|
|[Azure Functions: Add Cosmos DB for MongoDB API integration](tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-database-integration.md)|Fixed connection pooling.|

## 2021 September 


### New in September

|Name|Description|
|---------------------------------------|--|
|[Create an Azure Function to manage resource groups](how-to/with-web-app/azure-function-resource-group-management/introduction.md)|In this article series, you'll create an Azure Function app with APIs to manage Azure resource groups.<br><br>Features and functionality of this article series:<br><br>* Create local Azure Function app project in Visual Studio Code<br>* Create function APIs boilerplate code in Visual Studio Code<br>* Deploy to Azure Functions<br>* Create service principal<br>* Configure local and remote application settings<br>* Use DefaultAzureCredential in both local and remote environments<br>* Use Azure SDKs to use Azure Identity and Azure Resource Management APIs<br>* Use your local and cloud APIs to create, delete, and list resource groups in your subscription|
|[Upload file to Blob Storage with Function API](./how-to/with-web-app/azure-function-file-upload.md)|This article shows you how to create an Azure Function API, which uploads a file to Azure Storage using an _out_ binding to move the file contents from the API to Storage.<br><br>* Locally develop and run with Azurite Storage emulation and Azure Functions Core tools.<br>* Deploy to Azure Functions with a Storage resource<br>* Review logs in Application Insights|

### Updates in September

|Name|Description|
|---------------------------------------|--|
|[Create and deploy Azure Functions from Visual Studio Code with MongoDB integration](tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-install.md)|Create a secure API in Visual Studio Code with VS Code extensions and JavaScript, then deploy the application to the Azure cloud for hosting with a public HTTP endpoint. The API integrates with a Cosmos DB database using the MongoDB API. The MongoDB API is accessed from the [mongoose](https://www.npmjs.com/package/mongoose) npm package.<br><br>The MongoDB database functionality includes:<br>* Add item<br>* Delete item by ID<br>* Get item by ID<br>* Get all items| 
|[Upload an image to an Azure Storage blob](tutorial/browser-file-upload-azure-storage-blob.md)|* Updates based on Azure portal UI changes<br>* Added Static Web App resource creation and deployment<br>* Moved environment variables from source code into `.env` file| 
|[Clone and use a GitHub repository in Visual Studio Code](how-to/with-visual-studio-code/clone-github-repository.md)|Updated and clarified for new functionality.|

## 2021 August

### New in August

|Name|Description|
|---------------------------------------|--|
|[Create Static Web app using CLI](how-to/with-web-app/static-web-app-with-swa-cli/introduction.md)|In this article series, learn how to create a Static Web App (SWA). Locally develop using the SWA CLI with a proxy between the local client and API, including authentication. Run the same code remotely on Azure without changes.|


### Updates in August

|Name|Description|
|---------------------------------------|--|
|[Create and deploy an Azure Function API with VS Code](tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-install.md)|Previous version of document series focused on a public/anonymous API. The series now uses function-level security: local develop doesn't use the function key (`code` querystring param), the remote deployed function requires the function key.|
|Updated [hosting and deployment services](how-to/deploy-web-app.md)|Added Azure Web PubSub to list of services.|
|Updated [Azure Functions](how-to/develop-serverless-apps.md#common-security-settings-you-need-to-configure-for-your-azure-function)|Added **Common security settings you need to configure for your Azure Function**| 
|Updated [Top JS Tasks](how-to/common-javascript-tasks.md)|Added [Deployment](how-to/common-javascript-tasks.md#deployment-to-hosting-environment)| 

## 2021 July 


### New in July

|Name|Description|
|---------------------------------------|--|
|[Get started with GraphQL on Azure](./how-to/with-web-app/graphql/get-started.md)|Learn how to use a GraphQL API and deploy to Azure using the Apollo server in an Azure Function.|
|[Deploy a GraphQL API as an Azure Function ](./how-to/with-web-app/graphql/azure-function-hello-world.md)|Learn how to build and deploy an Apollo server-based GraphQL API endpoint. This article includes a simple `Hello World` API for those very new to GraphQL, along with a simple CRUD operations API using mutations.|
|[How to authenticate users with Microsoft Authentication Library for React](./how-to/with-authentication/static-web-app-with-api/introduction.md)|Learn how to authenticate users with the Microsoft Authentication Library for React (MSAL React) and call an Azure service on behalf of the user.|

## 2021 June 

### New in June

|Name|Description|
|---------------------------------------|--|
|[Getting started with authentication on Azure](./how-to/with-authentication/getting-started.md)|The Microsoft identity platform allows a JavaScript developer to authenticate and authorize user identity in your browser, server, or serverless application. |
|[How to authenticate users with (MSAL for React static web app)](./how-to/with-authentication/static-web-app-with-api/introduction.md)|In this article series, learn how to authenticate users with the Microsoft Authentication Library for React (MSAL React) and call an Azure service on behalf of the user.|

## 2021 May 

### New in May

|Name|Description|
|---------------------------------------|--|
|[Deploy Express.js with Microsoft Authentication to Azure App service](./how-to/with-web-app/deploy-msal-sdk-authentication-expressjs.md)|Learn how to deploy an Express.js app, integrated with Microsoft Authentication Library (MSAL).The sample Express.js web app uses the Embedded JavaScript templates (EJS) template engine to deliver server-side rendered HTML to allow users to sign in with the Microsoft Identity provider. Authentication is provided with the @azure/msal-node npm package. |

### Updated in May

|Name|Description|
|---------------------------------------|--|
|[Logging, metrics, and telemetry in Azure](./how-to/node-sdk-logging.md)|Web app and Function app logging information.|
|[Tutorial: Create a function with Visual Studio Code](./tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-install.md)|Added streaming logs in VS Code, and querying Kusto log in Azure portal.|
|[Tools update](./node-azure-tools.md)|Added several links to Microsoft or Azure specific tools. Added Azure service-specific tips.|
|[Add Microsoft login button to a single page application for authentication](./tutorial/single-page-application-azure-login-button-sdk-msal.md#7-store-application-specific-user-information)|Added Microsoft Identity provider and Active Directory app ID information. |
|Locally develop with the CosmosDB emulator|For [SQL API](./how-to/with-database/use-sql-api-as-cosmos-db.md#locally-develop-with-the-cosmosdb-emulator), [MongoDB](./how-to/with-database/use-mongodb-as-cosmosdb.md#locally-develop-with-the-cosmosdb-emulator), and [Cassandra](./how-to/with-database/use-cassandra-as-cosmos-db.md#locally-develop-with-the-cosmosdb-emulator). |


## 2021 April

### New in April

|Name|
|---------------------------------------|
|[Add easy authentication to your Express.js web app](./how-to/with-web-app/add-authentication-to-web-app.md)<br><br>Add Microsoft authentication to your web app with an app registration and an Azure app service. The Azure app service provides an easy authentication ("easy auth") to your web app, doing most of the work for a simple authentication use case for you. |

### Updated in April

|Name|
|---------------------------------------|
|[Set up development environment to use Azure SDK for JavaScript](./core/nodejs-sdk-azure-authenticate.md)<br><br>Use the **DefaultAzureCredential** to authenticate to the Azure cloud. Once your environment is correctly configured, you won't need to interactively login or store and manage credentials.|
|[Recommended actions for Monitor Azure resources](./how-to/node-sdk-logging.md)<br><br>When you create an Azure resource, configure proper monitoring, alerting, and logging. |
|[View deployed files in App or Functions services](./how-to/deploy-web-app.md#view-files-in-azure-hosted-environment)<br><br>Quick and simple methods to view your deployed files in the Azure portal or VSCode.|

## 2021 March

### New in March

|Name|
|---------------------------------------|
|[Secure JavaScript websites with **custom domains and certificates**](./how-to/add-custom-domain-to-web-app.md)<br><br>Learn how to create a web app on Azure with a custom domain name secured with an TLS/SSL certificate. |
|[Store and use **Azure Key Vault** secrets in Express.js app](./how-to/add-custom-domain-to-web-app.md)<br><br>Store secrets in Azure Key Vault, then use those secrets programmatically from Key Vault in your Express.js app. Includes [full source code](https://github.com/Azure-Samples/js-e2e-express-mongodb/tree/keyvault).|
|[Add **search functionality** to a Static Web app](/azure/search/tutorial-javascript-overview)<br><br>This tutorial builds a website to search through a catalog of books then deploys the website to an Azure Static Web App. A user can search the catalog by entering text in the search bar. While the user enters text, the website uses the Search Index's suggest feature to complete the text. Once the query finishes, the list of books is displayed with a portion of the details. A user can select a book to see all the details, stored in the Search Index, of the book. Includes [full source code](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/search-website).|

### Updates in March

|Name|
|---------------------------------------|
|[Install and manage Node.js for Azure development](./core/install-nodejs-develop-azure-sdk-project.md)|
|[Deploy Express.js MongoDB app to App Service from Visual Studio Code](./tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md)|


## 2021 February

### New in February

|Name|Notes|
|---------------------------------------|--|
|[How to use Cassandra on Azure Cosmos DB](./how-to/with-database/use-cassandra-as-cosmos-db.md)|To create, move, or use a Cassandra DB database to Azure, you need a Cosmos DB resource. Learn how to create the resource and use your database. |
|[How to use MongoDB on Azure Cosmos DB](./how-to/with-database/use-mongodb-as-cosmosdb.md)|To create, move, or use a mongoDB database to Azure, you need a Cosmos DB resource. Learn how to create the resource and use your database. |
|[How to use MariaDb on Azure](./how-to/with-database/use-mysql-mariadb.md)|To create, move, or use a MariaDB database to Azure, you need a **Azure Database for MariaDB** resource. Learn how to create the resource and use your database.|
|[How to use MySql on Azure](./how-to/with-database/use-mysql-mariadb.md)|To create, move, or use a MySQL database to Azure, you need a **Azure Database for MySQL** resource. Learn how to create the resource and use your database.|
|[How to use PostgreSQL on Azure](./how-to/with-database/use-postgresql-db.md)|To create, move, or use a PostgreSQL database to Azure, you need a **Azure Database for PostgreSQL server** resource. Learn how to create the resource and use your database.|
|[Develop a JavaScript application for Azure Cache for **Redis*](.//how-to/with-database/use-azure-cache-for-redis-db.md)|To create, move, or use a **Redis** database to Azure, you need an Azure Cache for Redis resource. Learn how to create the resource and use your database.|
|[Develop a JavaScript application for Cosmos DB with SQL API](.//how-to/with-database/use-sql-api-as-cosmos-db.md)|To create or use **Cosmos DB** with the SQL API use a Cosmos DB resource. Learn how to create the Cosmos resource and use your database.|

### Updated in February

|Name|Notes|
|---------------------------------------|--|
|[Top tasks for JavaScript developers](/azure/azure-monitor/app/api-custom-events-metrics)|



### <a name="top-10"></a>Top 10 documents, by page view, for JavaScript Developers

|#|Name|
|---------------------------------------|--|
|1|[Application Insights API for custom events and metrics](how-to/common-javascript-tasks.md)|
|2|[Static website hosting in Azure Storage](/azure/storage/blobs/storage-blob-static-website)|
|3|[Build, test, and deploy JavaScript and Node.js apps - Azure Pipelines](/azure/devops/pipelines/ecosystems/javascript?tabs=code)|
|4|[Monitor Azure Functions](/azure/azure-functions/functions-monitoring)|
|5|[Get started with speech-to-text](/azure/cognitive-services/speech-service/get-started-speech-to-text?tabs=script%2Cbrowser%2Cwindowsinstall&pivots=programming-language-javascript)|
|6|[Call an ASP.NET Core web API with JavaScript](/aspnet/core/tutorials/web-api-javascript?preserve-view=true&view=aspnetcore-5.0)|
|7|[ASP.NET Core SignalR JavaScript client](/aspnet/core/signalr/javascript-client?preserve-view=true&view=aspnetcore-5.0)|
|8|[Azure Functions JavaScript developer guide](/azure/azure-functions/functions-reference-node?tabs=v2)|
|9|[Sign in users and call the Microsoft Graph API from an Angular single-page application](/azure/active-directory/develop/tutorial-v2-angular)|
|10|[Application Insights for web pages](/azure/azure-monitor/app/javascript)|

## 2021 January

### New in January

|Name|Notes|
|---------------------------------------|--|
|[What's new with Developer Advocates](whats-new-developer-advocacy.md)|Blogs, videos, Learn modules|
|[Tutorial: Convert text to speech](./tutorial/convert-text-to-speech-cognitive-services.md)|In this tutorial, add Cognitive Services Speech to an existing Express.js app to add conversion from text to speech using the Cognitive Services Speech service. Converting text to speech allows you to provide audio without the cost of manually generating the audio.|
|How-to guide with Azure CLI|* [Create and use container registry](./how-to/with-azure-cli/create-container-registry-resource.md)<br>* [Configuring a custom domain name](./how-to/with-azure-cli/configure-app-service-custom-domain-name.md)<br>* [Create and use MongoDB on Azure with Cosmos DB](./how-to/with-azure-cli/create-mongodb-cosmosdb.md) |
|How-to guide with Visual Studio Code|* [Develop and debug Node.js](./how-to/with-visual-studio-code/install-run-debug-nodejs.md)<br>* [Clone and use a GitHub repository](./how-to/with-visual-studio-code/clone-github-repository.md)<br>* [Create a container image from your local JavaScript project](./how-to/with-visual-studio-code/containerize-local-project.md)|

### Updated in January

|Name|Notes|
|---------------------------------------|--|
|[**For beginners**](learn-azure-javascript.md#getting-started)|Various collections of online materials to get started with JavaScript, Node.js, web development and other areas of interest to JavaScript developers.|
|[Top tasks for JavaScript developers](how-to/common-javascript-tasks.md)|Find an example of your current tasks.|
|[Configure Visual Studio Code launch file](./how-to/configure-web-app-settings.md#configure-browser-for-cors-to-connect-with-server)|If you need to connect to your own server, and need to ignore CORS security while running and debugging with the client locally, the recommended solution is to configure this setting in the Visual Studio Code debug file, `launch.json`, to pass settings to the browser to disable the security.|

## 2020 December

### What's new

|Name|Notes|
|---------------------------------------|--|
|[Tutorial: Add login button to a React Static Web app for Microsoft Authentication](./tutorial/single-page-application-azure-login-button-sdk-msal.md)|Azure authentication presented in this tutorial is a login and logout button, and provides access to a user's account. Develop the application with an Azure client-side SDK, `@azure/msal-browser`, to manage the interaction of the user in the single page application (SPA).|
|[What is Azure for JavaScript developers?](core/what-is-azure-for-javascript-development.md)|Azure concepts JavaScript developers need to be successful.|
|[Install Node.js](core/install-nodejs-develop-azure-sdk-project.md)|Install and manage Node.js for common Azure development scenarios|
|[Configure web apps on Azure](how-to/configure-web-app-settings.md)|Learn how to set common configurations for your web app.|
|[Common top tasks for JavaScript developers](how-to/common-javascript-tasks.md)|Find an example of your current tasks.|
|[Automate tasks with Azure CLI](core/automate-tasks-with-azure-cli.md)|Automating Azure tasks is a common requirement for continuous deployment to hosting environments. Azure CLI is the recommended choice for JavaScript developers managing tasks and deploying from any location.|

### What's new in Learn


|Name|
|---------------------------------------|
|Static Web App, JavaScript, CodeTour: Use basketball stats to optimize game play with Visual Studio Code, inspired by SPACE JAM: A NEW LEGACY - [Learn](/learn/paths/optimize-basketball-games-with-machine-learning/)|
|Build a simple website using HTML, CSS, and JavaScript - [Learn](/learn/modules/build-simple-website/)|
|Use Visual Studio Code to build a JavaScript and Vue.js dashboard with a Serverless API powered by Azure Functions and Node.js. - [Learn](/learn/modules/build-api-azure-functions)|

## 2020 November

Welcome to what's new in the JavaScript docs from November 2020. This article lists some of the major changes to docs during this period.

### What's new

|Name|Notes|
|---------------------------------------|--|
|[Tutorial: Build and deploy a React Static Web app to Azure](./tutorial/static-web-app/introduction.md)|In this tutorial, build and deploy a React client application to an Azure Static Web App with a GitHub action.<br>The create-react-app allows you to analyze an image with Cognitive Services Computer Vision. The GitHub action starts when a push to a specific remote branch happens, building the React (create-react-app) client, and moving the resulting files to your Azure Static Web app resource.|
|[Tutorial: Deploy app to Linux virtual machine](./tutorial/nodejs-virtual-machine-vm/introduction.md)|In this tutorial, create a Linux virtual machine (VM) for an Express.js app. The VM is configured with a cloud-init configuration file and includes NGINX and a GitHub repository for an Express.js app. Once the VM is running, you can connect to the VM with SSH, change the web app to including trace logging, and view the public Express.js server app in a web browser.|

### What's updated

|Name|Notes|
|---------------------------------------|--|
|[Learn](learn-azure-javascript.md)|New modules and certifications for JavaScript.|

## 2020 October

Welcome to what's new in the JavaScript docs from October 2020. This article lists some of the major changes to docs during this period.

### What's new

|Name|Notes|
|---------------------------------------|--|
|[Tutorial: Upload image to Blob Storage](./tutorial/browser-file-upload-azure-storage-blob.md)|In this tutorial, use a **React app** to upload a file to an **Azure Storage** blob. The programming work is done for you, this tutorial focuses on using the local and remote Azure environments successfully from inside Visual Studio Code with Azure extensions.|
|[Tutorial: Deploy Node.js with database app to App Service from Visual Studio Code](./tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md)|In this tutorial, use a **Express.js** Node.js app with a **MongoDB** database using the MongoDB native API. Deploy the Node.js application to Azure App Service (on Linux) then verify the cloud-based app works. The programming work is done for you, this tutorial focuses on creating the Azure resources and deploying to Azure from inside Visual Studio Code with Azure extensions.|

### What's updated

|Name|Notes|
|---------------------------------------|--|
|[How-to: Serverless functions](how-to/develop-serverless-apps.md)|Functions run on top of a web service, as code or a Docker container, which is abstracted away so you can focus on the code for your endpoint.|
|[Get started: Authenticate with the Azure management modules for JavaScript](core/nodejs-sdk-azure-authenticate.md)|There are multiple ways of authenticating and creating the required credentials.|

## Next steps

* [Set up your development environment](./core/configure-local-development-environment.md)