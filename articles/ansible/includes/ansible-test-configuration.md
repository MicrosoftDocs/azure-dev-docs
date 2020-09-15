---
 author: tomarchermsft
 ms.service: ansible
 ms.topic: include
 ms.date: 09/15/2020
 ms.author: tarcher
---

This section shows how to create a test resource group within your new Ansible configuration. If you don't need to do that, you can skip this section.

### Create an Azure resource group

1. In Cloud Shell, create a file named `rg.yml`.

    ```bash
    code rg.yml
    ```

1. Paste the following code into the editor:

   ```yaml
   ---
   - hosts: localhost
     connection: local
     tasks:
       - name: Create resource group
         azure_rm_resourcegroup:
           name: ansible-rg
           location: eastus
         register: rg
       - debug:
           var: rg
   ```

1. Save the file and exit the editor.

1. Run the playbook using the `ansible-playbook` command:

   ```bash
   ansible-playbook rg.yml
   ```

1. Verify that the resource group is created by using [az group show](https://docs.microsoft.com/cli/azure/group#az_group_show).

    ```azurecli
    az group show --name <resource_group>
    ```

### Delete an Azure resource group

[!INCLUDE [ansible-delete-resource-group.md](ansible-delete-resource-group.md)]
