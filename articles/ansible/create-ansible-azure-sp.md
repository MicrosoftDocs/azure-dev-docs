---
title: Quickstart - Create an Azure Service Principal for Ansible
description: In this quickstart, learn how to create an Azure Service Principal to authenticate to Azure.
keywords: ansible, azure, devops, bash, cloudshell, playbook, azure cli, azure powershell, powershell
ms.topic: quickstart
ms.date: 04/23/2021
ms.custom: devx-track-ansible, devx-track-azurecli, devx-track-azurepowershell
---

# Quickstart: Create an Azure service principal for Ansible

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation1.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation1.md)]

[!INCLUDE [ansible-210-note.md](includes/ansible-210-note.md)]

## Create an Azure service principal

An Azure service principals gives you a dedicated account to manage Azure resources with Ansible.

Run the following code to create an Azure service principal:

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az ad sp create-for-rbac --name ansible
```

**NOTE**:

* Store the password from the output in a secure location. You won't be able to retrieve it from Azure later.

# [PowerShell](#tab/azurepowershell)

```azurepowershell
$password = '<Password>'

$credentials = New-Object Microsoft.Azure.Commands.ActiveDirectory.PSADPasswordCredential `
-Property @{ StartDate=Get-Date; EndDate=Get-Date -Year 2024; Password=$password}

$spSplat = @{
    DisplayName = 'ansible'
    PasswordCredential = $credentials
}

$sp = New-AzAdServicePrincipal @spSplat
```

Replace `'<Password>'` with your password.

**NOTE**:

* Store the password in a secure location. You won't be able to retrieve it from Azure later.

---

## Assign a role to the Azure service principal

By default service principals don't have the access necessary to manage resources in Azure.

Run the following command to assign the **Contributor** role to the service principal:

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az role assignment create --assignee <appID> --role Contributor
```

Replace `<appID>` with the value provided from the output of `az ad sp create-for-rba` command.

**NOTE**:

* To improve security, change the scope of the role assignment to a resource group instead of a subscription.

# [PowerShell](#tab/azurepowershell)

```azurepowershell
$subId = (Get-AzContext).Subscription.Id

$roleAssignmentSplat = @{
    ObjectId = $sp.id;
    RoleDefinitionName = 'Contributor';
    Scope = "/subscriptions/$subId"
}

New-AzRoleAssignment @roleAssignmentSplat
```

**NOTE**:

* To improve security, change the scope of the role assignment to a resource group instead of a subscription.

---

## Get Azure service principal information

To authenticate with Azure with the service principal you need:

* SubscriptionID
* Service Principal ApplicationId
* Service Principal password
* TenantID

Run the following commands to get the service principal information:

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az account show --query '{tenantId:tenantId,subscriptionid:id}';

az ad sp list --display-name ansible --query '{clientId:[0].appId}'
```
# [PowerShell](#tab/azurepowershell)

```azurepowershell
@{
    subscriptionId = (Get-AzContext).Subscription.Id
    clientid = (Get-AzADServicePrincipal -DisplayName 'ansible').ApplicationId.Guid
    tenantid = (Get-AzContext).Tenant.Id
}
```

---

## Authenticate to Azure with the service principal

Run the follow commands to populate the required environment variables on the Ansible server:

```bash
export AZURE_SUBSCRIPTION_ID=<SubscriptionID>
export AZURE_CLIENT_ID=<ApplicationId>
export AZURE_SECRET=<Password>
export AZURE_TENANT=<TenantID>
```

Replace `<SubscriptionID>`, `<ApplicationId>`, `<Password>`, and `<TenantID>` with the values of your service principal account.

## Test service principal permissions

Run the following command to create a new Azure resource group:

```bash
ansible localhost -m azure_rm_resourcegroup -a "name=<resource_group_name> location=<resource_group_location>"
```

Replace `<resource_group_name>` and `<resource_group_location>` with your new resource group values.

```Output
[WARNING]: No inventory was parsed, only implicit localhost is available
localhost | CHANGED => {
    "changed": true,
    "contains_resources": false,
    "state": {
        "id": "/subscriptions/<subscriptionID>/resourceGroups/azcli-test",
        "location": "eastus",
        "name": "azcli-test",
        "provisioning_state": "Succeeded",
        "tags": null
    }
}
```

Run the following command to delete the Azure resource group:

```bash
ansible localhost -m azure_rm_resourcegroup -a "name=<resource_group_name> state=absent force_delete_nonempty=yes"
```

Replace `<resource_group_name>` with the name of your resource group.

```Output
[WARNING]: No inventory was parsed, only implicit localhost is available
localhost | CHANGED => {
    "changed": true,
    "contains_resources": false,
    "state": {
        "id": "/subscriptions/subscriptionID>/resourceGroups/azcli-test",
        "location": "eastus",
        "name": "azcli-test",
        "provisioning_state": "Succeeded",
        "status": "Deleted",
        "tags": null
    }
}

```
