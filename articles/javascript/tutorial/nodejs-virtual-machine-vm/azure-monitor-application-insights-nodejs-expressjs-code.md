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

1. Edit the to add the client library and logging code, highlighted below. Many bash shells allow you to copy and paste directly into nano. 

    :::code language="javascript" source="~/../js-e2e-vm/index-logging.js" highlight="5, 7-19, 25,26" :::

1. When you are done, use `Control+x` to quit, then `y` to save the changes.

    The Node.js app is started and watched by PM2 so this cause a restart of the app, without having to restart the VM.

1. In a web browser, test the app with the new `trace` route:

    ```http
    http://REPLACE-WITH-YOUR-IP/trace
    ```

    The browser displays the response, `tracing...` with your IP address.

1. View VM log for the NGINX proxy server. In the same bash shell, use the following command to view the log:

    ```bash
     cat /var/log/nginx/access.log
    ```

    The log includes the call from your local computer. 

    ```console
     "GET /trace HTTP/1.1" 200 10 "-"
    ```

1. The tutorial won't connect to the VM again. Exit ssh connection with the following command in the bash shell. 

    ```bash
    exit
    ```

## Next step

> [!div class="nextstepaction"]
> [View logs in Azure portal](azure-monitor-application-insights-logs.md) 