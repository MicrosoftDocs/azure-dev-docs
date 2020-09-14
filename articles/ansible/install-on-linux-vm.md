---
title: Quickstart - Configure Ansible using Azure CLI
description: In this quickstart, learn how to install and configure Ansible for managing Azure resources on Ubuntu, CentOS, and SLES
keywords: ansible, azure, devops, bash, cloudshell, playbook, azure cli
ms.topic: quickstart
ms.date: 08/13/2020
ms.custom: devx-track-ansible,devx-track-cli
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

    **Notes**:

    - The `ssh-keygen` command displays the location of the generated key files. You need this directory name when you create the virtual machine.
    - The public key is stored in `ansible_rsa.pub` and the private key is stored in `ansible_rsa`.

## Create a virtual machine

1. Create a resource group using [az group create](/cli/azure/group#az-group-create). You might need to replace the `--location` parameter with the appropriate value for your environment.

    ```azurecli
    az group create --name QuickstartAnsible-rg --location eastus
    ```

1. Create a virtual machine using [az vm create](/cli/azure/vm#az-vm-create).

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

    **Notes**:

    - The output from the `az vm list` command includes the public IP address used to connect via SSH to the virtual machine.

## Install Ansible on the virtual machine

Run the Ansible installation script using [az vm extension set](/cli/azure/vm/extension?#az-vm-extension-set).

```azurecli
az vm extension set \
 --resource-group QuickstartAnsible-rg \
 --vm-name QuickstartAnsible-vm \
 --name customScript \
 --publisher Microsoft.Azure.Extensions \
 --version 2.1 \
 --settings '{"fileUris":["https://raw.githubusercontent.com/MicrosoftDocs/mslearn-ansible-control-machine/master/configure-ansible-centos.sh"]}' \
 --protected-settings '{"commandToExecute": "./configure-ansible-centos.sh"}'
```

**Notes:**

- Upon completion, the `az vm extension` command displays the results of running the installation script.

## Connect to your virtual machine via SSH

Using the SSH command, connect to your virtual machine.

```azurecli
ssh -i <ssh_private_key_filename> azureuser@<vm_ip_address>
```

## Create Azure credentials

To configure the Ansible credentials, you need the following information:

* Your Azure subscription ID 
* The service principal values

If you're using Ansible Tower or Jenkins, declare the service principal values as environment variables.

Configure the Ansible credentials using one of the following techniques:

- [Create an Ansible credentials file](#file-credentials)
- [Use Ansible environment variables](#env-credentials)

### <span id="file-credentials"/> Create Ansible credentials file

In this section, you create a local credentials file to provide credentials to Ansible.

For more information about defining Ansible credentials, see [Providing Credentials to Azure Modules](https://docs.ansible.com/ansible/guide_azure.html#providing-credentials-to-azure-modules).

1. For a development environment, create a file named `credentials` on the host virtual machine:

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

### <span id="env-credentials"/>Use Ansible environment variables

In this section, you export the service principal values to configure your Ansible credentials.

1. Open a terminal window.

1. Export the service principal values:

    ```bash
    export AZURE_SUBSCRIPTION_ID=<your-subscription_id>
    export AZURE_CLIENT_ID=<security-principal-appid>
    export AZURE_SECRET=<security-principal-password>
    export AZURE_TENANT=<security-principal-tenant>
    ```

You now have a virtual machine with Ansible installed and configured!

[!INCLUDE [ansible-clean-up-resources.md](includes/ansible-clean-up-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](/azure/developer/Ansible)