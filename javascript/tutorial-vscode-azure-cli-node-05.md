---
title: Stream logs from Azure App Service
description: Tutorial part 5, view logs
ms.topic: conceptual
ms.date: 09/24/2019
---

# Stream logs from App Service

[Previous step: Deploy the app](tutorial-vscode-azure-cli-node-04.md)

In this step, you view (or "tail") the logs from the running App Service. Any calls to `console.log` in the site code are displayed in the terminal.

1. Run the following command to start logging, replacing `<your_app_name>` with the name of your App Service:

    ```bash
    az webapp log tail --name <your_app_name>
    ```

1. After a few seconds, a message should appear to indicate that you're connected to the log-streaming service.

    ```bash
    2019-09-25T13:39:23  Welcome, you are now connected to log-streaming service. The default timeout is 2 hours. Change the timeout with the App Setting SCM_LOGSTREAM_TIMEOUT (in seconds).
    ```

1. Refresh the page a few times in the browser to generate additional output:

    ```bash
    GET / 304 2.327 ms - -
    GET / 304 0.957 ms - -
    GET / 304 2.435 ms - -
    ```

1. Press **Ctrl**+**C** to end the logging session.

> [!div class="nextstepaction"]
> [I see the logs](tutorial-vscode-azure-cli-node-06.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment&step=tailing-logs)
