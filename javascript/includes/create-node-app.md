1. In a terminal or command prompt, navigate to a location where you want to create the app folder.

1. Run the following command to create a new Express app named *myexpressapp* using the Express Generator. (The `--git --view pug` parameters tell the generator to to create a *.gitignore* file. and to use the [pug](https://pugjs.org/api/getting-started.html) template engine, formerly known as Jade.

    ```bash
    npx express-generator myexpressapp --git --view pug
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

1. Test the app by opening a browser to [http://localhost:3000](http://localhost:3000). The site should appear as follows:

    ![Running Express Application](../media/deploy-azure/express.png)

1. Press **Ctrl**+**C** in the terminal to stop the server.
