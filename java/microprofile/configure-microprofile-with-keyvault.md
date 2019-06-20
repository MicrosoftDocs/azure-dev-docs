---
title: Configure MicroProfile with Azure Key Vault
description: Learn how to inject secrets into a MicroProfile web service with Azure Key Vault
services: key-vault
documentationcenter: java
author: jonathangiles
manager: routlaw
editor: jonathangiles

ms.assetid:
ms.author: jogiles
ms.date: 09/07/2018
ms.devlang: java
ms.service: key-vault
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: web
---

# Configure MicroProfile with Azure Key Vault

This tutorial will demonstrate how to configure a [MicroProfile](http://microprofile.io) application to retrieve secrets from [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) using the [MicroProfile Config APIs](https://microprofile.io/project/eclipse/microprofile-config) to create a direct connection to Azure Key Vault. By using the MicroProfile Config APIs, developers benefit from a standard API for retrieving and injecting configuration data into their microservices.

Before we dive in, lets quickly take a look at what a combination of Azure Key Vault and the MicroProfile Config API enables us to write in our code. Here's a code snippet of a field in a class that has been annotated with `@Inject` and `@ConfigProperty`. The `name` specified in the annotation is the name of the property to look up in Azure Key Vault, and the `defaultValue` is what will be set if the key is not discovered. The end result is that the value stored in Azure Key Vault, or the default value, will be injected automatically into the field at runtime, simplifying the life of developers as they no longer need to pass values around in constuctors and setter methods, instead leaving it to MicroProfile to handle.

```java
@Inject
@ConfigProperty(name = "key-name", defaultValue = "Unknown")
String keyValue;
```

It is also possible to access the MicroProfile config directly, to request secrets as necessary, e.g.:

```java
public class DemoClass {
    @Inject
    Config config;

    public void method() {
        System.out.println("Hello: " + config.getValue("key-name", String.class));
    }
}
```

This sample makes use of [Payara Micro](https://www.payara.fish/payara_micro) and [MicroProfile](https://microprofile.io/) to create a tiny Java war file that can be run locally on your machine. It does not demonstrate how to dockerise or push the code to Azure, but the links section at the end of this tutorial has links to other useful tutorials that explain this.

This sample makes use of a free and open source library that creats a config source (using the MicroProfile Config API) for Azure Key Vault. You can learn more about this library, and review the code, on the [project GitHub page](https://github.com/Azure/azure-microprofile/tree/master/microprofile-config-keyvault). By using this library, the code in this tutorial can simply focus on configuration of the library, followed by injecting keys into your code, and we don't need to write any Azure-specific code.

Here are the steps required to run this code on your local machine, starting with creating an Azure Key Vault resource.

## Creating an Azure Key Vault resource

We will use the Azure CLI to create the Azure Key Vault resource and populate it with one secret.

1. Firstly, lets create an Azure service principal. This will provide us with the client ID and key we need to access Key Vault:

```bash
az login
az account set --subscription <subscription_id>

az ad sp create-for-rbac --name <service_principal_name>
```

Lets say we use `microprofile-keyvault-service-principal` for the service principal name in the previous step. The response from Azure for doing this will be in the following, slightly censored, form:

```json
{
  "appId": "5292398e-XXXX-40ce-XXXX-d49fXXXX9e79",
  "displayName": "microprofile-keyvault-service-principal",
  "name": "http://microprofile-keyvault-service-principal",
  "password": "9b217777-XXXX-4954-XXXX-deafXXXX790a",
  "tenant": "72f988bf-XXXX-41af-XXXX-2d7cd011db47"
}
```

Of particular note here is the `appID` and `password` values - these are what we will use later on as `client ID` and `key`, respectively.

Now that we have created a service principal, we can optionally create a resource group (if you already have one you want to use, you can skip this step). Note that to get a list of resource group locations, you can call `az account list-locations` and use the `name` value from that list to specify where the resource group should be created.

```bash
# For this tutorial, the author chose to use `westus`
# and `jg-test` for the resource group name.
az group create -l <resource_group_location> -n <resource_group_name>
```

We now create an Azure Key Vault resource. Note that the Key Vault name is what you will use to reference the key vault later, so choose something memorable.

```bash
az keyvault create --name <your_keyvault_name>            \
                   --resource-group <your_resource_group> \
                   --location <location>                  \
                   --enabled-for-deployment true          \
                   --enabled-for-disk-encryption true     \
                   --enabled-for-template-deployment true \
                   --sku standard
```

We also need to grant the appropriate permissions to the service principal we created earlier, so that it may access the Key Vault secrets. Note that the appID value is the `appId` value from above where we created the service principal (that is, `5292398e-XXXX-40ce-XXXX-d49fXXXX9e79` - but use the value from your terminal output).

```bash
az keyvault set-policy --name <your_keyvault_name>   \
                       --secret-permission get list  \
                       --spn <your_sp_appId_created_in_step1>
```

We are now at the point where we can push a secret into Key Vault. Lets use the key name `demo-key`, and set the value of the key to be `demo-value`:

```bash
az keyvault secret set --name demo-key      \
                       --value demo-value   \
                       --vault-name <your_keyvault_name>  
```

That's it! We now have Key Vault running in Azure with a single secret. We can now clone this repo and configure it to use this resource in our app.

## Getting up and running locally

This example is based on a sample application available on GitHub, so we will clone that and then step through the code. Follow the steps below to get the code cloned onto your machine:

1. `git clone https://github.com/Azure-Samples/microprofile-configsource-keyvault.git`

1. `cd microprofile-configsource-keyvault`

1. Navigate to `src/main/resources/META-INF/microprofile-config.properties` and change the properties in microprofile-config.properties file with details from above.

1. Try running the server using `mvn clean package payara-micro:start`

1. Try accessing [http://localhost:8080/keyvault-configsource/api/config](http://localhost:8080/keyvault-configsource/api/config) in your web browser - you should see a simple response that demonstrates values being read from Azure Key Vault.

## Summary

This sample application bakes together the MicroProfile Config API, Azure Key Vault, and the free and open source [microprofile-config-keyvault](https://github.com/Azure/azure-microprofile/tree/master/microprofile-config-keyvault) library to enable easy injection of configuration data and secrets into our MicroProfile web services.
