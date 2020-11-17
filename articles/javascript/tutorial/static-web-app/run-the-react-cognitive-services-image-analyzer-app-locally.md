---
title: Download sample React app
description: The complete sample app is provided in a GitHub repository. Fork the repository, install the dependencies, and run locally.
ms.topic: tutorial
ms.date: 11/13/2020
ms.custom: devx-track-js
---

# 2. Download and run the React Cognitive Services Image Analyzer app

The complete sample app is provided in a GitHub repository. Fork the repository, install the dependencies, and run locally.

## Fork the sample repo

Fork the repository, instead of just cloning it to your local computer, in order to have a GitHub repository of your own to push changes to. 

1. Open a separate browser window or tab, and to sign in to <a href="https://github.com/login" target="_blank">GitHub</a>. 
1. Navigate to the <a href="https://github.com/Azure-Samples/js-e2e-client-cognitive-services" target="_blank">GitHub sample repository</a> in the web browser. 

    ```http
    https://github.com/Azure-Samples/js-e2e-client-cognitive-services
    ```

1. On the top-right section of the page, select **Fork**. 
1. Select **Code** then copy the location URL for your fork. 

    :::image type="content" source="../../media/static-web-app/browser-screenshot-clone-github-sample-repository-fork.png" alt-text="Partial screenshot of GitHub website, select **Code** then copy the location for your fork.":::    

## Create local development environment

1. In a terminal or bash window, clone your fork to your local computer. Replace `YOUR-ACCOUNT-NAME` with your GitHub account name.

    ```bash
    git clone https://github.com/YOUR-ACCOUNT-NAME/js-e2e-client-cognitive-services
    ```

1. Change to the new directory and install the dependencies. 

    ```bash
    cd js-e2e-client-cognitive-services && npm install
    ```

## Run sample

Run the sample.

```bash
npm start
```

:::image type="content" source="../../media/static-web-app/browser-screenshot-react-cognitive-services-app-before-authentication.png" alt-text="Partial browser screenshot of React Cognitive Service Computer Vision sample for image analysis before key and endpoint set.":::    

The sample is working if you see the previous image. 
    
## Next step

> [!div class="nextstepaction"]
> [Create Computer Vision resource and use in code](create-computer-vision-resource-use-in-code.md) 