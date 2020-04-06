---
title: Redeploy a container to Azure App Service after making changes in Visual Studio Code
description: Tutorial step 6, the simple steps to rebuild and redeploy a container image.
ms.topic: conceptual
ms.date: 09/20/2019
---

# Make changes and redeploy

[Previous step: Deploy the app image](tutorial-vscode-docker-node-05.md)

Because you inevitably make changes to your app, you end up rebuilding and redeploying your container many times. Fortunately, the process is simple:

1. Make changes to your app and test locally.

1. In Visual Studio Code, open the **Command Palette** (**F1**) and run **Docker Images: Build Image** to rebuild the image). If you change only app code, the build should take only a few seconds.

1. To push the image to the registry, open the **Command Palette** (**F1**) again and run **Docker Images: Push**, choosing the image you just built. As before, because a change to your app code is small, only that layer needs to be pushed and the process typically completes in a few seconds.

1. In the **Azure: App Service** explorer, right-click the appropriate App Service and select **Restart**. Restarting an app service automatically pulls the latest container image from the registry.

1. After about 15-20 seconds, visit the App Service URL again to check the updates.

> [!div class="nextstepaction"]
> [I see the changes](tutorial-vscode-docker-node-07.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-docker-extension&step=deploy-changes)
