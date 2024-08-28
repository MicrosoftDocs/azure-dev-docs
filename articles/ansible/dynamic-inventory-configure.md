---
title: Tutorial - Configure dynamic inventories for Azure Virtual Machines using Ansible
description: Learn how to populate your Ansible inventory dynamically from information in Azure
keywords: ansible, azure, devops, bash, cloudshell, dynamic inventory
ms.topic: tutorial
ms.date: 08/14/2024
ms.custom: devx-track-ansible, devx-track-azurecli, devx-track-azurepowershell, linux-related-content
---

# Tutorial: Configure dynamic inventories of your Azure resources using Ansible

[!INCLUDE [ansible-28-note.md](includes/ansible-28-note.md)]

The [Ansible dynamic inventory](https://docs.ansible.com/ansible/latest/user_guide/intro_dynamic_inventory.html) feature removes the burden of maintaining static inventory files.

In this tutorial, you use Azure's dynamic-inventory plug-in to populate your Ansible inventory.

In this article, you learn how to:

> [!div class="checklist"]
> * Configure two test virtual machines.
> * Add tags to Azure virtual machines
> * Generate a dynamic inventory
> * Use conditional and keyed groups to populate group memberships
> * Run playbooks against groups within the dynamic inventory

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [open-source-devops-prereqs-create-service-principal.md](../includes/open-source-devops-prereqs-create-service-principal.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)]

## Create Azure VMs

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Open [Cloud Shell](/azure/cloud-shell/overview).

1. Create an Azure resource group to hold the virtual machines for this tutorial.

    > [!IMPORTANT]
    > The Azure resource group you create in this step must have a name that is entirely lower-case. Otherwise, the generation of the dynamic inventory will fail.

    # [Azure CLI](#tab/azure-cli)
    ```azurecli-interactive
    az group create --resource-group ansible-inventory-test-rg --location eastus
    ```
    # [Azure PowerShell](#tab/azure-powershell)
    
    ```azurepowershell
    New-AzResourceGroup -Name ansible-inventory-test-rg -Location eastus
    ```
    ---

1. Create two Linux virtual machines on Azure using one of the following techniques:

    - **Ansible playbook** - The article, [Create a basic Linux virtual machine in Azure with Ansible](./vm-configure.md) and [Create a basic Windows virtual machine in Azure with Ansible](./vm-configure-windows.md)  illustrates how to create a virtual machine from an Ansible playbook.

    - **Azure CLI** - Issue each of the following commands in the Cloud Shell to create the two virtual machines:

        # [Azure CLI](#tab/azure-cli)
        ```azurecli-interactive
        az vm create \
        --resource-group ansible-inventory-test-rg \
        --name win-vm \
        --image MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest \
        --admin-username azureuser \
        --admin-password <password>

        az vm create \
        --resource-group ansible-inventory-test-rg \
        --name linux-vm \
        --image Ubuntu2204 \
        --admin-username azureuser \
        --admin-password <password>
        ```


        # [Azure PowerShell](#tab/azure-powershell)
        
        ```azurepowershell
        $adminUsername = "azureuser"
        $adminPassword = ConvertTo-SecureString <password> -AsPlainText -Force
        $credential = New-Object System.Management.Automation.PSCredential ($adminUsername, $adminPassword);

        New-AzVM `
        -ResourceGroupName ansible-inventory-test-rg `
        -Location eastus `
        -Image MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest `
        -Name win-vm `
        -OpenPorts 3389 `
        -Credential $credential

        New-AzVM `
        -ResourceGroupName ansible-inventory-test-rg `
        -Location eastus `
        -Image Ubuntu2204 `
        -Name linux-vm `
        -OpenPorts 22 `
        -Credential $credential
        ```
        ---

        Replace the `<password>` your password.

## Add application role tags

Tags are used to organize and categorize Azure resources. Assigning the Azure VMs an application role allows you to use the tags as group names within the Azure dynamic inventory.

Run the following commands to update the VM tags:

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az vm update \
--resource-group ansible-inventory-test-rg \
--name linux-vm \
--set tags.applicationRole='message-broker' 

az vm update \
--resource-group ansible-inventory-test-rg \
--name win-vm \
--set tags.applicationRole='web-server' 
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzVM -Name win-vm -ResourceGroupName ansible-inventory-test-rg-pwsh | Update-AzVM -Tag @{"applicationRole"="web-server"}

Get-AzVM -Name linux-vm -ResourceGroupName ansible-inventory-test-rg-pwsh | Update-AzVM -Tag @{"applicationRole"="message-broker"}
```

---

Learn more about Azure tagging strategies at [Define your tagging strategy](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging).

## Generate a dynamic inventory

Ansible provides an [Azure dynamic-inventory plug-in](https://github.com/ansible/ansible/blob/stable-2.9/lib/ansible/plugins/inventory/azure_rm.py). 

The following steps walk you through using the plug-in:

1. Create a dynamic inventory named `myazure_rm.yml`

    ```yml
    plugin: azure_rm
    include_vm_resource_groups:
      - ansible-inventory-test-rg
    auth_source: auto
    ```

    **Key point:**
    * Ansible uses the inventory file name and extension to identify which inventory plug-in to use. To use the Azure dynamic inventory plug-in, the file must end with `azure_rm` and have an extension of either `yml` or `yaml`.

1. Run the following command to query the VMs within the resource group:

    ```bash
    ansible-inventory -i myazure_rm.yml --graph
    ```

1. When you run the command, you see results similar to the following output:
  
    ```output
    @all:
      |--@ungrouped:
      |  |--linux-vm_cdb4
      |  |--win-vm_3211
    ```

Both VMs belong to the `ungrouped` group, which is a child of the `all` group in the Ansible inventory.

**Key point**:
* By default the Azure dynamic inventory plug-in returns globally unique names. For this reason, the VM names may contain extra characters. You can disable that behavior by adding `plain_host_names: yes` to the dynamic inventory.

## Find Azure VM hostvars

Run the following command to view all the `hostvars`:

```bash
ansible-inventory -i myazure_rm.yml --list
```

```output
{
    "_meta": {
        "hostvars": {
            "linux-vm_cdb4": {
                "ansible_host": "52.188.118.79",
                "availability_zone": null,
                "computer_name": "linux-vm",
                "default_inventory_hostname": "linux-vm_cdb4",
                "id": "/subscriptions/<subscriptionid>/resourceGroups/ansible-inventory-test-rg/providers/Microsoft.Compute/virtualMachines/linux-vm",
                "image": {
                    "offer": "0001-com-ubuntu-server-jammy",
                    "publisher": "Canonical",
                    "sku": "22_04-lts-gen2",
                    "version": "latest"
                },
                ...,
                "tags": {
                    "applicationRole": "message-broker"
                },
                ...
            },
            "win-vm_3211": {
                "ansible_host": "52.188.112.110",
                "availability_zone": null,
                "computer_name": "win-vm",
                "default_inventory_hostname": "win-vm_3211",
                "id": "/subscriptions/<subscriptionid>/resourceGroups/ansible-inventory-test-rg/providers/Microsoft.Compute/virtualMachines/win-vm",
                "image": {
                    "offer": "WindowsServer",
                    "publisher": "MicrosoftWindowsServer",
                    "sku": "2019-Datacenter",
                    "version": "latest"
                },
                ...
                "tags": {
                    "applicationRole": "web-server"
                },
                ...
            }
        }
    },
    ...
    }
}
```

By pulling information from Azure, the dynamic inventory populates the `hostvars` for each Azure VM. Those `hostvars` are then to determine the VM group memberships within the Ansible inventory.

## Assign group membership with conditional_groups

Each conditional group is made of two parts. The name of the group and the condition for adding a member to the group.

Use the property `image.offer` to create conditional group membership for the _linux-vm_.

Open the `myazure_rm.yml` dynamic inventory and add the following `conditional_group`:

```yml
plugin: azure_rm
include_vm_resource_groups:
  - ansible-inventory-test-rg
auth_source: auto
conditional_groups:
  linux: "'ubuntu' in image.offer"
  windows: "'WindowsServer' in image.offer"
```

Run the `ansible-inventory` with the `--graph` option:

```bash
ansible-inventory -i myazure_rm.yml --graph
```

```output
@all:
  |--@linux:
  |  |--linux-vm_cdb4
  |--@ungrouped:
  |--@windows:
  |  |--win-vm_3211
```

From the output, you can see the VMs are no longer associated with the `ungrouped` group. Instead, each VM is assigned to a new group created by the dynamic inventory.

**Key point**:
* Conditional groups allow you to name specific groups within your inventory and populate them using `hostvars`.

## Assign group membership with keyed_groups

Keyed groups assign group membership the same way conditional groups do, but when using a keyed group the group name is also dynamically populated.

Add the following keyed_group to the `myazure_rm.yml` dynamic inventory:

```yml
plugin: azure_rm
include_vm_resource_groups:
  - ansible-inventory-test-rg
auth_source: auto
conditional_groups:
  linux: "'ubuntu' in image.offer"
  windows: "'WindowsServer' in image.offer"
keyed_groups:
 - key: tags.applicationRole
```

Run the `ansible-inventory` with the `--graph` option:

```bash
ansible-inventory -i myazure_rm.yml --graph
```

```output
@all:
  |--@_message_broker:
  |  |--linux-vm_cdb4
  |--@_web_server:
  |  |--win-vm_3211
  |--@linux:
  |  |--linux-vm_cdb4
  |--@ungrouped:
  |--@windows:
  |  |--win-vm_3211
```

From the output, you see two more groups `_message_broker` and `_web_server`. By using a keyed group, the `applicationRole` tag populates the group names and group memberships.

**Key point**:
* By default, keyed groups include a separator. To remove the separator, add `separator: ""` under the key property.

## Run playbooks with group name patterns

Use the groups created by the dynamic inventory to target subgroups.

1. Create a playbook called `win_ping.yml` with the following contents:

    ```yml
    ---
    - hosts: windows
      gather_facts: false
    
      vars_prompt:
        - name: username
          prompt: "Enter local username"
          private: false
        - name: password
          prompt: "Enter password"
    
      vars:
        ansible_user: "{{ username }}"
        ansible_password: "{{ password }}"
        ansible_connection: winrm
        ansible_winrm_transport: ntlm
        ansible_winrm_server_cert_validation: ignore
    
      tasks:
        - name: run win_ping
          win_ping:
    ```

1. Run the `win_ping.yml` playbook.

    ```bash
    ansible-playbook win_ping.yml -i myazure_rm.yml
    ```

    When prompted, enter the `username` and `password` for the Azure Windows VM.

    ```output
    Enter local username: azureuser
    Enter password:
    
    PLAY [windows] **************************************************************************************************************************************
    
    TASK [run win_ping] *********************************************************************************************************************************
    ok: [win-vm_3211]
    
    PLAY RECAP ******************************************************************************************************************************************
    win-vm_3211                : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    ```

    > [!IMPORTANT]
    > If you get the error `winrm or requests is not installed: No module named 'winrm'`, install pywinrm with the following command: `pip install "pywinrm>=0.3.0"`

1. Create a second playbook named `ping.yml` with the following contents:

    ```yml
    ---
    - hosts: all
      gather_facts: false
    
      vars_prompt:
        - name: username
          prompt: "Enter ssh user"
        - name: password
          prompt: "Enter password for ssh user"
    
      vars:
        ansible_user: "{{ username }}"
        ansible_password: "{{ password }}"
        ansible_ssh_common_args: '-o StrictHostKeyChecking=no'
    
      tasks:
        - name: run ping
          ping:
    ```

1. Run the `ping.yml` playbook.

    ```bash
    ansible-playbook ping.yml -i myazure_rm.yml
    ```

    When prompted, enter the `username` and `password` for the Azure Linux VM.

    ```output
    Enter ssh username: azureuser
    Enter password for ssh user:
    
    PLAY [linux] *******************************************************************************************************
    
    TASK [run ping] ****************************************************************************************************
    ok: [linux-vm_cdb4]
    
    PLAY RECAP *********************************************************************************************************
    linux-vm_cdb4              : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0  
    ```

## Clean up resources

# [Azure CLI](#tab/azure-cli)

1. Run [az group delete](/cli/azure/group#az-group-delete) to delete the resource group. All resources within the resource group are deleted.

    ```azurecli
    az group delete --name <resource_group>
    ```

1. Verify that the resource group was deleted by using [az group show](/cli/azure/group#az-group-show).

    ```azurecli
    az group show --name <resource_group>
    ```

# [Azure PowerShell](#tab/azure-powershell)

1. Run [Remove-AzResourceGroup](/powershell/module/az.resources/Remove-AzResourceGroup) to delete the resource group. All resources within the resource group are deleted.

    ```azurepowershell
    Remove-AzResourceGroup -Name <resource_group>
    ```

1. Verify that the resource group was deleted by using [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup).

    ```azurepowershell
    Get-AzResourceGroup -Name <resource_group>
    ```

---

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Configure Linux virtual machines in Azure using Ansible](./vm-configure.md)
