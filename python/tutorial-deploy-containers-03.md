---
title: Redeploy a conatiner to Azure App Service after making changes in Visual Studio Code
description: Tutorial part 3, the simple steps to rebuild and redeploy a container image.
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/02/2019
ms.author: kraigb
---

# Make changes and redeploy

[Previous step: deploy the image to Azure](tutorial-deploy-containers-02.md)

Because you inevitably make changes to your app, you end up rebuilding and redeploying your container many times. Fortunately, the process is simple:

1. Make changes to your app and test locally. (This step and the two that follow are explained in the tutorial, [Create a Python container in VS Code](https://code.visualstudio.com/docs/python/tutorial-create-container).)

1. Rebuild the Docker image. If you change only app code, the build should take only a few seconds.

1. Push your image to the registry. If again you change nothing but app code, only that small layer needs to be pushed and the process typically completes in a few seconds.

1. In the **Azure: App Service** explorer, right-click the appropriate App Service and select **Restart**. Restarting an app service automatically pulls the latest container image from the registry.

1. After about 15-20 seconds, visit the App Service URL again to check the updates.

> [!div class="nextstepaction"]
> [Next: Stream logs](tutorial-deploy-containers-04.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-appservice-containers&step=05-redeploy)
