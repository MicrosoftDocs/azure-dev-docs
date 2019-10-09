---
title: "Tutorial: Stream logs from Azure App Service into VS Code"
description: Tutorial step 6, streaming app logs into Visual Studio Code
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/12/2019
ms.author: kraigb
ms.custom: seo-python-october2019
---

# Tutorial: Stream logs from Azure App Service into Visual Studio Code

Use this procedure to stream logs from an Azure App Service to Visual Studio Code.

1. In Visual Studio Code, open the **Azure: App Service** explorer, right-click the App Service, and select **Start streaming logs**:

   ![Start streaming logs command](media/deploy-azure/start-streaming-logs-command.png)

1. When prompted to enable file logging and restart the web app, select **Yes**. While the app restarts, the **Output** window in VS Code shows progress. Enable logging is a one-time process.

1. After logging is enabled, right-click the App Service and again select **Start streaming logs**. The **Output** window in VS Code displays "Starting Live Log Stream" and log output begins to appear. Try refreshing the web app in the browser to generate more log information.

1. To stop streaming logs (without disabling logging), right-click the app in the **Azure: App Service** explorer and select **Stop streaming logs**.

> [!div class="nextstepaction"]
> [I see the logs](tutorial-deploy-app-service-on-linux-07.md)

[I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-appservice-python&step=06-stream-logs)
