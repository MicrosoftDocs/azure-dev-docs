---
title: Computer Vision app architecture
description: This sample has all the code necessary to add Computer Vision to the React App. This section of the tutorial _reviews_ the steps and code. 
ms.topic: tutorial
ms.date: 12/17/2020
ms.custom: devx-track-js
---

# 2. Application architecture for Static web app with Computer Vision

Learn about the client application and the deployment process.

## What is an Azure Static web app

When building static web apps, you have several choices on Azure, based on the degree of functionality and control you are interested in. This tutorial focuses on the easiest service with many of the choices made for you, so you can focus on your front-end code and not the hosting environment.

## Client application architecture

The React (create-react-app) provides the following functionality: 
* Display message if Azure key and endpoint for Cognitive Services [**Computer Vision**](https://docs.microsoft.com/azure/cognitive-services/computer-vision/) isn't found
* Allows you to analyze an image with Cognitive Services Computer Vision
    * Enter a public image URL or analyze image from collection
    * When analysis is complete
        * Display image
        * Display Computer Vision JSON results 

## Deploy to Azure with GitHub action

The GitHub action starts when a push to a specific branch happens:
* Inserts GitHub secrets for Computer Vision key and endpoint into build
* Builds the React (create-react-app) client
* Moves the resulting files to your Azure [**Static Web app**](https://docs.microsoft.com/azure/static-web-apps) resource

> [!div class="nextstepaction"]
> [Download and run the React Cognitive Services Image Analyzer app locally](run-the-react-cognitive-services-image-analyzer-app-locally.md) 