---
title: Convert text to speech on client and server with Cognitive Services
description: Use Cognitive Services Speech to convert text to speech, demonstrated on the client and the server. 
ms.topic: tutorial
ms.date: 01/20/2021
ms.custom: languages:JavaScript, devx-track-javascript
---

# Convert text to speech with Cognitive Services Speech

In this tutorial, add Cognitive Services Speech to an existing Express.js app to add conversion from text to speech using the Cognitive Services Speech service. Converting text to speech allows you to provide audio without the cost of manually generating the audio. 

## Application architecture

The tutorial takes a minimal Express.js app and adds functionality using a combination of:

* new route for the server API to provide conversion from text to speech, returning an MP3 stream
* new route for an HTML form to allow you to enter your information
* new HTML form, with JavaScript, provides a client-side call to the Speech service

This application provides three different calls to convert speech to text:

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
   - If you're using a local install, sign in with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.  To finish the authentication process, follow the steps displayed in your terminal.  See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for more sign-in options.
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

    :::code language="javascript" source="~/../js-e2e-express-server-cognitive-services/text-to-speech/src/azure-cognitiveservices-speech.js" highlight="3,21,32" :::

    * Parameters - The file pulls in the dependencies for using the SDK, streams, buffers, and the file system (fs). The `textToSpeech` function takes four arguments. If a file name with local path is sent, the text is converted to an audio file. If a file name is not sent, an in-memory audio stream is created. 
    * Speech SDK method - The Speech SDK method [synthesizer.speakTextAsync](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechsynthesizer?view=azure-node-latest#speakTextAsync_string___e__SpeechSynthesisResult_____void___e__string_____void__AudioOutputStream___PushAudioOutputStreamCallback___PathLike_) returns different types, based on the configuration it receives. 
        The method returns the result, which differs based on what the method was asked to do:
        * Create file 
        * Create in-memory stream as an array of Buffers
    * Audio format - The audio format selected is MP3, but [other formats](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechsynthesisoutputformat?preserve-view=true&view=azure-node-latest) exists, along with other [Audio configuration methods](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig?preserve-view=true&view=azure-node-latest#methods). 

    The textToSpeech converts the SDK function converts from callback into a promise. 

## Create a new route for the Express.js app

1. Open the `src/server.js` file. 
1. Add the `azure-cognitiveservices-speech.js` module as a dependency at the top of the file:

    :::code language="javascript" source="~/../js-e2e-express-server-cognitive-services/text-to-speech/src/server.js" range="2"  :::
    

1. Add a new API route to call the **textToSpeech** method created in the previous section of the tutorial. 

    :::code language="javascript" source="~/../js-e2e-express-server-cognitive-services/text-to-speech/src/server.js" range="30-51" highlight="45-50" :::

    This method takes the required and optional parameters for the textToSpeech method from the API querystring. If a file needs to be created, a unique file name is developed. The textToSpeech method is called asynchronously and returned as a piped stream. 

## Update the client web page with a form 

Update the client HTML web page with a form that collects the required parameters. The optional parameter is passed in based on which audio control the user selects. Because this tutorial provides a mechanism to call the Azure Speech service from the client, that JavaScript is also provided. 

Open the `/public/client.html` file and replace its contents with the following:

:::code language="html" source="~/../js-e2e-express-server-cognitive-services/text-to-speech/public/client.html" highlight="75, 102 137" :::

Highlighted lines in the file: 

* Line 74: The Azure Speech SDK is pulled into the client library, using the `cdn.jsdelivr.net` site to deliver the NPM package. 
* Line 102: The `updateSrc` method updates the audio controls' `src` URL with the querystring including the key, region, and text. 
* Line 137: If a user selects the `Get directly from Azure` button, the web page calls directly to Azure from the client page and process the result. 

## Create Cognitive Services Speech resource

Create the Speech resource with Azure CLI commands in an Azure Cloud Shell.


1. Log in to the [Azure Cloud Shell](https://shell.azure.com). This requires you to authenticate in a browser with your account, which has permission on a valid Azure Subscription. 
1. Create a resource group for your Speech resource. 

    ```azurecli
    az group create \
        --location eastus \
        --name tutorial-resource-group-eastus
    ```

1. Create a Speech resource in the resource group.

    ```azurecli
    az cognitiveservices account create \
        --kind SpeechServices \
        --location eastus \
        --name tutorial-speech \
        --resource-group tutorial-resource-group-eastus \
        --sku F0
    ```

    This command will fail if your only free Speech resource has already been created. 

1. Use the command to get the key values for the new Speech resource. 

    ```azurecli
    az cognitiveservices account keys list \
        --name tutorial-speech \
        --resource-group tutorial-resource-group-eastus \
        --output table
    ```

1. Copy one of the keys. 

    You use the key in the web form to authenticate to the Azure Speech service.

## Run the Express.js app to convert text to speech

1. Start the app with the following bash command.

    ```bash
    npm start
    ```

1. Open the web app in a browser.

    ```
    http://localhost:3000    
    ```

1. Paste your Speech key into the highlighted text box. 

    :::image type="content" source="../media/speech-tutorial/expressjs-webapp-form-with-speech-key-field-highlighted.png" alt-text="Browser screenshot of web form with Speech key input field highlighted.":::

1. Optionally, change the text to something new. 

1. Select one of the three buttons to begin the conversion to the audio format:
    * Get directly from Azure - client-side call to Azure
    * Audio control for audio from file
    * Audio control for audio from buffer

    You may notice a small delay between selecting the control and the audio playing. 



## Clean up resources by removing resource group

Once you have completed this tutorial, you need to remove the resource group, which includes the resource, to make sure you are not billed for any more usage. 

In the Azure Cloud shell, use the [Azure CLI command](/cli/azure/group#az_group_delete) to delete the resource group:

```azurecli
az group delete --name tutorial-resource-group-eastus  -y
```

This command may take a few minutes. 

## Next steps

* [Deploy Express.js MongoDB app to App Service from Visual Studio Code](deploy-nodejs-mongodb-app-service-from-visual-studio-code.md)