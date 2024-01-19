---
title: Get Started - Configure Ansible in a Docker container
description: Learn how to install and configure Ansible running in a Docker container to managing Azure resources.
keywords: ansible, azure, devops, bash, playbook, azure cli, azure powershell, powershell
ms.topic: quickstart
ms.date: 09/23/2021
ms.custom: devx-track-ansible, mode-portal
---

# Get Started: Configure Ansible in a Docker container

This article shows you how to install Ansible running in a Docker container. Using a container for Ansible development solves the problem of "It works on my machine." by providing a consistent experience across all your environments, locally or in production.

In this article, you learn to:

> [!div class="checklist"]

> * Create an Azure service principal
> * Create a Dockerfile
> * Build a Docker image
> * Install Ansible in a Docker container
> * Use a Service Principal to authenticate Ansible to Azure from a Docker container
> * Run Ansible commands from a Docker container

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- **Docker Desktop**: [Installation options](https://www.docker.com/products/docker-desktop) are available for Windows, Mac, and Linux.

[!INCLUDE [ansible-service-principal.md](includes/ansible-service-principal.md)]

## Create a Dockerfile that will install Ansible

1. Create a directory in which to test and run the sample code and make it the current directory.

1. Create a new file named `Dockerfile`.

1. Insert the following Docker commands into the new file.

    ```dockerfile
    FROM ubuntu:22.04

    RUN apt-get update; \
        apt-get install -y gcc python3; \
        apt-get install -y python3-pip; \
        apt-get install -y locales; \
        apt-get clean

    RUN locale-gen en_US.UTF-8

    ENV DEBIAN_FRONTEND=noninteractive

    RUN pip3 install --upgrade pip; \
        apt-get install -y ansible; \
        ansible-galaxy collection install azure.azcollection; \
        pip3 install -r ~/.ansible/collections/ansible_collections/azure/azcollection/requirements-azure.txt --break-system-packages

    ```

## Build the Ansible Docker image

Run [docker build](https://docs.docker.com/engine/reference/commandline/build/) to build the Docker image used to run Ansible.

```cmd
docker build . -t ansible
```

## Start the Ansible container

1. Run the [`docker run`](https://docs.docker.com/engine/reference/commandline/run/) to start the Ansible container.

    ```cmd
    docker run -it ansible
    ```

    **Key points:**

    - By default, Docker containers start detached from the terminal, running in the background.
    - The `-it` option stands for interactive terminal allowing you to run commands inside the Docker container.

1. To confirm Ansible was installed in the container, run the Ansible command to print its version.

    ```cmd
    ansible --version
    ```

## Connect to Azure from the Ansible container

Assign the following environment variables to connect to Azure:

```bash
export AZURE_TENANT="<azure_tenant_id>"
export AZURE_SUBSCRIPTION_ID="<azure_subscription_id>"
export AZURE_CLIENT_ID="<service_principal_app_id>"
export AZURE_SECRET="<service_principal_password>"
```

## Create an Azure resource group

Run the following Ansible command to create a resource group:

```bash
ansible localhost -m azure_rm_resourcegroup -a 'name=myResourceGroup location=eastus'
```

**Key points:**

- Upon completion, the command displays whether it was successful in creating the resource group.

## Clean up resources

Run the following Ansible command to delete the resource group.

```bash
ansible localhost -m azure_rm_resourcegroup -a 'name=myResourceGroup location=eastus state=absent'
```

**Key points:**

- Upon completion, the command displays whether it was successful in creating the resource group.

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](./index.yml)
