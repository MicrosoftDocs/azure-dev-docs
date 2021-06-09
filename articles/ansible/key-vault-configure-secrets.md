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

In this quickstart, you will create and get secrets from Azure key vault with Ansible.

[!INCLUDE [ansible-29-note.md](includes/ansible-28-note.md)]

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

## Create a resource group

Ansible needs a resource group to deploy your resources in.

**Create** an Ansible playbook named `azure_keyvault.yml` and copy the following contents into the playbook:

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

## Create an Azure key vault

Before you can create a key vault instance you need to pick `vault name` and know the `tenantID` and `servciePrincipalObjectId`.

Add the following variables to the `azure_keyvault.yml` playbook:

```yml
---
  vars:
    tenant_id: <tenantId>
    object_id: <servicePrincipalObjectId>
    vault_name: <vaultName>
```

Replace `<tenantId>`, `<servicePrincipalObjectId>`, and `<vaultName>` with the appropriate values. The objectId is used to assign an access policy to the service principal granting access to the key vault secrets.

Ensure the vault name isn't in use, it must be globally unique.

Next, use the `azure_rm_keyvault` Ansible module to create a key vault instance.

Add the following to the `tasks` list in the `azure_keyvault.yml` playbook:

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

Run the `azure_keyvault.yml` playbook.

```bash
ansible-playbook azure_keyvault.yml
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

**Create** another playbook named `azure_keyvault_secret.yml` and copy the following code into the playbook:

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

Run the `azure_keyvault_secret.yml` playbook.

```bash
ansible-playbook azure_keyvault_secret.yml
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

**Key point**:
  * Using the `azure_rm_keyvault_info` and `set_facts` modules registers the key vault URI as a variable. That variable is then passed to the `azure_rm_keyvaultsecret` module to create the secret.

### Get secrets from key vault

### Ansible 2.9 with azure_preview_modules

```yml
---
- hosts: localhost
  connection: local
  roles: 
    -  { role: azure.azure_preview_modules }
  
  tasks:
  - name: Get Key Vault by name
    azure_rm_keyvault_info:
      resource_group: ansible-kv-test-rg
      name: ansible-kv-test-01
    register: keyvault

  - name: set KeyVault uri fact
    set_fact: keyvaulturi="{{ keyvault | json_query('keyvaults[0].vault_uri')}}"

  - name: get secret without machine identity
    vars:
      url: "{{ keyvaulturi }}"
      secretname: 'adminPassword'
      client_id: 8dd5237a-816b-4a72-b605-446969e5f056
      secret: 'P@ssw0rd1234!'
      tenant: "{{ tenant_id }}"
    debug: 
      msg="the value of this secret is {{lookup('azure_keyvault_secret',secretname,vault_url=url, client_id=client_id, secret=secret, tenant_id=tenant)}}"
```

Replace `<vaultName>` with the name of your key vault created above and `<secretValue>` with the value for the secret.

### Ansible 2.10 with azure.azcollection

```yml
  - name: Get Key Vault by name
    azure_rm_keyvault_info:
      resource_group: ansible-kv-test-rg
      name: ansible-kv-test-01
    register: keyvault

  - name: set KeyVault uri fact
    set_fact: keyvaulturi="{{ keyvault | json_query('keyvaults[0].vault_uri')}}"

  - name: get value
    azure_rm_keyvaultsecret_info:
      vault_uri: "{{ keyvaulturi }}"
      name: adminPassword
    register: secret

  - name: set KeyVault uri fact
    set_fact: secretValue="{{ secret | json_query('secrets[0].secret')}}"

  - debug: msg="{{ secretValue }}"
```