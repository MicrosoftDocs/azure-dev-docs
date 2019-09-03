---
title: Stream logs from Azure App Service for a container into Visual Studio Code
description: Tutorial part 4, viewing logs from Azure App Service to monitor its behavior.
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/02/2019
ms.author: kraigb
---

# Stream logs from Azure App Service

[Previous step: make changes and redeploy](tutorial-deploy-containers-03.md)

From within VS Code, you can view (or "tail") logs from the running site on Azure App Service, which captures any output to the console as from `print` statements and routes them to the VS Code **Output** panel.

1. Find the app in the **Azure: App Service** explorer, right-click the app, and choose **Start Streaming Logs**.

1. Answer **Yes** when prompted to enable logging and restart the app. Once the app is restarted, the VS Code Output panel opens with a connection to the log stream.

1. After a few seconds, you see a message indicating that you are connected to the log-streaming service.

    ```bash
    Connecting to log stream...
    2018-09-27T20:14:26  Welcome, you are now connected to log-streaming service.

    2018-09-27 20:14:59.269 INFO  - Starting container for site

    2018-09-27 20:14:59.270 INFO  - docker run -d -p 24138:8000 --name vsdocs-django-sample-container_0 -e WEBSITES_PORT=8000 -e WEBSITE_SITE_NAME=vsdocs-django-sample-container -e WEBSITE_AUTH_ENABLED=False -e WEBSITE_ROLE_INSTANCE_ID=0 -e WEBSITE_INSTANCE_ID=02c705ae24eaf5f298e553a9c2724b9fe4485707c2d1c36137cd02931091e561 -e HTTP_LOGGING_ENABLED=1 vsdocsregistry.azurecr.io/python-sample-vscode-django-tutorial:latest

    2018-09-27 20:15:06.216 INFO  - Container vsdocs-django-sample-container_0 for site vsdocs-django-sample-container initialized successfully.
    ```

1. Navigate within the app to see additional output for various HTTP requests.

## Clean up resources

The various Azure resources you created in this tutorial can incur ongoing costs. To clean them up, its best to visit [Azure portal](https://portal.azure.com), select **Resource groups** from the left-side navigation pane, select the resource group that was created in the process of this tutorial, and then use the **Delete resource group** command.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-appservice-containers&step=04-stream-logs)

## Next steps

You can learn more about the Docker and App Service extensions by visiting their respective repositories on GitHub: [vscode-docker](https://github.com/Microsoft/vscode-docker) and [vscode-azureappservice](https://github.com/Microsoft/vscode-azureappservice). Issues and contributions are also welcome.

To learn more about Azure services that you can use from Python, including data storage along with AI and Machine Learning services, visit [Azure Python Developer Center](https://docs.microsoft.com/python/azure/?view=azure-python).

There are also other Azure extensions for VS Code that you may find helpful. Just search on "Azure" in the Extensions explorer:

![Azure extensions for VS Code](media/deploy-containers/azure-extensions.png)

Some popular extensions are:

- [Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
- [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
- [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
- [Azure Resource Manager (ARM) Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
