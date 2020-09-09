---
title: "Step 4: Stream logs from Azure App Service for a container into Visual Studio Code"
description: Tutorial part 4, viewing logs from Azure App Service to monitor its behavior.
ms.topic: conceptual
ms.date: 09/12/2019
ms.custom: devx-track-python, seo-python-october2019
---

# 4: Stream logs from Azure App Service for a container

[Previous step: make changes and redeploy](tutorial-deploy-containers-03.md)

Use this procedure to stream logs from an Azure App Service  for a container to Visual Studio Code.

From within VS Code, you can view (or "tail") logs from the running site on Azure App Service, which captures any output to the console as from `print` statements and routes them to the VS Code **Output** panel.

1. Find the app in the **Azure: App Service** explorer, right-click the app, and choose **Start Streaming Logs**.

1. Answer **Yes** when prompted to enable logging and restart the app. Once the app is restarted, the VS Code Output panel opens with a connection to the log stream.

1. After a few seconds, you see a message in the output that indicates you are connected to the log-streaming service:

    <pre>
    Connecting to log stream...
    2018-09-27T20:14:26  Welcome, you are now connected to log-streaming service.

    2018-09-27 20:14:59.269 INFO  - Starting container for site

    2018-09-27 20:14:59.270 INFO  - docker run -d -p 24138:8000 --name vsdocs-django-sample-container_0 -e WEBSITES_PORT=8000 -e WEBSITE_SITE_NAME=vsdocs-django-sample-container -e WEBSITE_AUTH_ENABLED=False -e WEBSITE_ROLE_INSTANCE_ID=0 -e WEBSITE_INSTANCE_ID=02c705ae24eaf5f298e553a9c2724b9fe4485707c2d1c36137cd02931091e561 -e HTTP_LOGGING_ENABLED=1 vsdocsregistry.azurecr.io/python-sample-vscode-django-tutorial:latest

    2018-09-27 20:15:06.216 INFO  - Container vsdocs-django-sample-container_0 for site vsdocs-django-sample-container initialized successfully.
    </pre>

1. Navigate within the app to see additional output for various HTTP requests.

> [!div class="nextstepaction"]
> [I see the logs - continue to step 5 >>>](tutorial-deploy-containers-05.md)

Issues? Submit a GitHub issue using the "This page" feedback at the bottom of the page.
