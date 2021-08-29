---
title: Quickstart - Configure Linux virtual machines in Azure using Ansible 
description: In this quickstart, learn how to create a Linux virtual machine in Azure using Ansible
keywords: ansible, azure, devops, virtual machine
ms.topic: tutorial
ms.date: 08/28/2021
ms.custom: devx-track-ansible
---

# Quickstart: Configure Linux virtual machines in Azure using Ansible

Using a declarative language, Ansible allows you to automate the creation, configuration, and deployment of Azure resources via Ansible *playbooks*. This article presents a sample Ansible playbook for configuring Linux virtual machines. The [complete Ansible playbook](#complete-sample-ansible-playbook) is listed at the end of this article.

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-sub.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation1.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation1.md)]

## Create a resource group

Ansible needs a resource group in which your resources are deployed. The following sample Ansible playbook section creates a resource group named `myResourceGroup` in the `eastus` location:

```yaml
- name: Create resource group
  azure_rm_resourcegroup:
    name: myResourceGroup
    location: eastus
```

## Create a virtual network

When you create an Azure virtual machine, you must create a [virtual network](/azure/virtual-network/virtual-networks-overview) or use an existing virtual network. You also need to decide how your virtual machines are intended to be accessed on the virtual network. The following sample Ansible playbook section creates a virtual network named `myVnet` in the `10.0.0.0/16` address space:

```yaml
- name: Create virtual network
  azure_rm_virtualnetwork:
    resource_group: myResourceGroup
    name: myVnet
    address_prefixes: "10.0.0.0/16"
```

All Azure resources deployed into a virtual network are deployed into a [subnet](/azure/virtual-network/virtual-network-manage-subnet) within a virtual network. 

The following sample Ansible playbook section creates a subnet named `mySubnet` in the `myVnet` virtual network:

```yaml
- name: Add subnet
  azure_rm_subnet:
    resource_group: myResourceGroup
    name: mySubnet
    address_prefix: "10.0.1.0/24"
    virtual_network: myVnet
```

## Create a public IP address

[Public IP addresses](/azure/virtual-network/virtual-network-ip-addresses-overview-arm) allow Internet resources to communicate inbound to Azure resources. 
Public IP addresses also enable Azure resources to communicate outbound to public-facing Azure services. In both scenarios, an IP address assigned to the resource being accessed. The address is dedicated to the resource until you unassign it. If a public IP address isn't assigned to a resource, the resource can still communicate outbound to the Internet. The connection is made by Azure dynamically assigning an available IP address. The dynamically assigned address isn't dedicated to the resource.

The following sample Ansible playbook section creates a public IP address named `myPublicIP`:

```yaml
- name: Create public IP address
  azure_rm_publicipaddress:
    resource_group: myResourceGroup
    allocation_method: Static
    name: myPublicIP
```

## Create a network security group

[Network security groups](/azure/virtual-network/security-overview) filter network traffic between Azure resources in a virtual network. Security Rules are defined that govern inbound and outbound traffic to and from Azure resources. For more information about Azure resources and network security groups, see [Virtual network integration for Azure services](/azure/virtual-network/virtual-network-for-azure-services)

The following playbook creates a network security group named `myNetworkSecurityGroup`. The network security group includes a rule that allows SSH traffic on TCP port 22.

```yaml
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
```

## Create a virtual network interface card

A virtual network interface card connects your virtual machine to a given virtual network, public IP address, and network security group. 

The following section in a sample Ansible playbook section creates a virtual network interface card named `myNIC` connected to the virtual networking resources you've created:

```yaml
- name: Create virtual network interface card
  azure_rm_networkinterface:
    resource_group: myResourceGroup
    name: myNIC
    virtual_network: myVnet
    subnet: mySubnet
    public_ip_name: myPublicIP
    security_group: myNetworkSecurityGroup
```

## Create a virtual machine

The final step is to create a virtual machine that uses all the resources you've created in the previous sections of this article. 

The sample Ansible playbook section presented in this section creates a virtual machine named `myVM` and attaches the virtual network interface card named `myNIC`. Replace the &lt;your-key-data> placeholder with your own complete public key data.

```yaml
- name: Create VM
  azure_rm_virtualmachine:
    resource_group: myResourceGroup
    name: myVM
    vm_size: Standard_DS1_v2
    admin_username: azureuser
    ssh_password_enabled: false
    ssh_public_keys:
      - path: /home/azureuser/.ssh/authorized_keys
        key_data: <your-key-data>
    network_interfaces: myNIC
    image:
      offer: CentOS
      publisher: OpenLogic
      sku: '7.5'
      version: latest
```

## Run the sample Ansible playbook

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Open [Cloud Shell](/azure/cloud-shell/overview).

1. Create a file named `ansible-create-vm.yml` to contain your playbook.

1. Insert the following code into your playbook:

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
      - name: Dump public IP for VM which will be created
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
              key_data: <your-key-data>
          network_interfaces: myNIC
          image:
            offer: CentOS
            publisher: OpenLogic
            sku: '7.5'
            version: latest
    ```

1. Run the sample Ansible playbook.

   ```bash
   ansible-playbook `ansible-create-vm.yml`
   ```

1. Verify the VM was created.

    ```azurecli
    az vm list -d -o table --query "[?name=='MyVM']"
    ```

1. The SSH command is used to access your Linux VM. Replace the &lt;ip-address> placeholder with the IP address from the previous step.

    ```bash
    ssh azureuser@<ip-address>
    ```

## Clean up resources

[!INCLUDE [ansible-delete-resource-group.md](includes/ansible-delete-resource-group.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Quickstart: Manage a Linux virtual machine in Azure using Ansible](./vm-manage.md)
