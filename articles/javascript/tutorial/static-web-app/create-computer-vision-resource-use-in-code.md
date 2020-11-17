---
title: Create Computer Vision resource
description: Create your Cognitive Services Computer Vision resource and set to environment variables.
ms.topic: tutorial
ms.date: 11/13/2020
ms.custom: devx-track-js
---

# 3. Create Computer Vision resource and use in code

In this step, create your Computer Vision resource and set to environment variables. 

## Create Azure resources

Creating a resource group allows you to easily find the resources, and delete them when you are done.

At the end of this series of steps, you need to have **the key and endpoint** for your resource.

1. At a terminal or bash shell, enter the [Azure CLI command to create an Azure resource group](/cli/azure/group?view=azure-cli-latest#az_group_create), with the name `rg-demo-eastus`:

    ```azurecli
    az group create \
        --location eastus \
        --name rg-demo 
    ```
1. Run the following command to [create a Computer Vision resource](/cli/azure/cognitiveservices/account?view=azure-cli-latest#az-cognitiveservices-account-create):


    ```azurecli
    az cognitiveservices account create \
        --name demo-ComputerVision \
        --resource-group rg-demo \
        --kind ComputerVision \
        --sku F0 \
        --location eastus \
        --yes
    ```

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

1. Run the following [command](/cli/azure/cognitiveservices/account/keys?view=azure-cli-latest#az-cognitiveservices-account-keys-list) to get your keys. 

    ```azurecli
    az cognitiveservices account keys list \
    --name ComputerVision \
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

To use your resource, the code needs to have the key and endpoint available. This code base stores those in environment variables:
* REACT_APP_COMPUTERVISIONKEY
* REACT_APP_COMPUTERVISIONENDPOINT 

Run the following command to add these variables to your environment.

# [bash](#tab/bash)

```bash
export REACT_APP_COMPUTERVISIONKEY="REPLACE-WITH-YOUR-KEY"
export REACT_APP_COMPUTERVISIONENDPOINT="REPLACE-WITH-YOUR-ENDPOINT"
```

# [cmd](#tab/cmd)

```cmd
set REACT_APP_COMPUTERVISIONKEY="REPLACE-WITH-YOUR-KEY"
set REACT_APP_COMPUTERVISIONENDPOINT="REPLACE-WITH-YOUR-ENDPOINT"
```
---

## Add environment variables to your remote environment

The GitHub action to build the react app needs secure access to the Computer Vision key and endpoint. 

1. In a web browser, on your GitHub repository, select **Settings**, then **Secrets**, then **New repository secret**..

    :::image type="content" source="../../media/tutorial-cog-serv/browser-screenshot-github-create-new-repository-secret.png" alt-text="Partial browser screenshot of React Cognitive Service Computer Vision sample for image analysis before key and endpoint set.":::

1. Enter the same name and value for the endpoint. Then create another secret with the same name and value for the key. 
    
    :::image type="content" source="../../media/tutorial-cog-serv/browser-screenshot-github-add-secret.png" alt-text="Enter the same name and value for the endpoint. Then create another secret with the same name and value for the key.":::

## Run react app with ComputerVision resource

This React app watches for changes to rebuild and rerun the app. 

1. **Enter a new line** in `./src/VisualAi.js` just after the two console.log lines to cause a rebuild of the site.

    :::image type="content" source="../../media/tutorial-cog-serv/browser-screenshot-react-computervision-app-start-up.png" alt-text="Partial browser screenshot of React Cognitive Service Computer Vision sample ready for URL or press enter.":::

1. Leave the text field empty and **select the Analyze button**. 

    :::image type="content" source="../../media/tutorial-cog-serv/browser-screenshot-react-computervision-app-image-analysis-result.png" alt-text="Partial browser screenshot of React Cognitive Service Computer Vision sample results.":::

    The image is selected randomly. 

1. Continue to select the **Analyze** button to see the other images and results. 

## Next step

> [!div class="nextstepaction"]
> [Create Azure Static web app](create-static-web-app-visual-studio-code-extension.md)