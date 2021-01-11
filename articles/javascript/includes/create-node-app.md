---
ms.topic: include
ms.date: 01/11/2021
ms.custom: devx-track-js
---

Create and run a Node.js app by cloning an Azure sample repository. 

1. At a terminal command prompt, go to the location where you want to create the app folder.

1. Clone the repository with the following **git** command, downloading the files into a subdirectory named `js-e2e-express-server-tutorial`.

    ```bash
    git clone https://github.com/Azure-Samples/js-e2e-express-server.git js-e2e-express-server-tutorial
    ```

1. Change into the new directory:

    ```bash
    cd js-e2e-express-server-tutorial
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
 
