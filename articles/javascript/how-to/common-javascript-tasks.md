---
title: Top Azure tasks for JavaScript developers
description: Find an example of your current tasks.
ms.topic: reference
ms.date: 01/04/2021
ms.custom: devx-track-js
---

# Common top tasks for JavaScript developers

Find an example of your current task. If you can't find a task, leave feedback requesting your task. 

## App registration

|Task|using|
|--|--|
|Create app registration|[Portal](../tutorial/single-page-application-azure-login-button-sdk-msal.md#3-create-app-registration-for-authentication)|

## Application settings

|Task|using|
|--|--|
|Set local environment variables|[Bash](../tutorial/static-web-app/create-computer-vision-resource-use-in-code.md#add-environment-variables-to-your-local-environment)|
|Create Storage container shared access signature (SAS) token|[Portal](../tutorial/browser-file-upload-azure-storage-blob.md#5-generate-your-shared-access-signature-sas-token)|
|Set SAS token in code|[TypeScript](../tutorial/browser-file-upload-azure-storage-blob.md#set-sas-token-in-code-file)|
|Configure CORS for Storage|[Portal](../tutorial/browser-file-upload-azure-storage-blob.md#6-configure-cors-for-azure-storage-resource)|

## Authentication

|Task|using|
|--|--|
|Microsoft Login/Logoff button using `@azure/msal-browser`|[React/TypeScript](../tutorial/single-page-application-azure-login-button-sdk-msal.md#5-add-login-and-logoff-buttons)|
|Revoke AAD permission|[https://myapplications.microsoft.com/](https://myapplications.microsoft.com/)|
|Revoke Consumer permission|[https://account.live.com/consent/manage](https://account.live.com/consent/manage)|

## Azure Resource Groups

|Task|using|
|--|--|
|Create resource group|[Azure CLI](../tutorial/static-web-app/create-computer-vision-resource-use-in-code.md#create-azure-resources)|
|Delete resource group|[Azure CLI](../tutorial/static-web-app/clean-up-resources.md#remove-all-the-resources-by-removing-resource-group)|

## Static web apps

|Task|using|
|--|--|
|Create Angular app|[Bash](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-02.md?tabs=angular)
|Create React app targeting JavaScript language|[Bash](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-02.md?tabs=react)|
|Create React app targeting TypeScript language|[Bash](../tutorial/single-page-application-azure-login-button-sdk-msal.md#4-create-react-single-page-application-for-typescript)|
|Create Vue app|[Bash](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-02.md?tabs=vue)|
|Create Svelte app|[Bash](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-02.md?tabs=svelte)
|Create Static web app|[Visual Studio Code extension](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#create-a-static-web-app-resource)|
|Create Storage-hosted static app|[Visual Studio Code extension](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-03.md)|
|Deploy Storage-hosted static app|[Visual Studio Code extension](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-04.md)|
|Browse site|[Visual Studio Code extension](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#view-azure-static-web-site-in-browser)|

## Function (serverless) apps

|Task|using|
|--|--|
|Create Functions app locally|[Visual Studio Code extension](../tutorial/tutorial-vscode-serverless-node-create-local.md)|
|HTTP trigger code|[JavaScript](../tutorial/tutorial-vscode-serverless-node-create-local.md#http-function-javascript-template-code)|
|Debug/test function locally|[Visual Studio Code](../tutorial/tutorial-vscode-serverless-node-test-local.md)|
|Deploy function to Azure cloud|[Visual Studio Code extension](../tutorial/tutorial-vscode-serverless-node-deploy-hosting.md)|
|Verify function is available on public URL|[Visual Studio Code extension/Browser](../tutorial/tutorial-vscode-serverless-node-deploy-hosting.md#verify-functions-app-is-publicly-available-with-browser)
|Remove function app resource|[Visual Studio Code extension](../tutorial/tutorial-vscode-serverless-node-remove-resource.md)|

## App service - full-stack, server-only, or client-only apps

|Task|using|
|--|--|
|Create local Express.js app|[Bash](../tutorial/deploy-nodejs-azure-app-service-with-visual-studio-code.md?tabs=bash#3-create-a-local-expressjs-app)
|Create app resource - includes: deploy Express.js app, stream logs|[Visual Studio Code extension](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md#create-web-app-resource-and-deploy-expressjs-app)|
|Create app resource - includes: deploy Express.js app, configure app settings, run npm install, browse to deployed website|[Visual Studio Code extension](../tutorial/deploy-nodejs-azure-app-service-with-visual-studio-code.md?tabs=bash#6-create-app-service-resource-in-visual-studio-code)|
|Create app resource|[Azure CLI](../tutorial/tutorial-vscode-azure-cli-node/tutorial-vscode-azure-cli-node-03.md)|
|Delete app resource|[Visual Studio Code extension](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md#clean-up-resources)|
|Stream remote logs|[Visual Studio Code extension](../tutorial/deploy-nodejs-azure-app-service-with-visual-studio-code.md?tabs=bash#7-stream-remote-service-logs-in-visual-studio-code)|


## Storage

|Task|using|
|--|--|
|Create resource|[Visual Studio Code extension](../tutorial/browser-file-upload-azure-storage-blob.md#3-create-storage-resource-with-visual-studio-extension)|
|Delete resource|[Visual Studio Code extension](../tutorial/browser-file-upload-azure-storage-blob.md#clean-up-resources)|
|Create Storage-hosted static app|[Visual Studio Code extension](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-03.md)|
|Deploy Storage-hosted static app|[Visual Studio Code extension](../tutorial/tutorial-vscode-static-website-node/tutorial-vscode-static-website-node-04.md)|

### Blobs

|Task|using|
|--|--|
|Create container in storage with [`@azure/storage-blob`](https://www.npmjs.com/package/@azure/storage-blob)|[React/TypeScript](../tutorial/browser-file-upload-azure-storage-blob.md#create-storage-client-and-manage-steps)|
|Upload file to storage with [`@azure/storage-blob`](https://www.npmjs.com/package/@azure/storage-blob)|[React/TypeScript](../tutorial/browser-file-upload-azure-storage-blob.md#upload-button-functionality)|
|List files in Storage container with [`@azure/storage-blob`](https://www.npmjs.com/package/@azure/storage-blob)|[React/TypeScript](../tutorial/browser-file-upload-azure-storage-blob.md#get-list-of-blobs)|

## Cognitive Services

|Task|using|
|--|--|
|Create Cognitive Services _ComputerVision_ resource|[Azure CLI](../tutorial/static-web-app/create-computer-vision-resource-use-in-code.md#create-azure-resources)|
|Get Cognitive Services _ComputerVision_ resource|[Azure CLI](../tutorial/static-web-app/create-computer-vision-resource-use-in-code.md#create-azure-resources)|
|Install Azure SDK|[Bash](../tutorial/static-web-app/add-computer-vision-react-app.md#add-computer-vision-to-local-react-app)|
|Analyze image with [`@azure/cognitiveservices-computervision`](https://www.npmjs.com/package/@azure/cognitiveservices-computervision)|[Visual Studio Code](../tutorial/static-web-app/add-computer-vision-react-app.md#add-computer-vision-code-as-separate-module)|

## Databases

|Task|using|
|--|--|
|Create CosmosDB - MongoDB resource|[Visual Studio Code extension](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md)|
|Get CosmosDB connection string|[Visual Studio Code extension](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md#get-cosmosdb-connection-string)|

## Git

|Task|using|
|--|--|
|Initialize local Git repository|[Visual Studio Code extension](../tutorial/deploy-nodejs-azure-app-service-with-visual-studio-code.md?tabs=bash#5-initialize-git-in-visual-studio-code-for-current-app)|

## GitHub actions 

|Task|using|
|--|--|
|Add secrets|[Visual Studio Code](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#create-a-static-web-app-resource)|
|View build process|[GitHub website](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#view-the-github-action-build-process)|

## Azure resource group

|Task|using|
|--|--|
|Create resource group|[Azure CLI](../tutorial/tutorial-vscode-azure-cli-node/tutorial-vscode-azure-cli-node-03.md)|

## Visual Studio Code

|Task|using|
|--|--|
|Clone GitHub repo|[Visual Studio Code](../tutorial/browser-file-upload-azure-storage-blob.md#2-clone-and-run-the-initial-react-app)|

## Samples supporting these tasks

|Name | Description|
|--|--|
|Build and deploy a Static Web app to Azure|Locally build and deploy a React/TypeScript client application to an Azure Static Web App with a GitHub action.<br>[Tutorial](../tutorial/static-web-app/introduction.md) - [Sample code](https://github.com/Azure-Samples/js-e2e-client-cognitive-services)|
|Upload file to Azure Storage Blobs|This sample project is a TypeScript React (create-react-app) framework client app with an HTML form to select a file for upload to Azure Storage Blobs.<br>[Tutorial](../tutorial/browser-file-upload-azure-storage-blob.md) - [Sample code](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob)|
|Add login button to client application|The SPA built in this tutorial is a React app (create-react-app) with the following tasks:<br>* Login using a Microsoft-supported login such as Office 365 or Outlook.com<br>* Log off the application<br>[Tutorial](../tutorial/single-page-application-azure-login-button-sdk-msal.md) - [Sample code](https://github.com/Azure-Samples/js-e2e-client-azure-login-button)|
|CosmosDB (MongoDB)/Express.js app deployed to App service|The tutorial demonstrates how to load and run the project locally with VSCode, using extensions, was well as how to run the code remotely on an App service. The tutorial includes creating a CosmosDB resource for the Mongo API, getting the connection information and setting that in the app service configuration setting to connect to a cloud database.<br>[Tutorial](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md#get-cosmosdb-connection-string) - [Sample code](https://github.com/Azure-Samples/js-e2e-express-mongo)|

## Next steps

* [Deploy a web app](deploy-web-app.md)