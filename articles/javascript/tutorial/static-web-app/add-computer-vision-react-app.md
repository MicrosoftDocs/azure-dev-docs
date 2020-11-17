---
title: 
description:   
ms.topic: tutorial
ms.date: 11/13/2020
ms.custom: devx-track-js
---

# 6. Add Computer Vision to the React app

This sample has all the code necessary to add Computer Vision to the React App. This section of the tutorial _reviews_ the steps and code. 

## Add Computer Vision to React with NPM

Use npm to add Computer Vision to the package.json file. 

```bash
npm install @azure/cognitiveservices-computervision 
```

## Add Computer Vision code as separate module

The Computer Vision code is contained in a separate file named `./src/VisualAI.js`. The main function of the module is highlighted. 

:::code language="javascript" source="~/../js-e2e-client-cognitive-services/src/VisualAI.js" highlight="55-75" :::

## Add catalog of images as separate module

The app selects a random image from a catalog if the user doesn't enter an image URL. The random selection function is highlighted 

:::code language="javascript" source="~/../js-e2e-client-cognitive-services/src/DefaultImages.js" highlight="33-35" :::

## Add Computer Vision to React app

Add methods to the React `app.js`. The image analysis and display of results are highlighted.

:::code language="javascript" source="~/../js-e2e-client-cognitive-services/src/index.js" highlight="20-25, 29-42" :::

## Next step

> [!div class="nextstepaction"]
> [Create GitHub secrets for the key and endpoint](add-github-secret-key-endpoint.md) 