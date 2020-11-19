---
title: React code using Computer Vision
description: This sample has all the code necessary to add Computer Vision to the React App. This section of the tutorial _reviews_ the steps and code. 
ms.topic: tutorial
ms.date: 11/13/2020
ms.custom: devx-track-js
---

# 5. Review how to add Computer Vision to the React app

This sample has all the code necessary to add Computer Vision to the React App. This section of the tutorial _reviews_ the steps and code. You do not need to take these steps for this tutorial. 

## Add Computer Vision to local React app

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

## Add custom Computer Vision module to React app

Add methods to the React `app.js`. The image analysis and display of results are highlighted.

:::code language="javascript" source="~/../js-e2e-client-cognitive-services/src/App.js" highlight="20-25, 29-42" :::

## Next step

> [!div class="nextstepaction"]
> [Clean up resources](clean-up-resources.md) 