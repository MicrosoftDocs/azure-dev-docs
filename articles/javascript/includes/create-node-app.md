---
author: burkeholland
ms.service: app-service  
ms.topic: include
ms.date: 03/31/2020
ms.author: buhollan
ms.custom: devx-track-js
---

1. At a terminal command prompt, go to the location where you want to create the app folder.

1. Run the following command to create a new Express app named `myexpressapp` by using the Express Generator. The `--git --view pug` parameters tell the generator to create a .gitignore file and to use the [Pug](https://pugjs.org/api/getting-started.html) template engine, which was formerly known as Jade.

    ```bash
    npx express-generator myexpressapp --git --view pug
    ```

1. Go to the app folder:

    ```bash
    cd myexpressapp
    ```

1. Install the application's dependencies:

    ```bash
    npm install
    ```

1. Start the server:

    ```bash
    npm start
    ```

1. Test the app by opening a browser and going to `http://localhost:3000`. Here is how the site should appear:

    ![Running the Express application](../media/deploy-azure/express.png)

1. Select **Ctrl**+**C** in the terminal to stop the server.
 
