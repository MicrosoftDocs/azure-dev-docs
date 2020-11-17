---
title: Introduction and prerequisites 
description: Locally build and deploy a React client application to an Azure Static Web App with a GitHub action. 
ms.topic: tutorial
ms.date: 11/13/2020
ms.custom: devx-track-js
---

# 1. Build and deploy a Static Web app to Azure

In this tutorial, locally build and deploy a React client application to an Azure Static Web App with a GitHub action. 

The React (create-create-app) provides the following functionality: 
* Display message if Azure key and endpoint for Cognitive Services Computer Vision isn't found
* Allows you to analyze an image with Cognitive Services Computer Vision
    * Enter a public image URL or analyze image from collection
    * When analysis is complete
        * Display image
        * Display Computer Vision JSON results 

The GitHub action starts when a push to a specific branch happens:
* Inserts GitHub secrets for Computer Vision key and endpoint into build
* Builds the React (create-react-app) client
* Moves the resulting files to your Azure Static Web app resource

[!INCLUDE [Create or use existing Azure Subscription ](../../includes/environment-subscription-h2.md)]

## What is an Azure Static web app

When building static web apps, you have several choices on Azure, based on the degree of functionality and control you are interested in. This tutorial focuses on the easiest service with many of the choices made for you, so you can focus on your front-end code and not the hosting environment.

## Prerequisites

[!INCLUDE [Azure CLI](~/../azure-docs/includes/azure-cli-prepare-your-environment-no-header.md)]
- [Node.js and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
    - [Azure Static Web Apps (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) - used to deploy React app to Azure Static Web app.
- [Git](https://git-scm.com/downloads) - used to push to GitHub - which activates the GitHub action.
- [GitHub account](https://github.com/join) - to fork and push to a repo

## Next step

> [!div class="nextstepaction"]
> [Download and run the React Cognitive Services Image Analyzer app locally](run-the-react-cognitive-services-image-analyzer-app-locally.md) 