---
title: Azure management libraries for Java release notes | Microsoft Docs
description: See what's new and watch for breaking changes in the Azure management libraries for Java
keywords: Azure,  Java, API, reference,  notes,  updates, deprecate
author: routlaw
manager: douge
ms.assetid: 1f128cf9-f747-4344-84e1-f9964709deb8
ms.service: Azure
ms.devlang: java
ms.topic: reference
ms.technology: Azure
ms.date: 3/06/2016
---

# Release Notes 

## October 5, 2017 - 1.3.0 

Version 1.3.0 is backwards compatible with previous versions for services and features use that reached the general availability (stable) stage in previous releases.

Any breaking changes from Preview versions for those services are marked with the @Beta annotation.

If you are migrating your code to 1.3.0, you can use [these notes](https://github.com/Azure/azure-sdk-for-java/blob/master/notes/prepare-for-1.3.0.md) to prepare your existing code for the 1.3 version.

### Generally availabile in V1.3

Some of the APIs that were still in Beta in previous releases are now GA, in particular:

- async methods
- all methods in CDN that were previously in Beta
- all methods and interfaces in Application Gateways that were previously in Beta

  Some parts of the library are still in Preview. Refer to the table below for the current state of the libraries:

Service or feature | Available as GA | Available as Preview 
---------|---------|---------|-
Compute  | Virtual machines and VM extensions, Virtual machine scale sets, managed disks   | Azure container service, Azure container registry 
Storage   |  Storage accounts       |    Encryption     
SQL Database  | Databases, firewalls, elastic pools              
Networking    |  Virtual networks , network interfaces , IP addresses ,routing tables, network security groups , DNS, Traffic managers, Application gateways  |    Load balancers, Network peering, Virtual Network Gateway, Network watchers 
More services    |  Resource Manager, Key Vault, Redis,  CDN, Batch       |  Web apps, Function apps, Service Bus, Graph RBAC, Cosmos DB, Search  
Fundamentals     |   Authentication - core , Async methods , Managed Service Identity      |      |

> Preview features are marked with a `@Beta` annotation at the class or interface or method level in libraries. These features are subject to change. They can be modified in any way, or even removed, in the future.

### Import with Maven

```XML
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure</artifactId>
    <version>1.3.0</version>
</dependency>
```

### Get help and give feedback

Check out the [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-java-sdk) community for help using the libraries in your own code. If you encounter any bugs or have suggestions to improve these libraries, please file issues via [GitHub](https://github.com/Azure/azure-sdk-for-java/issues).


