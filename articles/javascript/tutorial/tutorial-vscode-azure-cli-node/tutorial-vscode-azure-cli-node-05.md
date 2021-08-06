---
title: Stream logs from Azure App Service
description: Tutorial part 5, Azure CLI view logs
ms.topic: tutorial
ms.date: 08/05/2021
ms.custom: devx-track-js, devx-track-azurecli
---

# 5. Stream logs from App Service

In this step, you view (or "tail") the logs from the running App Service. Any calls to `console.log` in the site code are displayed in the terminal.

## Watch remote Azure logs from local terminal

1. Run the following command to start logging, replacing `<your_app_name>` with the name of your App Service:

    ```azurecli
    az webapp log tail --name <your_app_name>
    ```

1. After a few seconds, a message should appear in the output to indicate that you're connected to the log-streaming service.

    <pre>
    2019-09-25T13:39:23  Welcome, you are now connected to log-streaming service. The default timeout is 2 hours. Change the timeout with the App Setting SCM_LOGSTREAM_TIMEOUT (in seconds).
    </pre>

1. Refresh the page a few times in the browser to generate additional output:

    <pre>
    GET / Thu Aug 05 2021 19:06:48 GMT-0700 (Pacific Daylight Time)
    </pre>

1. Press **Ctrl**+**C** to end the logging session.

## Next steps

* [Stream logs](tutorial-vscode-azure-cli-node-06.md)