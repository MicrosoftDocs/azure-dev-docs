---
title: Create the Azure App Service from Visual Studio Code
description: Tutorial part 2, create the Node.js app
ms.topic: conceptual
ms.date: 03/04/2020
---

# Clone and run a local Node.js application

[Previous step: Introduction and prerequisites](tutorial-vscode-azure-app-service-node-01.md)

In this step, you clone a simple Node.js sample app from GitHub and test it locally.

1. On your local computer, open a terminal and clone the sample repository:

    ```bash
    git clone https://github.com/Azure-Samples/nodejs-docs-hello-world
    ```

1. Navigate into the new app folder:

    ```bash
    cd nodejs-docs-hello-world
    ```

1. Start the app to test it locally:

    ```bash
    npm start
    ```

1. Open your browser and navigate to [http://localhost:1337](http://localhost:1337). The browser should display "Hello World!".

1. Press **Ctrl**+**C** in the terminal to stop the server.

> [!div class="nextstepaction"]
> [I created the  Node.js app](tutorial-vscode-azure-app-service-node-03.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azureappservice&step=create-app)
