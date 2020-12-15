---
title: Create the Azure App Service from the Azure CLI to host the app
description: Tutorial part 3, Azure CLI create the App Service
ms.topic: tutorial
ms.date: 09/24/2019
ms.custom: devx-track-js, devx-track-azurecli
---

# Create the App Service

[Previous step: Create the app](tutorial-vscode-azure-cli-node-02.md)

In this step, you use the Azure CLI to create the Azure App Service to host your app code.

1. At a terminal or command prompt, use the following command to create a **resource group** for the App Service. A resource group is essentially a named collection of an app's resources in Azure, such as a website, a database, Azure Functions, etc.

    ```azurecli
    az group create --name myResourceGroup --location westus
    ```

    The command above creates a resource group called `myResourceGroup` in the `westus` data center. You can change these values as desired.

    Once the command runs successfully, it displays JSON output with the details of the resource group.

1. Run the following command to set the default resource group and region for subsequent commands. Doing so avoids the need to specify these values each time. (This command has no output on success.)

    ```azurecli
    az configure --defaults group=myResourceGroup location=westus
    ```

1. Run the following command to create an **app service plan** that defines the underlying virtual machine used by the App Service:

    ```azurecli
    az appservice plan create --name myPlan --sku F1
    ```

    The command above specifies a free hosting plan (`--sku F1`), which uses a shared virtual machine, and names the plan `myPlan`. 

1. Run the following command to create the App Service, replacing `<your_app_name>` with a unique name that becomes the URL, `http://<your_app_name>.azurewebsites.net`, with the [latest Node.js runtime](/cli/azure/webapp?view=azure-cli-latest#az_webapp_list_runtimes). 

    ```azurecli
    az webapp create --name <your_app_name> --plan myPlan --runtime "node|12-lts"
    ```


1. Run the following command to open a browser to the newly created App Service, again replacing `<your_app_name>` with the name you used:

    ```azurecli
    az webapp browse --name <your_app_name>
    ```

1. Because you haven't deployed any custom code for the app you, the browser should show a default page:

    ![Default App Service page](media/azure-cli/azure-default-page.png)

> [!div class="nextstepaction"]
> [I created the App Service](tutorial-vscode-azure-cli-node-04.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment&step=create-website)
