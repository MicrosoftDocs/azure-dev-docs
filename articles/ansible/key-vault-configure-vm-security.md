---
title: Tutorial - Use Azure Key Vault with a Linux virtual machine in Ansible
description: Learn how to use Ansible to configure VM security using Azure Key Vault
keywords: ansible, azure, devops, key vault, security, credentials, secrets, keys, certificates, ansible modules for azure, resource group, azure_rm_resourcegroup, 
ms.topic: tutorial
ms.date: 04/20/2020
ms.custom: devx-track-ansible
---

# Tutorial: Use Azure Key Vault with a Linux virtual machine in Ansible

[!INCLUDE [ansible-29-note.md](includes/ansible-29-note.md)]

This tutorial shows you how to use the Ansible collection for Azure modules in using [Azure Key Vault](/azure/key-vault/general/overview). Azure Key Vault allows you to centralize the storage of credentials such as application secrets, keys, and certificates. The decoupling of credentials and application code helps your system become more secure. Also, implementing a rotating credentials-management pattern with auto expiry dates becomes much more manageable.

> [!div class="checklist"]
>
> * Use the Azure CLI to get Azure subscription and service principal values
> * Store key values as Linux environment variables
> * Get Linux environment variables from an Ansible playbook
> * Create a key vault
> * Set an access policy for a key vault
> * Use the Azure portal to add an access policy to a key vault
> * Create a key vault secret
> * Use the Ansible shell module to get a key vault secret
> * Create a virtual machine along with all of its constituent components

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)]
[!INCLUDE [ansible-configure-azure-collection.md](includes/ansible-configure-azure-collection.md)]
    
## Get Azure subscription info

Use the Azure CLI to get the necessary Azure subscription information needed when using the Ansible modules for Azure. 

1. Get the Azure subscription ID and Azure subscription tenant ID using the `az account show` command. For the `<Subscription>` placeholder, specify either the Azure subscription name or Azure subscription ID. The command will display many of the key values associated with the default Azure subscription. If you have multiple subscriptions, you might need to set the current subscription via the [az account set](/cli/azure/account#az-account-set) command. From the command's output, make note of both the **ID** and **tenantID** values.

    ```azurecli
    az account show --subscription "<Subscription>" --query tenantId
    ```

1. If you don't have a service principal for the Azure subscription. [create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli). From the command's output, make note of the **appId** value.

1. Get the object ID of the service principal using the `az ad sp show` command. For the `<ApplicationID>` placeholder, specify the service principal appId. The `--query` parameter indicates which value to print to *stdout*. In this case, it's the service principal object ID.

    ```azurecli
    az ad sp show --id <ApplicationID> --query objectId
    ```
    
1. Store the following values as environment variables: Azure subscription ID, Azure subscription tenant ID, and service principal object ID. How you run the playbook, where you store subscription and credential values, and how you retrieve those values is based on your particular environment. For purposes of this demo, I used Azure Cloud Shell and stored the necessary Azure values in `~/.bashrc` by adding the following lines to the end of the file:

    ```bash
    export AZ_SUBSCRIPTION_ID="<subscriptionID>"
    export AZ_TENANT_ID="<tenantID>"
    export AZ_OBJECT_ID="<objectID>"
    export AZ_CLIENT_ID="<appID>"
    ```

## Declare the Azure collection

After [downloading the latest Azure collection](#prerequisites), specify its use via the `collections` key.

```yml
- hosts: all
  collections:
    - azure.azcollection
```

## Create Azure resource group for the key vault

The following playbook snippet creates a uniquely named resource group into which the key vault will be created. 

```yml
---
- hosts: localhost
  tasks:
    - name: Prepare random postfix
      set_fact:
        rpfx: "{{ 10000 | random }}"
      run_once: yes
      
- hosts: localhost
  vars:
    kv_rg: kv_rg_{{ rpfx }}
    kv_rg_loc: eastus

  tasks:
    - name: Set facts
      set_fact:
        az_sub_id: "{{ lookup('env', 'AZ_SUBSCRIPTION_ID') }}"

    - name: Create a resource group to hold the key vault
      azure_rm_resourcegroup:
        subscription_id: "{{ az_sub_id }}"
        name: "{{ kv_rg }}"
        location: "{{ kv_rg_loc }}"

    - debug:
        msg: "New resource group = {{ kv_rg }}"
```

**Notes:**

- In this demo, the key vault is created as the sole resource in a resource group. It's common practice to separate the key vault from the resources that use it. This pattern helps to prevent accidental deletion of the key vault when deleting other resources.
- Since the key vault name must be unique in Azure, the demo creates a random *postfix* value. This value is appended to the name of the key vault resource group and the key vault (created in the next section). The code in the task `Prepare random postfix` generates the random postfix value that is assigned to the `rpfx` variable.
- In the task `Set facts`, the `lookup` command is used to retrieve the Azure subscription ID that is stored as an environment variable.
- The [azure_rm_resourcegroup module](https://docs.ansible.com/ansible/latest/modules/azure_rm_resourcegroup_module.html) is used to create the new resource group.
- A `debug` task at the end of the playbook displays the name of the new resource group.

## Create a key vault

As mentioned in the previous section, the key vault name must be unique across Azure. As such, the following playbook snippet assigns to the `kv` variable the concatenation of the literal `kv` and `rpfx`value.

```yml
vars:
  kv: "kv{{ rpfx }}"
  kv_rg: "kv_rg_{{ rpfx }}"

tasks:
  - name: Set facts
    set_fact:
      az_object_id: "{{ lookup('env', 'AZ_OBJECT_ID') }}"
      az_tenant_id: "{{ lookup('env', 'AZ_TENANT_ID') }}"

  - name: Create a key vault
    azure_rm_keyvault:
      subscription_id: "{{ az_sub_id }}"
      resource_group: "{{ kv_rg }}"
      vault_name: "{{ kv }}"
      vault_tenant: "{{ az_tenant_id }}"
      enabled_for_deployment: yes
      sku:
        name: standard
        family: A
      access_policies:
        - object_id: "{{ az_object_id }}"
          tenant_id: "{{ az_tenant_id }}"
          secrets:
            - get
            - list
            - set
  - debug:
      msg: "New key vault name = {{ kv }} within the {{ kv_rg }} resource group"

```

**Notes:**

- The [azure_rm_keyvault module](https://docs.ansible.com/ansible/latest/modules/azure_rm_keyvault_module.html) is used to create the key vault.
- When creating the access policy as part of the key vault, an object ID and tenant ID were supplied. These values define an access policy for a specific service principal (that is associated with an Azure subscription). However, browsing to the Azure portal and attempting to view the key vault's secrets might result in error messages. These messages might be similar to "The operation "List" is not enabled in this key vault's access policy." and "You are unauthorized to view these contents." Receiving these messages indicates that you - as an Active Directory user - don't have access. The next section shows you how to add an access policy for yourself to the key vault.
- A `debug` task at the end of the playbook displays the name of the new key vault.

## Add yourself to key vault access policy

If you want to view the key vault's secrets or if you're working through the demo steps, you need to add an access policy for your Azure Active Directory ID. The following steps walk you through adding to the key vault an access policy for yourself as a user:

1. Browse to the [Azure portal](https://portal.azure.com).

1. In the page's main search box, enter `key vaults`, and under **Services**, select **Key vaults**.

1. Select the key vault created in the previous section. (The name was printed to stdout from the playbook.)

1. Select **Access policies**.

1. A single access policy is displayed with your Azure Active Directory ID that represents your specified service principal.

1. Select **Add Access Policy**.

1. Select **Select principal**.

1. In the **Principal** tab, in the search box, enter your email address.

1. From the filtered list, select the appropriate entry.

1. The information for the selected user is copied to the **Selected member** list. Select **Select**.

1. Select the appropriate options for **Key permissions**, **Secret permissions**, and **Certificate permissions**. For this demo, it's enough to select **Secret permissions** and then **Get**, **List**, and **Set**.

1. Select **Add**.

1. The new access policy for the selected user now displays on the **Access policies** page.

1. Select **Save**.

1. Select the **Notifications** in the upper right corner of the portal. Wait until the access policy has been updated before continuing to the next step.

## Create a key vault secret

The following Ansible playbook snippet shows how to create a key vault secret:

```yml
  vars:
    kv_secret_name: testsecret
    kv_secret_value: MySecret007$

  tasks:
    - name: Set facts
      set_fact:
        az_client_id: "{{ lookup('env', 'AZ_CLIENT_ID') }}"

    - name: Create a secret
      azure_rm_keyvaultsecret:
        subscription_id: "{{ az_sub_id }}"
        client_id: "{{ az_client_id }}"
        keyvault_uri: "{{ kv_uri }}"
        secret_name: "{{ kv_secret_name }}"
        secret_value: "{{ kv_secret_value }}"
```

**Notes:**

- The [azure_rm_keyvaultsecret module](https://docs.ansible.com/ansible/latest/modules/azure_rm_keyvaultsecret_module.html) is used to create the key vault secret.
- For simplicity, the demo includes the `secret_name` and `secret_value`. However, playbooks are infrastructure-as-code (IaC) files just like any source code for your project. As such, values such as these shouldn't be stored in plaintext files when used in production environments.
- After running this code, the **Secrets** tab for the key vault lists the newly added secret named `testsecret`. To view it, select the secret, select the current version, and select **Show Secret Value**.

## Get a key vault secret

The following Ansible playbook snippet shows how to get the latest version of a key vault secret:

```yml
  vars:
    kv_secret_name: testsecret
    kv_secret_value: MySecret007$

tasks:
    - name: Get latest version of a secret
      azure_rm_keyvaultsecret_info:
        vault_uri: "{{ kv_uri }}"
        name: "{{ kv_secret_name }}"
      register: output
    - debug:
        var: output['secrets'][0]['secret']
```

**Notes:**

- The **azure_rm_keyvaultsecret_info module** is used to get the key vault secret. This module is only available if using the Ansible collection for Azure modules. 
- If you receive an error running this snippet, ensure that you've followed all the instructions in the [Prerequisites section](#prerequisites).
- For simplicity, the demo includes the `secret_name` and `secret_value`. However, playbooks are infrastructure-as-code (IaC) files just like any source code for your project. As such, values such as these shouldn't be stored in plaintext files when used in production environments.

## Run the complete playbook

Once you have the key vault and its secret established, you can use that information when protecting Azure resources such as virtual machines. The following Ansible playbook performs the tasks shown throughout this tutorial and creates a complete virtual machine. 

```yml
---
- hosts: localhost
  tasks:
    - name: Prepare random postfix
      set_fact:
        rpfx: "{{ 10000 | random }}"
      run_once: yes
      
- hosts: localhost
  collections:
    - azure.azcollection
  vars:
    kv_rg: kv_rg_{{ rpfx }}
    kv_rg_loc: eastus
    kv: "kv{{ rpfx }}"
    kv_uri: "https://{{ kv }}.vault.azure.net"
    kv_secret_name: testsecret
    kv_secret_value: MySecret007$

    # Test VM vars
    test_vm_rg: kv_test_vm_rg
    test_vm_rg_loc: eastus
    test_vm: kvtestvm
    test_vm_vnet: "kv_test_vm_vnet"
    test_vm_subnet: kv_test_vm_subnet
    test_vm_public_ip: kv_test_vm_public_ip
    test_vm_nsg: kv_test_vm_nsg
    test_vm_nsg_list: 
      - name: Allow-SSH
        access: Allow
        protocol: Tcp
        direction: Inbound
        priority: 300
        port: 22 
        source_address_prefix: Internet
      - name: Allow-HTTP
        access: Allow
        protocol: Tcp
        direction: Inbound
        priority: 100
        port: 80
        source_address_prefix: Internet 
    test_vm_nic: kv_test_vnic
    admin_username: testadmin

  tasks:
    - name: Set facts
      set_fact:
        az_sub_id: "{{ lookup('env', 'AZ_SUBSCRIPTION_ID') }}"
        az_object_id: "{{ lookup('env', 'AZ_OBJECT_ID') }}"
        az_tenant_id: "{{ lookup('env', 'AZ_TENANT_ID') }}"
        az_client_id: "{{ lookup('env', 'AZ_CLIENT_ID') }}"

    - name: Create a resource group to hold the Key Vault instance
      azure_rm_resourcegroup:
        subscription_id: "{{ az_sub_id }}"
        name: "{{ kv_rg }}"
        location: "{{ kv_rg_loc }}"

    - debug:
        msg: "New resource group = {{ kv_rg }}"

    - name: Create instance of Key Vault
      azure_rm_keyvault:
        subscription_id: "{{ az_sub_id }}"
        resource_group: "{{ kv_rg }}"
        vault_name: "{{ kv }}"
        vault_tenant: "{{ az_tenant_id }}"
        enabled_for_deployment: yes
        sku:
          name: standard
          family: A
        access_policies:
          - object_id: "{{ az_object_id }}"
            tenant_id: "{{ az_tenant_id }}"
            secrets:
              - get
              - list
              - set

    - debug:
        msg: "New Key Vault instance name = {{ kv }} within the {{ kv_rg }} resource group"

    - name: Create a secret
      azure_rm_keyvaultsecret:
        subscription_id: "{{ az_sub_id }}"
        client_id: "{{ az_client_id }}"
        keyvault_uri: "{{ kv_uri }}"
        secret_name: "{{ kv_secret_name }}"
        secret_value: "{{ kv_secret_value }}"

    - name: Register Key Vault provider.
      shell:
        az provider register -n Microsoft.KeyVault

    - name: Get latest version of a secret
      azure_rm_keyvaultsecret_info:
        vault_uri: "{{ kv_uri }}"
        name: "{{ kv_secret_name }}"
      register: output
    - debug:
        var: output['secrets'][0]['secret']

    - name: Create resource group for test VM.
      azure_rm_resourcegroup:
        subscription_id: "{{ az_sub_id }}"
        name: "{{ test_vm_rg }}"
        location: "{{ test_vm_rg_loc }}"

    - name: Create virtual network.
      azure_rm_virtualnetwork:
        subscription_id: "{{ az_sub_id }}"
        resource_group: "{{ test_vm_rg }}"
        name: "{{ test_vm_vnet }}"
        address_prefixes: "172.16.0.0/16"

    - name: Create subset within virtual network.
      azure_rm_subnet:
        subscription_id: "{{ az_sub_id }}"
        resource_group: "{{ test_vm_rg }}"
        virtual_network_name: "{{ test_vm_vnet }}"
        name: "{{ test_vm_subnet }}"
        address_prefix_cidr:  "172.16.10.0/24"

    - name: Create public IP address.
      azure_rm_publicipaddress:
        subscription_id: "{{ az_sub_id }}"
        resource_group: "{{ test_vm_rg }}"
        allocation_method: Static
        name: "{{ test_vm_public_ip }}"

    - name: Create Network Security Group and rules.
      azure_rm_securitygroup:
        subscription_id: "{{ az_sub_id }}"
        resource_group: "{{ test_vm_rg }}"
        name: "{{ test_vm_nsg}}"
        rules:
          - name: "{{ item.name }}"
            access: "{{ item.access }}"
            protocol: "{{ item.protocol }}"
            direction: "{{ item.direction }}"
            destination_port_range: "{{ item.port }}"
            priority: "{{ item.priority }}"
            source_address_prefix: "{{ item.source_address_prefix }}"
      loop: "{{ test_vm_nsg_list }}"

    - name: Create virtual network interface card (NIC).
      azure_rm_networkinterface:
        subscription_id: "{{ az_sub_id }}"
        resource_group: "{{ test_vm_rg }}"
        name: "{{ test_vm_nic }}"
        virtual_network: "{{ test_vm_vnet }}"
        subnet: "{{ test_vm_subnet }}"
        ip_configurations:
          - name: ipconfig
            public_ip_address_name: "{{ test_vm_public_ip }}"
            primary: yes
        security_group: "{{ test_vm_nsg }}"

    - name: Create virtual machine.
      azure_rm_virtualmachine:
        subscription_id: "{{ az_sub_id }}"
        resource_group: "{{ test_vm_rg }}"
        name: "{{ test_vm }}"
        admin_username: " {{ admin_username }} "
        admin_password: " {{ output['secrets'][0]['secret'] }}"
        vm_size: Standard_B1ms
        network_interfaces: "{{ test_vm_nic }}"
        image:
          offer: UbuntuServer
          publisher: Canonical
          sku: 16.04-LTS
          version: latest

```

**Notes:**

- The *admin* password for the virtual machine is set to the key vault secret.
- Your ability to run the entire playbook at once depends on your test environment. You might need to manually add yourself to the key vault's access policy before creating the key. This task is explained in the sections, [Create a key vault](#create-a-key-vault), and [Add yourself to key vault access policy](#add-yourself-to-key-vault-access-policy).
- As you can see, many different Ansible modules are used to create an Azure virtual machine and all of its constituent components. For more information about the various Ansible modules used to create a virtual machine, use the following list:
    - [Azure resource group module (azure_rm_resourcegroup)](https://docs.ansible.com/ansible/latest/modules/azure_rm_resourcegroup_module.html)
    - [Azure virtual network module (azure_rm_virtualnetwork)](https://docs.ansible.com/ansible/latest/modules/azure_rm_virtualnetwork_module.html)
    - [Azure virtual network subnet module (azure_rm_subnet)](https://docs.ansible.com/ansible/latest/modules/azure_rm_subnet_module.html)
    - [Azure public IP module (azure_rm_publicipaddress)](https://docs.ansible.com/ansible/latest/modules/azure_rm_publicipaddress_module.html)
    - [Azure network security group module (azure_rm_securitygroup)](https://docs.ansible.com/ansible/latest/modules/azure_rm_securitygroup_module.html)
    - [Azure network interface (azure_rm_networkinterface)](https://docs.ansible.com/ansible/latest/modules/azure_rm_networkinterface_module.html)
    - [Azure virtual machine (azure_rm_virtualmachine)](https://docs.ansible.com/ansible/latest/modules/azure_rm_virtualmachine_module.html)
    
## Clean up resources

When no longer needed, delete the resources created in this article. Replace the `<kv_rg>` placeholder with the resource group used to hold the demo key vault.	

```yml	
- hosts: localhost	
  vars:	
    kv_rg: <kv_rg>	
    test_vm_rg: kv_test_vm_rg	
  tasks:	
    - name: Delete the key vault resource group	
      azure_rm_resourcegroup:	
        name: "{{ kv_rg }}"	
        force_delete_nonempty: yes	
        state: absent	
    - name: Delete the test vm resource group	
      azure_rm_resourcegroup:	
        name: "{{ test_vm_rg }}"	
        force_delete_nonempty: yes	
        state: absent

## Next steps

> [!div class="nextstepaction"] 
> [Azure Key Vault security overview](/azure/key-vault/general/overview-security)
