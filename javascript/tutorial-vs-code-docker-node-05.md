---
title: Stream logs from a containerized Node.js app into Visual Studio Code
description: Tutorial part 5, stream logs into Visual Studio
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/20/2019
ms.author: kraigb
---

# Stream logs into Visual Studio Code

[Previous step: deploy the app image](tutorial-vscode-docker-node-04.md)

In this step, you learn how to view or "tail" any output that the running website generates through calls to `console.log`. This output appears in the **Output** window in Visual Studio Code.

1. In the **Azure App Service** explorer, right-click the app node and choose **Start Streaming Logs**.

    ![View Streaming Logs](media/deploy-containers/stream-logs-command.png)

1. When prompted, choose to enable logging and restart the application.

    ![Prompt to enable logging and restart](media/deploy-azure/enable-logging-and-restart.png)

1. Once the app is restarted, the **Output** panel in Visual Studio Code opens with a connection to the log stream, starting with the message `Starting Live Log Stream`.

## Next steps

[!INCLUDE [tutorial-next-steps](includes/tutorial-next-steps.md)]

> [!div class="nextstepaction"]
> [I'm done](node-howto-deploy-containers.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azureappservice&step=tailing-logs)
