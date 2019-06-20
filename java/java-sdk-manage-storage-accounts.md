---
title: Manage Azure storage accounts with Java | Microsoft Docs
description: Sample code to manage Azure storage accounts using the Azure SDK for Java
author: rloutlaw
manager: douge
ms.assetid: 49be8b66-3b56-4c10-8f14-9d326d815cb4
ms.devlang: java
ms.topic: article
ms.service: Azure
ms.devlang: java
ms.technology: Azure
ms.date: 3/30/2017
ms.author: routlaw;asirveda
---

# Manage Azure storage accounts from your Java applications

[This sample](https://github.com/Azure-Samples/storage-java-manage-storage-accounts) creates an [Azure Storage](https://docs.microsoft.com/azure/storage/storage-introduction) account and works with the account access keys using the [Java management libraries](https://github.com/Azure/azure-sdk-for-java). 

## Run the sample

Create an [authentication file](https://github.com/Azure/azure-sdk-for-java/blob/master/AUTH.md) and set an environment variable `AZURE_AUTH_LOCATION` with the full path to the file on your computer. Then run:

```
git clone https://github.com/Azure-Samples/storage-java-manage-storage-accounts.git
cd storage-java-manage-storage-accounts
mvn clean compile exec:java
```

View the [complete code sample on GitHub](https://github.com/Azure-Samples/storage-java-manage-storage-accounts).

## Authenticate with Azure

[!INCLUDE [auth-include](includes/java-auth-include.md)] 

## Create a storage account

```java
// create a new storage account
StorageAccount storageAccount = azure.storageAccounts().define(storageAccountName)
                    .withRegion(Region.US_EAST)
                    .withNewResourceGroup(rgName)
                    .create();
```

The storage name provided must be unique across all names in Azure and contain only lowercase letters and numbers. The default performance and replication profile used for this account is [Standard_GRS](https://docs.microsoft.com/azure/storage/storage-redundancy#geo-redundant-storage).

## List keys in a storage account
```java
// list the name and value for each access key in the storage account
List<StorageAccountKey> storageAccountKeys = storageAccount.getKeys();
for(StorageAccountKey key : storageAccountKeys)    {
    System.out.println("Key name: " + key.keyName() + " with value "+ key.value());
}
```

Two keys are provided in each Azure storage account so that you can regenerate one key while still allowing access to storage using the other key.

## Regenerate a key in a storage account

```java
// regenerate the first key in a storage account and return an updated list of keys 
List<StorageAccountKey> updatedStorageAccountKeys =
    storageAccount.regenerateKey(storageAccountKeys.get(0).keyName());
```

You must update all Azure resources and applications with the new key after generating a new one.

## List all storage accounts in a resource group
```java
// get a list of accounts in a resource group , log info about each one
List<StorageAccount> accounts = azure.storageAccounts().listByResourceGroup(rgName);
for (StorageAccount sa : accounts) {
    System.out.println("Storage Account " + sa.name() + " created @ " + sa.creationTime());
}
```

[com.microsoft.azure.management.storage.StorageAccount](https://docs.microsoft.com/java/api/com.microsoft.azure.management.storage._storage_account) provides a set of useful methods to inspect the configuration of a storage account.

## Delete a storage account
```java
// delete by ID when you already have a storage account object
azure.storageAccounts().deleteById(storageAccount.id());

// delete by resource group and account name if you don't have an account object
azure.storageAccounts().deleteByResourceGroup(rgName,accountName);
```

> [!NOTE]
> Storage accounts with in-use disk images connected to virtual machines or disks in use by other artifacts may not remove with these methods. Detach the storage from these resources before removing the account.

## Sample explanation

[The sample code on GitHub](https://github.com/Azure-Samples/storage-java-manage-storage-accounts):

- creates a storage account
- reads and regenerates access keys
- lists all storage accounts in a resource group
- deletes the storage account 

| Class used in sample | Notes
|-------|-------|
| [StorageAccount](https://docs.microsoft.com/java/api/com.microsoft.azure.management.storage._storage_account)  | Representation of an Azure storage account. Use the methods in the class to get information about the storage account.
| [StorageAccountKey](https://docs.microsoft.com/java/api/com.microsoft.azure.management.storage._storage_account_key) | `StorageAccount.getKeys()` returns the storage account keys. Use the `regenerateKey` methods in `StorageAccount` to update the keys.

## Next steps

[!INCLUDE [next-steps](includes/java-next-steps.md)]