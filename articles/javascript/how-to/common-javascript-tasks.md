---
title: Top Azure tasks for JavaScript developers
description: Find an example of your current tasks.
ms.topic: reference
ms.date: 01/04/2021
ms.custom: devx-track-js
---

# Common top tasks for JavaScript developers

Find an example of your current task.

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
|Create React app targeting TypeScript language|[Bash](../tutorial/single-page-application-azure-login-button-sdk-msal.md#4-create-react-single-page-application-for-typescript)|
|Create Static web app|[Visual Studio Code extension](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#create-a-static-web-app-resource)|
|Browse site|[Visual Studio Code extension](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#view-azure-static-web-site-in-browser)|

## Storage

|Task|using|
|--|--|
|Create resource|[Visual Studio Code extension](../tutorial/browser-file-upload-azure-storage-blob.md#3-create-storage-resource-with-visual-studio-extension)|
|Delete resource|[Visual Studio Code extension](../tutorial/browser-file-upload-azure-storage-blob.md#clean-up-resources)|

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

## GitHub actions 

|Task|using|
|--|--|
|Add secrets|[Visual Studio Code](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#create-a-static-web-app-resource)|
|View build process|[GitHub website](../tutorial/static-web-app/create-static-web-app-visual-studio-code-extension.md#view-the-github-action-build-process)|

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

## Next steps

* [Deploy a web app](deploy-web-app.md)