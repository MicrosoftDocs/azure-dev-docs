---
 author: tomarchermsft
 ms.service: ansible
 ms.topic: include
 ms.date: 09/15/2020
 ms.author: tarcher
---

This section shows how to create a test resource group within your new Ansible configuration. If you don't need to do that, you can skip this section.

### Create an Azure resource group

1. Save the following code as `create_rg.yml`.

    ```yaml
    ---
    - hosts: localhost
      connection: local
      tasks:
        - name: Creating resource group - "{{ name }}"
          azure_rm_resourcegroup:
            name: "{{ name }}"
            location: "{{ location }}"
          register: rg
        - debug:
            var: rg
    ```

1. Run the playbook using [ansible-playbook](https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html). Replace the placeholders with the appropriate values for your environment.

    ```bash
    ansible-playbook create_rg.yml --extra-vars "name=<resource_group_name> location=<resource_group_location>"
    ```

    **Notes**:

    - Due to the `register` variable and `debug` section of the playbook, the results display when the command finishes.

### Delete an Azure resource group

[!INCLUDE [ansible-delete-resource-group.md](ansible-delete-resource-group.md)]
