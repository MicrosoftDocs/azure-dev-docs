---
title: Tutorial - Configure VM security using Azure Key Vault and Anible
description: Learn how to use Ansible to configure VM security using Azure Key Vault
keywords: ansible, azure, devops, key vault, security, credentials, secrets, keys, certificates, ansible modules for azure, resource group, azure_rm_resourcegroup, 
ms.topic: tutorial
ms.date: 04/15/2020
---

# Tutorial: Configure VM security using Azure Key Vault and Ansible

[!INCLUDE [ansible-29-note.md](includes/ansible-29-note.md)]

In this tutorial, you learn how to use the Ansible collection for Azure modules in using [Azure Key Vault](/azure/key-vault/general/overview). Azure Key Vault allows you to centralize the storage of credentials such as application secrets, keys, and certificates. The decoupling of credentials and application code helps your system become more secure. In addition, implementing a rotating credentials-management pattern with auto expiry dates becomes much more manageable.

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

In this section, you use the Azure CLI to get the necessary Azure subscription information needed when using the Ansible modules for Azure. 

1. Get the Azure subscription ID and Azure subscription tenant ID using the `az account show` command. For the `<Subscription>` placeholder, specify either the Azure subscription name or Azure subscription ID. The command will display many of the key values associated with the default Azure subscription. If you have multiple subscriptions, you might need to set the current subscription via the [az acccount set](/cli/azure/account?view=azure-cli-latest#az-account-set) command. From the command's output, make note of both the **ID** and **tenantID** values.

    ```azurecli
    az account show --subscription "<Subscription>" --query tenantId
    ```

1. If you do not have a service principal for the Azure subscription. [create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest). From the command's output, make note of the **appId** value.

1. Get the object ID of the service principal using the `az ad sp show` command. For the `<ApplicationID>` placeholder, specify the service principal appId. The `--query` parameter indicates which value you wanted printed to the stdout as a result of running the command. In this case, it's the service principal object ID.

    ```azurecli
    az ad sp show --id <ApplicationID> --query objectId
    ```
    
1. Store the following values as environment variables: Azure subscription ID, Azure subscription tenant ID, and service principal object ID. How you run the playbook, where you store subscription and credential values, and how you retrieve those values is based on your particular environment. For purposes of this demo, I used Azure cloud shell and stored the necessary Azure values in `~/.bashrc` by adding the following lines to the end of the file:

    ```bash
    export AZ_SUBSCRIPTION_ID="<subscriptionID>"
    export AZ_TENANT_ID="<tenantID>"
    export AZ_OBJECT_ID="<objectID>"
    export AZ_CLIENT_ID="<appID>"
    ```

## Declare the Azure collection

Assuming you've [downloaded the latest Azure collection](#prerequisites), the first thing you'll need to do in any Ansible playbook that uses the Azure collection is to specify that collection as follows:

```yml
- hosts: all
  collections:
    - azure.azcollection
```

## Create Azure resource group for the key vault

Before creating a key vault, you'll need to create the resource group for it. It's a best practice to store the key vault in its own resource group and reference it from resources residing in other resource groups.

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

Some key notes to consider when working with the sample playbook:

- In this demo, the key vault will reside by itself in a resource group. Additionally, the key vault name must be unique in Azure. Therefore, the demo creates a random *postfix* value. This value is appended to the name of the key vault resource group and the key vault (created in the next section). The code in the task `Prepare random postfix` generates the random postfix value that is assigned to the `rpfx` variable.
- In the task `Set facts`, the `lookup` command is used to retrieve the Azure subscription ID that is stored as an environment variable.
- The [azure_rm_resourcegroup module](https://docs.ansible.com/ansible/latest/modules/azure_rm_resourcegroup_module.html) is used to create the new resource group.
- A `debug` task at the end of the playbook displays the name of the new resource group.

## Create a key vault

As mentioned in the previous section, the key vault name must be unique across Azure. Therefore, the following playbook snippet assigns to the `kv` variable the concatenation of the literal `kv` and `rpfx`value.

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

Some key notes to consider when working with the sample playbook:

- The [azure_rm_keyvault module](https://docs.ansible.com/ansible/latest/modules/azure_rm_keyvault_module.html) is used to create the key vault.
- When creating the access policy as part of the key vault, an object ID and tenant ID were supplied. These values define an access policy for a specific service principal (that is associated with a Azure subscription). However, if you browse to the Azure portal and try to view the key vault's secrets, you see messages along the lines of "The operation "List" is not enabled in this key vault's access policy." and "You are unauthorized to view these contents." This is because you - as an Active Directory user - do not have access. The next section shows you how to add an access policy for yourself to the key vault.
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

1. From the filtered list, select the desired user's name or email address.

1. The information for the selected user is copied to the **Selected member** list. Select **Select**.

1. Select the appropriate options for **Key permissions**, **Secret permissions**, and **Certificate permissions**. For this demo, it is enough to select **Secret permissions** and then **Get**, **List**, and **Set**.

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

Some key notes to consider when working with the sample playbook:

- The [azure_rm_keyvaultsecret module](https://docs.ansible.com/ansible/latest/modules/azure_rm_keyvaultsecret_module.html) is used to create the key vault.
- For simplicity, the demo includes the `secret_name` and `secret_value`. However, playbooks are infrastructure-as-code (AiC) files just like any source code for your project. Therefore, values such as these should not be stored in plaintext files when used in production environments.
- After running this code, the **Secrets** tab for the key vault lists the newly added secret named `testsecret`. To view it, select the secret, select the current version, and select **Show Secret Value**.

## Get a key vault secret

There are several ways to get a key vault secret, including running commands from Azure CLI and Azure PowerShell. In this section, the Azure CLI [az keyvault command](/cli/azure/keyvault?view=azure-cli-latest) is used. Also, this demo assumes that you are running this playbook on Linux. Therefore, the Ansible shell module is used.

```yml
  tasks:
    - name: Register Key Vault provider
      shell:
        az provider register -n Microsoft.KeyVault

    - name: Get latest version of a secret
      shell:
        az keyvault secret show --vault-name "{{ kv }}" --name "{{ kv_secret_name }}" --query value
      register:
        result
    - debug:
        msg: "{{ result.stdout }}"

```

Some key notes to consider when working with the sample playbook:

- The [az provider register command](/cli/azure/provider?view=azure-cli-latest#az-provider-register) is used to register the Key Vault provider. You can determine if you've already registered the Key Vault provider by entering enter `az provider show --namespace "Microsoft.KeyVault"`. However, if you are providing an automation script for others, it is recommended to include the provider registration code.
- Most Azure CLI commands outputs JSON data to the stdout, where you can use the `--query` parameter to get the column you need. Therefore, `--query value` is used to get just the password value.
- An Ansible register named `result` is used to capture the output of the task `Get latest version of a secret`. That variable is then printed via the `debug` task.

## Create a virtual machine

Once you have the key vault and its secret established, you can use that information when creating Azure resources such as virtual machines. The following Ansible playbook snippet shows the code to create a virtual machine that uses the secret value as the admin password:

```yml
---
- hosts: localhost

  vars:
    kv_secret_name: testsecret

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
    - name: Set facts.
      set_fact:
        az_sub_id: "{{ lookup('env', 'AZ_SUBSCRIPTION_ID') }}"        

    - name: Register Key Vault provider.
      shell:
        az provider register -n Microsoft.KeyVault

    - name: Get latest version of secret.
      shell:
        az keyvault secret show --vault-name "{{ kv }}" --name "{{ kv_secret_name }}" --query value
      register:
        result
    - debug:
        msg: "{{ result.stdout }}"

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
        admin_password: " {{ result.stdout }} "
        vm_size: Standard_B1ms
        network_interfaces: "{{ test_vm_nic }}"
        image:
          offer: UbuntuServer
          publisher: Canonical
          sku: 16.04-LTS
          version: latest

```

As you can see, many different Ansible modules are used to create an Azure virtual machine and all of its constituent components. For your convenience, here's a list of the various modules used with links to their reference documentation so that you can learn more about their parameters and see further examples:
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
```

## Next steps

> [!div class="nextstepaction"] 
> [Azure Key Vault security overview](/azure/key-vault/general/overview-security)