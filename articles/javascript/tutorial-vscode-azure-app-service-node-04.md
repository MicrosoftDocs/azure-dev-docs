---
title: Stream logs from Azure App Service into Visual Studio Code
description: Tutorial part 4, view or tail logs.
ms.topic: conceptual
ms.date: 03/04/2020
ms.custom: devx-track-js
---

# Stream logs from Azure App Service

[Previous step: Deploy the website](tutorial-vscode-azure-app-service-node-03.md)

In this step, you learn how to view or "tail" any output that the running app generates through calls to `console.log`. This output appears in the **Output** window in Visual Studio Code.

1. In the **Azure App Service** explorer, right-click the app node and choose **Start Streaming Logs**.

    ![View Streaming Logs](media/deploy-azure/start-streaming-logs.png)

1. When prompted, choose to enable logging and restart the application.

    ![Prompt to enable logging and restart](media/deploy-azure/enable-restart.png)

1. Once the app is restarted, the VS Code **Output** window opens with a connection to the log stream that shows output.

    <pre>
    Connecting to log stream...
    2020-03-04T19:29:44  Welcome, you are now connected to log-streaming service. The default timeout is 2 hours.
    Change the timeout with the App Setting SCM_LOGSTREAM_TIMEOUT (in seconds).
    </pre>

1. Refresh the web page a few times in the browser to see additional log output.

> [!div class="nextstepaction"]
> [I see the logs](tutorial-vscode-azure-app-service-node-05.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azureappservice&step=tailing-logs)
