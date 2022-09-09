---
title: Build and deploy a Python web app with Azure Container Apps
description: Describes how to create a container from a Python web app and deploy it to Azure Container Apps, a serverless platform for hosting containerized applications.
ms.topic: conceptual
ms.date: 09/07/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Build and deploy a Python web app with Azure Container Apps and PostgreSQL

This article is part of a tutorial about how to containerize and deploy a Python web app to [Azure Container Apps][8]. Container Apps enable you to deploy containerized apps without managing complex infrastructure. 

In this part of the tutorial, you learn how to build containerized Python web app from a sample app (Django or Flask version). You build the container image in the cloud and deploy it to Azure Container Apps.  A [Service Connector][9] enables the container to connect to an [Azure Database for PostgreSQL - Flexible Server][10] instance, where the sample app stores data.

The service diagram shown below highlights the components covered in this article, namely building and deploying a container image.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-deploy.png" alt-text="A screenshot of the services in the Tutorial - Deploy a Python App on Azure Container Apps. Section highlighted is what is covered in this article." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-deploy.png":::

## Get the sample app

Go to the repository of the sample app ([Django][1] or [Flask][2]) and fork the repository.

1. Select the Fork button at the top of the sample app repo to fork the repo to your account.

1. Now you can clone your fork of the sample repository.

1. Use the following git command to clone your forked repo into the *python-code-to-cloud* folder:

    ```bash
    # Django
    git clone https://github.com/$GITHUB_USERNAME/msdocs-python-django-azure-container-app.git python-code-to-cloud
    
    # Flask
    # git clone https://github.com/$GITHUB_USERNAME/msdocs-python-flask-azure-container-app.git python-code-to-cloud
    ```
    
1. Change directory:

    ```bash
    cd python-code-to-cloud
    ```

## Build container image from web app code

After following these steps, you'll have an Azure Container Registry and a Docker container image built from the sample code. 

### [Azure portal](#tab/azure-portal)

Sign in to [Azure portal][3] to complete these steps.

:::row:::
    :::column span="2":::
        **Step 1.** In the portal search at the top of the screen, search for "container registries" and select the **Container Registries** service in the results.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2.** Select **+ Create** to start the create process.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Fill out the form and specify.
        * **Resource group** &rarr; Create a new one named *pythoncontainer-rg*.
        * **Registry name** &rarr; The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. 
        * **Location** &rarr; Select a location to match. 
        * **SKU** &rarr; Select **Standard**.

        When finished, select **Review + create**. After the validation is complete, select **Create**.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4.** Open [Azure Cloud Shell][4].

        You can also open Azure Cloud Shell selecting the Cloud Shell icon in the top menu bar of any portal window.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 5.** Use the [az acr build][5] command to build the image.

        Specify the registry name and resource group you created above. For `\<repo-path>`, choose either the [Django][1] or [Flask][2] repo path.

        ```azurecli
        az acr build -r <registry-name> -g <res-group> -t pythoncontainer:latest <repo-path>
        ```

        Go to the registry and confirm the image shows up.
    :::column-end:::
:::row-end:::


### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension][6] for VS Code.

:::row:::
    :::column span="2":::
        **Step 1.** Select **F1** or **CTRL+SHIFT+P** to open the command palette.
        * Type "images".
        * Select the task **Docker Images: Build Image in Azure**
        Alternatively, right-click the *Dockerfile* and select **Build Image in Azure**. This UI action starts the same create registry task.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2.** Follow the prompts to create a registry, a resource group, and build the image.
        * **Tag image as** &rarr; Enter *pythoncontainer:lastest*.
        * **Create new registry...** &rarr; Select this option to create new registry.
        * **Registry name** &rarr; The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. 
        * **Select a SKU** &rarr; Select **Standard**.
        * **Create a new resource group** &rarr; Select this option to create resource group.
        * **Resource group** &rarr; Create a new one named *pythoncontainer-rg*.
        * **Location** &rarr; Select a location.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Confirm the registry name
        * **Registry name** &rarr; The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. 
        * **SKU** &rarr; Select **Standard**.
        * **Resource group** &rarr; Create a new one named *pythoncontainer-rg*.
        * **Location** &rarr; Select a location.
        * **Select OS** &rarr; Select **Linux**.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell][4] or on a workstation with the [Azure CLI][7] installed.

:::row:::
    :::column span="1":::
        **Step 1.** Create a resource group with the [az group create](/cli/azure/group#az-group-create) command.

        ```azurecli
        az group create -n pythoncontainer-rg -l <location>
        ```

        *\<location>* is one of the Azure location values from the command `az account list-locations -o table`.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 2.** Create a container registry with the [az acr create](/cli/azure/acr#az-acr-create) command.

        ```azurecli
        az acr create -g pythoncontainer-rg -n <registry-name> --sku Basic
        ```

        *\<registry-name>* must be unique within Azure, and contain 5-50 alphanumeric characters.

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 3.** Sign in to the registry using the [az acr login](/cli/azure/acr#az-acr-login) command.

        ```azurecli
        az acr login -n <registry-name>
        ```
        
        The above command adds "azurecr.io" to the name to create the fully qualified registry name. If successful, you'll see the message "Login Succeeded". If you're accessing the registry from a subscription different from the one in which the registry was created, use the `--suffix` switch.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 4.** Build the image with the [az acr build](/cli/azure/acr#az-acr-build) command.

        ```azurecli
        az acr build -r <registry-name> -g <res-group> -t msdocspythoncontainerwebapp:latest .
        ```
        
        Note:

        * The dot (".") at the end of the command indicates the location of the source code to build. If you aren't running this command in the sample app root directory, specify the path to the code.

        * If you leave out the `-t` (same as `--image`) option, the command queues a local context build without pushing it to the registry. Building without pushing can be useful to check that the image builds.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 5.** Confirm the container image was created with the [az acr repository list](/cli/azure/acr/repository#az-acr-repository-list) command.

        ```azurecli
        az acr repository list -n <registry-name>
        ```
        :::column-end:::
:::row-end:::

---

## Create a PostgreSQL Flexible Server

TBD

## Deploy web app to Container Apps

Container apps are deployed to Container Apps environments, which act as a secure boundary. These steps will create both the environment and the container inside the environment, as well as configure the environment so that the website is visible externally.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **Step 1.** In the portal search at the top of the screen, search for "container apss" and select the **Container Apps** service in the results.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2.** Select **+ Create** to start the create process.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Specify the **Basics** of the container app.
        
        * **Resource group** &rarr; Use the group created earlier and contains the Azure Container Registry.
        
        * **Container app name** &rarr; *python-container-app*.
        
        * **Region** &rarr; Use the same region/location as the resource group.

        * **Container Apps Environment** &rarr; Accept the suggested name for a new environment.
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4.** On the **Basics** page, select **Next: App Settings** to go to configure app settings.

        On the **App settings** page:
        
        * **Use quickstart image** &rarr; Unselect checkbox (disabled).
        
        * **Name** &rarr; *containerweb*.
        	
        * **Image Source** &rarr; Select *Azure Container Registry*.
        
        * **Registry** &rarr; Select the name of registry you created earlier.
        
        * **Image name** &rarr; Select *pythoncontainer* (the name of the image you built).
        
        * **Image tag** &rarr; Select *latest*.
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5.** Configure HTTP Ingress.
        
        * **HTTP Ingress** &rarr;  Select checkbox (enabled).
        
        * **Ingress traffic** &rarr; Select **Accepting traffice from anywhere**.
        
        * **Target port**&rarr; Set to 8000 (Django) or 5000 (Flask).
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6.** Review and create.

        * Select **Review and create**.
        * Select **Create** to create the container app.
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::


### [VS Code](#tab/vscode-aztools)

These steps require the [Azure Container Apps extension][11] for VS Code.

Use "Container Create" task.

Can do update passing in .env variable file.

AZURE_POSTGRESQL_HOST=<host-name>.postgres.database.azure.com
AZURE_POSTGRESQL_DATABASE=<database-name>
AZURE_POSTGRESQL_USERNAME=<db-username>
AZURE_POSTGRESQL_PASSWORD=<db-password>
RUNNING_IN_PRODUCTION=1


### [Azure CLI](#tab/azure-cli)


:::row:::
    :::column:::
        **Step 1.** Sign in to Azure and authenticate, if needed.

        ```azurecli
        az login
        ```
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 2.** Install or upgrade the extension for Azure Container Apps withe [az extension add][14] command.
        
        ```azurecli
        az extension add --name containerapp --upgrade
        ```
        
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 3.** Create a Container Apps environment with the [az containerapp env create][13] command.

        ```azurecli
        az containerapp env create \
        --name python-container-env \
        --resource-group pythoncontainer-rg \
        --location <location>
        ```
        *\<location>* is one of the Azure location values from the command `az account list-locations -o table`.

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 4.** Create a container app in the environment with the [az containerapp create][12] command.

        ```azurecli
        az containerapp create \
        --name python-container-app \
        --resource-group pythoncontainer-rg \
        --image pythoncontainer \
        --environment python-container-env \
        --registry-server <registry-server-name> \
        --registry-username <registry-username> \
        --registry-password <registry-password>
        ```

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 5.** Add environment variables for the container with the  [az containerapp up][15] command.

        ```azurecli        
        az containerapp up  \
        --name python-container-app \
        --resource-group pythoncontainer-rg \
        --image pythoncontainer \
        --environment python-container-env \
        --env-vars <env-variable-string>
        ```

        Where \<env-variable-string> contains:

        * AZURE_POSTGRESQL_HOST=<host-name>.postgres.database.azure.com
        * AZURE_POSTGRESQL_DATABASE=<database-name>
        * AZURE_POSTGRESQL_USERNAME=<db-username>
        * AZURE_POSTGRESQL_PASSWORD=<db-password>
        * RUNNING_IN_PRODUCTION=1

    :::column-end:::
:::row-end:::

---

## Add environment variables that specify how to connect to PostgreSQL

### [Azure portal](#tab/azure-portal)


### [VS Code](#tab/vscode-aztools)



### [Azure CLI](#tab/azure-cli)

---

## Verify website

How to find Application Url in portal, vscode, and CLI.

## Troubleshoot deployment

* Image doesn't appear in the Azure Container Registry.
  * Check that output of the Azure CLI command or VS Code Output and look for messages to confirm success.
  * Check that the name of the registry was specified correctly in your build command with the Azure CLI or in the VS Code prompts.
  * Make sure your credentials haven't expired. For example, with Azure CLI, run `az login`. In VS Code, find the target registry in the Docker extension and refresh.

* Website returns "Bad Request (400)".
  * Check the environment variables passed in to the container. The error is indicative of not being able to connect to the PostgreSQL instance.
  * Check that there is a container environment variable `RUNNING_IN_PRODUCTION` set to 1. 

* Website returns "Not Found (404)".
  * Check the **Application Url** one the **Overview** page for the container. If the Url containers "internal", the ingress is not set correctly.
  * Go to the **Ingress** resource of the container and make sure **HTTP Ingress** is enabled and **Accepting traffice from anywhere** is selected..
    
[1]: https://github.com/Azure-Samples/msdocs-python-django-azure-container-app
[2]: https://github.com/Azure-Samples/msdocs-python-flask-azure-container-app
[3]: https://portal.azure.com/
[4]: https://shell.azure.com/
[5]: /cli/azure/acr#az-acr-build
[6]: https://code.visualstudio.com/docs/containers/overview
[7]: /cli/azure/install-azure-cli
[8]: /azure/container-apps/overview
[9]: /azure/service-connector/overview
[10]: /azure/postgresql/flexible-server/overview
[11]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps
[12]: /cli/azure/containerapp#az-containerapp-create
[13]: /cli/azure/containerapp/env#az-containerapp-env-create
[14]: /cli/azure/extension#az-extension-add
[15]: /cli/azure/containerapp#az-containerapp-up