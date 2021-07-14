---
title: Quickstart - Configure Ansible in a Docker container
description: In this quickstart, learn how to install and configure Ansible running in a Docker container to managing Azure resources.
keywords: ansible, azure, devops, bash, playbook, azure cli, azure powershell, powershell
ms.topic: quickstart
ms.date: 05/20/2021
ms.custom: devx-track-ansible
---

# Quickstart: Configure Ansible in a Docker container

This quickstart shows you how to install Ansible running in a Docker container. Using a container for Ansible development solves the problem of "It works on my machine." by providing a consistent experience across all your environments, locally or in production.

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

## Create a Dockerfile

From the terminal, create a new `Dockerfile`.

# [Bash](#tab/bash)
```bash
touch Dockerfile
```
# [PowerShell](#tab/powershell)
```powershell
New-Item Dockerfile
```
---

## Install Ansible with a Dockerfile

Open the `Dockerfile` and copy the follow Docker commands into the file.

**Ansible 2.9**

```dockerfile
FROM centos:7

ENV ANSIBLE_VERSION 2.9.17

RUN yum check-update; \
    yum install -y gcc libffi-devel python3 epel-release; \
    yum install -y python3-pip; \
    yum clean all

RUN pip3 install --upgrade pip; \
    pip3 install "ansible==${ANSIBLE_VERSION}"; \
    pip3 install ansible[azure]
```

**Ansible 2.10**

```dockerfile
FROM centos:7

RUN yum check-update; \
    yum install -y gcc libffi-devel python3 epel-release; \
    yum install -y python3-pip; \
    yum install -y wget; \
    yum clean all

RUN pip3 install --upgrade pip; \
    pip3 install "ansible"; \
    wget -q https://raw.githubusercontent.com/ansible-collections/azure/dev/requirements-azure.txt; \
    pip3 install -r requirements-azure.txt; \
    rm requirements-azure.txt; \
    ansible-galaxy collection install azure.azcollection
```

## Build an Ansible Docker image

Within the directory containing the `Dockerfile`, run the following Docker command:

```cmd
docker build . -t ansible
```

The docker build command executes the commands defined within the `Dockerfile`, which produces the Docker image used to run Ansible within a container.

## Start an Ansible container

Run the `docker run` command to start the Ansible container.

```cmd
docker run -it ansible
```

By default, Docker containers start detached from the terminal, running in the background. The `-it` option stands for interactive terminal allowing you to run commands inside the Docker container.

Confirm Ansible was installed by running the command `ansible --version` inside the Docker container.

```bash
ansible --version
```

## Connect to Azure from the Ansible container

**Export** the following environment variables to connect to Azure:

```bash
export AZURE_SUBSCRIPTION_ID=<subscriptionId>
export AZURE_CLIENT_ID=<servicePrincipal-appId>
export AZURE_SECRET=<servicePrincipal-password>
export AZURE_TENANT=<tenantId>
```

> [!TIP]
> You can start the Ansible container with pre-populated environment variable using the `--env` option of the `docker run` command.

# [Bash](#tab/bash)
```bash
docker run -it \
--env "AZURE_SUBSCRIPTION_ID=<Azure_Subscription_ID>" \
--env "AZURE_CLIENT_ID=<Service_Principal_Application_ID>" \
--env "AZURE_SECRET=<Service_Principal_Password>" \
--env "AZURE_TENANT=<Azure_Tenant>" \
ansible
```

Replace the values with your service principal and Azure subscription details.

# [PowerShell](#tab/powershell)
```powershell
docker run -it `
--env "AZURE_SUBSCRIPTION_ID=<Azure_Subscription_ID>" `
--env "AZURE_CLIENT_ID=<Service_Principal_Application_ID>" `
--env "AZURE_SECRET=<Service_Principal_Password>" `
--env "AZURE_TENANT=<Azure_Tenant>" `
ansible
```

Replace the values with your service principal and Azure subscription details.

---

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

**Delete** the resource group by adding `state=absent` to the argument list.

```bash
ansible localhost -m azure_rm_resourcegroup -a 'name=myResourceGroup location=eastus state=absent'
```
---

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](./index.yml)
