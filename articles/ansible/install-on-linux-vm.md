---
title: Quickstart - Install Ansible on an Azure VM
description: In this quickstart, learn how to install and configure Ansible on an Azure VM for managing Azure resources.
keywords: ansible, azure, devops, bash, cloudshell, playbook, azure cli, powershell, azure powershell
ms.topic: quickstart
ms.date: 05/10/2021
ms.custom: devx-track-ansible, devx-track-azurecli, devx-track-azurepowershell
---

# Quickstart: Configure Ansible using Azure CLI

This quickstart shows how to install [Ansible](https://docs.ansible.com/) on a Centos VM in Azure.

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
* **Install Open-SSH**:
    * [Windows Server 2019, Windows 10](/windows-server/administration/openssh/openssh_install_firstuse)

## Create an SSH key pair

When connecting to Linux VMs, you can use password authentication or key-based authentication. Key-based authentication is more secure than using passwords. As such, this article uses key-based authentication.

With key-based authentication, there are two keys:

* **Public key**: The public key is stored on the host - such as on your VM (as in this article)
* **Private key**: The private key enables you to securely connect to your host. The private key is effectively your password and should be protected as such.

The following steps walk you through creating an SSH key pair.

Run the following command to create an SSH key using [ssh-keygen](https://www.ssh.com/ssh/keygen/).

# [Bash](#tab/azure-cli)
```bash
ssh-keygen -m PEM -t rsa -b 2048 -C "azureuser@azure" -f ~/.ssh/ansible_rsa -N ""
```
# [PowerShell](#tab/powershell)

```powershell
ssh-keygen -m PEM -t rsa -b 2048 -C "azureuser@azure" -f ~/.ssh/ansible_rsa -N """"
```
---

**NOTE**:

* The `ssh-keygen` command displays the location of the generated key files. You need this directory name when you create the virtual machine.
* The public key is stored in `ansible_rsa.pub` and the private key is stored in `ansible_rsa`.

## Create a virtual machine

1. Create a an Azure resource group.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az group create --name QuickstartAnsible-rg --location eastus
    ```

    You might need to replace the `--location` parameter with the appropriate value for your environment.

    # [PowerShell](#tab/powershell)

    ```azurepowershell
    New-AzResourceGroup -Name QuickstartAnsible-rg -location eastus
    ```

    You might need to replace the `-location` parameter with the appropriate value for your environment.

    ---

1. Create the Azure virtual machine for Ansible.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az vm create \
    --resource-group QuickstartAnsible-rg \
    --name QuickstartAnsible-vm \
    --image OpenLogic:CentOS:7.7:latest \
    --admin-username azureuser \
    --ssh-key-values ~/.ssh/<ssh_public_key_filename>.pub
    ```

    Replace the placeholder with the fully qualified name of your SSH **public** key filename.

    # [PowerShell](#tab/powershell)

    ```azurepowershell
    New-AzResourceGroup -Name QuickstartAnsible-rg -location eastus
    ```

    Replace the placeholder with the fully qualified name of your SSH **public** key filename.

1. Verify the creation (and state) of the new virtual machine using [az vm list](/cli/azure/vm#az_vm_list).

    ```azurecli
    az vm list -d -o table --query "[?name=='QuickstartAnsible-vm']"
    ```

**NOTE**:

* The output from the `az vm list` command includes the public IP address used to connect via SSH to the virtual machine.

## Connect to your virtual machine via SSH

Using the SSH command, connect to your virtual machine's public IP address.

```azurecli
ssh -i <ssh_private_key_filename> azureuser@<vm_ip_address>
```

Replace the placeholders with the appropriate values returned in pervious commands.

## Install Ansible on the virtual machine

Run the following commands to configure Ansible on Centos:

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

## Create Azure credentials

To configure the Ansible credentials, you need the following information:

* Your Azure subscription ID and tenant ID
* The service principal applicationID, and secret

Configure the Ansible credentials using one of the following techniques:

- [Option 1: Create an Ansible credentials file](#file-credentials)
- [Option 2: Define Ansible environment variables](#env-credentials)

#### <span id="file-credentials"/> Option 1: Create Ansible credentials file

In this section, you create a local credentials file to provide credentials to Ansible. For security reasons, credential files should only be used in development environments.

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

#### <span id="env-credentials"/> Option 2: Define Ansible environment variables

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
