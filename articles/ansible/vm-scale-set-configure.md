---
title: Tutorial - Configure virtual machine scale sets in Azure using Ansible
description: Learn how to use Ansible to create and configure virtual machine scale sets in Azure
keywords: ansible, azure, devops, bash, playbook, virtual machine, virtual machine scale set, vmss
ms.topic: tutorial
ms.date: 04/30/2019
ms.custom: devx-track-ansible
---

# Tutorial: Configure virtual machine scale sets in Azure using Ansible

[!INCLUDE [ansible-29-note.md](includes/ansible-29-note.md)]

[!INCLUDE [open-source-devops-intro-vm-scale-set.md](../includes/open-source-devops-intro-vm-scale-set.md)]

[!INCLUDE [ansible-tutorial-goals.md](includes/ansible-tutorial-goals.md)]

> [!div class="checklist"]
>
> * Configure the resources for a VM
> * Configure a scale set
> * Scale the scale set by increasing it's VM instances 

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)]

## Configure a scale set

The playbook code in this section defines the following resources:

* **Resource group** into which all of your resources will be deployed.
* **Virtual network** in the 10.0.0.0/16 address space
* **Subnet** within the virtual network
* **Public IP address** that allows you to access resources across the Internet
* **Network security group** that controls the flow of network traffic in and out of your scale set
* **Load balancer** that distributes traffic across a set of defined VMs using load balancer rules
* **Virtual machine scale set** that uses all the created resources

There are two ways to get the sample playbook:

* [Download the playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vmss/vmss-create.yml) and save it to `vmss-create.yml`.
* Create a new file named `vmss-create.yml` and copy into it the following contents:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    vmss_lb_name: myScaleSetLb
    location: eastus
    admin_username: azureuser
    admin_password: "{{ admin_password }}"

  tasks:
    - name: Create a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"
    - name: Create virtual network
      azure_rm_virtualnetwork:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        address_prefixes: "10.0.0.0/16"
    - name: Add subnet
      azure_rm_subnet:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        address_prefix: "10.0.1.0/24"
        virtual_network: "{{ vmss_name }}"
    - name: Create public IP address
      azure_rm_publicipaddress:
        resource_group: "{{ resource_group }}"
        allocation_method: Static
        name: "{{ vmss_name }}"
    - name: Create Network Security Group that allows SSH
      azure_rm_securitygroup:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        rules:
          - name: SSH
            protocol: Tcp
            destination_port_range: 22
            access: Allow
            priority: 1001
            direction: Inbound

    - name: Create a load balancer
      azure_rm_loadbalancer:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}lb"
        location: "{{ location }}"
        frontend_ip_configurations:
          - name: "{{ vmss_name }}front-config"
            public_ip_address: "{{ vmss_name }}"
        backend_address_pools:
          - name: "{{ vmss_name }}backend-pool"
        probes:
          - name: "{{ vmss_name }}prob0"
            port: 8080
            interval: 10
            fail_count: 3
        inbound_nat_pools:
          - name: "{{ vmss_name }}nat-pool"
            frontend_ip_configuration_name: "{{ vmss_name }}front-config"
            protocol: Tcp
            frontend_port_range_start: 50000
            frontend_port_range_end: 50040
            backend_port: 22
        load_balancing_rules:
          - name: "{{ vmss_name }}lb-rules"
            frontend_ip_configuration: "{{ vmss_name }}front-config"
            backend_address_pool: "{{ vmss_name }}backend-pool"
            frontend_port: 80
            backend_port: 8080
            load_distribution: Default
            probe: "{{ vmss_name }}prob0"

    - name: Create VMSS
      no_log: true
      azure_rm_virtualmachinescaleset:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        vm_size: Standard_DS1_v2
        admin_username: "{{ admin_username }}"
        admin_password: "{{ admin_password }}"
        ssh_password_enabled: true
        capacity: 2
        virtual_network_name: "{{ vmss_name }}"
        subnet_name: "{{ vmss_name }}"
        upgrade_policy: Manual
        tier: Standard
        managed_disk_type: Standard_LRS
        os_disk_caching: ReadWrite
        image:
          offer: UbuntuServer
          publisher: Canonical
          sku: 16.04-LTS
          version: latest
        load_balancer: "{{ vmss_name }}lb"
        data_disks:
          - lun: 0
            disk_size_gb: 20
            managed_disk_type: Standard_LRS
            caching: ReadOnly
          - lun: 1
            disk_size_gb: 30
            managed_disk_type: Standard_LRS
            caching: ReadOnly

```

Before running the playbook, see the following notes:

* In the `vars` section, replace the `{{ admin_password }}` placeholder with your own password.

Run the playbook using [ansible-playbook](https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html)

```bash
ansible-playbook vmss-create.yml
```

After running the playbook, you see output similar to the following results:

```Output
PLAY [localhost] 

TASK [Gathering Facts] 
ok: [localhost]

TASK [Create a resource group] 
changed: [localhost]

TASK [Create virtual network] 
changed: [localhost]

TASK [Add subnet] 
changed: [localhost]

TASK [Create public IP address] 
changed: [localhost]

TASK [Create Network Security Group that allows SSH] 
changed: [localhost]

TASK [Create a load balancer] 
changed: [localhost]

TASK [Create Scale Set] 
changed: [localhost]

PLAY RECAP 
localhost                  : ok=8    changed=7    unreachable=0    failed=0

```

## View the number of VM instances

The [configured scale set](#configure-a-scale-set) currently has two instances. The following steps are used to confirm that value:

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Navigate to the scale set you configured.

1. You see the scale set name with the number of instances in parenthesis: `Standard_DS1_v2 (2 instances)`

1. You can also verify the number of instances with the [Azure Cloud Shell](https://shell.azure.com/) by running the following command:

    ```azurecli-interactive
    az vmss show -n myScaleSet -g myResourceGroup --query '{"capacity":sku.capacity}' 
    ```

    The results of running the Azure CLI command in Cloud Shell show that two instances exist:

    ```bash
    {
      "capacity": 2,
    }
    ```

## Scale out a scale set

The playbook code in this section retrieves information about the scale set and changes its capacity from two to three.

There are two ways to get the sample playbook:

* [Download the playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vmss/vmss-scale-out.yml) and save it to `vmss-scale-out.yml`.
* Create a new file named `vmss-scale-out.yml` and copy into it the following contents:

```yml
---
- hosts: localhost
  gather_facts: false
  
  vars:
    resource_group: myTestRG
    vmss_name: myTestVMSS
  
  tasks:

    - name: Get scaleset info
      azure_rm_virtualmachine_scaleset_facts:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        format: curated
      register: output_scaleset

    - name: set image fact
      set_fact:
        vmss_image: "{{ output_scaleset.vmss[0].image }}"

    - name: Create VMSS
      no_log: true
      azure_rm_virtualmachinescaleset:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        capacity: 3
        image: "{{ vmss_image }}"
```

Run the playbook using [ansible-playbook](https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html)

```bash
ansible-playbook vmss-scale-out.yml
```

After running the playbook, you see output similar to the following results:

```Output
PLAY [localhost] 

TASK [Gathering Facts] 
ok: [localhost]

TASK [Get scaleset info] 
ok: [localhost]

TASK [Set image fact] 
ok: [localhost]

TASK [Change VMSS capacity] 
changed: [localhost]

PLAY RECAP 
localhost                  : ok=3    changed=1    unreachable=0    failed=0
```

## Verify the results

Verify your results of your work via the Azure portal:

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Navigate to the scale set you configured.

1. You see the scale set name with the number of instances in parenthesis: `Standard_DS1_v2 (3 instances)`

1. You can also verify the change with the [Azure Cloud Shell](https://shell.azure.com/) by running the following command:

    ```azurecli-interactive
    az vmss show -n myScaleSet -g myResourceGroup --query '{"capacity":sku.capacity}' 
    ```

    The results of running the Azure CLI command in Cloud Shell show that three instances now exist: 

    ```bash
    {
      "capacity": 3,
    }
    ```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Deploy apps to virtual machine scale sets in Azure using Ansible](./vm-scale-set-deploy-app.md)
