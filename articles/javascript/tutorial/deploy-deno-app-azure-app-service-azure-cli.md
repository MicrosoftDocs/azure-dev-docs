---
title: Deploy Deno apps to Azure App Service from the Azure CLI
description: In this tutorial, you deploy a Deno application to Azure App Service (on Linux or Windows) using the Azure CLI.
ms.topic: tutorial
ms.date: 10/13/2020
ms.custom: scenarios:getting-started, languages:JavaScript, devx-track-javascript
---
# Deploy Deno apps to Azure App Service from the Azure CLI

Deploy a Deno application to Azure App Service (on Linux or Windows) using the Azure CLI.

![Running the demo server](../media/deploy-azure/deno-hello-world.png)

## Application architecture

## 1. Prepare your environment

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-appservice-deno&mktingSource=vscode-tutorial-appservice-deno)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Deno](https://deno.land/#installation)
- Having Azure CLI installed and logged in

## 2. Install or run in Azure Cloud Shell

The easiest way to get started with the Azure CLI is by running it in an Azure Cloud Shell environment through your browser. To learn about Cloud Shell, see  [Quickstart for Bash in Azure Cloud Shell](/azure/cloud-shell/quickstart).

When you're ready to install the CLI, see the [installation instructions](/cli/azure/install-azure-cli).

After installing the CLI for the first time, check that it's installed and you've got the correct version by running `az --version`.

> [!NOTE]
> If you're using the Azure classic deployment model, [install the Azure classic CLI](/cli/azure/install-classic-cli).

## 3. Sign in

Before using any CLI commands with a local install, you need to sign in with [az login](/cli/azure/reference-index#az-login).

[!INCLUDE [interactive-login](../../azure-cli/includes/interactive-login.md)]

After logging in, you see a list of subscriptions associated with your Azure account. The subscription information with `isDefault: true` is the currently activated subscription after logging in. To select another subscription, use the [az account set](/cli/azure/account#az-account-set) command with the subscription ID to switch to. For more information about subscription selection, see [Use multiple Azure subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli).

## 4. Create local Deno API app

Create a simple Deno api using Deno's built-in webserver. You then run the app locally.

1. In a terminal or command prompt, navigate to a location where you want to create the app folder and create a new folder called `deno-demo`.

1. Create a new file called `demo.ts`.
1. Deno accepts running code from URLs directly. Write a HTTP server that answers all the requests with "Hello World". Use the following code:

    ```typescript
    import { serve } from "https://deno.land/std@0.54.0/http/server.ts"
    const handler = serve({ port: 80 })

    console.log("Serving at 80")

    for await (const req of handler) {
     req.respond({ body: "Hello World!\n" })
    }
    ```

1. Execute the app by running the following script:

    ```bash
    deno run --allow-net ./demo.ts
    ```

1. Test the app by opening a browser to `http://localhost:80`. The site should appear as follows:

    ![Running the demo server](../media/deploy-azure/deno-hello-world.png)

    You can also run this code by typing `deno run --allow-net https://gist.githubusercontent.com/khaosdoctor/cd2bbb28e682feb8d20a7aba47fc1e17/raw/92de998fd11f2a24ae40bbcb84f5262cfe9389b2/deno-demo.ts`

1. Press **Ctrl**+**C** in the terminal to stop the server.

## 5. Deploy Deno app to Azure

Deploy your Deno app to Azure using Azure CLI.

1. Create a resource group named `deno-quickstart` with the following command:

    ```bash
    az groups create -n deno-quickstart -l eastus
    ```

    If you decide to change the name of the resource group, be sure to update all the `-g` flags in the following steps

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

## 6. Configure Deno app deployment to web app 

Now the AppService is configured and it's waiting to receive the app from the previous step. But to run it, the app needs to be packaged in a `.zip` package. You can do so with the following steps:

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

## Clean up resources

In this section, we'll remove and cleanup all the created resources.

The App Service you created includes a backing App Service Plan running on a free pricing tier, so you won't incur any ongoing costs.

When you want to clean up the resources, visit the [Azure portal](https://portal.azure.com), select **Resource groups**, locate, and select the resource group that was created in the process of this tutorial (such as `deno-quickstart`), and then use the **Delete resource group** command.

## Next steps

Learn more about:
* [Deploy to App service](../tutorial-vscode-azure-app-service-node-01.md) with Visual Studio Code extensions
* [Deploy to a Virtual Machine](./nodejs-virtual-machine-vm/introduction.md)