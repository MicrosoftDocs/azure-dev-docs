---
title: Stream logs from Azure App Service
description: Tutorial part 5, Azure CLI view logs
ms.topic: tutorial
ms.date: 08/16/2021
ms.custom: devx-track-js, devx-track-azurecli
# Verified full run: diberry 08/16/2021
---

# 5. Stream logs from App Service

In this step, you view the logs from the running App Service. Any calls to `console.log` in the site code are displayed in the terminal.

## Watch remote Azure logs from local terminal

1. Run the following command to start logging, replacing `<your_app_name>` with the name of your App Service:

    ```azurecli
    az webapp log tail --name <your_app_name>
    ```

1. After a few seconds, a message should appear in the output to indicate that you're connected to the log-streaming service.

1. Refresh the page a few times in the browser to generate additional output.

1. Press **Ctrl**+**C** to end the logging session.

## Next steps

* [Clean up resources](tutorial-vscode-azure-cli-node-07.md)
