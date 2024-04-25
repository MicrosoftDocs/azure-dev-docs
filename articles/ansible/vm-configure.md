---
title: Create a Linux virtual machines in Azure using Ansible 
description: Learn how to create a Linux virtual machine in Azure using Ansible
keywords: ansible, azure, devops, virtual machine
ms.topic: tutorial
ms.date: 11/08/2021
ms.custom: devx-track-ansible, linux-related-content
---

# Create a Linux virtual machines in Azure using Ansible

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and plan accordingly. For more information, see the [CentOS End Of Life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

This article presents a sample Ansible playbook for configuring a Linux virtual machine.

In this article, you learn how to:

> [!div class="checklist"]

> * Create a resource group
> * Create a virtual network
> * Create a public IP address
> * Create a network security group
> * Create a virtual network interface card
> * Create a virtual machine

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-sub.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation1.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation1.md)]

## 2. Create an SSH key pair

1. Run the following command. When prompted, specify the files to be created in the following directory: `/home/azureuser/.ssh/authorized_keys`.

    ```bash
    ssh-keygen -m PEM -t rsa -b 4096
    ```

1. Copy the contents of the public key file. By default, the public key file is named `id_rsa.pub`. The value is a long string starting with "ssh-rsa ". You'll need this value in the next step.
    
## 3. Implement the Ansible playbook

1. Create a directory in which to test and run the sample Ansible code and make it the current directory.

1. Create a file named `main.yml` and insert the following code. Replace the `<key_data>` placeholder with the public key value from the previous step.

    ```yaml
    - name: Create Azure VM
      hosts: localhost
      connection: local
      tasks:
      - name: Create resource group
        azure_rm_resourcegroup:
          name: myResourceGroup
          location: eastus
      - name: Create virtual network
        azure_rm_virtualnetwork:
          resource_group: myResourceGroup
          name: myVnet
          address_prefixes: "10.0.0.0/16"
      - name: Add subnet
        azure_rm_subnet:
          resource_group: myResourceGroup
          name: mySubnet
          address_prefix: "10.0.1.0/24"
          virtual_network: myVnet
      - name: Create public IP address
        azure_rm_publicipaddress:
          resource_group: myResourceGroup
          allocation_method: Static
          name: myPublicIP
        register: output_ip_address
      - name: Public IP of VM
        debug:
          msg: "The public IP is {{ output_ip_address.state.ip_address }}."
      - name: Create Network Security Group that allows SSH
        azure_rm_securitygroup:
          resource_group: myResourceGroup
          name: myNetworkSecurityGroup
          rules:
            - name: SSH
              protocol: Tcp
              destination_port_range: 22
              access: Allow
              priority: 1001
              direction: Inbound
      - name: Create virtual network interface card
        azure_rm_networkinterface:
          resource_group: myResourceGroup
          name: myNIC
          virtual_network: myVnet
          subnet: mySubnet
          public_ip_name: myPublicIP
          security_group: myNetworkSecurityGroup
      - name: Create VM
        azure_rm_virtualmachine:
          resource_group: myResourceGroup
          name: myVM
          vm_size: Standard_DS1_v2
          admin_username: azureuser
          ssh_password_enabled: false
          ssh_public_keys:
            - path: /home/azureuser/.ssh/authorized_keys
              key_data: "<key_data>"
          network_interfaces: myNIC
          image:
            offer: CentOS
            publisher: OpenLogic
            sku: '7.5'
            version: latest
    ```

## 4. Run the playbook

[!INCLUDE [ansible-playbook.md](includes/ansible-playbook.md)]

## 5. Verify the results

Run [az vm list](/cli/azure/vm#az-vm-list) to verify the VM was created.

  ```azurecli
  az vm list -d -o table --query "[?name=='myVM']"
  ```

## 6. Connect to the VM

Run the SSH command to connect to your new Linux VM. Replace the &lt;ip-address> placeholder with the IP address from the previous step.

```bash
ssh azureuser@<ip_address> -i /home/azureuser/.ssh/authorized_keys/id_rsa
```

## Clean up resources

[!INCLUDE [ansible-delete-resource-group.md](includes/ansible-delete-resource-group.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Manage a Linux virtual machine in Azure using Ansible](./vm-manage.md)
