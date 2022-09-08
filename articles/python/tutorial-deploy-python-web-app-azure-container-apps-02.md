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

The service diagram shown below highlights the components covered in this article.

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
        az acr build -r <registry-name> -g <res-group> -t msdocspythoncontainerwebapp:latest <repo-path>
        ```

        In the registry, confirm the image was built.
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
        * **Tag image as** &rarr; Enter *pythoncontainer:{{.Run.ID}}*.
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
        az group create -n <res-group> -l <location>
        ```

        *\<res-group>* is the resource group name. *\<location>* is one of the Azure location values from the command `az account list-locations -o table`.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 2.** Create a container registry with the [az acr create](/cli/azure/acr#az-acr-create) command.

        ```azurecli
        az acr create -g <res-group> -n <registry-name> --sku Basic
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
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4.** Select **+ Create New Environment** to create a new environment.
        
        * **Environment name** &rarr; *python-container-env".
        
        * **Zone redundancy** &rarr; **disabled**.
        
        * Select **Create** to finish and return to previous container **Basics**.

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5.** Configure App Settings.
        
        * **Use quickstart image** &rarr; Unselect checkbox (disabled).
        
        * **Name** &rarr; *container1*.
        	
        * **Image Source** &rarr; Select *Azure Container Registry*.
        
        * **Registry** &rarr; Select the name of registry created earlier.
        
        * **Image name** &rarr; Select *msdocspythoncontainerwebapp* (the name of the image you created earlier).
        
        * **Image tag** &rarr; Select *latest*.
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6.** Configure HTTP Ingress.
        
        * **HTTP Ingress** &rarr;  Select checkbox (enabled).
        
        * **Ingress traffic** &rarr; Select **Limited to Container Apps environment**.
        
        * **Target port**&rarr; Set to 8000 (Django) or 5000 (Flask).
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7.** Review and create.

        * Select **Review and create**.
        * Select **Create** to create the container app.
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::


### [VS Code](#tab/vscode-aztools)

These steps require the [Azure Container Apps extension][11] for VS Code.

TBD

### [Azure CLI](#tab/azure-cli)

TBD
---


## Verify website

## Troubleshoot deployment



    
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