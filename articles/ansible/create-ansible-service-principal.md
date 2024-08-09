---
title: Quickstart - Create an Azure service principal for Ansible
description: In this quickstart, learn how to create an Azure Service Principal to authenticate to Azure.
keywords: ansible, azure, devops, bash, cloudshell, playbook, azure cli, azure powershell, powershell
ms.topic: quickstart
ms.date: 03/30/2022
ms.custom: devx-track-ansible, devx-track-azurecli, devx-track-azurepowershell, mode-portal
---

# Quickstart: Create an Azure service principal for Ansible

In this quickstart, you create an Azure service principal with AzureCLI or Azure PowerShell and authenticate to Azure from Ansible.

In this article, you learn how to:

> [!div class="checklist"]
>
> * Create an Azure service principal using the Azure CLI
> * Create an Azure service principal using the Azure PowerShell
> * Assign a role to the Azure service principal
> * Get key information from the service principal
> * Set environment variables so that Ansible can retrieve the service principal values
> * Test the service principal

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation1.md](includes/ansible-prereqs-cloudshell-use-or-vm-creation1.md)]

## Create an Azure service principal

An Azure service principal gives you a dedicated account to manage Azure resources with Ansible.

Run the following code to create an Azure service principal:

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az ad sp create-for-rbac --name ansible \
            --role Contributor \
            --scopes /subscriptions/<subscription_id>
```

>[!NOTE]
>Store the password from the output in a secure location.

# [Azure PowerShell](#tab/azurepowershell)

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

>[!NOTE]
>Store the password in a secure location.

---

## Assign a role to the Azure service principal

By default service principals don't have the access necessary to manage resources in Azure.

Run the following command to assign the **Contributor** role to the service principal:

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az role assignment create --assignee <appID> \
    --role Contributor \
    --scope /subscriptions/<subscription_id>
```

Replace `<appID>` with the value provided from the output of `az ad sp create-for-rbac` command.

>[!NOTE]
>To improve security, change the scope of the role assignment to a resource group instead of a subscription.

# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
$subId = (Get-AzContext).Subscription.Id

$roleAssignmentSplat = @{
    ObjectId = $sp.id;
    RoleDefinitionName = 'Contributor';
    Scope = "/subscriptions/$subId"
}

New-AzRoleAssignment @roleAssignmentSplat
```

>[!NOTE]
>To improve security, change the scope of the role assignment to a resource group instead of a subscription.

---

## Get Azure service principal information

To authenticate to Azure with a service principal, you need the following information:

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
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
@{
    subscriptionId = (Get-AzContext).Subscription.Id
    clientid = (Get-AzADServicePrincipal -DisplayName 'ansible').ApplicationId.Guid
    tenantid = (Get-AzContext).Tenant.Id
}
```

---

## Authenticate to Azure with the service principal

Run the following commands to populate the required environment variables on the Ansible server:

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

## Next steps

* [Configure Linux virtual machines in Azure using Ansible](./vm-configure.md)
