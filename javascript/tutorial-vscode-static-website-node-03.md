---
title: Create an Azure Storage account for a static Node.js website from Visual Studio Code
description: Tutorial part 3, create an Azure Storage account
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: kraigb
---

# Create an Azure Storage account

[Previous step: create the app](tutorial-vscode-static-website-node-02.md)

In this step, you create an Azure Storage account, which serves as a simple file store (or CDN) with a built-in web server. This built-in server makes Azure Storage a great choice for quickly hosting static sites.

1. From the `my-react-app` folder created in the previous step, start Visual Studio Code so that it opens that folder automatically:

    ```bash
    code .
    ```

1. In VS Code, select the Azure logo to open the **Azure** explorer. Under **Azure Storage**, right-click on your Azure subscription and choose **Create Storage Account**:

    ![Create Storage Account in VS Code](media/static-website/create-storage-account.png)

1. At the prompt, "Enter the name of the new storage account", enter a globally unique name for your Storage Account and press Enter. Valid characters for an app name are 'a-z' and '0-9'.

1. At the prompt, "Select a resource group", select **Create a new Resource Group** and accept the default name.

1. At the prompt, "Select a location", choose [region](https://azure.microsoft.com/regions/) near you.

1. While the Storage account is created, progress appears in **Output** panel of VS Code:

1. Once the Storage account is complete, right-click that account and select **Configure Static Website**. Enabling static website hosting means that Azure Storage automatically serves your index document and any other static assets.

    ![Create Storage Account](media/static-website/configure-static-website.png)

1. When prompted, enter *index.html* for both the index document name and the 404 error document name. We use *index.html* for the error document because modern single page apps (SPAs) such as React, Angular, and Vue, handle errors in the client. For classic static websites, use a custom 404 error page.

> [!div class="nextstepaction"]
> [I created a storage container](tutorial-vscode-static-website-node-04.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-staticwebsite&step=create-storage)
