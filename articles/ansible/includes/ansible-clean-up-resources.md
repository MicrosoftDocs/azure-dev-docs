---
 author: tomarchermsft
 ms.service: ansible
 ms.topic: include
 ms.date: 09/14/2020
 ms.author: tarcher
---

## Clean up resources

#### [Ansible](#tab/ansible)

When no longer needed, delete the resources created in this article.

1. Save the following code as `cleanup.yml`. Replace the `&lt;resource_group>` placeholder with the name of the resource group to be deleted. All resources within the resource group will be deleted.

    ```yml
    ---
    - hosts: localhost
      vars:
        resource_group: <resource_group>
      tasks:
        - name: Delete a resource group
          azure_rm_resourcegroup:
            name: "{{ resource_group }}"
            state: absent
    ```

1. Run the playbook using the [ansible-playbook](https://docs.ansible.com/ansible/latest/user_guide/playbooks.html) command.

    ```bash
    ansible-playbook cleanup.yml --extra-vars <resource_group>
    ```
    
#### [Azure CLI](#tab/azure-cli)

Azure CLI

---

