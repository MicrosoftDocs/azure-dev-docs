---
title: Clean up resources after deploying to Azure App Service
description: Deno Tutorial part 4, clean up resources
ms.topic: tutorial
ms.date: 06/01/2020
ms.custom: devx-track-js
---

# Clean up

[Previous step: Deploy the app](tutorial-visual-studio-code-azure-app-service-deno-03.md)

In this section, we'll remove and cleanup all the created resources.

## Remove your resources

The App Service you created includes a backing App Service Plan running on a free pricing tier, so you won't incur any ongoing costs.

When you want to clean up the resources, visit the [Azure portal](https://portal.azure.com), select **Resource groups**, locate, and select the resource group that was created in the process of this tutorial (such as `deno-quickstart`), and then use the **Delete resource group** command.

## Next steps

[!INCLUDE [tutorial-next-steps](includes/tutorial-next-steps.md)]

> [!div class="nextstepaction"]
> [I'm done](node-howto-deploy-web-app.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=deno-deployment-azureappservice&step=clean-up-resources)
