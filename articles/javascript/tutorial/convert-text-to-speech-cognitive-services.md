---
title: Express.js app converts text to speech with Cognitive Services Speech
description: Use Cognitive Services Speech to convert text to speech, demonstrated on the client and the server. 
ms.topic: how-to
ms.date: 01/18/2024
ms.custom: languages:JavaScript, devx-track-js, devx-track-azurecli
# Verified full run with CommonJS: 01/18/2024
---

# Express.js app converts text to speech with Cognitive Services Speech

In this tutorial, add Cognitive Services Speech to an existing Express.js app to add conversion from text to speech using the Cognitive Services Speech service. Converting text to speech allows you to provide audio without the cost of manually generating the audio. 

This tutorial shows 3 different ways to convert text to speech from Azure Cognitive Services Speech:

* Client JavaScript gets audio directly 
* Server JavaScript gets audio from file (*.MP3)
* Server JavaScript gets audio from in-memory arrayBuffer

## Application architecture

The tutorial takes a minimal Express.js app and adds functionality using a combination of:

* new route for the server API to provide conversion from text to speech, returning an MP3 stream
* new route for an HTML form to allow you to enter your information
* new HTML form, with JavaScript, provides a client-side call to the Speech service

This application provides three different calls to convert speech to text:

* The first server call creates a file on the server then returns it to the client. You would typically use this for longer text or text you know should be served more than once. 
* The second server call is for shorter term text and is held in-memory before returned to the client. 
* The client call demonstrates a direct call to the Speech service using the SDK. You may choose to make this call if you have a client-only application without a server. 

## Prerequisites


- [Node.js LTS](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
- The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for VS Code (installed from within VS Code).
- [Git](https://git-scm.com/downloads) - used to push to GitHub - which activates the GitHub action.
- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the bash 
   [![Embed launch](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png "Launch Azure Cloud Shell")](https://shell.azure.com)   
- If you prefer, [install](/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.
   - If you're using a local install, sign in with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.  To finish the authentication process, follow the steps displayed in your terminal.  See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for more sign-in options.
  - When you're prompted, install Azure CLI extensions on first use.  For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).

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
    * Speech SDK method - The Speech SDK method [synthesizer.speakTextAsync](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechsynthesizer#speakTextAsync_string___e__SpeechSynthesisResult_____void___e__string_____void__AudioOutputStream___PushAudioOutputStreamCallback___PathLike_) returns different types, based on the configuration it receives. 
        The method returns the result, which differs based on what the method was asked to do:
        * Create file 
        * Create in-memory stream as an array of Buffers
    * Audio format - The audio format selected is MP3, but [other formats](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechsynthesisoutputformat?preserve-view=true&view=azure-node-latest) exists, along with other [Audio configuration methods](/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig?preserve-view=true&view=azure-node-latest#methods). 

    The local method, `textToSpeech`, wraps and converts the SDK call-back function into a promise. 

## Create a new route for the Express.js app

1. Open the `src/server.js` file. 
1. Add the `azure-cognitiveservices-speech.js` module as a dependency at the top of the file:

    :::code language="javascript" source="~/../js-e2e-express-server-cognitive-services/text-to-speech/src/server.js" range="3"  :::
    

1. Add a new API route to call the **textToSpeech** method created in the previous section of the tutorial. Add this code after the `/api/hello` route.

    :::code language="javascript" source="~/../js-e2e-express-server-cognitive-services/text-to-speech/src/server.js" range="30-51" highlight="45-50" :::

    This method takes the required and optional parameters for the `textToSpeech` method from the querystring. If a file needs to be created, a unique file name is developed. The `textToSpeech` method is called asynchronously and pipes the result to the response (`res`) object. 

## Update the client web page with a form 

Update the client HTML web page with a form that collects the required parameters. The optional parameter is passed in based on which audio control the user selects. Because this tutorial provides a mechanism to call the Azure Speech service from the client, that JavaScript is also provided. 

Open the `/public/client.html` file and replace its contents with the following:

:::code language="html" source="~/../js-e2e-express-server-cognitive-services/text-to-speech/public/client.html" highlight="75, 102 137" :::

Highlighted lines in the file: 

* Line 74: The Azure Speech SDK is pulled into the client library, using the `cdn.jsdelivr.net` site to deliver the NPM package. 
* Line 102: The `updateSrc` method updates the audio controls' `src` URL with the querystring including the key, region, and text. 
* Line 137: If a user selects the `Get directly from Azure` button, the web page calls directly to Azure from the client page and processes the result. 

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

    You use the key by pasting it into the web form of the Express app to authenticate to the Azure Speech service.

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

## Create new Azure App service in Visual Studio Code

1. From the command palette (**Ctrl**+**Shift**+**P**), type "create web" and select **Azure App Service: Create New Web App...Advanced**. You use the advanced command to have full control over the deployment including resource group, App Service Plan, and operating system rather than use Linux defaults.

1. Respond to the prompts as follows:

    - Select your **Subscription** account.
    - For **Enter a globally unique name** like `my-text-to-speech-app`. 
        - Enter a name that's unique across all of Azure. Use only alphanumeric characters ('A-Z', 'a-z', and '0-9') and hyphens ('-')
    - Select `tutorial-resource-group-eastus` for the resource group.
    - **Select a runtime stack** of a version that includes `Node` and `LTS`. 
    - Select the Linux operating system.
    - Select **Create a new App Service plan**, provide a name like `my-text-to-speech-app-plan`.
    - Select the **F1** free [pricing tier](../core/what-is-azure-for-javascript-development.md#free-tier-resources). If your subscription already has a free web app, select the `Basic` tier.
    - Select **Skip for now** for the Application Insights resource.
    - Select the `eastus` location. 

1. After a short time, Visual Studio Code notifies you that creation is complete. Close the notification with the **X** button.

## Deploy local Express.js app to remote App service in Visual Studio Code

1. With the web app in place, deploy your code from the local computer. Select the Azure icon to open the **Azure App Service** explorer, expand your subscription node, right-click the name of the web app you just created, and select **Deploy to Web App**.

1. If there are deployment prompts, select the root folder of the Express.js app, select your **subscription** account again and then select the name of the web app, `my-text-to-speech-app`, created earlier.

1. If prompted to run `npm install` when deploying to Linux, select **Yes** if prompted to update your configuration to run `npm install` on the target server.

    ![Prompt to update configuration on the target Linux server](../media/deploy-azure/server-build.png)

1. Once deployment is complete, select **Browse Website** in the prompt to view your freshly deployed web app. 

1. (Optional): You can make changes to your code files, then use the **Deploy to Web App**, in the Azure App service extension, to update the web app.

## Stream remote service logs in Visual Studio Code

View (tail) any output that the running app generates through calls to `console.log`. This output appears in the **Output** window in Visual Studio Code.

1. In the **Azure App Service** explorer, right-click your new app node and choose **Start Streaming Logs**.

    <pre>
    Starting Live Log Stream ---
    </pre>

1. Refresh the web page a few times in the browser to see additional log output.


## Clean up resources by removing resource group

Once you have completed this tutorial, you need to remove the resource group, which includes the resource, to make sure you are not billed for any more usage. 

In the Azure Cloud Shell, use the [Azure CLI command](/cli/azure/group#az-group-delete) to delete the resource group:

```azurecli
az group delete --name tutorial-resource-group-eastus  -y
```

This command may take a few minutes. 

## Next steps

* [Deploy Express.js MongoDB app to App Service](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli)