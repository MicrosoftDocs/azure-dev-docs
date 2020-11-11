---
title: Install Application Insights client library
description: Add the Azure SDK client library to the code on the virtual machine to begin collecting app logs in the Azure cloud. 
ms.topic: tutorial
ms.date: 11/09/2020
ms.custom: devx-track-js
---

# 5. Install Azure SDK client library to monitor web app

In this step, add the Azure SDK client library to the code on the virtual machine to begin collecting app logs in the Azure cloud.

## Edit index.js for logging with Azure Monitor Application Insights

1. Use the nano text editor provided in the virtual machine to edit the `index.js`. 

    ```bash
    sudo nano index.js -l
    ```

1. Edit the to add the client library and logging code, highlighted below. 

    TBD include code

1. When you are done, use `Control+x` to quit, then `y` to save the changes.
1. Exit ssh connection with the following command in the bash shell.

    ```bash
    exit
    ```

1. Restart the virtual machine with the Azure CLI command:

    ```azurecli
    az vm restart --resource-group rg-demo-vm-eastus --name demo-vm
    ```

## Next step

> [!div class="nextstepaction"]
> [View logs in Azure portal](azure-monitor-application-insights-logs.md) 