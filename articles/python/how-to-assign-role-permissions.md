---
title: Assign role permissions to an app identity or service principal
description: How to grant permissions to a service principal or app identity using the Azure CLI
ms.date: 05/04/2020
ms.topic: conceptual
---

# How to assign role permissions to an app identity or service principal

Azure's role-based access control (RBAC) system manages specific permissions for a wide variety of resources. A *role* is essentially a collection of related permissions that are commonly needed together. To enable permissions, you assign a role to a *security principal* (a user, group, service principal, or app identity) with a specific *scope* to which that role applies.

In practice, always assign only the roles that a security principal really needs at the most specific scope. Avoid assigning broader roles at broader scopes even if it initially seems more convenient to do so. By limiting roles and scopes you limit what resources are at risk if the security principal is ever compromised (that is, if the credentials for that principal are exposed in a data breach or other security incident).

Because you use different security principals in development and production, you repeat the role assignments in each environment. That is, during development you typically assign roles to the local service principal created on your workstation (see [Configure your local Python dev environment - Authentication](configure-local-development-environment.md#configure-authentication)). In production, you assign roles to the application identity or service principal before deployment to ensure that the application has access on startup.

For more information about RBAC in general, see the [What is Azure role-based access control?](/azure/role-based-access-control/overview).

## Role assignment process

Assigning a role has three steps:

1. [Find the appropriate role](#find-the-roles-you-need) for the type of resource involved and the operations you want to authorize.

1. Identify the needed scope for the role in question, which describes the extent of resources for which operations are authorized.

1. Assign the role to a security principal.

Steps 1 is the same for both the Azure portal and the Azure CLI. Steps 2 and 3 are different between the portal and the CLI, and are thus combined in the sections that follow: [Identify scope and assign a role on the Azure Portal](#azure-portal) and [Identify scope and assign a role through the Azure CLI](#azure-cli).

> [!NOTE]
> If your account doesn't have permission to assign a role, you see an error message that your account "does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write'."

## Find the roles you need

1. Begin with the comprehensive article, [Azure built-in roles](/azure/role-based-access-control/built-in-roles). The table at the top of the article is an index into the details later in the article.

1. In that article, navigate to the service category (compute, storage, databases, etc.) for the resource to which you want to grant permissions. The easiest way to find what your looking for is typically to search the page for a relevant keyword, like "blob", "virtual machine", and so on.

1. Review the roles listed for the service category and identify the specific operations you need. Again, always start with the most restrictive role.

    For example, if a security principal needs to read blobs in an Azure Storage account, but doesn't need write-access, then choose "Storage Blob Data Reader" rather than "Storage Blob Data Contributor" (and definitely not the administrator-level "Storage Blob Data Owner" role). You can always update the role assignments later as needed.

    If the security principal also needs access to queue storage, you can use roles such as "Storage Queue Data Reader" and "Storage Queue Data Contributor". Again, be as specific as you can rather than assigning a broad role such as "Reader and Data Access", which gives access to account keys through which the principal can access anything in the entire storage account.

1. If you don't find a suitable role, you can create [custom roles](/azure/role-based-access-control/custom-roles).

## <a name="azure-portal"></a>Identify scope and assign a role on the Azure Portal

1. On the [Azure portal](https://portal.azure.com), navigate to the resource to which you want to assign a role. The scope of the resource determines the scope of the assignment.

    For example, if you navigate to a storage account, any role assignment applies to the whole storage account. If you navigate to a specific blob container within that storage account, the role assignment applies to only that container.

1. Select the **Access Control (IAM)** blade (IAM stands for "identity and access management").

1. Within that blade is a **Role assignments** section, in which you can add and remove roles assigned to any security principals.

For full details and a UI walkthrough, see [Add or remove Azure role assignments](/azure/role-based-access-control/role-assignments-portal) in the Azure RBAC documentation.

## <a name="azure-cli"></a>Identify scope and assign a role through the Azure CLI

Role assignment with the Azure CLI uses the [`az role assignment`](/cli/azure/role/assignment?view=azure-cli-latest) command. You use `az role assignment create` to add an assignment and `az role assignment delete` to remove an assignment. 

Although the full process is described in [Add or remove Azure role assignments using Azure CLI](/azure/role-based-access-control/role-assignments-cli), the following summary provides specific examples that are relevant to other articles on this Developer Center.

The `az role assignment create` command has the following syntax:

```azurecli
az role assignment create --assignee <assignee> --role <role> --scope <scope>
```

- `<assignee>` identifies the security principal; for service principals, such as that which you use during local development, the assignee is the client ID of that principal. For applications deployed to the cloud, the assignee is the name of the application.
- `<role>` is the name of the role to assign, such as "Storage Blob Data Contributor", or its GUID, such as "ba92f5b4-2d11-453d-a403-e96b0029c9fe".
- `<scope>` is a potentially long string that identifies the exact scope of the assignment.

The scope consists of a series of identifiers separated by the / character. You can think of this string as expressing the following hierarchy, where text without placeholders (`<>`) are fixed identifiers:

<pre>
/subscriptions
  /&lt;subscription_id&gt;
    /resourcegroups
      /&lt;resource_group_name&gt;
        /providers
          /&lt;provider_name&gt;
            /&lt;resource_type&gt;
              /&lt;resource_sub_type_1&gt;
                /&lt;resource_sub_type_2&gt;
                  /&lt;resource_name&gt;
</pre>

- `<subscription_id>` is the ID of the subscription to use (a GUID).
- `<resources_group_name>` is the name of the containing resource group.
- `<provider_name>` is the name of the service that handles the resource, then `<resource_type>` and `<resource_sub_type_*>` identify further levels within that service.
  
    You find these names and types by referring to the [Azure build-in roles](/azure/role-based-access-control/built-in-roles) reference. Locate and select the role in the upper table to jump to the specific description of the role. There you find strings that contain the provider name, resource type, and resource sub types. For example, with the "Storage Blob Data Contributor" you see "Microsoft.Storage/storageAccounts/blobServices/containers/". For the "Cosmos DB Account Reader Role" you see "Microsoft.DocumentDB/databaseAccounts/readonlykeys", which has only one sub type.

- `<resource_name>` is the last part of the string that identifies a specific resource.

The broadest (least specific) scope is `/subscriptions/<subscription_id>`, which applies an assignment across the entire subscription. Each additional level of hierarchy makes the scope more specific.

### Examples

The following examples assume the following conditions (see [Example: Use the Azure SDK with Azure Storage](azure-sdk-example-storage.md)):

- Your Azure subscription ID is contained in an environment variable named `AZURE_SUBSCRIPTION_ID`.
- The client ID of the service principal to which you want to assign a role is contained in an environment variable named `AZURE_CLIENT_ID`.
- In the subscription you have a resource group named "PythonSDKExample-Storage-rg".
- The resource group contains an Azure Storage account named "pythonsdkstorage-12345".
- You have a blob container in that storage account named "blob-container-01".
- You want to assign the "Storage Blob Data Contributor" to the service principal.

> [!TIP]
> It can take a minute for changes in role assignments to propagate within Azure. As a result, you may find that code still works for a short time after you remove a permission. If you see unexpected behavior, wait a minute or two and try again.

#### Grant permissions for the specific container only

# [bash](#tab/bash)

```azurecli
az role assignment create --assignee $AZURE_CLIENT_ID \
    --role "Storage Blob Data Contributor" \
    --scope "/subscriptions/$AZURE_SUBSCRIPTION_ID/resourceGroups/PythonSDKExample-Storage-rg/providers/Microsoft.Storage/storageAccounts/pythonsdkstorage12345/blobServices/default/containers/blob-container-01"
```

# [cmd](#tab/cmd)

```azurecli
az role assignment create --assignee %AZURE_CLIENT_ID% ^
    --role "Storage Blob Data Contributor" ^
    --scope "/subscriptions/%AZURE_SUBSCRIPTION_ID%/resourceGroups/PythonSDKExample-Storage-rg/providers/Microsoft.Storage/storageAccounts/pythonsdkstorage12345/blobServices/default/containers/blob-container-01"
```

---

#### Grant permissions for all blob containers in the storage account

# [bash](#tab/bash)

```azurecli
az role assignment create --assignee $AZURE_CLIENT_ID \
    --role "Storage Blob Data Contributor" \
    --scope "/subscriptions/$AZURE_SUBSCRIPTION_ID/resourceGroups/PythonSDKExample-Storage-rg/providers/Microsoft.Storage/storageAccounts/pythonsdkstorage12345"
```

# [cmd](#tab/cmd)

```azurecli
az role assignment create --assignee %AZURE_CLIENT_ID% ^
    --role "Storage Blob Data Contributor" ^
    --scope "/subscriptions/%AZURE_SUBSCRIPTION_ID%/resourceGroups/PythonSDKExample-Storage-rg/providers/Microsoft.Storage/storageAccounts/pythonsdkstorage12345"
```

---

#### Grant permissions for all blob containers in the resource group

# [bash](#tab/bash)

```azurecli
az role assignment create --assignee $AZURE_CLIENT_ID \
    --role "Storage Blob Data Contributor" \
    --scope "/subscriptions/$AZURE_SUBSCRIPTION_ID/resourceGroups/PythonSDKExample-Storage-rg"
```

Alternately, you can just specify the resource group with the `--resource-group` parameter:

```azurecli
az role assignment create --assignee $AZURE_CLIENT_ID \
    --role "Storage Blob Data Contributor" \
    --resource-group "PythonSDKExample-Storage-rg"
```

# [cmd](#tab/cmd)

```azurecli
az role assignment create --assignee %AZURE_CLIENT_ID% ^
    --role "Storage Blob Data Contributor" ^
    --scope "/subscriptions/%AZURE_SUBSCRIPTION_ID%/resourceGroups/PythonSDKExample-Storage-rg"
```

Alternately, you can just specify the resource group with the `--resource-group` parameter:

```azurecli
az role assignment create --assignee %AZURE_CLIENT_ID% ^
    --role "Storage Blob Data Contributor" ^
    --resource-group "PythonSDKExample-Storage-rg"
```

---

#### Grant permissions to all blob containers in the subscription

# [bash](#tab/bash)

```azurecli
az role assignment create --assignee $AZURE_CLIENT_ID \
    --role "Storage Blob Data Contributor" \
    --scope "/subscriptions/$AZURE_SUBSCRIPTION_ID"
```

# [cmd](#tab/cmd)

```azurecli
az role assignment create --assignee %AZURE_CLIENT_ID% ^
    --role "Storage Blob Data Contributor" ^
    --scope "/subscriptions/%AZURE_SUBSCRIPTION_ID%"
```

---
