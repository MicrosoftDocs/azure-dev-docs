---
title: "Step 3: Redeploy a container to Azure App Service after making changes in Visual Studio Code"
description: Tutorial step 3, the simple steps to rebuild and redeploy a container image.
ms.topic: conceptual
ms.date: 09/12/2019
ms.custom: devx-track-python, seo-python-october2019
---

# 2: Redeploy a container to Azure App Service after making changes

[Previous step: deploy the image to Azure](tutorial-deploy-containers-02.md)

This article explains how to redeploy a container to Azure App Service after making changes in Visual Studio Code.

Because you inevitably make changes to your app, you end up rebuilding and redeploying your container many times. Fortunately, the process is simple:

1. Make changes to your app and test locally. (This step and the two that follow are explained in the tutorial, [Create a Python container in VS Code](https://code.visualstudio.com/docs/python/tutorial-create-containers).)

1. Rebuild the Docker image. If you change only app code, the build should take only a few seconds.

1. Push your image to the registry. If again you change nothing but app code, only that small layer needs to be pushed and the process typically completes in a few seconds.

1. In the **Azure: App Service** explorer, right-click the appropriate App Service and select **Restart**. Restarting an app service automatically pulls the latest container image from the registry.

1. After about 15-20 seconds, visit the App Service URL again to check the updates.

> [!div class="nextstepaction"]
> [I made changes and redeployed - continue to step 4 >>>](tutorial-deploy-containers-04.md)

Issues? Submit a GitHub issue using the "This page" feedback at the bottom of the page.
