---
title: Create the Node.js Azure App Service from Visual Studio Code
description: Node.js Tutorial part 2, create the Node.js app and run it locally
ms.topic: tutorial
ms.date: 03/04/2020
ms.custom: devx-track-js
---

# Create and run a local Node.js app

[Previous step: Introduction and prerequisites](tutorial-vscode-azure-app-service-node-01.md)

In this step, you create a simple Node.js app using the Express application generator. You then run the app locally.

1. In a terminal or command prompt, navigate to a location where you want to create the app folder.

1. Run the following command to create a new Express app named *expressApp1* using the Express Generator. (The `--view pug --git` parameters tell the generator to use the [pug](https://pugjs.org/api/getting-started.html) template engine, formerly known as Jade, and to create a *.gitignore* file.)

    ```bash
    npx express-generator expressApp1 -–git --view pug 
    ```

1. Navigate into the app folder:

    ```bash
    cd expressApp1
    ```

1. Install the application's dependencies:

    ```bash
    npm install
    ```

1. Start the server:

    ```bash
    npm start
    ```

1. Test the app by opening a browser to `http://localhost:3000`. The site should appear as follows:

    ![Running Express Application](media/deploy-azure/express.png)

1. Press **Ctrl**+**C** in the terminal to stop the server.

> [!div class="nextstepaction"]
> [I created the  Node.js app](tutorial-vscode-azure-app-service-node-03.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azureappservice&step=create-app)
