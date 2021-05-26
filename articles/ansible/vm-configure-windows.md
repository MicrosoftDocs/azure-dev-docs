---
title: Quickstart - Configure Windows virtual machines in Azure using Ansible
description: In this quickstart, learn how to create Windows virtual machine in Azure using Ansible.
keywords: ansible, azure, devops, bash, playbook, virtual machine
ms.topic: quickstart
ms.service: ansible
ms.date: 05/19/2021
ms.custom: devx-track-ansible
---

# Quickstart: Deploy a Windows Azure VM with Ansible

This quickstart shows how to deploy a Windows Server 2019 VM in Azure with [Ansible](https://docs.ansible.com/).

In this quickstart, you'll complete these tasks:

> [!div class="checklist"]
> * Create a resource group
> * Create a virtual network, public IP, network security group, and network interface
> * Deploy a Windows Server virtual machine
> * Connect to the virtual machine via WinRM
> * Run an Ansible playbook to configure Windows IIS

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [open-source-devops-prereqs-create-sp.md](../includes/open-source-devops-prereqs-create-service-principal.md)]

[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation1.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation1.md)]

## Create a resource group

Ansible needs a resource group to deploy your resources in.

**Create** an Ansible playbook named `azure_windows_vm.yml` and copy the following contents into the playbook:

```yaml
---
- name: Create Azure VM
  hosts: localhost
  connection: local
  tasks:

  - name: Create resource group
    azure_rm_resourcegroup:
      name: myResourceGroup
      location: eastus
```

**Key points**:
* Setting `hosts` to _localhost_ and `connection` as _local_ runs the playbook locally on the Ansible server.

## Create the virtual network and subnet

When you create an Azure virtual machine, you must create a virtual network or use an existing virtual network.

Add the following tasks to the `azure_windows_vm.yml` Ansible playbook:

```yml
  - name: Create virtual network
    azure_rm_virtualnetwork:
      resource_group: myResourceGroup
      name: vNet
      address_prefixes: "10.0.0.0/16"

  - name: Add subnet
    azure_rm_subnet:
      resource_group: myResourceGroup
      name: subnet
      address_prefix: "10.0.1.0/24"
      virtual_network: vNet
```

## Create a public IP address

To make the Azure VM accessible via the internet, add a public IP address.

Add the following tasks to the `azure_windows_vm.yml` Ansible playbook:

```yml
  - name: Create public IP address
    azure_rm_publicipaddress:
      resource_group: myResourceGroup
      allocation_method: Static
      name: pip
    register: output_ip_address

  - name: Output public IP
    debug:
      msg: "The public IP is {{ output_ip_address.state.ip_address }}"
```

**Key points**:
* Ansible `register` module is used to store the output from `azure_rm_publicipaddress` in a variable called `output_ip_address`. Then the `debug` module is used to output the public IP address of the VM to the console.

## Create network security group and NIC

A virtual network interface card connects your VM to the virtual network, a public IP address, and a security group.

Network security group defines what traffic is allowed and not allowed to reach the VM.

Add the following tasks to the `azure_windows_vm.yml` Ansible playbook:

```yml
  - name: Create Network Security Group
    azure_rm_securitygroup:
      resource_group: myResourceGroup
      name: networkSecurityGroup
      rules:
        - name: 'allow_rdp'
          protocol: Tcp
          destination_port_range: 3389
          access: Allow
          priority: 1001
          direction: Inbound
        - name: 'allow_web_traffic'
          protocol: Tcp
          destination_port_range:
            - 80
            - 443
          access: Allow
          priority: 1002
          direction: Inbound
        - name: 'allow_powershell_remoting'
          protocol: Tcp
          destination_port_range: 
            - 5985
            - 5986
          access: Allow
          priority: 1003
          direction: Inbound

  - name: Create a network interface
    azure_rm_networkinterface:
      name: nic
      resource_group: myResourceGroup
      virtual_network: vNet
      subnet_name: subnet
      security_group: networkSecurityGroup
      ip_configurations:
        - name: default
          public_ip_address_name: pip
          primary: True
```

**Key Point**:
* The `azure_rm_securitygroup` creates an Azure network security group to allow WinRM traffic from the Ansible server to the remote host by allowing port `5985` and `5986`.

### Create a virtual machine

Next create a virtual machine that uses all the resources you've created in the previous sections of this article.

Add the following task to the `azure_windows_vm.yml` Ansible playbook:

```yml
  - name: Create VM
    azure_rm_virtualmachine:
      resource_group: myResourceGroup
      name: win-vm
      vm_size: Standard_DS1_v2
      admin_username: azureuser
      admin_password: "{{ password }}"
      network_interfaces: nic
      os_type: Windows
      image:
          offer: WindowsServer
          publisher: MicrosoftWindowsServer
          sku: 2019-Datacenter
          version: latest
    no_log: true
```

The `admin_password` value of `{{ password }}` is an Ansible variable that contains the Windows VM password. To securely populate that variable, add a `var_prompts` entry to the beginning of the playbook.

```yml
- name: Create Azure VM
  hosts: localhost
  connection: local
  vars_prompt:
    - name: password
      prompt: "Enter local administrator password"
  tasks:
```

**Key points**:
* Avoid storing sensitive data as plain text. Use `var_prompts` to populate variables at run time. Add `no_log: true` to prevent passwords from being log.

## Configure the WinRM Listener

Ansible uses PowerShell to connect and configure remote hosts. In order for Ansible to configure the remote host, the WinRM listener has to be configured.

Add the following tasks to the `azure_windows_vm.yml` Ansible playbook:

```yml
  - name: Create VM script extension to enable HTTPS WinRM listener
    azure_rm_virtualmachineextension:
      name: winrm-extension
      resource_group: myResourceGroup
      virtual_machine_name: win-vm
      publisher: Microsoft.Compute
      virtual_machine_extension_type: CustomScriptExtension
      type_handler_version: '1.9'
      settings: '{"fileUris": ["https://raw.githubusercontent.com/ansible/ansible/devel/examples/scripts/ConfigureRemotingForAnsible.ps1"],"commandToExecute": "powershell -ExecutionPolicy Unrestricted -File ConfigureRemotingForAnsible.ps1"}'
      auto_upgrade_minor_version: true
```

Using the `azure_rm_virtualmachineextension` allows you to run a PowerShell script locally on the Azure Windows VM without connect to it via Ansible to configure WinRM. The script `ConfigureRemotingForAnsible.ps1` configures WinRM so that all future configuration can be handled by Ansible.

Ansible can't connect to the VM until WinRM is fully configured.

Add the following tasks to your playbook to wait for the WinRM connection:

```yml
  - name: Get facts for one Public IP
    azure_rm_publicipaddress_info:
      resource_group: myResourceGroup
      name: pip
    register: publicipaddresses

  - name: set public ip address fact
    set_fact: publicipaddress="{{ publicipaddresses | json_query('publicipaddresses[0].ip_address')}}"

  - name: wait for the WinRM port to come online
    wait_for:
      port: 5986
      host: '{{ publicipaddress }}'
      timeout: 600
```

The `azure_rm_publicipaddress_info` modules queries the public IP address from Azure. And `set_fact` stores the output in a variable for the `wait_for` module to use.

## Complete sample Ansible playbook

This section lists the entire sample Ansible playbook that you've built up over the course of this article.

```yml
---
- name: Create Azure VM
  hosts: localhost
  connection: local
  vars_prompt:
    - name: password
      prompt: "Enter local administrator password"
  tasks:

  - name: Create resource group
    azure_rm_resourcegroup:
      name: myResourceGroup
      location: eastus

  - name: Create virtual network
    azure_rm_virtualnetwork:
      resource_group: myResourceGroup
      name: vNet
      address_prefixes: "10.0.0.0/16"

  - name: Add subnet
    azure_rm_subnet:
      resource_group: myResourceGroup
      name: subnet
      address_prefix: "10.0.1.0/24"
      virtual_network: vNet

  - name: Create public IP address
    azure_rm_publicipaddress:
      resource_group: myResourceGroup
      allocation_method: Static
      name: pip
    register: output_ip_address

  - name: Output public IP
    debug:
      msg: "The public IP is {{ output_ip_address.state.ip_address }}"
  
  - name: Create Network Security Group
    azure_rm_securitygroup:
      resource_group: myResourceGroup
      name: networkSecurityGroup
      rules:
        - name: 'allow_rdp'
          protocol: Tcp
          destination_port_range: 3389
          access: Allow
          priority: 1001
          direction: Inbound
        - name: 'allow_web_traffic'
          protocol: Tcp
          destination_port_range:
            - 80
            - 443
          access: Allow
          priority: 1002
          direction: Inbound
        - name: 'allow_powershell_remoting'
          protocol: Tcp
          destination_port_range: 
            - 5985
            - 5986
          access: Allow
          priority: 1003
          direction: Inbound

  - name: Create a network interface
    azure_rm_networkinterface:
      name: nic
      resource_group: myResourceGroup
      virtual_network: vNet
      subnet_name: subnet
      security_group: networkSecurityGroup
      ip_configurations:
        - name: default
          public_ip_address_name: pip
          primary: True

  - name: Create VM
    azure_rm_virtualmachine:
      resource_group: myResourceGroup
      name: win-vm
      vm_size: Standard_DS1_v2
      admin_username: azureuser
      admin_password: "{{ password }}"
      network_interfaces: nic
      os_type: Windows
      image:
          offer: WindowsServer
          publisher: MicrosoftWindowsServer
          sku: 2019-Datacenter
          version: latest
    no_log: true

  - name: Create VM script extension to enable HTTPS WinRM listener
    azure_rm_virtualmachineextension:
      name: winrm-extension
      resource_group: myResourceGroup
      virtual_machine_name: win-vm
      publisher: Microsoft.Compute
      virtual_machine_extension_type: CustomScriptExtension
      type_handler_version: '1.9'
      settings: '{"fileUris": ["https://raw.githubusercontent.com/ansible/ansible/devel/examples/scripts/ConfigureRemotingForAnsible.ps1"],"commandToExecute": "powershell -ExecutionPolicy Unrestricted -File ConfigureRemotingForAnsible.ps1"}'
      auto_upgrade_minor_version: true

  - name: Get facts for one Public IP
    azure_rm_publicipaddress_info:
      resource_group: myResourceGroup
      name: pip
    register: publicipaddresses

  - name: set public ip address fact
    set_fact: publicipaddress="{{ publicipaddresses | json_query('publicipaddresses[0].ip_address')}}"

  - name: wait for the WinRM port to come online
    wait_for:
      port: 5986
      host: '{{ publicipaddress }}'
      timeout: 600
```

## Add WinRM Support to Ansible

Ansible to communicate over WinRM, which requires the Python package `pywinrm`.

Run the command following command on the Ansible server:

```bash
pip install "pywinrm>=0.3.0"
```

For more information, see [Windows Remote Management for Ansible](https://docs.ansible.com/ansible/latest/user_guide/windows_winrm.html#windows-remote-management).

## Connect to the Windows virtual machine

Ansible's configuration determines how Ansible connects and authenticates to remote hosts. The variables you need to define to connect to a Windows host depend on your WinRM connection type and the authentication option you've chosen.

In this tutorial, you'll use WinRM over HTTPS with self-signed certificates and NTLM for the authentication.

Read more about [Connecting to a Windows Host](https://www.ansible.com/blog/connecting-to-a-windows-host) and [Windows Authentication Options](https://docs.ansible.com/ansible/latest/user_guide/windows_winrm.html#authentication-options).

**Create** a new Ansible playbook named `connect_azure_windows_vm.yml` and copy the following contents into the playbook:

```yml
---
- hosts: all
  vars_prompt:
    - name: ansible_password
      prompt: "Enter local administrator password"
  vars:
    ansible_user: azureuser
    ansible_connection: winrm
    ansible_winrm_transport: ntlm
    ansible_winrm_server_cert_validation: ignore
  tasks:

  - name: Test connection
    win_ping:
```

Run the Ansible playbook.

```bash
ansible-playbook connect_azure_windows_vm.yml -i <publicIPaddress>,
```

Replace `<publicIPaddress>` with your virtual machine's address.

**Key Point**:
* Adding `,` after the public IP address bypasses Ansible's inventory parser. This syntax allows you to run playbooks against hosts not in an inventory file

## Clean up resources

[!INCLUDE [ansible-delete-resource-group.md](includes/ansible-delete-resource-group.md)]

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](./index.yml)