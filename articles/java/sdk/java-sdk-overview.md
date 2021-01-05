---
title: Use the Azure Libraries for Java
description: Overview of the features and capabilities of the Azure libraries for Java that helps developers be more productive when provisioning, using, and managing Azure resources.
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
---

# Use the Azure Libraries for Java

The open-source Azure libraries for Java simplify provisioning, managing, and using Azure resources from Java application code.

## Important details

* The Azure libraries are how you communicate with Azure services from Java code that you run either locally or in the cloud.
* The libraries support Java 8 and later, and are tested against both the Java 8 baseline as well as the latest Java 'long-term support' release.
* The libraries include full Java module support, which means that they are fully compliant with the requirements of a Java module and export all relevant packages for use.
* The Azure SDK for Java is composed solely of many individual Java libraries that relate to specific Azure services. There are no other tools in the "SDK".
* There are distinct "management" and "client" libraries (sometimes referred to as "management plane" and "data plane" libraries). Each set serves different purposes and is used by different kinds of code. For more details, see the following sections later in this article:
  * [Connect to and use Azure resources with client libraries.](#connect-to-and-use-azure-resources-with-client-libraries)
  * [Provision and manage Azure resources with management libraries.](#provision-and-manage-azure-resources-with-management-libraries)
* Documentation for the libraries is found on the [Azure for Java Reference](https://docs.microsoft.com/java/api/overview/azure/), which is organized by Azure Service, or the [Java API browser](https://docs.microsoft.com/java/api/), which is organized by package name.

## Other details

* The Azure libraries for Java build on top of the underlying Azure REST API, allowing you to use those APIs through familiar Java paradigms. However, you can always use the REST API directly from Java code, if desired.
* You can find the [source code for the Azure libraries on GitHub](https://github.com/Azure/azure-sdk-for-java). As an open-source project, contributions are welcome!
* We're currently updating the Azure libraries for Java libraries to share common cloud patterns such as authentication protocols, logging, tracing, transport protocols, buffered responses, and retries.
  * This shared functionality is contained in the [azure-core](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core/azure-core) library.
* For details on the guidelines we apply to the libraries, see the [Java Guidelines: Introduction](https://azure.github.io/azure-sdk/java_introduction.html).

## Connect to and use Azure resources with client libraries

The client (or "data plane") libraries help you write Java application code to interact with already-provisioned services. Client libraries exist only for those services that support a client API. They can be easily identified as their Maven group ID is `com.azure`.

All Azure Java client libraries follow the same API design pattern of offering a Java builder class that is responsible for creating an instance of a client. This separates the definition and instantiation of the client from its operation, allowing the client to be immutable and thus simpler to use. On top of this, all client libraries follow a few important patterns:

* Client libraries that support both synchronous and asynchronous APIs must offer these in separate classes. This means that in these cases there would be, for example, a `KeyVaultClient` for sync APIs and a `KeyVaultAsyncClient` for async APIs.

* There is a single builder class that takes responsibility for building both the sync and async APIs. The builder will be named similarly to the sync client class, with `Builder` included. For example, `KeyVaultClientBuilder`. This builder will have `buildClient()` and `buildAsyncClient()` methods to create client instances, as appropriate.

Because of these conventions, users of the Java client libraries should feel comfortable that all classes ending in `Client` will be immutable and provide operations to interact with an Azure service. All classes that end in `ClientBuilder` will provide operations to configure and create an instance of a particular client type.

### Client libraries example

The code to create a synchronous Key Vault `KeyClient` would be similar to the following:

```java
KeyClient client = new KeyClientBuilder()
        .endpoint(<your-vault-url>)
        .credential(new DefaultAzureCredentialBuilder().build())
        .buildClient();
```

Similarly, to create an asynchronous Key Vault `KeyAsyncClient`, do the following:

```java
KeyAsyncClient client = new KeyClientBuilder()
        .endpoint(<your-vault-url>)
        .credential(new DefaultAzureCredentialBuilder().build())
        .buildAsyncClient();
```

For details on working with each client library, see the README.md file located in the library's project folder in the [SDK GitHub repository](https://github.com/Azure/azure-sdk-for-java). You can also find additional code snippets in the [reference documentation](https://docs.microsoft.com/java/api) and the [Azure Samples](https://docs.microsoft.com/samples/browse/?products=azure&languages=java).

## Provision and manage Azure resources with management libraries

The management (or "management plane") libraries, all of which can be found in the `com.azure.resourcemanager` Maven group ID, help you create, provision and otherwise manage Azure resources from Java application code. All Azure services have corresponding management libraries.

With the management libraries, you can write configuration and deployment scripts to perform the same tasks that you can through the [Azure portal](https://portal.azure.com/) or the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

All Azure Java management libraries provide a `*Manager` class as service API, for example, `ComputeManager` for Azure compute service, or `AzureResourceManager` for the aggregation of popular services. 

### Management libraries example

The code to create a `ComputeManager` would be similar to the following:

```java
ComputeManager computeManager = ComputeManager
    .authenticate(
        new DefaultAzureCredentialBuilder().build(),
        new AzureProfile(AzureEnvironment.AZURE));
```

The code to provision a new virtual machine would be similar to the following:

```java
VirtualMachine virtualMachine = computeManager.virtualMachines()
    .define(<your-virtual-machine>)
    .withRegion(Region.US_WEST)
    .withExistingResourceGroup(<your-resource-group>)
    .withNewPrimaryNetwork("10.0.0.0/28")
    .withPrimaryPrivateIPAddressDynamic()
    .withoutPrimaryPublicIPAddress()
    .withPopularLinuxImage(KnownLinuxVirtualMachineImage.UBUNTU_SERVER_18_04_LTS)
    .withRootUsername(<virtual-machine-username>)
    .withSsh(<virtual-machine-ssh-key>)
    .create();
```

The code to get an existing virtual machine would be:

```java
VirtualMachine virtualMachine = computeManager.virtualMachines()
    .getByResourceGroup(<your-resource-group>, <your-virtual-machine>);
```

The code to update the virtual machine and add a new data disk would be similar to the following:

```java
virtualMachine.update()
    .withNewDataDisk(10)
    .apply();
```

For details on working with each management library, see the README.md file located in the library's project folder in the [SDK GitHub repository](https://aka.ms/azsdk/java/mgmt). You can also find additional code snippets in the [reference documentation](https://docs.microsoft.com/java/api) and the [Azure Samples](https://docs.microsoft.com/samples/browse/?products=azure&languages=java).

## Get help and connect with the SDK team

* Visit the [Azure libraries for Java documentation](https://aka.ms/java-docs)
* Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-for-java)
* Open issues against the SDK on [GitHub](https://github.com/Azure/azure-sdk-for-java/issues)
* Mention [@AzureSDK](https://twitter.com/AzureSdk/) on Twitter

## Next steps

Now that you understand what the Azure SDK for Java is, it is time to take a deep dive into many of the cross-cutting concepts that exist to make developers productive when using the libraries. A good starting point is the documentation for the following:

* [HTTP clients & pipeline](java-sdk-http-client-pipeline.md)
* [Asynchronous programming](java-sdk-async-programming.md)
* [Pagination & iteration](java-sdk-pagination.md)
* [Long-Running operations](java-sdk-lro.md)
* [Proxying](java-sdk-proxying.md)
* [Tracing](java-sdk-tracing.md)
