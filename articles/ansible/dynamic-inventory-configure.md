---
title: Tutorial - Configure dynamic inventories of your Azure resources using Ansible
description: Learn how to use Ansible to manage your Azure dynamic inventories
keywords: ansible, azure, devops, bash, cloudshell, dynamic inventory
ms.topic: tutorial
ms.date: 10/30/2020
ms.custom: devx-track-ansible, devx-track-azurecli
---

# Tutorial: Configure dynamic inventories of your Azure resources using Ansible

Ansible can be used to pull inventory information from various sources (including cloud sources such as Azure) into a *dynamic inventory*. 

[!INCLUDE [ansible-tutorial-goals.md](includes/ansible-tutorial-goals.md)]

> [!div class="checklist"]
>
> * Configure two test virtual machines.
> * Tag one of the virtual machines
> * Install Nginx on the tagged virtual machines
> * Configure a dynamic inventory that includes the configured Azure resources

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [open-source-devops-prereqs-create-service-principal.md](../includes/open-source-devops-prereqs-create-service-principal.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)]

## Create the test VMs

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Open [Cloud Shell](/azure/cloud-shell/overview).

1. Create an Azure resource group to hold the virtual machines for this tutorial.

    > [!IMPORTANT]
    > The Azure resource group you create in this step must have a name that is entirely lower-case. Otherwise, the generation of the dynamic inventory will fail.

    ```azurecli
    az group create --resource-group ansible-inventory-test-rg --location eastus
    ```

1. Create two Linux virtual machines on Azure using one of the following techniques:

    - **Ansible playbook** - The article, [Create a basic virtual machine in Azure with Ansible](./vm-configure.md) illustrates how to create a virtual machine from an Ansible playbook. If you use a playbook to define one or both of the virtual machines, ensure that the SSH connection is used instead of a password.

    - **Azure CLI** - Issue each of the following commands in the Cloud Shell to create the two virtual machines:

        ```azurecli
        az vm create --resource-group ansible-inventory-test-rg \
                     --name ansible-inventory-test-vm1 \
                     --image UbuntuLTS --generate-ssh-keys
        ```

        ```azurecli
        az vm create --resource-group ansible-inventory-test-rg \
                     --name ansible-inventory-test-vm2 \
                     --image UbuntuLTS --generate-ssh-keys
        ```

## Tag a VM

You can [use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags#azure-cli) by user-defined categories.

### Using Ansible version < 2.8
Enter the following [az resource tag](/cli/azure/resource#az-resource-tag) command to tag the virtual machine `ansible-inventory-test-vm1` with the key `nginx`:

```azurecli
az resource tag --tags nginx --id /subscriptions/<YourAzureSubscriptionID>/resourceGroups/ansible-inventory-test-rg/providers/Microsoft.Compute/virtualMachines/ansible-inventory-test-vm1
```

### Using Ansible version >= 2.8
Enter the following [az resource tag](/cli/azure/resource#az-resource-tag) command to tag the virtual machine `ansible-inventory-test-vm1` with the key `Ansible=nginx`:

```azurecli
az resource tag --tags Ansible=nginx --id /subscriptions/<YourAzureSubscriptionID>/resourceGroups/ansible-inventory-test-rg/providers/Microsoft.Compute/virtualMachines/ansible-inventory-test-vm1
```

## Generate a dynamic inventory

Once you have your virtual machines defined (and tagged), it's time to generate the dynamic inventory.

### Using Ansible version < 2.8

Ansible provides a Python script named [azure_rm.py](https://github.com/ansible-collections/community.general/blob/main/scripts/inventory/azure_rm.py) that generates a dynamic inventory of your Azure resources. The following steps walk you through using the `azure_rm.py` script to connect to your two test Azure virtual machines:

1. Use the GNU `wget` command to retrieve the `azure_rm.py` script:

    ```bash
    wget https://raw.githubusercontent.com/ansible-collections/azure/dev/plugins/inventory/azure_rm.py
    ```

1. Use the `chmod` command to change the access permissions to the `azure_rm.py` script. The following command uses the `+x` parameter to allow for execution (running) of the specified file (`azure_rm.py`):

    ```bash
    chmod +x azure_rm.py
    ```

1. Use the [ansible command](https://docs.ansible.com/ansible/2.4/ansible.html) to connect to your resource group:

    ```bash
    ansible -i azure_rm.py ansible-inventory-test-rg -m ping
    ```

1. Once connected, you see results indicating the results of the virtual machines being created.

### Ansible version >= 2.8

Starting with Ansible 2.8, Ansible provides an [Azure dynamic-inventory plug-in](https://github.com/ansible/ansible/blob/stable-2.9/lib/ansible/plugins/inventory/azure_rm.py). The following steps walk you through using the plug-in:

1. The inventory plug-in requires a configuration file. The configuration file must end in `azure_rm` and have an extension of either `yml` or `yaml`. For this tutorial example, save the following playbook as `myazure_rm.yml`:

    ```yml
        plugin: azure_rm
        include_vm_resource_groups:
        - ansible-inventory-test-rg
        auth_source: auto
    
        keyed_groups:
        - prefix: tag
          key: tags
    ```

1. Run the following command to ping VMs in the resource group:

    ```bash
    ansible all -m ping -i ./myazure_rm.yml
    ```

1. When running the preceding command, you could receive an error. The error would be due  indicating a failure to connect to the host due to a 

    ```output
    Failed to connect to the host via ssh: Host key verification failed.
    ```
    
    If you do receive the "host-key verification" error, add the following line to the Ansible configuration file. The Ansible configuration file is located at `/etc/ansible/ansible.cfg` or `~/.ansible.cfg`.

    ```bash
    host_key_checking = False
    ```

1. When you run the playbook, you see results similar to the following output:
  
    ```output
    ansible-inventory-test-vm1_0324 : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    ansible-inventory-test-vm2_8971 : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    ```

## Enable the VM tag

### If you're using Ansible < 2.8,

- Once you've set a tag, you need to "enable" that tag. One way to enable a tag is by exporting the tag to an environment variable  `AZURE_TAGS` via the `export` command:

    ```console
    export AZURE_TAGS=nginx
    ```
    
- Run the following command:

    ```bash
    ansible -i azure_rm.py ansible-inventory-test-rg -m ping
    ```
    
    You now see only one virtual machine (the one whose tag matches the value exported into the `AZURE_TAGS` environment variable):

    ```output
       ansible-inventory-test-vm1 | SUCCESS => {
        "changed": false,
        "failed": false,
        "ping": "pong"
    }
    ```

### If you're using Ansible >=  2.8

- Run the command `ansible-inventory -i myazure_rm.yml --graph` to get the following output:

    ```output
        @all:
          |--@tag_Ansible_nginx:
          |  |--ansible-inventory-test-vm1_9e2f
          |--@ungrouped:
          |  |--ansible-inventory-test-vm2_7ba9
    ```

- You can also run the following command to test connection to the Nginx VM:
  
    ```bash
    ansible -i ./myazure_rm.yml -m ping tag_Ansible_nginx
    ```


## Set up Nginx on the tagged VM

The purpose of tags is to enable the ability to quickly and easily work with subgroups of your virtual machines. For example, let's say you want to install Nginx only on virtual machines to which you've assigned a tag of `nginx`. The following steps illustrate how easy that is to accomplish:

1. Create a file named `nginx.yml`:

   ```console
   code nginx.yml
   ```

1. Paste the following sample code into the editor:

    ```yml
        ---
        - name: Install and start Nginx on an Azure virtual machine
          hosts: all
          become: yes
          tasks:
          - name: install nginx
            apt: pkg=nginx state=present
            notify:
            - start nginx
    
          handlers:
            - name: start nginx
              service: name=nginx state=started
    ```

1. Save the file and exit the editor.

1. Run the playbook using [ansible-playbook](https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html)

   - Ansible < 2.8:

     ```bash
     ansible-playbook -i azure_rm.py nginx.yml
     ```

   - Ansible >= 2.8:

     ```bash
     ansible-playbook  -i ./myazure_rm.yml  nginx.yml --limit=tag_Ansible_nginx
     ```

1. After running the playbook, you see output similar to the following results:

    ```output
    PLAY [Install and start Nginx on an Azure virtual machine] 

    TASK [Gathering Facts] 
    ok: [ansible-inventory-test-vm1]

    TASK [install nginx] 
    changed: [ansible-inventory-test-vm1]

    RUNNING HANDLER [start nginx] 
    ok: [ansible-inventory-test-vm1]

    PLAY RECAP 
    ansible-inventory-test-vm1 : ok=3    changed=1    unreachable=0    failed=0
    ```

## Test Nginx installation

This section illustrates one technique to test that Nginx is installed on your virtual machine.

1. Use the [az vm list-ip-addresses](/cli/azure/vm#az-vm-list-ip-addresses) command to retrieve the IP address of the `ansible-inventory-test-vm1` virtual machine. The returned value (the virtual machine's IP address) is then used as the parameter to the SSH command to connect to the virtual machine.

    ```azurecli
    ssh `az vm list-ip-addresses \
    -n ansible-inventory-test-vm1 \
    --query [0].virtualMachine.network.publicIpAddresses[0].ipAddress -o tsv`
    ```

1. While connected to the `ansible-inventory-test-vm1` virtual machine, run the [nginx -v](https://nginx.org/en/docs/switches.html) command to determine if Nginx is installed.

    ```console
    nginx -v
    ```

1. Once you run the `nginx -v` command, you see the Nginx version (second line) that indicates that Nginx is installed.

    ```output
    tom@ansible-inventory-test-vm1:~$ nginx -v

    nginx version: nginx/1.10.3 (Ubuntu)

    tom@ansible-inventory-test-vm1:~$
    ```

1. Click the `<Ctrl>D` keyboard combination to disconnect the SSH session.

1. Doing the preceding steps for the `ansible-inventory-test-vm2` virtual machine yields an informational message indicating where you can get Nginx (which implies that you don't have it installed at this point):

    ```output
    tom@ansible-inventory-test-vm2:~$ nginx -v
    The program 'nginx' can be found in the following packages:
    * nginx-core
    * nginx-extras
    * nginx-full
    * nginx-lightTry: sudo apt install <selected package>
    tom@ansible-inventory-test-vm2:~$
    ```

## Clean up resources

[!INCLUDE [ansible-delete-resource-group.md](includes/ansible-delete-resource-group.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Quickstart: Configure Linux virtual machines in Azure using Ansible](./vm-configure.md)
