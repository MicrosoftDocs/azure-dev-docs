---
ms.author: tarcher
ms.topic: include
ms.date: 01/04/2022
ms.custom: devx-track-ansible
---

## Create an Azure Service Principal

Run the following commands to create an Azure Service Principal:

# [Azure CLI](#tab/azure-cli)

```azurecli
az ad sp create-for-rbac --name <service-principal-name> \
        --role Contributor \
        --scopes /subscriptions/<subscription_id>
```

Replace `<service-principal-name>` with your service principal name.

> [!Important]
> Make note of the password value in the output, you won't be able to retrieve it afterwards.

# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
$subId = '<subscriptionID>'
$credentials = New-Object Microsoft.Azure.Commands.ActiveDirectory.PSADPasswordCredential -Property @{ StartDate=Get-Date; EndDate=Get-Date -Year 2024; Password='<Password>'};

$params = @{
    DisplayName = '<service-principal-name>'
    PasswordCredential = $credentials
}

$sp = New-AzAdServicePrincipal @params

$roleAssignmentSplat = @{
    ObjectId = $sp.id
    RoleDefinitionName = 'Contributor'
    Scope = "/subscriptions/$subId"
}

New-AzRoleAssignment @roleAssignmentSplat
```

Replace `<subscriptionID>` and `<Password>` and `<service-principal-name>` with the appropriate values.

---
