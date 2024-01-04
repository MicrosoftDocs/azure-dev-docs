---
title: Configure MicroProfile with Azure Key Vault
description: Learn how to inject secrets into a MicroProfile web service with Azure Key Vault
services: key-vault
documentationcenter: java
author: KarlErickson
ms.author: jogiles
ms.date: 09/07/2018
ms.service: key-vault
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: web
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java, devx-track-javaee, devx-track-javaee-mp, devx-track-javaee-mp-aca
---

# Configure MicroProfile with Azure Key Vault

This tutorial will demonstrate how to configure a [MicroProfile](http://microprofile.io) application to retrieve secrets from [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) using the [MicroProfile Config APIs](https://microprofile.io/project/eclipse/microprofile-config) to create a direct connection to Azure Key Vault. By using the MicroProfile Config APIs, developers benefit from a standard API for retrieving and injecting configuration data into their microservices.

Before you dive in, lets quickly take a look at what a combination of Azure Key Vault and the MicroProfile Config API enables us to write in our code. Here's a code snippet of a field in a class that has been annotated with `@Inject` and `@ConfigProperty`. The `name` specified in the annotation is the name of the secret to look up in Azure Key Vault, and the `defaultValue` is what will be set if the secret isn't discovered. The end result is that the secret value stored in Azure Key Vault, or the default value, will be injected automatically into the field at runtime, simplifying the life of developers as they no longer need to pass values around in constructors and setter methods, instead leaving it to MicroProfile to handle.

```java
@Inject
@ConfigProperty(name = "key-name", defaultValue = "Unknown")
String keyValue;
```

It's also possible to access the MicroProfile config directly, to request secrets as necessary, for example:

```java
public class DemoClass {
    @Inject
    Config config;

    public void method() {
        System.out.println("Hello: " + config.getValue("key-name", String.class));
    }
}
```

This sample makes use of [Open Liberty](https://openliberty.io/) and [MicroProfile](https://microprofile.io/) to create a tiny Java war file that you can run locally on your machine. The sample also demonstrate how to containerize and run the application on Azure.

This sample also makes use of a free and open source library that creates a config source (using the MicroProfile Config API) for Azure Key Vault. You can learn more about this library, and review the code, on the [project GitHub page](https://github.com/Azure/azure-microprofile/tree/main/config-keyvault). By using this library, the code in this tutorial can focus on configuration of the library, followed by retrieving secrets stored in Azure Key Vault using the MicroProfile config, and you don't need to write any Azure-specific code.

Here are the steps required to run this code on your local machine, starting with creating an Azure Key Vault resource.

## Creating an Azure Key Vault resource

You use the Azure CLI to create the Azure Key Vault resource and populate it with two secrets.

First, sign into the Azure and set a subscription to be the current active subscription.

```azurecli
az login
az account set --subscription <subscription-id>
```

Next, create a resource group with a unique name, for example, *mp-kv-rg-ejb010424*.

```azurecli
RESOURCE_GROUP_NAME=mp-kv-rg-ejb010424
az group create \
    --name ${RESOURCE_GROUP_NAME} \
    --location eastus
```

Now create an Azure Key Vault resource with a unique name (for example, *kvejb010424*), add two secrets, and export the Key Vault uri as an environment variable.

```azurecli
KEY_VAULT_NAME=kv-ejb010424
az keyvault create \
    --name "${KEY_VAULT_NAME}" \
    --resource-group "${RESOURCE_GROUP_NAME}" \
    --location eastus

az keyvault secret set \
    --vault-name "${KEY_VAULT_NAME}" \
    --name secret \
    --value 1234
az keyvault secret set \
    --vault-name "${KEY_VAULT_NAME}" \
    --name anotherSecret \
    --value 5678

export AZURE_KEYVAULT_URL=$(az keyvault show \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --name "${KEY_VAULT_NAME}" \
  --query properties.vaultUri -o tsv)
echo $AZURE_KEYVAULT_URL
```

The environment variable `AZURE_KEYVAULT_URL` is required to config the library to work with the sample later. Keep the terminal open and you use it for running the app locally later.

That's it! You now have Key Vault running in Azure with two secrets. You can now clone the sample repo and configure it to use this resource in our app.

## Getting up and running locally

This example is based on a sample application available on GitHub, switch to the terminal you opened before and run the following commands to clone the repo and run the app locally.

```
git clone https://github.com/Azure/azure-microprofile.git
cd azure-microprofile/integration-tests/open-liberty-sample
mvn package liberty:run
```

> [!NOTE]
> The library uses [Default Azure credential](/azure/developer/java/sdk/identity-azure-hosted-auth#default-azure-credential) to authenticate in Azure.
> Since you've authenticated an account via the Azure CLI `az login` command locally, `DefaultAzureCredential` authenticates with that account to access the Azure Key Vault.

Wait until you see the similar output *The defaultServer server is ready to run a smarter planet*. Open a new terminal and run the following commands to test the sample.

```
# Get the value of secret "secret" stored in the Azure key vault. You should see 1234 in the response.
echo $(curl -s http://localhost:9080/config/value/secret -X GET)

# Get the value of secret "anotherSecret" stored in the Azure key vault. You should see 5678 in the response.
echo $(curl -s http://localhost:9080/config/value/anotherSecret -X GET)

# Get the names of secrets stored in the Azure key vault. You should see ["anotherSecret","secret"] in the response.
echo $(curl -s http://localhost:9080/config/propertyNames -X GET)

# Get the name-value paris of secrets stored in the Azure key vault. You should see {"anotherSecret":"5678","secret":"1234"} in the response.
echo $(curl -s http://localhost:9080/config/properties -X GET)
```

You should see the expected outputs described above. Switch back to the terminal where the app is running, press <kbd>Ctrl</kbd> + <kbd>C</kbd> to stop the app.

