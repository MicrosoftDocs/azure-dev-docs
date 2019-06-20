---
title: Azure management libraries for Java developer's guide
description: Patterns and concepts for using the Java management libraries for Java to manage your cloud resources in Azure.
keywords: Azure, Java, SDK, API, Maven, Gradle, authentication, active directory, service principal
author: rloutlaw
ms.author: routlaw
manager: douge
ms.date: 04/16/2017
ms.topic: article
ms.prod: azure
ms.technology: azure
ms.devlang: java
ms.service: multiple
ms.assetid: f452468b-7aae-4944-abad-0b1aaf19170d
---

# Patterns and best practices for development with the Azure libraries for Java 

This article lists a series of patterns and best practices when using the Azure libraries for Java in your projects. Develop with these patterns and guidelines to reduce the amount of code to maintain and make it easier to add or configure additional resources in future updates to the management libraries.

## Build resources through a fluent interface

A fluent interface is a pattern that creates objects using a method chain that correctly configures the object's attributes. For example, to create a new Azure Storage account

```java
StorageAccount storage = azure.storageAccounts().define(storageAccountName)
    .withRegion(region)
    .withNewResourceGroup(resourceGroup)
    .create();
```

As you go through the method chain, your IDE suggests the next method to call in the fluent conversation.   

![GIF of IntelliJ command completion working through a fluent chain](media/intelliJFluent.gif)

Chain the methods suggested by the IDE as long as they make sense for the Azure resource being defined. If you are missing a required method in the chain your IDE will highlight it with an error.

## Resource collections

The management library has a single point of entry through the top-level `com.microsoft.azure.management.Azure` object to create and update resources. Select which type of resources to work with using the resource collection methods defined in the `Azure` object. For example, SQL Database:

```java
SqlServer sqlServer = azure.sqlServers().define(sqlServerName)
    .withRegion(Region.US_EAST)
    .withNewResourceGroup(rgName)
    .withAdministratorLogin(administratorLogin)
    .withAdministratorPassword(administratorPassword)
    .create();
```

## Lists and iterations

Each resource collection has a `list()` method to return every instance of that resource in your current subscription. For example, `azure.sqlServers().list()` returns all SQL databases in the subscription.

Use the `listByResourceGroup(String groupname)` method to scope the returned List to a specific [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups).  

Search and iterate over the returned `PagedList<T>` collection just as you would a normal `List<T>`:

```java
PagedList<VirtualMachine> vms = azure.virtualMachines().list();
for (VirtualMachine vm : vms) {
    System.out.println("Found virtual machine with ID " + vm.id());
}
```   

## Collections returned from queries

The management libraries return specific collection types from queries based on the structure of the results.

- `List<T>`: Unordered data that is easy to search and iterate over.
- `Map<T>`: Maps are key/value pairs with unique keys, but not necessarily unique values. An example of a Map would be app settings for an App Service Web App.
- `Set<T>`: Sets have unique keys and values. An example of a Set would be networks attached to a virtual machine, which would have both an unique identifier (the key) and a unique network configuration (the value).

## Actionable verbs

Methods with verbs in their names take immediate action in Azure. These methods work synchronously and block execution in the current thread until they complete. 

| Verb   |  Sample Usage |
|--------|---------------|
| create | `azure.virtualMachines().create(listOfVMCreatables)` |
| apply  | `virtualMachineScaleSet.update().withCapacity(6).apply()` |
| delete | `azure.disks().deleteById(id)` | 
| list   | `azure.sqlServers().list()` | 
| get    | `VirtualMachine vm  = azure.virtualMachines().getByResourceGroup(group, vmName)` |

>[!NOTE]
> `define()` and `update()` are verbs but do not block unless followed by a `create()` or `apply()`.
 
Asynchronous versions of some of these  methods exist with the `Async` suffix using [Reactive extensions](https://github.com/ReactiveX/RxJava). 

Some objects have other methods with that change the state of the resource in Azure. For example, `restart()` on a `VirtualMachine`.

```java
VirtualMachine vmToRestart = azure.getVirtualMachines().getById(id);
vmToRestart.restart();
```
These methods do not always have asynchronous versions and will block execution on their thread until they complete.

<a name="Creatables"></a>

## Lazy resource creation

A challenge when creating Azure resources arises when a new resource depends on another resource that doesn't yet exist. An example of this scenario is reserving a public IP address and setting up a disk when creating a new virtual machine. You don't want to verify reserving the address or the creating the disk, you just want to ensure the virtual machine has those resources when it is created.

`Creatable<T>` objects let you define Azure resources for use in your code without waiting around for them to be created in your subscription. The management libraries defer creating  `Creatable<T>` objects until they are needed.

Generate `Creatable<T>` objects for Azure resources through the `define()` verb:

```java
Creatable<PublicIPAddress> publicIPAddressCreatable = azure.publicIPAddresses().define(publicIPAddressName)
    .withRegion(Region.US_EAST)
    .withNewResourceGroup(rgName);
```

The Azure resource defined by the `Creatable<PublicIPAddress>` in this example does not yet exist in your subscription when this code executes.  Use the `publicIPAddressCreatable` object to create other Azure resources with this IP address. 

```java
Creatable<VirtualMachine> vmCreatable = azure.virtualMachines().define("creatableVM")
    .withNewPrimaryPublicIPAddress(publicIPAddressCreatable)
```

The `Creatable<T>` resources are generated in your subscription when any resource that is defined using the object is built in Azure using `create()`. Continuing the IP address and virtual machine example:

```java
CreatedResources<VirtualMachine> virtualMachine = azure.virtualMachines().create(vmCreatable);
```

Passing the `Creatable<T>` to `create()` calls returns a `CreatedResources` object instead of a single resource object.  The `CreatedResources<T>` object lets you access all resources created by the `create()` call, not just the typed resource in the call. To access the public IP address created in Azure for the virtual machine created in the above example:

```java
PublicIPAddress pip = (PublicIPAddress) virtualMachine.createdRelatedResource(publicIPAddressCreatable.key());
```    

## Exception handling

The management libraries' Exception classes extend `com.microsoft.rest.RestException`. Catch exceptions generated by the management libraries with a `catch (RestException exception)` block after the relevant `try` statement.

## Logs and trace

Configure the amount of logging from the management library when you build the entry point `Azure` object using `withLogLevel()`. The following trace levels exist:

| Trace level | Logging enabled 
| ------------ | ---------------
| com.microsoft.rest.LogLevel.NONE | No output
| com.microsoft.rest.LogLevel.BASIC | Logs the URLs to underlying REST calls, response codes and times
| com.microsoft.rest.LogLevel.BODY | Everything in BASIC plus request and response bodies for the REST calls
| com.microsoft.rest.LogLevel.HEADERS | Everything in BASIC plus the request and response headers REST calls
| com.microsoft.rest.LogLevel.BODY_AND_HEADERS | Everything in both BODY and HEADERS log level

Bind a [SLF4J logging implementation](https://www.slf4j.org/manual.html) if you need to log output to a logging framework like [Log4J 2](https://logging.apache.org/log4j/2.x/).