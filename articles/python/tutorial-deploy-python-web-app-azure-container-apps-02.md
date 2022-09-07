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

## Get sample app

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


    
[1]: https://github.com/Azure-Samples/msdocs-python-django-azure-container-app
[2]: https://github.com/Azure-Samples/msdocs-python-flask-azure-container-app