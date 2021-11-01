---
title: Install Application Insights client library
description: Add the Azure SDK client library to the code on the virtual machine to begin collecting app logs in the Azure cloud. 
ms.topic: tutorial
ms.date: 11/13/2020
ms.custom: devx-track-js
---

# 5. Install Azure SDK client library to monitor web app

In this step, add the Azure SDK client library to the code on the virtual machine to begin collecting app logs in the Azure cloud.


## Edit index.js for logging with Azure Monitor Application Insights

1. Still in the SSH terminal, use the [Nano](https://www.nano-editor.org/dist/latest/nano.html#Editor-Basics) text editor provided in the virtual machine to open the `index.js`. 

    ```bash
    sudo nano index.js
    ```

1. Edit the `index.js` file to add the client library and logging code, highlighted below. Many bash shells allow you to copy and paste directly into Nano. 

    :::code language="JavaScript" source="~/../js-e2e-vm/index-logging.js" :::

1. Still in the SSH terminal, save the file in the Nano editor with <kbd>control</kbd> + <kbd>X</kbd>. Enter **Y** to save, when prompted. Accept the file name when prompted.  

    Changes to the web app are watched by PM2; this change caused a restart of the app, without having to restart the VM. 

1. In a web browser, test the app with the new `trace` route:

    ```http
    http://YOUR-VM-PUBLIC-IP-ADDRESS/trace
    ```

    The browser displays the response, `tracing...YOUR-VM-PUBLIC-IP-ADDRESS` with your IP address.

## Viewing the VM logs for NGINX and PM2

The Virtual machine collects logs for NGINX and PM2, which are available to view.

| Service | Log location|
|--|--|
|NGINX| /var/log/nginx/access.log|
|PM2| /var/log/pm2.log|

1. Still in the SSH terminal, view VM log for the NGINX proxy service with the following command to view the log:

    ```bash
     cat /var/log/nginx/access.log
    ```

    The log includes the call from your local computer. 

    ```console
     "GET /trace HTTP/1.1" 200 10 "-"
    ```

1. View VM log for the PM2 service. In the same bash shell, use the following command to view the log:

    ```bash
    cat /var/log/pm2.log
    ```

    The log includes the call from your local computer. 

    ```console
    Hello world app listening on port 3000!
    testing from trace route 76.22.73.183
    ```

1. The tutorial won't connect to the VM again. Exit the ssh connection with the following command in the bash shell. 

    ```bash
    exit
    ```

## VM logging and cloud logging

In this article series, `console.log` posts into the PM2 logs found on the VM only. If you delete the logs or the VM, you lose that information. 

If you want to retain the logs beyond the lifespan of your virtual machine, use Application Insights. 

## Troubleshooting

If you have issues, use the following table to understand how to resolve your issue:

|Problem|Resolution|
|--|--|
|502 Gateway error|This could indicate your index.js or package.js file has an error. View your PM2 logs at `/var/log/pm2.log` for more information. The most recent error is at the bottom of the file. If you are sure those files are correct, stop and start the PM2 using the npm scripts in `package.json`.|

## Next step

> [!div class="nextstepaction"]
> [View logs in Azure portal](azure-monitor-application-insights-logs.md) 