---
title: Use the Azure SDK for Java
description: Overview of the features and capabilities of the Azure SDK for Java that help you be more productive when provisioning, using, and managing Azure resources.
ms.date: 04/02/2025
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
---

# Use the Azure SDK for Java

The open-source Azure SDK for Java simplifies provisioning, managing, and using Azure resources from Java application code.

## Important details

* The Azure libraries are how you communicate with Azure services from Java code that you run either locally or in the cloud.
* The libraries support Java 8 and later, and are tested against both the Java 8 baseline and the latest Java 'long-term support' release.
* The libraries include full Java module support, which means that they're fully compliant with the requirements of a Java module and export all relevant packages for use.
* The Azure SDK for Java is composed solely of many individual Java libraries that relate to specific Azure services. There are no other tools in the "SDK".
* There are distinct "management" and "client" libraries (sometimes referred to as "management plane" and "data plane" libraries). Each set serves different purposes and is used by different kinds of code. For more information, see the following sections later in this article:
  * [Connect to and use Azure resources with client libraries.](#connect-to-and-use-azure-resources-with-client-libraries)
  * [Provision and manage Azure resources with management libraries.](#provision-and-manage-azure-resources-with-management-libraries)
* You can find documentation for the libraries in the [Azure for Java Reference](/java/api/overview/azure/) organized by Azure Service, or the [Java API browser](/java/api/) organized by package name.

## Other details

* The Azure SDK for Java libraries build on top of the underlying Azure REST API, allowing you to use those APIs through familiar Java paradigms. However, you can always use the REST API directly from Java code, if you prefer.
* You can find the source code for the Azure libraries in the [GitHub repository](https://github.com/Azure/azure-sdk-for-java). As an open-source project, contributions are welcome!
* We're currently updating the Azure SDK for Java libraries to share common cloud patterns such as authentication protocols, logging, tracing, transport protocols, buffered responses, and retries.
  * This shared functionality is contained in the [azure-core](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core/azure-core) library.
* For more information on the guidelines we apply to the libraries, see the [Java Azure SDK Design Guidelines](https://azure.github.io/azure-sdk/java_introduction.html).

## Supported platforms for Azure SDK for Java

The Azure SDK for Java ships with support for Java 8 and later, but we recommend that developers always use the latest Java long-term support (LTS) release in development and when releasing to production. Using the latest LTS release ensures the availability of the latest improvements within Java, including bug fixes, performance improvements, and security fixes. Also, the Azure SDK for Java includes additional support for later releases of Java. This additional support improves performance and includes JDK-specific enhancements beyond the supported Java 8 baseline.

The Azure SDK for Java is tested and supported on Windows, Linux, and macOS. It is not tested on other platforms that the JDK supports, and does not support Android deployments. For developers wanting to develop software for deployment on Android devices and which make use of Azure services, there are Android-specific libraries available in the [Azure SDK for Android](https://github.com/Azure/azure-sdk-for-android) project.

## Connect to and use Azure resources with client libraries

The client (or "data plane") libraries help you write Java application code to interact with already-provisioned services. Client libraries exist only for those services that support a client API. You can identify them because their Maven group ID is `com.azure`.

All Azure Java client libraries follow the same API design pattern of offering a Java builder class that's responsible for creating an instance of a client. This pattern separates the definition and instantiation of the client from its operation, allowing the client to be immutable and therefore easier to use. Additionally, all client libraries follow a few important patterns:

* Client libraries that support both synchronous and asynchronous APIs must offer these APIs in separate classes. What this means is that in these cases there would be, for example, a `KeyVaultClient` for sync APIs and a `KeyVaultAsyncClient` for async APIs.

* There's a single builder class that takes responsibility for building both the sync and async APIs. The builder is named similarly to the sync client class, with `Builder` included. For example, `KeyVaultClientBuilder`. This builder has `buildClient()` and `buildAsyncClient()` methods to create client instances, as appropriate.

Because of these conventions, all classes ending in `Client` are immutable and provide operations to interact with an Azure service. All classes that end in `ClientBuilder` provide operations to configure and create an instance of a particular client type.

### Client libraries example

The following code example shows how to create a synchronous Key Vault `KeyClient`:

```java
KeyClient client = new KeyClientBuilder()
        .endpoint(<your Key Vault URL>)
        .credential(new DefaultAzureCredentialBuilder().build())
        .buildClient();
```

The following code example shows how to create an asynchronous Key Vault `KeyAsyncClient`:

```java
KeyAsyncClient client = new KeyClientBuilder()
        .endpoint(<your Key Vault URL>)
        .credential(new DefaultAzureCredentialBuilder().build())
        .buildAsyncClient();
```

For more information on working with each client library, see the **README.md** file located in the library's project directory in the [SDK GitHub repository](https://github.com/Azure/azure-sdk-for-java). You can also find more code snippets in the [reference documentation](/java/api) and the [Azure Samples](/samples/browse/?products=azure&languages=java).

## Provision and manage Azure resources with management libraries

The management (or "management plane") libraries help you create, provision and otherwise manage Azure resources from Java application code. You can find these libraries in the `com.azure.resourcemanager` Maven group ID. All Azure services have corresponding management libraries.

With the management libraries, you can write configuration and deployment scripts to perform the same tasks that you can through the [Azure portal](https://portal.azure.com/) or the [Azure CLI](/cli/azure/install-azure-cli).

All Azure Java management libraries provide a `*Manager` class as service API, for example, `ComputeManager` for Azure compute service, or `AzureResourceManager` for the aggregation of popular services.

### Management libraries example

The following code example shows how to create a `ComputeManager`:

```java
ComputeManager computeManager = ComputeManager
    .authenticate(
        new DefaultAzureCredentialBuilder().build(),
        new AzureProfile(AzureEnvironment.AZURE));
```

The following code example shows how to provision a new virtual machine:

```java
VirtualMachine virtualMachine = computeManager.virtualMachines()
    .define(<your virtual machine>)
    .withRegion(Region.US_WEST)
    .withExistingResourceGroup(<your resource group>)
    .withNewPrimaryNetwork("10.0.0.0/28")
    .withPrimaryPrivateIPAddressDynamic()
    .withoutPrimaryPublicIPAddress()
    .withPopularLinuxImage(KnownLinuxVirtualMachineImage.UBUNTU_SERVER_18_04_LTS)
    .withRootUsername(<virtual-machine username>)
    .withSsh(<virtual-machine SSH key>)
    .create();
```

The following code example shows how to get an existing virtual machine:

```java
VirtualMachine virtualMachine = computeManager.virtualMachines()
    .getByResourceGroup(<your resource group>, <your virtual machine>);
```

The following code example shows how to update the virtual machine and add a new data disk:

```java
virtualMachine.update()
    .withNewDataDisk(10)
    .apply();
```

For more information on working with each management library, see the **README.md** file located in the library's project directory in the [SDK GitHub repository](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/resourcemanager#readme). You can also find more code snippets in the [reference documentation](/java/api) and the [Azure Samples](/samples/browse/?products=azure&languages=java).

## Get help and connect with the SDK team

* Visit the [Azure SDK for Java documentation](https://azure.github.io/azure-sdk-for-java/).
* Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-for-java).
* Open issues against the SDK in the [GitHub repository](https://github.com/Azure/azure-sdk-for-java/issues).
* Mention [@AzureSDK](https://twitter.com/AzureSdk/) on Twitter.

## Next steps

Now that you understand what the Azure SDK for Java is, you can take a deep dive into many of the cross-cutting concepts that exist to make you productive when using the libraries. The following articles provide good starting points:

* [HTTP clients and pipelines](http-client-pipeline.md)
* [Asynchronous programming](async-programming.md)
* [Pagination and iteration](pagination.md)
* [Long-running operations](lro.md)
* [Configure proxies](proxying.md)
* [Configure tracing](tracing.md)
