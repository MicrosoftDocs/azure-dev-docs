---
title: Clean up resources after deploying a containerized Node.js app from Visual Studio Code
description: Tutorial part 6, clean up resources
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/20/2019
ms.author: kraigb
---

# Clean up resources

[Previous step: Stream logs](tutorial-vscode-docker-node-05.md)

The App Service you created for the container includes a backing App Service Plan that can incur costs. To clean up the resources, right-click the App Service in the **Azure: App Service** explorer and select **Delete**.

You can also visit the [Azure portal](https://portal.azure.com), select **Resource groups** from the left-side navigation pane, select the resource group that was created in the process of this tutorial, and then use the **Delete resource group** command.

## Next steps

[!INCLUDE [tutorial-next-steps](includes/tutorial-next-steps.md)]

> [!div class="nextstepaction"]
> [I'm done](node-howto-deploy-containers.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-docker-extension&step=clean-up-resources)
