---
title: Building an Image Analysis web app with TypeScript 
description: Locally build and run a React/TypeScript client application to an Azure Static Web App with a GitHub action. 
ms.topic: tutorial
ms.date: 08/20/2024
ms.custom: devx-track-js, devx-track-azurecli, devx-track-ts
#Customer intent: As a TypeScript Developer, I want to learn how to build and deploy an image analysis web app so that I can understand hosting AI applications on Azure. 
---

# Tutorial: Build an image analysis web app with TypeScript

In this tutorial, you learn how to locally build and deploy a React/TypeScript client application to an Azure Static Web App with a GitHub action. The React app allows you to analyze an image with Cognitive Services Computer Vision.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Create Azure resources with Azure CLI
> * Add environment variables to remote environment
> * Use GitHub action with environment variables
> * View deployed web app

## Prerequisites

* Azure user account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=azure-docs-js-dev-vscode-tutorial-appservice-extension&mktingSource=azure-docs-js-dev-vscode-tutorial-appservice-extension).
* [Node.js and npm](https://nodejs.org/en/download) - installed to your local machine.
* [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine.
  * [Azure Static Web Apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) - used to deploy React app to Azure Static Web app.
* [Git](https://git-scm.com/downloads) - used to push to GitHub - which activates the GitHub action.
* [GitHub account](https://github.com/join) - to fork and push to a repo.
* Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the bash environment.
* Your Azure account must have a Cognitive Services Contributor role assigned in order for you to agree to the responsible AI terms and create a resource. To get this role assigned to your account, follow the steps in the [Assign roles](/azure/role-based-access-control/role-assignments-steps) documentation, or contact your administrator.

## What is an Azure Static web app

When building static web apps, you have several choices on Azure, based on the degree of functionality and control you are interested in. This tutorial focuses on the easiest service with many of the choices made for you, so you can focus on your front-end code and not the hosting environment.

The React (create-react-app) provides the following functionality:

* Display message if Azure key and endpoint for Cognitive Services [**Computer Vision**](/azure/cognitive-services/computer-vision/) isn't found
* Allows you to analyze an image with Cognitive Services Computer Vision
  * Enter a public image URL or analyze image from collection
  * When analysis is complete
    * Display image
    * Display Computer Vision JSON results

:::image type="content" source="../media/static-web-app/browser-screenshot-react-computervision-app-image-analysis-result.png" alt-text="Screenshot of React Cognitive Service Computer Vision sample results.":::

To deploy the static web app, use a GitHub action, which  starts when a push to a specific branch happens:

* Inserts GitHub secrets for Computer Vision key and endpoint into build
* Builds the React (create-react-app) client
* Moves the resulting files to your Azure [**Static Web app**](/azure/static-web-apps) resource

## Fork the sample repo

Fork the repository, instead of just cloning it to your local computer, in order to have a GitHub repository of your own to push changes to.

1. Open a separate browser window or tab, and to sign in to [GitHub](https://github.com/login).
1. Navigate to the [GitHub sample repository](https://github.com/Azure-Samples/js-e2e-client-cognitive-services).

    ```http
    https://github.com/Azure-Samples/js-e2e-client-cognitive-services
    ```

1. On the top-right section of the page, select **Fork**.
1. Select **Code** then copy the location URL for your fork.

    :::image type="content" source="../media/static-web-app/browser-screenshot-clone-github-sample-repository-fork.png" alt-text="Screenshot of GitHub website, select **Code** then copy the location for your fork.":::

## Create local development environment

1. In a terminal or bash window, clone your fork to your local computer. Replace `YOUR-ACCOUNT-NAME` with your GitHub account name.

    ```bash
    git clone https://github.com/YOUR-ACCOUNT-NAME/js-e2e-client-cognitive-services
    ```

1. Change to the new directory and install the dependencies.

    ```bash
    cd js-e2e-client-cognitive-services && npm install
    ```

    The installation step installs the required dependencies, including [@azure/cognitiveservices-computervision](https://www.npmjs.com/package/@azure/cognitiveservices-computervision).

## Run the local sample

1. Run the sample.

    ```bash
    npm start
    ```

    :::image type="content" source="../media/static-web-app/browser-screenshot-react-cognitive-services-app-before-authentication.png" alt-text="Screenshot of React Cognitive Service Computer Vision sample for image analysis before key and endpoint set.":::

1. Stop the app. Either close the terminal window or use `control+c` at the terminal.

## Create your resource group

At a terminal or bash shell, enter the [Azure CLI command to create an Azure resource group](/cli/azure/group#az-group-create), with the name `rg-demo`:

```azurecli
az group create \
    --location eastus \
    --name rg-demo \
    --subscription YOUR-SUBSCRIPTION-NAME-OR-ID
```

## Create a Computer Vision resource

Creating a resource group allows you to easily find the resources, and delete them when you are done. This type of resource requires that you agree to the Responsible Use agreement. Use the following list to know how you can quickly create the correct resource:

* [Your first Computer Vision resource](#create-your-first-computer-vision-resource) - agree to the Responsible Use agreement
* [Additional Computer Vision](#create-an-additional-computer-vision-resource) - already agreed to the Responsible Use agreement

## Create your first Computer Vision resource

If this is your first AI service, you must create the service through the portal and agree to the Responsible Use agreement, as part of that resource creation. If this isn't your first resource requiring the Responsible Use agreement, you can create the resource with the Azure CLI, found in the next section.

Use the following table to help [create the resource within the Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision).

|Setting|Value|
|--|--|
|Resource group|rg-demo|
|Name|demo-ComputerVision|
|Sku|S1|
|Location|eastus|

## Create an additional Computer Vision resource

Run the following command to [create a Computer Vision resource](/cli/azure/cognitiveservices/account#az-cognitiveservices-account-create):

```azurecli
az cognitiveservices account create \
    --name demo-ComputerVision \
    --resource-group rg-demo \
    --kind ComputerVision \
    --sku S1 \
    --location eastus \
    --yes
```

## Get Computer Vision resource endpoint and keys

1. In the results, find and copy the `properties.endpoint`. You will need that later.

    ```json
    ...
    "properties":{
        ...
        "endpoint": "https://eastus.api.cognitive.microsoft.com/",
        ...
    }
    ...
    ```

1. Run the following [command](/cli/azure/cognitiveservices/account/keys#az-cognitiveservices-account-keys-list) to get your keys.

    ```azurecli
    az cognitiveservices account keys list \
    --name demo-ComputerVision \
    --resource-group rg-demo
    ```

1. Copy one of the keys, you will need that later.

    ```json
    {
      "key1": "8eb7f878bdce4e96b26c89b2b8d05319",
      "key2": "c2067cea18254bdda71c8ba6428c1e1a"
    }
    ```

## Add environment variables to your local environment

To use your resource, the local code needs to have the key and endpoint available. This code base stores those in environment variables:

* REACT_APP_AZURE_COMPUTER_VISION_KEY
* REACT_APP_AZURE_COMPUTER_VISION_ENDPOINT

1. Run the following command to add these variables to your environment.

    #### [bash](#tab/bash)

    ```bash
    export REACT_APP_AZURE_COMPUTER_VISION_KEY="REPLACE-WITH-YOUR-KEY"
    export REACT_APP_AZURE_COMPUTER_VISION_ENDPOINT="REPLACE-WITH-YOUR-ENDPOINT"
    ```

    #### [cmd](#tab/cmd)

    ```cmd
    set REACT_APP_AZURE_COMPUTER_VISION_KEY="REPLACE-WITH-YOUR-KEY"
    set REACT_APP_AZURE_COMPUTER_VISION_ENDPOINT="REPLACE-WITH-YOUR-ENDPOINT"
    ```
    ---

## Add environment variables to your remote environment

When using Azure Static web apps, environment variables such as secrets, need to be passed from the GitHub action to the Static web app. The GitHub action builds the app, including the Computer Vision key and endpoint passed in from the GitHub secrets for that repository, then pushes the code with the environment variables to the static web app.

1. In a web browser, on your GitHub repository, select **Settings**, then **Secrets**, then **New repository secret**..

    :::image type="content" source="../media/static-web-app/browser-screenshot-github-create-new-repository-secret.png" alt-text="Screenshot of GitHub repository, creating new repository secret.":::

1. Enter the same name and value for the endpoint you used in the previous section. Then create another secret with the same name and value for the key as used in the previous section.

    :::image type="content" source="../media/static-web-app/browser-screenshot-github-add-new-secret.png" alt-text="Screenshot of entering the same name and value for the endpoint. Then create another secret with the same name and value for the key.":::

## Run local react app with ComputerVision resource

1. Start the app again, at the command line:

    ```bash
    npm start
    ```

    :::image type="content" source="../media/static-web-app/browser-screenshot-react-computervision-app-start-up.png" alt-text="Screenshot of React Cognitive Service Computer Vision sample ready for URL or press enter.":::

1. Leave the text field empty, to select an image from the default catalog, and select the **Analyze** button.

    :::image type="content" source="../media/static-web-app/browser-screenshot-react-computervision-app-image-analysis-result.png" alt-text="Screenshot of React Cognitive Service Computer Vision sample results.":::

    The image is selected randomly from a catalog of images defined in `./src/DefaultImages.js`.

1. Continue to select the **Analyze** button to see the other images and results.

## Push the local branch to GitHub

In the Visual Studio Code terminal, push the local branch, `main` to your remote repository.

```bash
git push origin main
```

You didn't need to commit any changes because no changes were made yet.

## Create a Static Web app resource

1. Select the **Azure** icon, then right-click on the **Static Web Apps** service, then select **Create Static Web App (Advanced)**.

    :::image type="content" source="../media/static-web-app/visualstudiocode-storage-extension-create-static-web-resource.png" alt-text="Screenshot with Visual Studio extension":::

1. If a pop-up window asks if you want to continue on the `main` branch, select **Continue**.

1. Enter the following information in the subsequent fields, presented one at a time.

    |Field name| value|
    |--|--|
    |Select a resource group for new resources.|Select the resource group you created for your ComputerVision resource, `demo-ComputerVision`.|
    |Enter a name for the new static web app.|`Demo-ComputerVisionAnalyzer`|
    |Select pricing option|Select **free**.|
    |Select the location of your application code.|Select the same location you selected when you created your resource group, `eastus`.|
    |Choose build preset to configure default project structure.|`React`| 
    |Choose the location of your application code.|`/`|
    |Enter the location of your Azure Functions code.|Take the default value.|
    |Enter the path of your build output relative to your app's location.|`build`|

## Update the GitHub action with secret environment variables

The Computer Vision key and endpoint are in the repository's secrets collection but are not in the GitHub action yet. This step adds the key and endpoint to the action.

1. Pull down the changes made from creating the Azure resource, to get the GitHub action file.

    ```bash
    git pull origin main
    ```

1. In the Visual Studio Code editor, edit the GitHub Action file found at `./.github/workflows/` to add the secrets.

    :::code language="yml" source="~/../js-e2e-client-cognitive-services/sample-github-workflow.yml" highlight="34-36" :::

1. Add and commit the change to the local `main` branch.

    ```bash
    git add . && git commit -m "add secrets to action"
    ```

1. Push the change to the remote repository, starting a new build-and-deploy action to your Azure Static web app.

    ```bash
    git push origin main
    ```

## View the GitHub Action build process

1. In a web browser, open your GitHub repository for this tutorial, and select **Actions**.

1. Select the top build in the list, then select **Build and Deploy Job** on the left-side menu to watch the build process. Wait until the **Build And Deploy** successfully finishes.

    :::image type="content" source="../media/static-web-app/browser-screenshot-github-action-build-react-computer-vision-app.png" alt-text="Screenshot of GitHub action building the app.":::

## View remote Azure static web site in browser

1. In Visual Studio Code, select the **Azure** icon in the far right menu, then select your Static web app, then right-click **Browse site**, then select **Open** to view the public static web site.

:::image type="content" source="../media/static-web-app/visualstudiocode-browse-static-web-app.png" alt-text="Screenshot of web browser: Select `Browse site`, then select `Open` to view the public static web site. ":::

You can also find the URL for the site at:

* the Azure portal for your resource, on the **Overview** page.
* the GitHub action's build-and-deploy output has the site URL at the very end of the script

## Code: Add Computer Vision to local React app

Use npm to add Computer Vision to the package.json file.

```bash
npm install @azure/cognitiveservices-computervision 
```

## Code: Add Computer Vision code as separate module

The Computer Vision code is contained in a separate file named `./src/azure-cognitiveservices-computervision.js`. The main function of the module is highlighted.

:::code language="javascript" source="~/../js-e2e-client-cognitive-services/src/azure-cognitiveservices-computervision.js" highlight="57-77" :::

## Code: Add catalog of images as separate module

The app selects a random image from a catalog if the user doesn't enter an image URL. The random selection function is highlighted

:::code language="javascript" source="~/../js-e2e-client-cognitive-services/src/DefaultImages.js" highlight="35-37" :::

## Code: Add custom Computer Vision module to React app

Add methods to the React `app.js`. The image analysis and display of results are highlighted.

:::code language="javascript" source="~/../js-e2e-client-cognitive-services/src/App.js" highlight="22-27, 31-44" :::

## Clean up resources

Once you have completed this tutorial, you need to remove the resource group, which includes the Computer Vision resource and Static web app, to make sure you are not billed for any more usage.

[!INCLUDE [3 ways to delete resource group](../includes/resource-group-remove.md)]

## Related content

* [**Sample code**](https://github.com/Azure-Samples/js-e2e-client-cognitive-services)
* [SPA that signs in users and calls web API](/azure/active-directory/develop/scenario-spa-overview)
