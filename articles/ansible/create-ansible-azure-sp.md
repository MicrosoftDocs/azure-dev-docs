---
title: Quickstart - Create an Azure Service Principal for Ansible
description: In this quickstart, learn how to create an Azure Service Principal to authenticate to Azure.
keywords: ansible, azure, devops, bash, cloudshell, playbook, azure cli, azure powershell, powershell
ms.topic: quickstart
ms.date: 04/23/2021
ms.custom: devx-track-ansible, devx-track-azurecli, devx-track-azurepowershell
---

# Quickstart: Create an Azure service principal for Ansible

Azure service principals allow you to connect to and manage Azure resources with a dedicated automation account.

Run the following code to create an Azure service principal:

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az login
```

Make note of the password value and save it in a secure location. You'll need it later and won't be able to retrieve it from Azure.

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

Run the following commands to assign the _Contributor_ role the service principal:

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az login
```
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

## Test the Azure service principal credentials

Authenticate to Azure with the service principal by defining the following environment variables on the Ansible server:

```bash
export AZURE_SUBSCRIPTION_ID=<SubscriptionID>
export AZURE_CLIENT_ID=<ApplicationId>
export AZURE_SECRET=<Password>
export AZURE_TENANT=<TenantID>
```

Replace `<SubscriptionID>`, `<ApplicationId>`, `<Password>`, and `<TenantID>` with the values of your service principal account.

Next, validate that authenticate worked and the service principal's permissions are set correctly.

Run the following command to create a new Azure resource group:

```bash
ansible localhost -m azure_rm_resourcegroup -a "name=<resource_group_name> location=<resource_group_location>"
```

Replace `<resource_group_name>` and `<resource_group_location>` with the your new resource group values.

For other ways to authenticate to Azure with a service principal check out [connect to azure with ansible]()