---
 author: tomarchermsft
 ms.service: ansible
 ms.topic: include
 ms.date: 09/14/2020
 ms.author: tarcher
---

## Clean up resources

When no longer needed, delete the resources created in this article.

#### [Ansible](#tab/ansible)

1. Save the following code as `cleanup.yml`.

    ```yml
    - hosts: localhost
      tasks:
        - name: Delete a resource group
          azure_rm_resourcegroup:
            name: "{{ resource_group }}"
            state: absent
    ```

1. Run the playbook using the [ansible-playbook](https://docs.ansible.com/ansible/latest/user_guide/playbooks.html) command. Replace the `<resource_group>` placeholder with the name of the resource group to be deleted. All resources within the resource group will be deleted.

    ```bash
    ansible-playbook cleanup.yml --extra-vars <resource_group>
    ```
    
1. Verify that the resource group was deleted by using [az group show](https://docs.microsoft.com/cli/azure/group#az_group_show).

    ```azurecli
    az group show --name <resource_group>
    ```

#### [Azure CLI](#tab/azure-cli)

1. Run [az group delete](https://docs.microsoft.com/cli/azure/group#az_group_delete) to delete the resource group. All resources within the resource group will be deleted.

    ```azurecli
    az group delete --name <resource_group>
    ```

1. Verify that the resource group was deleted by using [az group show](https://docs.microsoft.com/cli/azure/group#az_group_show).

    ```azurecli
    az group show --name <resource_group>
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Run [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/Remove-AzResourceGroup) to delete the resource group. All resources within the resource group will be deleted.

    ```azurepowershell
    Remove-AzResourceGroup -Name <resource_group>
    ```

1. Verify that the resource group was deleted by using [Get-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/Get-AzResourceGroup).

    ```azurepowershell
    Get-AzResourceGroup -Name <resource_group>
    ```

---
