---
title: Quickstart - Configure Ansible using Azure CLI
description: In this quickstart, learn how to install and configure Ansible for managing Azure resources on Ubuntu, CentOS, and SLES
keywords: ansible, azure, devops, bash, cloudshell, playbook, azure cli
ms.topic: quickstart
ms.date: 02/25/2021
ms.custom: devx-track-ansible, devx-track-azurecli
---

# Quickstart: Configure Ansible using Azure CLI

This quickstart shows how to install [Ansible](https://docs.ansible.com/) using the Azure CLI.

In this quickstart, you'll complete these tasks:

> [!div class="checklist"]
> * Create an SSH key pair
> * Create a resource group
> * Create a CentOS virtual machine
> * Install Ansible on the virtual machine
> * Connect to the virtual machine via SSH
> * Configure Ansible on the virtual machine

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [open-source-devops-prereqs-create-sp.md](../includes/open-source-devops-prereqs-create-service-principal.md)]
- **Access to Linux or a Linux virtual machine** -  If you don't have a Linux machine, create a [Linux virtual machine](/azure/virtual-network/quick-create-cli).

## Create an SSH key pair

When connecting to Linux VMs, you can use password authentication or key-based authentication. Key-based authentication is more secure than using passwords. As such, this article uses key-based authentication.

With key-based authentication, there are two keys:

- **Public key**: The public key is stored on the host - such as on your VM (as in this article)
- **Private key**: The private key enables you to securely connect to your host. The private key is effectively your password and should be protected as such.
        
The following steps walk you through creating an SSH key pair.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview) and - if not done already - switch to **Bash**.

1. Create an SSH key using [ssh-keygen](https://www.ssh.com/ssh/keygen/).

    ```bash
    ssh-keygen -m PEM -t rsa -b 2048 -C "azureuser@azure" -f ~/.ssh/ansible_rsa -N ""
    ```

> [!NOTE]
> The `ssh-keygen` command displays the location of the generated key files. You need this directory name when you create the virtual machine.
> The public key is stored in `ansible_rsa.pub` and the private key is stored in `ansible_rsa`.

## Create a virtual machine

1. Create a resource group using [az group create](/cli/azure/group#az-group-create). You might need to replace the `--location` parameter with the appropriate value for your environment.

    ```azurecli
    az group create --name QuickstartAnsible-rg --location eastus
    ```

1. Create a virtual machine using [az vm create](/cli/azure/vm#az-vm-create). Replace the placeholder with the fully qualified name of your SSH **public** key filename.

    ```azurecli
    az vm create \
    --resource-group QuickstartAnsible-rg \
    --name QuickstartAnsible-vm \
    --image OpenLogic:CentOS:7.7:latest \
    --admin-username azureuser \
    --ssh-key-values <ssh_public_key_filename>
    ```

1. Verify the creation (and state) of the new virtual machine using [az vm list](/cli/azure/vm#az-vm-list).

    ```azurecli
    az vm list -d -o table --query "[?name=='QuickstartAnsible-vm']"
    ```

## Connect to your virtual machine via SSH

Using the SSH command, connect to your virtual machine's public IP address.

```azurecli
ssh -i <ssh_private_key_filename> azureuser@<vm_ip_address>
```

Replace the placeholders with the appropriate values returned in pervious commands.

## Install Ansible on the virtual machine

Run the following commands to configure Ansible on Centos:

<br>

<details>

<summary><code>configure-ansible-centos.sh</code></summary>

```bash
#!/bin/bash

# Update all packages that have available updates.
sudo yum update -y

# Install Python 3 and pip.
sudo yum install -y python3-pip

# Upgrade pip3.
sudo pip3 install --upgrade pip

# Install Ansible.
pip3 install ansible[azure]

# Install Ansible modules and plugins for interacting with Azure.
ansible-galaxy collection install azure.azcollection

# Install required modules for Ansible on Azure
wget https://raw.githubusercontent.com/ansible-collections/azure/dev/requirements-azure.txt

# Install Ansible modules
sudo pip3 install -r requirements-azure.txt
``````

</details>

## Create Azure credentials

To configure the Ansible credentials, you need the following information:

* Your Azure subscription ID and tenant ID
* The service principal applicationID, and secret

Configure the Ansible credentials using one of the following techniques:

- [Option 1 - Create an Ansible credentials file](#file-credentials)
- [Option 2 - Define Ansible environment variables](#env-credentials)

#### <span id="file-credentials"/> Option 1 - Create Ansible credentials file

In this section, you create a local credentials file to provide credentials to Ansible.

For more information about defining Ansible credentials, see [Providing Credentials to Azure Modules](https://docs.ansible.com/ansible/latest/scenario_guides/guide_azure.html).

1. Once you've successfully connected to the host virtual machine, create and open a file named `credentials`:

    ```bash
    mkdir ~/.azure
    vi ~/.azure/credentials
    ```

1. Insert the following lines into the file. Replace the placeholders with the service principal values.

    ```bash
    [default]
    subscription_id=<your-subscription_id>
    client_id=<security-principal-appid>
    secret=<security-principal-password>
    tenant=<security-principal-tenant>
    ```

1. Save and close the file.

> [!WARNING]
> For security reasons, credential files should only be used in development environments.

#### <span id="env-credentials"/> Option 2 - Define Ansible environment variables

On the host virtual machine, export the service principal values to configure your Ansible credentials.

```bash
export AZURE_SUBSCRIPTION_ID=<your-subscription_id>
export AZURE_CLIENT_ID=<security-principal-appid>
export AZURE_SECRET=<security-principal-password>
export AZURE_TENANT=<security-principal-tenant>
```

## Test Ansible installation

You now have a virtual machine with Ansible installed and configured!

[!INCLUDE [ansible-test-configuration.md](includes/ansible-test-configuration.md)]

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](./index.yml)
