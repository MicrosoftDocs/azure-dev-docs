---
title: Top Azure tasks for JavaScript developers
description: Find an example of your current tasks.
ms.topic: how-to
ms.date: 04/01/2021
ms.custom: devx-track-js
---

# Top tasks for JavaScript developers

Find an example of your current task. If you can't find a task, leave feedback requesting your task. 

## Active Directory App 

Provide authentication. 

[AD App registration Documentation](/azure/active-directory/develop/quickstart-register-app)

|Task|using|
|--|--|
|Create app registration|[Portal](../tutorial/single-page-application-azure-login-button-sdk-msal.md#3-create-app-registration-for-authentication)<br>[Azure CLI](/cli/azure/ad/app#az_ad_app_create)|
|List app registration|[Azure CLI](/cli/azure/ad/app#az_ad_app_list)
|Microsoft Login/Logoff button using `@azure/msal-browser`|[React/TypeScript](../tutorial/single-page-application-azure-login-button-sdk-msal.md#5-add-login-and-logoff-buttons)|
|Revoke AAD permission|[https://myapplications.microsoft.com/](https://myapplications.microsoft.com/)|
|Revoke Consumer permission|[https://account.live.com/consent/manage](https://account.live.com/consent/manage)
|Login|[Azure CLI](../tutorial/deploy-deno-app-azure-app-service-azure-cli.md#2-sign-in-to-azure-cli)<br>[Visual Studio Code extension](../tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-01.md#sign-in-to-azure)|


## Azure Resource Groups

|Task|using|
|--|--|
|Create resource group|[Azure CLI](../tutorial/static-web-app/create-computer-vision-resource-use-in-code.md#create-azure-resources)|
|Delete resource group|[Azure CLI](../tutorial/static-web-app/clean-up-resources.md#remove-all-the-resources-by-removing-resource-group)|

## Apps

### Static web apps

[Service documentation](/azure/static-web-apps/)

|Task|using|
|--|--|
|Create Angular app|[Bash](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-02.md?tabs=angular)|
|Create Deno app|[Bash](../tutorial/deploy-deno-app-azure-app-service-azure-cli.md#3-create-local-deno-api-app)|
|Create React app targeting JavaScript language|[Bash](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-02.md?tabs=react)|
|Create React app targeting TypeScript language|[Bash](../tutorial/single-page-application-azure-login-button-sdk-msal.md#4-create-react-single-page-application-for-typescript)|
|Create Vue app|[Bash](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-02.md?tabs=vue)|
|Create Svelte app|[Bash](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-02.md?tabs=svelte)|
|Create Static web app|[Visual Studio Code extension](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#create-a-static-web-app-resource)|
|Create Storage-hosted static app|[Visual Studio Code extension](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-03.md)|
|Deploy Storage-hosted static app|[Visual Studio Code extension](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-04.md)|
|Browse site|[Visual Studio Code extension](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#view-azure-static-web-site-in-browser)|
|Set Static Web app local environment variables|[Bash](../tutorial/static-web-app/create-computer-vision-resource-use-in-code.md#add-environment-variables-to-your-local-environment)|



### Function (serverless) apps

[Service documentation](/azure/azure-functions/)

|Task|using|
|--|--|
|Create Functions app locally|[Visual Studio Code extension](../tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-create-local.md)|
|HTTP trigger code|[JavaScript](../tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-create-local.md#http-function-javascript-template-code)|
|Debug/test function locally|[Visual Studio Code](../tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-test-local.md)|
|Deploy function to Azure cloud|[Visual Studio Code extension](../tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-deploy-hosting.md)|
|Verify function is available on public URL|[Visual Studio Code extension/Browser](../tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-deploy-hosting.md#verify-functions-app-is-publicly-available-with-browser)|
|Remove function app resource|[Visual Studio Code extension](../tutorial/vscode-function-app-http-trigger/tutorial-vscode-serverless-node-remove-resource.md)|

### App service - full-stack, server-only, or client-only apps

[Service documentation](/azure/app-service/)

|Task|using|
|--|--|
|Create local Express.js app|[Bash](../tutorial/deploy-nodejs-azure-app-service-with-visual-studio-code.md?tabs=bash#3-create-a-local-expressjs-app)|
|Create app resource - includes: deploy Express.js app, stream logs|[Visual Studio Code extension](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md#create-web-app-resource-and-deploy-expressjs-app)|
|Create app resource - includes: deploy Express.js app, configure app settings, run npm install, browse to deployed website|[Visual Studio Code extension](../tutorial/deploy-nodejs-azure-app-service-with-visual-studio-code.md)|
|Create app resource|[Azure CLI](../tutorial/tutorial-vscode-azure-cli-node/tutorial-vscode-azure-cli-node-03.md)|
|Create app, deploy, browser app, view logs|[Azure CLI](../tutorial/tutorial-vscode-azure-cli-node/tutorial-vscode-azure-cli-node-03.md)|
|Configure web app to use database connection string|[Azure CLI](./with-azure-cli/create-mongodb-cosmosdb.md#configure-your-azure-web-app-with-the-connection-string)|
|Configure web app to use container|[Azure CLI](./with-azure-cli/create-container-registry-resource.md#configure-web-app-to-use-container)|
|Configure web app custom domain name|[Azure CLI](./with-azure-cli/configure-app-service-custom-domain-name.md#register-a-domain-name-with-your-azure-app)|
|Delete app resource|[Visual Studio Code extension](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md#clean-up-resources)<br>[Azure CLI](../tutorial/tutorial-vscode-azure-cli-node/tutorial-vscode-azure-cli-node-07.md)|
|Deploy or reploy app|[Visual Studio Code extension](deploy-web-app.md#deploy-or-redeploy-to-app-service-with-visual-studio-code)|
|Get web app external IP|[Azure CLI](./with-azure-cli/configure-app-service-custom-domain-name.md#register-a-domain-name-with-your-azure-app)|
|Purchase a domain name and configure DNS record|[Azure CLI](./with-azure-cli/configure-app-service-custom-domain-name.md#purchase-a-domain-name-and-configure-dns-record)|
|Stream remote logs|[Visual Studio Code extension](../tutorial/deploy-nodejs-azure-app-service-with-visual-studio-code.md?tabs=bash#7-stream-remote-service-logs-in-visual-studio-code)<br>[Azure CLI](../tutorial/tutorial-vscode-azure-cli-node/tutorial-vscode-azure-cli-node-05.md)|

## Cognitive Services

[Service group documentation](/azure/cognitive-services/)

|Task|using|
|--|--|
|Create Cognitive Services _ComputerVision_ resource|[Azure CLI](../tutorial/static-web-app/create-computer-vision-resource-use-in-code.md#create-azure-resources)|
|Get Cognitive Services _ComputerVision_ resource|[Azure CLI](../tutorial/static-web-app/create-computer-vision-resource-use-in-code.md#create-azure-resources)|
|Install Azure SDK|[Bash](../tutorial/static-web-app/add-computer-vision-react-app.md#add-computer-vision-to-local-react-app)|
|Analyze image with [`@azure/cognitiveservices-computervision`](https://www.npmjs.com/package/@azure/cognitiveservices-computervision)|[Visual Studio Code](../tutorial/static-web-app/add-computer-vision-react-app.md#add-computer-vision-code-as-separate-module)|

## Containers including Docker tasks

|Task|using|
|--|--|
|Add docker files to local project|[Visual Studio Code extension](../tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-04.md#add-docker-files)|
|Build docker image from local project|[Visual Studio Code extension](../tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-04.md#build-a-docker-image)|
|Create a container image from your local JavaScript project|[Visual Studio Code](./with-visual-studio-code/containerize-local-project.md#create-a-container)|
|Create container registry resource|[Visual Studio Code extension](../tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-02.md#create-an-azure-container-registry)<br>[Azure CLI](./with-azure-cli/create-container-registry-resource.md#create-a-container-registry)|
|Create Dockerfile|[Visual Studio Code extension](./with-visual-studio-code/containerize-local-project.md#create-a-dockerfile-in-your-project)|
|Deploy image to app service|[Visual Studio Code extension](../tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-05.md#deploy-image)|
|Enable admin access to registry|[Visual Studio Code extension](../tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-05.md#enable-admin-access-on-the-registry)|
|Get Azure container registry credentials|[Azure CLI](./with-azure-cli/create-container-registry-resource.md#get-container-registry-credentials)|
|Login to container registry|[BASH - Docker CLI](./with-azure-cli/create-container-registry-resource.md#login-to-container-registry-with-docker-cli)|
|Push image to Docker registry resource|[Visual Studio Code extension](./with-visual-studio-code/containerize-local-project.md#push-local-container-image-to-dockerhub)|
|Push image to Azure container registry resource|[Visual Studio Code extension](../tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-04.md#push-the-image-to-a-registry)<BR>[BASH - Docker CLI](./with-azure-cli/create-container-registry-resource.md#push-your-local-image-to-your-container-registry)|
|Run local container|[Visual Studio Code extension](with-visual-studio-code/containerize-local-project.md#build-image-from-your-project)|
|Tag your local image|[BASH - Docker CLI](./with-azure-cli/create-container-registry-resource.md#tag-your-local-image)|
|Verify Docker version|[Bash](../tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-01.md#verify-docker-install)|

## Databases

### Cassandra API on Cosmos DB

[Service documentation](/azure/cosmos-db/)

|Task|Using|
|--|--|
|Create resource|[Azure portal](https://ms.portal.azure.com/#create/Microsoft.DocumentDB)<br>[Azure CLI](./with-azure-cli/create-cassandra-db.md#create-a-cosmos-db-resource-for-cassandra-db)|
|Create keystore on resource|[Azure CLI](./with-azure-cli/create-cassandra-db.md#create-a-keyspace-on-the-server-with-azure-cli)|
|Create table on keystore|[Azure CLI](./with-azure-cli/create-cassandra-db.md#create-a-table-on-the-keyspace-with-azure-cli)|
|Get connection information|[Azure CLI](./with-azure-cli/create-cassandra-db.md#get-the-cassandra-connection-string-with-azure-cli)|
|Use cassandra-driver API on Cosmos DB|[JavaScript](./with-database/use-cassandra-as-cosmos-db.md#use-cassandra-driver-sdk-to-connect-to-cassandra-db-on-azure)|

### MariaDB

[Service documentation](/azure/mariadb/)

|Task|Using|
|--|--|
|Create MariaDB resource|[Azure portal](https://ms.portal.azure.com/#create/Microsoft.MariaDBServer)<br>[Azure CLI](./with-azure-cli/create-mariadb.md#create-a-mariadb-resource-with-azure-cli)<br>[@azure/arm-mariadb](https://www.npmjs.com/package/@azure/arm-mariadb)|
|Create MariaDB database on resource|[Azure CLI](./with-azure-cli/create-mariadb.md#create-a-mariadb-resource-with-azure-cli)|
|Get Connection string|[Azure CLI](./with-azure-cli/create-mariadb.md#get-the-mariadb-connection-string-with-azure-cli)|
|Use and view database|[Azure Cloud Shell](https://shell.azure.com/)'s _mysql_ CLI<br>[MySQL Workbench](https://www.mysql.com/products/workbench/)<br>[Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)<br>[npm mariadb](https://www.npmjs.com/package/mariadb)<br>[JavaScript](./with-database/use-mariadb.md#use-mariadb-sdk-to-connect-to-mariadb-on-azure)|

### MongoDB API on Cosmos DB

[Service documentation](/azure/cosmos-db/)

|Task|using|
|--|--|
|Create Cosmos DB - MongoDB resource|[Visual Studio Code extension](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md)<br>[Azure CLI](./with-azure-cli/create-mongodb-cosmosdb.md#create-a-cosmos-db-resource-for-mongodb)|
|Get Cosmos DB connection string|[Visual Studio Code extension](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md#get-cosmos-db-connection-string)<br>[Azure CLI](./with-azure-cli/create-mongodb-cosmosdb.md#get-the-mongodb-connection-string-for-your-resource)|
|View Cosmos DB|[Cosmos DB Explorer](https://cosmos.azure.com/)|
|Use Mongoose API for mongoDB on Cosmos DB|[JavaScript](./with-database/use-mongodb-as-cosmosdb.md#use-mongoose-sdk-to-connect-to-mongodb-on-azure)

### MySQL

[Service documentation](/azure/mysql/)

|Task|Using|
|--|--|
|Create resource|[Azure portal](https://ms.portal.azure.com/#create/Microsoft.MySQLServer)<br>[Azure CLI](./with-azure-cli/create-mysql-db.md#create-an-azure-database-for-mysql-resource-with-azure-cli)<br>[@azure/arm-mysql](https://www.npmjs.com/package/@azure/arm-mysql)|
|Create database on resource|[Azure CLI](./with-database/use-mysql-db.md#create-a-database-on-the-server-with-azure-cli)|
|Get Connection string|[Azure CLI](./with-database/use-mysql-db.md#get-the-mysql-connection-string-with-azure-cli)|
|Use and view database|[MySQL Workbench](https://www.mysql.com/products/workbench/)<br>[Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)<br>[npm mysql](https://www.npmjs.com/package/mysql)<br>[npm promise-mysql](https://www.npmjs.com/package/promise-mysql)|
|Use promise-mysql API|[JavaScript](./with-database/use-mysql-db.md#use-promise-mysql-sdk-to-connect-to-mysql-on-azure)|

### PostgreSQL

[Service documentation](/azure/postgresql/)

|Task|using|
|--|--|
|Create resource|[Visual Studio Code extension](./with-visual-studio-code/create-azure-database.md#create-a-postgresql-database)<br>[Azure CLI](./with-azure-cli/create-postgresql-server-resource.md#create-an-azure-database-for-postgresql-server-resource-with-azure-cli)<br>[Azure portal](https://ms.portal.azure.com/#create/Microsoft.PostgreSQLServer)<br>[@azure/arm-postgresql](https://www.npmjs.com/package/@azure/arm-postgresql)|
|Get connection string|[Azure CLI](./with-azure-cli/create-postgresql-server-resource.md#get-the-postgresql-connection-string-with-azure-cli)|
|View DB|[Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)<br>[Azure Cloud Shell's psql](https://shell.azure.com/)|
|Use pg API for DB|[JavaScript](./with-database/use-postgresql-db.md#use-pg-sdk-to-connect-to-postgresql-on-azure)

### SQL API on Cosmos DB

* [Service documentation](/azure/cosmos-db/)
* [@azure/cosmosdb](https://www.npmjs.com/package/@azure/cosmos) npm package

|Task|using|
|--|--|
|Add firewall rule for your client IP address|[Azure CLI](./with-database/use-sql-api-as-cosmos-db.md#add-firewall-rule-for-your-client-ip-address)
|Create Cosmos DB - SQL API resource|[Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)<br>[Azure CLI](./with-database/use-sql-api-as-cosmos-db.md#create-a-cosmos-db-resource-for-sql-api)|
|Get Cosmos DB keys|[Azure CLI](./with-database/use-sql-api-as-cosmos-db.md#get-the-cosmos-db-keys-for-your-resource)|
|Get Cosmos DB connection string|[Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)|
|View Cosmos DB|[Cosmos DB Explorer](https://cosmos.azure.com/)|
|Use SQL API for on Cosmos DB|[JavaScript](./with-database/use-sql-api-as-cosmos-db.md#use--sdk-to-connect-to-database)



## Git

|Task|using|
|--|--|
|Create a local branch|[Visual Studio Code with Command Palette](./with-visual-studio-code/clone-github-repository.md#create-a-branch-for-changes-with-git-cl)<br>[Visual Studio Code with Status Bar](./with-visual-studio-code/clone-github-repository.md#create-a-branch-from-status-bar)|
|Clone project from GitHub to local computer|[Visual Studio Code](with-visual-studio-code/install-run-debug-nodejs.md#clone-sample-project-to-local-computer)|
|Push a local branch to remote repo|[Visual Studio Code with Status Bar](./with-visual-studio-code/clone-github-repository.md#push-a-local-branch-to-remote-from-status-bar)<br>[Visual Studio Code with Source Course extension](./with-visual-studio-code/clone-github-repository.md#push-a-local-branch-to-remote-from-the-source-control-extension)|

## GitHub 

### Actions 

|Task|using|
|--|--|
|Add secrets|[Visual Studio Code](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#create-a-static-web-app-resource)|
|View build process|[GitHub website](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#view-the-github-action-build-process)|


## Monitoring

|Task|using|
|--|--|
|Create resource|[Azure CLI](../tutorial/nodejs-virtual-machine-vm/create-azure-monitoring-application-insights-web-resource.md#create-azure-monitor-resource-with-azure-cli)|



## Storage

[Service documentation](/azure/storage/)

|Task|using|
|--|--|
|Create resource|[Visual Studio Code extension](../tutorial/browser-file-upload-azure-storage-blob.md#3-create-storage-resource-with-visual-studio-extension)|
|Delete resource|[Visual Studio Code extension](../tutorial/browser-file-upload-azure-storage-blob.md#clean-up-resources)|
|Create Storage-hosted static app|[Visual Studio Code extension](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-03.md)|
|Deploy Storage-hosted static app|[Visual Studio Code extension](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-04.md)|
|Create Storage container shared access signature (SAS) token|[Portal](../tutorial/browser-file-upload-azure-storage-blob.md#5-generate-your-shared-access-signature-sas-token)|
|Set SAS token in code|[TypeScript](../tutorial/browser-file-upload-azure-storage-blob.md#set-sas-token-in-code-file)|
|Configure CORS for Storage|[Portal](../tutorial/browser-file-upload-azure-storage-blob.md#6-configure-cors-for-azure-storage-resource)|


### Blobs

|Task|using|
|--|--|
|Create container in storage with [`@azure/storage-blob`](https://www.npmjs.com/package/@azure/storage-blob)|[React/TypeScript](../tutorial/browser-file-upload-azure-storage-blob.md#create-storage-client-and-manage-steps)|
|Upload file to storage with [`@azure/storage-blob`](https://www.npmjs.com/package/@azure/storage-blob)|[React/TypeScript](../tutorial/browser-file-upload-azure-storage-blob.md#upload-button-functionality)|
|List files in Storage container with [`@azure/storage-blob`](https://www.npmjs.com/package/@azure/storage-blob)|[React/TypeScript](../tutorial/browser-file-upload-azure-storage-blob.md#get-list-of-blobs)|

## Terminal usage

|Task|using|
|--|--|
|Integrated terminal|[Visual Studio Code](./with-visual-studio-code/install-run-debug-nodejs.md#use-the-integrated-bash-terminal-to-install-dependencies)|

## Virtual machines

[Service documentation](/azure/virtual-machines/)

|Task|using|
|--|--|
|Connect to VM with SSH|[Bash](../tutorial/nodejs-virtual-machine-vm/connect-linux-virtual-machine-ssh.md#connect-with-ssh-and-change-web-app)|
|Install Monitoring SDK|[Bash](../tutorial/nodejs-virtual-machine-vm/connect-linux-virtual-machine-ssh.md#install-monitoring-sdk)|
|Add monitoring code to Express.js app|[JavaScript](../tutorial/nodejs-virtual-machine-vm/azure-monitor-application-insights-nodejs-expressjs-code.md#edit-indexjs-for-logging-with-azure-monitor-application-insights)|
|Create cloud-init file|[YAML](../tutorial/nodejs-virtual-machine-vm/create-linux-virtual-machine-azure-cli.md#create-a-cloud-init-file-to-expedite-linux-virtual-machine-creation)|
|Create linux VM resource|[Azure CLI](../tutorial/nodejs-virtual-machine-vm/create-linux-virtual-machine-azure-cli.md#create-a-virtual-machine-resource)|
|Open port of linux VM|[Azure CLI](../tutorial/nodejs-virtual-machine-vm/create-linux-virtual-machine-azure-cli.md#open-port-for-virtual-machine)|
|View logs|[Azure CLI](../tutorial/nodejs-virtual-machine-vm/azure-monitor-application-insights-nodejs-expressjs-code.md#viewing-the-vm-logs-for-nginx-and-pm2)<br>[Portal](../tutorial/nodejs-virtual-machine-vm/azure-monitor-application-insights-logs.md#view-application-traces-in-azure-portal)|


## Visual Studio Code: Develop and debug JavaScript apps 

[Tool documentation](https://code.visualstudio.com/docs)

|Task|using|
|--|--|
|Code completion|[Visual Studio Code](./with-visual-studio-code/install-run-debug-nodejs.md#use-visual-studio-code-autocompletion-with-mongodb)|
|Debugging local Node.js app|[Visual Studio Code](./with-visual-studio-code/install-run-debug-nodejs.md#debugging-the-local-nodejs-app)|
|Local full-stack debugging|[Visual Studio Code](with-visual-studio-code/install-run-debug-nodejs.md#local-full-stack-debugging-in-visual-studio-code)|
|Navigate the project files and code|[Visual Studio Code](./with-visual-studio-code/install-run-debug-nodejs.md#navigate-the-project-files-and-code)|
|Running the local Node.js app|[Visual Studio Code](./with-visual-studio-code/install-run-debug-nodejs.md#running-the-local-nodejs-app)|

## Samples supporting these tasks

|Name | Description|
|--|--|
|React app using Cognitive Services|Locally build and deploy a React/TypeScript client application to an Azure Static Web App with a GitHub action.<br>[Tutorial](../tutorial/static-web-app/introduction.md) - [Sample code](https://github.com/Azure-Samples/js-e2e-client-cognitive-services)|
|React app uploading file to Azure Storage Blobs|This sample project is a TypeScript React (create-react-app) framework client app with an HTML form to select a file for upload to Azure Storage Blobs.<br>[Tutorial](../tutorial/browser-file-upload-azure-storage-blob.md) - [Sample code](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob)|
|React app with login button|The SPA built in this tutorial is a React app (create-react-app) with the following tasks:<br>* Login using a Microsoft-supported login such as Office 365 or Outlook.com<br>* Log off from the application<br>[Tutorial](../tutorial/single-page-application-azure-login-button-sdk-msal.md) - [Sample code](https://github.com/Azure-Samples/js-e2e-client-azure-login-button)|
|Express.js app with MongoDB database|The tutorial demonstrates how to load and run the project locally with VSCode, using extensions, was well as how to run the code remotely on an App service. The tutorial includes creating a Cosmos DB resource for the Mongo API, getting the connection information and setting that in the app service configuration setting to connect to a cloud database.<br>[Tutorial](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md) - [Sample code](https://github.com/Azure-Samples/js-e2e-express-mongo)|
|Express.js app deployed to VM with cloud-init file|Create a Linux virtual machine (VM) for an Express.js app. The VM is configured with a cloud-init configuration file and includes NGINX and a GitHub repository for an Express.js app. Once the VM is running, you can connect to the VM with SSH, change the web app to including trace logging, and view the public Express.js server app in a web browser.<br>[Tutorial](../tutorial/nodejs-virtual-machine-vm/introduction.md) - [Sample code](https://github.com/Azure-Samples/js-e2e-express-mongo)|

Use the JavaScript end-to-end snippets collection, [https://github.com/azure-samples/js-e2e](https://github.com/azure-samples/js-e2e), to find or submit JavaScript or TypeScript code examples. 

Use the [Azure Samples browser](/samples/browse/?languages=javascript%2cnodejs%2ctypescript) to find more samples supporting your specific use case. 

## Next steps

* [Deploy a web app](deploy-web-app.md)
