---
title: Use Azure Key Vault with Ansible
description: In this quickstart, learn how to use secrets in Azure Key Vault with Ansible.
keywords: ansible, azure, devops, bash, playbook, virtual machine
ms.topic: quickstart
ms.service: ansible
ms.date: 06/08/2021
ms.custom: devx-track-ansible
---

# Quickstart: Use Azure Key Vault with Ansible

In this quickstart, you'll create and retrieve secrets from Azure key vault with Ansible.

[!INCLUDE [ansible-29-note.md](includes/ansible-29-note.md)]

[!INCLUDE [ansible-tutorial-goals.md](includes/ansible-tutorial-goals.md)]

> [!div class="checklist"]
>
> * Create an Azure key vault instance
> * Create a secret store in Azure key vault
> * Get secrets from Azure key vault with Ansible

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [open-source-devops-prereqs-create-sp.md](../includes/open-source-devops-prereqs-create-service-principal.md)]

[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation1.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation1.md)]

## Create an Azure key vault

Ansible needs a resource group to deploy your resources in.

1. Create an Ansible playbook named `create_kv.yml` add the following task to create a resource group:

    ```yml
    ---
    - name: Create Azure key vault
      hosts: localhost
      connection: local
      tasks:
    
      - name: Create resource group
        azure_rm_resourcegroup:
          name: ansible-kv-test-rg
          location: eastus
    ```

1. Define the required variables for the tenant ID, service principal object ID, and vault name.

    ```yml
    ---
      vars:
        tenant_id: <tenantId>
        object_id: <servicePrincipalObjectId>
        vault_name: <vaultName>
    ```

    Replace `<tenantId>`, `<servicePrincipalObjectId>`, and `<vaultName>` with the appropriate values. The objectId is used to grant access to secrets within the key vault.

    **key point**:
    * Azure key vault names must be globally universally unique. The key vault and keys/secrets inside it are accessed via `https://{vault-name}.vault.azure.net` URI.

1. Configure the Azure key vault instance by adding the `create_kv.yml` task.

    ```yml
    ---
      - name: Create key vault instance
        azure_rm_keyvault:
          resource_group: ansible-kv-test-rg
          vault_name: "{{ vault_name }}"
          enabled_for_deployment: yes
          vault_tenant: "{{ tenant_id }}"
          sku:
            name: standard
          access_policies:
            - tenant_id: "{{ tenant_id }}"
              object_id: "{{ object_id }}"
              secrets:
                - get
                - list
                - set
                - delete
    ```

1. Run the `create_kv.yml` playbook.

    ```bash
    ansible-playbook create_kv.yml
    ```

    ```output
    PLAY [localhost] *******************************************************************************************************
    
    TASK [Gathering Facts] *************************************************************************************************
    ok: [localhost]
    
    TASK [Create resource group] *******************************************************************************************
    ok: [localhost]
    
    TASK [Create key vault instance] ************************************************************************************
    ok: [localhost]
    
    PLAY RECAP *************************************************************************************************************
    localhost                  : ok=3    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    ```

## Complete Azure key vault Ansible playbook

This section lists the entire sample Ansible playbook for creating an Azure key vault.

```yaml
- hosts: localhost
  connection: local

  vars:
    tenant_id: <tenantId>
    object_id: <servicePrincipalObjectId>
    vault_name: <vaultName>

  tasks:
  - name: Create resource group 
    azure_rm_resourcegroup:
      name: ansible-kv-test-rg
      location: eastus

  - name: Create instance of Key Vault
    azure_rm_keyvault:
      resource_group: ansible-kv-test-rg
      vault_name: "{{ vault_name }}"
      enabled_for_deployment: yes
      vault_tenant: "{{ tenant_id }}"
      sku:
        name: standard
      access_policies:
        - tenant_id: "{{ tenant_id }}"
          object_id: "{{ object_id }}"
          secrets:
            - get
            - list
            - set
            - delete
```

## Create a secret in key vault

Before the secret can be created, you'll need the keyvault URI.

1. Create another playbook named `create_kv_secret.yml`. Copy the following code into the playbook:

    ```yml
    ---
    - hosts: localhost
      connection: local
    
      tasks:
    
      - name: Get Key Vault by name
        azure_rm_keyvault_info:
          resource_group: ansible-kv-test-rg
          name: <vaultName>
        register: keyvault
    
      - name: set KeyVault uri fact
        set_fact: keyvaulturi="{{ keyvault | json_query('keyvaults[0].vault_uri')}}"
    
      - name: Create a secret
        azure_rm_keyvaultsecret:
          secret_name: adminPassword
          secret_value: <secretValue>
          keyvault_uri: "{{ keyvaulturi }}"
    ```

    Replace `<vaultName>` with the name of your key vault name and `<secretValue>` with the value for the secret.

    **Key point**:
    * The `azure_rm_keyvault_info` and `set_facts` modules registers the key vault URI as a variable. That variable is then passed to the `azure_rm_keyvaultsecret` module to create the secret.

1. Run the `create_kv_secret.yml` playbook.

    ```bash
    ansible-playbook create_kv_secret.yml
    ```

    ```output
    PLAY [localhost] *******************************************************************************************************
    
    TASK [Gathering Facts] *************************************************************************************************
    ok: [localhost]
    
    TASK [Get Key Vault by name] *******************************************************************************************
    ok: [localhost]
    
    TASK [set KeyVault uri fact] *******************************************************************************************
    ok: [localhost]
    
    TASK [Create a secret] *************************************************************************************************
    ok: [localhost]
    
    PLAY RECAP *************************************************************************************************************
    localhost                  : ok=4    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    ```

## Get secrets from key vault

Secrets stored in Azure key vault can be used to populate Ansible variables.

1. Create a new playbook called `get_kv_secrets.yml` to retrieve key vault secrets with Ansible.

    **Ansible 2.9 with azure_preview_modules**

    ```yml
    ---
    - hosts: localhost
      connection: local
      roles: 
        -  { role: azure.azure_preview_modules }
    
      vars:
        tenant_id: <tenantId>
        vault_name: <vaultName>
        secret_name: adminPassword
        client_id: <servicePrincipalApplicationId>
        client_secret: <servicePrincipalSecret>
      
      tasks:
      - name: Get Key Vault by name
        azure_rm_keyvault_info:
          resource_group: ansible-kv-test-rg
          name: "{{ vault_name }}"
        register: keyvault
    
      - name: Set key vault URI fact
        set_fact: keyvaulturi="{{ keyvault | json_query('keyvaults[0].vault_uri')}}"
      
      - name: Set key vault secret fact
        set_fact: secretValue={{ lookup('azure_keyvault_secret',secret_name,vault_url=keyvaulturi, client_id=client_id, secret=client_secret, tenant_id=tenant_id) }}
      
      - name: Output key vault secret
        debug:
          msg: "{{ secretValue }}"
    ```

    Replace `<tenantId>`, `<vaultName>`, `<servicePrincipalApplicationId>`, and `<servicePrincipalSecret>` with the appropriate values.

    To learn more about `azure_preview_modules`, see the [Ansible Galaxy](https://galaxy.ansible.com/Azure/azure_preview_modules) page.

    **Ansible 2.10 with azure.azcollection**

    ```yml
    ---
    - hosts: localhost
      connection: local
      collections:
        - azure.azcollection
      
      vars:
        vault_name: ansible-kv-test-01
        secret_name: adminPassword
    
      tasks:
    
      - name: Get Key Vault by name
        azure_rm_keyvault_info:
          resource_group: ansible-kv-test-rg
          name: "{{ vault_name }}"
        register: keyvault
    
      - name: Set key vault URI fact
        set_fact: keyvaulturi="{{ keyvault | json_query('keyvaults[0].vault_uri')}}"
    
      - name: Get secret value
        azure_rm_keyvaultsecret_info:
          vault_uri: "{{ keyvaulturi }}"
          name: "{{ secret_name }}"
        register: secret
    
      - name: set secret fact
        set_fact: secretValue="{{ secret | json_query('secrets[0].secret')}}"
    
      - name: Output key vault secret
        debug: 
          msg="{{ secretValue }}"
    ```

    Replace `<vaultName>` with the appropriate value.

    To learn more about `azcollection`, see [Ansible collection for Azure](https://galaxy.ansible.com/azure/azcollection).

1. Run the `get-secret-value.yml` playbook.

    ```bash
    ansible-playbook get-secret-value.yml
    ```

    ```output
    TASK [Output key vault secret] *************************************************
    ok: [localhost] => {
        "msg": "<plainTextPassword>"
    }
    ```

    Confirm the output that replaced `<plainTextPassword>` is the plain text value of the secret previously created in Azure key vault.

## Clean up resources

[!INCLUDE [ansible-delete-resource-group.md](includes/ansible-delete-resource-group.md)]

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](./index.yml)