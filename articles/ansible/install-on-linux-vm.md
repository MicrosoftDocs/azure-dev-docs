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
> * Create a resource group
> * Create a CentOS virtual machine
> * Install Ansible on the virtual machine
> * Connect to the virtual machine via SSH
> * Configure Ansible on the virtual machine

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [open-source-devops-prereqs-create-sp.md](../includes/open-source-devops-prereqs-create-service-principal.md)]

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
    --admin-password <password>
    ```

    Replace the `<password>` your password.

    # [PowerShell](#tab/powershell)

    ```azurepowershell
    $adminUsername = "azureuser"
    $adminPassword = ConvertTo-SecureString <password> -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential ($adminUsername, $adminPassword);
    
    New-AzVM `
    -ResourceGroupName QuickstartAnsible-rg `
    -Location eastus `
    -Image OpenLogic:CentOS:7.7:latest `
    -Name QuickstartAnsible-vm `
    -OpenPorts 22 `
    -Credential $credential
    ```

    Replace the `<password>` your password.

1. Geth the public Ip address of the Azure virtual machine.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az vm show -d -g QuickstartAnsible-rg -n QuickstartAnsible-vm --query publicIps -o tsv
    ```

    **NOTE**:

    * The output displays the public IP address used to connect via SSH to the virtual machine.

    # [PowerShell](#tab/powershell)

    ```azurepowershell
    (Get-AzVM -ResourceGroupName QuickstartAnsible-rg QuickstartAnsible-vm-pwsh | Get-AzPublicIpAddress).IpAddress
    ```

    **NOTE**:

    * The output displays the public IP address used to connect via SSH to the virtual machine.

## Connect to your virtual machine via SSH

Using the SSH command, connect to your virtual machine's public IP address.

```azurecli
ssh azureuser@<vm_ip_address>
```

Replace the placeholders with the appropriate values returned in pervious commands.

## Install Ansible on the virtual machine

### Ansible 2.9 with the azure_rm module

Run the following commands to configure Ansible 2.9 on Centos:

```bash
#!/bin/bash

# Update all packages that have available updates.
sudo yum update -y

# Install Python 3 and pip.
sudo yum install -y python3-pip

# Upgrade pip3.
sudo pip3 install --upgrade pip

# Install Ansible.
pip3 install "ansible==2.9.17"

# Install Ansible azure_rm module for interacting with Azure.
pip3 install ansible[azure]
```

### Ansible 2.10 with the azure.azcollection collection

Run the following commands to configure Ansible on Centos:

```bash
#!/bin/bash

# Update all packages that have available updates.
sudo yum update -y

# Install Python 3 and pip.
sudo yum install -y python3-pip

# Upgrade pip3.
sudo pip3 install --upgrade pip

# Install Ansible az collection for interacting with Azure.
ansible-galaxy collection install azure.azcollection

# Get required modules for Ansible on Azure list
wget https://raw.githubusercontent.com/ansible-collections/azure/dev/requirements-azure.txt

# Install Ansible modules for Azure
sudo pip3 install -r requirements-azure.txt
```

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

This section shows how to create a test resource group within your new Ansible configuration. If you don't need to do that, you can skip this section.

### Create an Azure resource group

Run the following ad-hoc Ansible command to create a resource group:

```bash
#Ansible 2.9 with azure_rm module
ansible localhost -m azure_rm_resourcegroup -a "name=ansible-test location=eastus"

#Ansible 2.10 with azure.azcollection
ansible localhost -m azure.azcollection.azure_rm_resourcegroup -a "name=<resource_group_name> location=<location>"
```

Replace `<resource_group_name>` and `<location>` with your values.

### (Optional) Create an Azure resource group with an Ansible playbook

1. Save the following code as `create_rg.yml`.

    Ansible 2.9 with azure_rm module

    ```yml
    ---
    - hosts: localhost
        connection: local
        tasks:
        - name: Creating resource group
            azure_rm_resourcegroup:
            name: "<resource_group_name"
            location: "<location>"
    ```

    Ansible 2.10 with azure.azcollection

    ```yml
    - hosts: localhost
      connection: local
      collections:
       - azure.azcollection
      tasks:
      - name: Creating resource group
          azure_rm_resourcegroup:
          name: "<resource_group_name"
          location: "<location>"
    ```

    Replace `<resource_group_name>` and `<location>` with your values.

1. Run the playbook using [ansible-playbook](https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html).

    ```bash
    ansible-playbook create_rg.yml
    ```

Read more about the [azure.azcollection](https://cloudblogs.microsoft.com/opensource/2020/04/28/announcing-azcollection-the-ansible-collection-for-azure/).

### Delete an Azure resource group

Run the following command to delete the Azure resource group:

```bash
#Ansible 2.9 with azure_rm module
ansible localhost -m azure_rm_resourcegroup -a "name=<resource_group_name> state=absent force_delete_nonempty=yes"

#Ansible 2.10 with azure.azcollection
ansible localhost -m azure.azcollection.azure_rm_resourcegroup -a "name=<resource_group_name> state=absent force_delete_nonempty=yes"
```

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](./index.yml)
