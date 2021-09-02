---
title: Get Started - Configure Ansible in a Docker container
description: Learn how to install and configure Ansible running in a Docker container to managing Azure resources.
keywords: ansible, azure, devops, bash, playbook, azure cli, azure powershell, powershell
ms.topic: quickstart
ms.date: 09/02/2021
ms.custom: devx-track-ansible
---

# Get Started: Configure Ansible in a Docker container

This article shows you how to install Ansible running in a Docker container. Using a container for Ansible development solves the problem of "It works on my machine." by providing a consistent experience across all your environments, locally or in production.

In this article, you learn to:

> [!div class="checklist"]

> * Create an Azure service principal
> * Create a Dockerfile
> * Install Ansible in a Docker container
> * Build a Docker image
> * Run Ansible commands from a Docker container
> * Connect to Azure from Ansible in a Docker container

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- **Docker Desktop**: [Installs](https://www.docker.com/products/docker-desktop) are available for Windows, Mac, and Linux.

[!INCLUDE [ansible-service-principal.md](includes/ansible-service-principal.md)]

## Install Ansible with a Dockerfile

1. Create a directory in which to test and run the sample code and make it the current directory.

1. Create a new file named `Dockerfile`.

1. Insert the following Docker commands into the new file.

    ```dockerfile
    FROM centos:7
    
    RUN yum check-update; \
        yum install -y gcc libffi-devel python3 epel-release; \
        yum install -y python3-pip; \
        yum install -y wget; \
        yum clean all
    
    RUN pip3 install --upgrade pip; \
        pip3 install --upgrade virtualenv; \
        pip3 install pywinrm[kerberos]; \
        pip3 install pywinrm; \
        pip3 install jmspath; \
        pip3 install requests; \
        yum install ansible -y; \
        wget -q https://raw.githubusercontent.com/ansible-collections/azure/dev/requirements-azure.txt; \
        pip3 install -r requirements-azure.txt; \
        rm requirements-azure.txt; \
        ansible-galaxy collection install azure.azcollection
        ```

## Build an Ansible Docker image

Run [docker build](https://docs.docker.com/engine/reference/commandline/build/) to build the Docker image used to run Ansible.

```cmd
docker build . -t ansible
```

## Start an Ansible container

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
export ARM_TENANT_ID="<azure_tenant_id>"
export ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
export ARM_CLIENT_ID="<service_principal_app_id>"
export ARM_CLIENT_SECRET="<service_principal_password>"
```

## Create an Azure resource group

From inside the Ansible container, run the following Ansible command to create a resource group:

```bash
ansible localhost -m azure_rm_resourcegroup -a 'name=myResourceGroup location=eastus'
```

Confirm the resource group was created.

# [Bash](#tab/bash)
```bash
az group show --resource-group myResourceGroup
```

Replace the values with your service principal and Azure subscription details.

# [PowerShell](#tab/powershell)
```powershell
Get-AzResourceGroup -Name myResourceGroup
```
---

## Clean up resources

Delete the resource group by adding `state=absent` to the argument list.

```bash
ansible localhost -m azure_rm_resourcegroup -a 'name=myResourceGroup location=eastus state=absent'
```
---

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](./index.yml)
