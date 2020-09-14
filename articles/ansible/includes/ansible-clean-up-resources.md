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

Save the following code as `cleanup.yml`:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
  tasks:
    - name: Delete a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        state: absent
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook cleanup.yml
```

#### [Azure CLI](#tab/azure-cli)

Azure CLI

---

