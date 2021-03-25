---
title: Quickstart - Configure Ansible in a Docker Container
description: In this quickstart, learn how to install and configure Ansible running in a Docker container to managing Azure resources.
keywords: ansible, azure, devops, bash, playbook, azure cli
ms.topic: quickstart
ms.date: 03/24/2021
ms.custom: devx-track-ansible
---

# Quickstart - Configure Ansible in a Docker Container

This quick start shows you how to install Ansible running in a Docker container.

In this article, you learn to:

> [!div class="checklist"]
> * Create an Azure Service Principal
> * Create a Dockerfile
> * Install Ansible in a Docker container
> * Build a Docker image
> * Run Ansible commands from a Docker container
> * Connect to Azure from Ansible in a Docker container

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- **Docker Desktop**: [Installs](https://www.docker.com/products/docker-desktop) are available for Windows, Mac, and Linux.

[!INCLUDE [ansible-service-principal.md](includes/ansible-service-principal.md)]

## Create a Dockerfile

From the terminal, create a new `Dockerfile`.

## [Bash](#tab/bash)

```bash
touch Dockerfile
```

## [PowerShell](#tab/powershell)

```powershell
New-Item Dockerfile
```

## Install Ansible with a Dockerfile

Open the `Dockerfile` and copy the follow Docker commands into the file.

## [Ansible 2.9](#tab/ansible-2-9)

```dockerfile
touch Dockerfile
```

## [Ansible 2.10](#tab/ansible-2-10)

```dockerfile
FROM ubuntu:18.04

RUN apt-get update; \
    apt install -y python3-pip; \
    apt-get clean

RUN pip3 install --upgrade pip; \
    pip3 install "ansible"; \
    wget -q https://raw.githubusercontent.com/ansible-collections/azure/dev/requirements-azure.txt; \
    pip3 install -r requirements-azure.txt; \
    rm requirements-azure.txt; \
    ansible-galaxy collection install azure.azcollection
```

Version 2.10 of Ansible Azure's functionality is installed with collections instead of Ansible roles or modules.

## Build an Ansible Docker Image

Within the directory containing the `Dockerfile`, run the following Docker command:

```cmd
docker build . -t ansible
```

The docker build command executes the commands defined within the `Dockerfile`, which produces the Docker image used to run Ansible within a container.

## Start an Ansible Container

Run the `docker run` command to start the Ansible container.

```cmd
docker run -it ansible
```

By default Docker containers start detached from the terminal, running in the background. The `-it` option stands for interactive terminal allowing you to run commands inside the Docker container.

Confirm Ansible was installed by running the command `ansible --version` inside the Docker container.

```bash
ansible --version
```

## Connect to Azure from the Ansible Container

**Export** the following environment variables to connect to Azure:

```bash
export AZURE_SUBSCRIPTION_ID=<subscriptionId>
export AZURE_CLIENT_ID=<servicePrincipal-appId>
export AZURE_SECRET=<servicePrincipal-password>
export AZURE_TENANT=<tenantId>
```

> [!TIP]
> You can start the Ansible container with pre-populated environment variable using the `--env` option of the `docker run` command.

## [bash](#tab/bash)

```bash
 docker run -it --rm \
--env "AZURE_SUBSCRIPTION_ID=<Azure_Subscription_ID>" \
--env "AZURE_CLIENT_ID=<Service_Principal_Application_ID>" \
--env "AZURE_SECRET=<Service_Principal_Password>" \
--env "AZURE_TENANT=<Azure_Tenant>" \
ansible
```

## [PowerShell](#tab/powershell)

```powershell
docker run -it `
--env "AZURE_SUBSCRIPTION_ID=<Azure_Subscription_ID>" `
--env "AZURE_CLIENT_ID=<Service_Principal_Application_ID>" `
--env "AZURE_SECRET=<Service_Principal_Password>" `
--env "AZURE_TENANT=<Azure_Tenant>" `
ansible
```

---

## Create an Azure Resource Group with Ansible

Run the following ad-hoc Ansible command to create a resource group:

```bash
ansible localhost -m azure_rm_resourcegroup -a 'name=myResourceGroup location=eastus'
```

## Delete the Azure Resource Group

**Delete** the resource group by adding `state: absent` to the argument list.

```bash
ansible localhost -m azure_rm_resourcegroup -a 'name=myResourceGroup location=eastus'
```
