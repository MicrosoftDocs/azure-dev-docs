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

This article is part of a tutorial about how to containerize and deploy a Python web app to Azure Container Apps. Container Apps enable you to deploy containerized apps without managing complex infrastructure. 

In this part of the tutorial, you learn how to build containerized Python web app from a sample app (Django or Flask version). You build the container image in the cloud and deploy it to Azure Container Apps.  A Service Connector enables the container to connect to an Azure Database for PostgreSQL - Flexible Server instance, where the sample app stores data.

The service diagram shown below highlights the components covered in this article.

## Get the sample app

Go to the repository for one of the sample app framework version ([Django][1] or Flask[2]) and fork the repository.

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

After following these steps, you'll have a Azure Container Registry and a Docker container image built from the sample code. 
### [Azure portal](#tab/azure-portal)

Sign in to [Azure portal][3] to complete these steps.

:::row:::
    :::column span="2":::
        **Step 1.** In the portal search at the top of the screen, search for "container registries" and go **Container registries** service.
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
        az acr build -r <registry-name> -g <resource-group> -t msdocspythoncontainerwebapp:latest <repo-path>
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


* az group create
* az acr create
* az acr build (az acr login)
* az acr repository list

---

    
[1]: https://github.com/Azure-Samples/msdocs-python-django-azure-container-app
[2]: https://github.com/Azure-Samples/msdocs-python-flask-azure-container-app
[3]: https://portal.azure.com/
[4]: https://shell.azure.com/
[5]: https://docs.microsoft.com/cli/azure/acr#az-acr-build
[6]: https://code.visualstudio.com/docs/containers/overview
[7]: https://docs.microsoft.com/cli/azure/install-azure-cli