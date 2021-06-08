---
title: Use Azure Key Vault with Ansible
description: In this quickstart, learn how to use secrets in Azure Key Vault with Ansible.
keywords: ansible, azure, devops, bash, playbook, virtual machine
ms.topic: quickstart
ms.service: ansible
ms.date: 06/08/2021
ms.custom: devx-track-ansible
---

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [open-source-devops-prereqs-create-sp.md](../includes/open-source-devops-prereqs-create-service-principal.md)]

[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation1.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation1.md)]

## Create an Azure key vault


```yml
- hosts: localhost
  connection: local
  gather_facts: false

  vars:
    tenant_id: <tenantID>
    object_id: <servicePrincipalObjectID>
    vault_name: <keyVaultName>

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

- resourceGroup
- KV
- access policites

## Create secrets in key vault

## Get secrets from key vault