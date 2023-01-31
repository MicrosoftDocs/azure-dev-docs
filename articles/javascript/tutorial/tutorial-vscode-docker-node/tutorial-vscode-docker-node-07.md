---
title: Stream logs from a containerized Node.js app from Visual Studio Code
description: Docker Tutorial part 7, stream logs into Visual Studio Code
ms.topic: how-to
ms.date: 09/02/2022
ms.custom: devx-track-js, vscode-azure-extension-update-completed 
# Verified full run: diberry 09/02/2022
---

# 7. Stream logs into Visual Studio Code

In this step, you learn how to view or "tail" any output that the running website generates through calls to `console.log`. This app uses console.log in the `./src/utils.js` file to log each request with the `appLogger` function. This output appears in the **Output** window in Visual Studio Code.

```javascript
// ./src/utils.js
const appLogger = (req, res, next) => {
  const srcIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const {method} = req;
  const {url} = req;
  const status = res.statusCode;

  console.log(`${srcIp} - ${method} ${url} ${status}`);

  next();
};
```

## Turn on File System logging for your Linux container

Enable logging for your container before you see `console.log` output in the logs.

1. In the **Azure** explorer  (<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>), in the **Resources** section, find your website in the **App Services** section.
1. Right-click the app node and choose **Open in portal**. 
1. In the web browser for your App Service resource, find the **Monitoring ->App Service logs** section. 
1. Enable the **Application logging** toggle to **File system**. 
1. For this small application, use the following settings:

    * Quota (MB): 5
    * Retention Period (Days): 7
1. Select **Save**. 

## View console.log output in VS Code for App Service resource

There are several types of logs associated with your App Service such as container logs, web app runtime logs, authentication logs.

To see `console.log` output for your remote Azure App Service from your local VS Code environment:

1. In the **Azure** explorer  (<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>), in the **Resources** section, find your website in the **App Services** section.
1. Expand your website and find the **Logs** node and expand it. 
1. Look for a log file with a naming format of **YYYY_MM_DD-HH-MM-X-XX_default_docker.log**.
1. You should see log lines such as:

    ```console
    2022-09-02T15:46:11.077358064Z > js-e2e-express-server@1.0.0 start
    2022-09-02T15:46:11.077373563Z > node src/index.js
    2022-09-02T15:46:11.077382763Z 
    2022-09-02T15:46:12.593108569Z Server has started on port 3000!
    2022-09-02T15:46:12.629573838Z ::ffff:169.254.129.1 - GET /robots933456.txt 200
    2022-09-02T15:46:12.766645409Z 76.22.73.183:60375 - GET /api/hello 200
    ```

    To see the same `console.log` output in the Azure portal, use **Monitoring -> Log stream (Preview)**. The select **Application logs**. 

## Stream platform logs from Visual Studio Code

1. In the **Azure** explorer  (<kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>), in the **Resources** section, find your website in the **App Services** section.
1. Right-click the app node and choose **Start Streaming Logs**.

    ![View Streaming Logs](../../media/deploy-containers/stream-logs-command.png)

1. Once the app is restarted, the **Output** panel in Visual Studio Code opens with a connection to the log stream, starting with the message `Starting Live Log Stream`.

    To see the same output in the Azure portal, use **Monitoring -> Log stream (Preview)**. The select **Platform logs**. 

## Next steps

* [Clean up resources](tutorial-vscode-docker-node-08.md)
