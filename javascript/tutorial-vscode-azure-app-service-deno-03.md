---
title: Deploy Deno apps to Azure App Service from Visual Studio Code
description: Tutorial part 3, deploy the website
ms.topic: conceptual
ms.date: 06/01/2020
---

# Deploy Deno apps to Azure

[Previous step: Create the app](tutorial-vscode-azure-app-service-deno-02.md)

In this step, you deploy your Deno app to Azure using Azure CLI.

## Deploy the app to Azure

1. Create a resource group named `deno-quickstart` with the following command:

    ```bash
    az groups create -n deno-quickstart -l eastus
    ```

    > If you decide to change the name of the resource group, be sure to update all the `-g` flags in the following steps

1. Create an AppService Plan named `deno-plan` that will hold your website using this command:

    ```bash
    az appservice plan create -g deno-quickstart -n deno-plan --is-linux
    ```

1. Next up, you'll create the webapp itself. This command will create a new AppService and will bind it to the previously created Plan. Change the `<your-app-name>` tag to the name you want to give to your Webapp, remember, it needs to be unique!

    ```bash
    az webapp create -n <your-app-name> -g deno-quickstart -p deno-plan -i anthonychu/azure-webapps-deno:1.0.2
    ```

    This AppService runs a Docker image, which provides the base functionality to run any Deno code. This process may take a few seconds to complete.

1. After the creation, you'll need to configure some variables. You can do so by issuing this command:

    ```bash
    az webapp config container set -n <your-app-name> -g deno-quickstart -i anthonychu/azure-webapps-deno:1.0.2 -r 'https://index.docker.io' -u '' -p  '' -t true && \
    az webapp config set -n <your-app-name> -g deno-quickstart --startup-file '' && \
    az webapp config appsettings set -n <your-app-name> -g deno-quickstart --settings WEBSITE_RUN_FROM_PACKAGE=1 WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
    ```

Now the AppService is configured and it's waiting to receive the app from the previous step. But to run it, the app needs to be package in a `.zip` package. You can do so with the following steps:

1. Go to the `deno-demo` folder

    ```bash
    cd deno-demo
    ```

1. Run the `zip` command:

    ```bash
    zip demo demo.ts
    ```

    The result of this command will be a file called `demo.zip` in the same folder as the `demo.ts` file.

1. After packaging you can upload the file to the AppService to be executed:

    ```bash
    az webapp deployment source config-zip -n <your-app-name> -g deno-quickstart --src ./demo.zip && \
    az webapp config set -n <your-app-name> -g deno-quickstart --startup-file 'deno run --allow-net demo.ts'
    ```

1. Test the application by going to `https://<your-app-name>.azurewebsites.net`

> [!div class="nextstepaction"]
> [My site is on Azure](tutorial-vscode-azure-app-service-deno-04.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=deno-deployment-azureappservice&step=deploy-app)

## Next steps

[!INCLUDE [tutorial-next-steps](includes/tutorial-next-steps.md)]

> [!div class="nextstepaction"]
> [I'm done](node-howto-deploy-web-app.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=deno-deployment-azureappservice&step=clean-up-resources)
