---
title: Convert text to speech on client and server with Cognitive Services
description: Use Cognitive Services Speech to convert text to speech, demonstrated on the client and the server. 
ms.topic: tutorial
ms.date: 01/20/2021
ms.custom: languages:JavaScript, devx-track-javascript
---

# Convert text to speech with Cognitive Services Speech

In this tutorial, you will add Cognitive Services Speech to an existing Express.js app for the purpose of adding conversion from text to speech using the Cognitive Services Speech service. Converting text to speech allows you to provide audio without the cost of manually generating the audio. 

## Application architecture

The tutorial takes a minimal Express.js app and adds functionality using a combination of:

* new route for the server API to provide conversion from text to speech, returning an MP3 stream
* new route for an HTML form to allow you to enter your information
* new HTML form with JavaScript provide a client-side call to the Speech service

This application provides 3 different calls to convert speech to text:

* The first server call creates a file on the server then returns it to the client. You would typically use this for longer text or text you know should be served more than once. 
* The second server call is for shorter term text and is help in-memory before returned to the client. 
* The client call demonstrates a direct call to the Speech service using the SDK. You may choose to make this call if you have a client-only application without a server. 

## Prerequisites


- [Node.js 8x+ and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
    - [Azure Static Web Apps (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) - used to deploy React app to Azure Static Web app.
- [Git](https://git-scm.com/downloads) - used to push to GitHub - which activates the GitHub action.
- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the bash 
   [![Embed launch](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png "Launch Azure Cloud Shell")](https://shell.azure.com)   
- If you prefer, [install](/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.
   - If you're using a local install, sign in with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.  To finish the authentication process, follow the steps displayed in your terminal.  See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for additional sign-in options.
  - When you're prompted, install Azure CLI extensions on first use.  For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az_version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az_upgrade).

## Download sample Express.js repo 

1. Using git, clone the Express.js sample repo to your local computer. 

    ```bash
    git clone https://github.com/Azure-Samples/js-e2e-express-server
    ```

1. Change to the new directory for the sample.

    ```bash
    cd js-e2e-express-server
    ```

1. Open the project in Visual Studio Code.

    ```bash
    code .
    ```

1. Open a new terminal in Visual Studio Code and install the project dependencies.

    ```bash
    npm install
    ```

## Install Cognitive Services Speech SDK for JavaScript

From the Visual Studio Code terminal, install the Azure Cognitive Services Speech SDK.

```bash
npm install microsoft-cognitiveservices-speech-sdk
```

## Create a Speech module for the Express.js app

1. To integrate the Speech SDK into the Express.js application, create a file in the `src` folder named `azure-cognitiveservices-speech.js`.
1. Add the following code to pull in dependencies and create a function to convert text to speech.

    ```javascript
    
    ```

1. 

## Create a new route for the Express.js app

## Update the client web page with a form 

## Run the Express.js app to convert text to speech

## Next steps