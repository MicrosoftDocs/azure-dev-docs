---
title: Configure MicroProfile with Azure Key Vault
description: Learn how to inject secrets into a MicroProfile web service with Azure Key Vault
author: KarlErickson
ms.author: jialuogan
ms.date: 10/09/2024
ms.topic: article
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java, devx-track-javaee, devx-track-javaee-mp, devx-track-javaee-mp-aca
---

# Configure MicroProfile with Azure Key Vault

This tutorial demonstrates how to configure a [MicroProfile](http://microprofile.io) application to retrieve secrets from [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) using the [MicroProfile Config APIs](https://microprofile.io/project/eclipse/microprofile-config). Developers benefit from the open standard MicroProfile Config API for retrieving and injecting configuration data into their microservices.

## Prerequisites

- An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/) or sign up for a [free account](https://azure.microsoft.com/free/).

- Azure CLI for Unix-like environments. This article requires only the Bash variant of Azure CLI.

    - [!INCLUDE [azure-cli-login](../../includes/azure-cli-login.md)]

    - This article requires at least version 2.61.0 of Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.

- Azure Cloud Shell has all of these prerequisites preinstalled. For more, see [Quickstart for Azure Cloud Shell](/azure/cloud-shell/quickstart).

- If you're running the commands in this guide locally (instead of using Azure Cloud Shell), complete the following steps:

    - Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, or Windows Subsystem for Linux).

    - Install a Java SE implementation version 17 or later (for example, [Microsoft build of OpenJDK](/java/openjdk)).

    - Install [Maven](https://maven.apache.org/download.cgi) 3.9.8 or higher.

    - Install [cURL](https://curl.se/download.html).

## Connecting MicroProfile Config with Azure Key Vault

Let's take a quick look at power of combining Azure Key Vault and the MicroProfile Config API. Here's a code snippet of a field in a class that is annotated with `@Inject` and `@ConfigProperty`. The `name` specified in the annotation is the name of the secret to look up in Azure Key Vault, and the `defaultValue` is used if the secret isn't discovered. The secret value stored in Azure Key Vault, or the default value if no such secret exists, is injected automatically into the field at runtime. Injecting property values in this way provides numerous benefits. For example, you no longer need to pass values around in constructors and setter methods, and the configuration is externalized from the code. One of the most powerful benefits is having separate sets of values for dev, test, and prod environments.

```java
   @Inject
   @ConfigProperty(name = "key-name", defaultValue = "Unknown")
   String keyValue;
```

It's also possible to access the MicroProfile config imperatively, as shown in the following example:

```java
   public class DemoClass {
       @Inject
       Config config;

       public void method() {
           System.out.println("Hello: " + config.getValue("key-name", String.class));
       }
   }
```

This sample uses the [Open Liberty](https://openliberty.io/) implementation of [MicroProfile](https://microprofile.io/). For a complete list of compatible implementations, see [MicroProfile Compatible Implementations](https://microprofile.io/compatible/). The sample also demonstrates how to containerize and run the application on Azure.

This sample uses the low-friction Azure extension for MicroProfile Key Vault Custom ConfigSource library. For more information about this library, see [the library README](https://github.com/Azure/azure-microprofile/blob/main/config-keyvault/README.md).

Here are the steps required to run this code on your local machine, starting with creating an Azure Key Vault resource.

## Create an Azure Key Vault resource

You use the Azure CLI to create the Azure Key Vault resource and populate it with two secrets. First, sign into the Azure and set a subscription to be the current active subscription.

```azurecli
   az login
   az account set --subscription <subscription-id>
```

Next, create a resource group with a unique name, for example, **mp-kv-rg-ejb010424**.

```azurecli
   export RESOURCE_GROUP_NAME=mp-kv-rg-ejb010424
   az group create \
       --name ${RESOURCE_GROUP_NAME} \
       --location eastus
```

Now create an Azure Key Vault resource with a unique name (for example, **kvejb010424**), add two secrets, and export the Key Vault uri as an environment variable.

```azurecli
   export KEY_VAULT_NAME=kv-ejb010424
   az keyvault create \
       --resource-group "${RESOURCE_GROUP_NAME}" \
       --name "${KEY_VAULT_NAME}" \
       --location eastus \
       --enable-rbac-authorization false

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
       --query properties.vaultUri \
       --output tsv)
   echo $AZURE_KEYVAULT_URL
```

The environment variable `AZURE_KEYVAULT_URL` is required to configure the library to work with the sample later. Keep the terminal open and use it for running the app locally later.

That's it! You now have Key Vault running in Azure with two secrets. You can now clone the sample repo and configure it to use this resource in your app.

## Get up and running locally

This example is based on a sample application available on GitHub. Switch to the terminal you opened before and run the following commands to clone the repo and run the app locally:

```azurecli
   git clone https://github.com/Azure/azure-microprofile.git
   cd azure-microprofile
   git checkout 1.0.0-beta.3
   cd integration-tests/open-liberty-sample
   mvn clean package liberty:run
```

If you see a message about `You are in 'detached HEAD' state`, this message is safe to ignore.

> [!NOTE]
> The library uses [Default Azure credential](/azure/developer/java/sdk/identity-azure-hosted-auth#default-azure-credential) to authenticate in Azure.
>
> Since you've authenticated an account via the Azure CLI `az login` command locally, `DefaultAzureCredential` authenticates with that account to access the Azure Key Vault.

Wait until you see output similar to `The defaultServer server is ready to run a smarter planet`. Open a new terminal and use the following commands to test the sample:

```azurecli
   # Get the value of secret "secret" stored in the Azure key vault. You should see 1234 in the response.
   echo $(curl -s http://localhost:9080/config/value/secret -X GET)

   # Get the value of secret "anotherSecret" stored in the Azure key vault. You should see 5678 in the response.
   echo $(curl -s http://localhost:9080/config/value/anotherSecret -X GET)

   # Get the names of secrets stored in the Azure key vault. You should see ["anotherSecret","secret"] in the response.
   echo $(curl -s http://localhost:9080/config/propertyNames -X GET)

   # Get the name-value paris of secrets stored in the Azure key vault. You should see {"anotherSecret":"5678","secret":"1234"} in the response.
   echo $(curl -s http://localhost:9080/config/properties -X GET)
```

You should see the expected outputs described in the comments. Switch back to the terminal where the app is running. To stop the app, press <kbd>Ctrl</kbd> + <kbd>C</kbd>.

## Examine the sample app

Let's gain a deeper understanding of how MicroProfile Config works in general, and the MicroProfile Key Vault Custom ConfigSource library works in particular.

### Library dependency

Include MicroProfile Key Vault Custom ConfigSource in your app with the following Maven dependency:

```xml
   <dependency>
     <groupId>com.azure.microprofile</groupId>
     <artifactId>azure-microprofile-config-keyvault</artifactId>
   </dependency>
```

### Connecting to Azure Key Vault

The `azure-microprofile-config-keyvault` library connects your app to Azure Key Vault without introducing any direct dependencies on Azure APIs. The library provides an implementation of the MicroProfile Config specification [ConfigSource](https://download.eclipse.org/microprofile/microprofile-config-3.1/apidocs/org/eclipse/microprofile/config/spi/ConfigSource.html) interface that knows how to read from Azure Key Vault. The remainder of the implementation of MicroProfile Config is provided by the Open Liberty runtime. For a link to the specification, see [Next steps](#next-steps).

The library defines the `azure.keyvault.url` configuration property to bind your app to a specific key vault. The MicroProfile Config specification defines the "Environment Variables Mapping Rules" for how the value for a config property, such as `azure.keyvault.url`, is discovered at runtime. One of these rules states that properties are converted to environment variables. The property `azure.keyvault.url` causes the environment variable `AZURE_KEYVAULT_URL` to be consulted.

### Key classes in the sample app

Let's examine the REST resource the preceding cURL commands have been calling. This REST resource is defined in the class `ConfigResource.java` in the `integration-tests/open-liberty-sample` project.

```java
   @Path("/config")
   public class ConfigResource {

       @Inject
       private Config config;

       @GET
       @Produces(MediaType.TEXT_PLAIN)
       @Path("/value/{name}")
       public String getConfigValue(@PathParam("name") String name) {
           return config.getConfigValue(name).getValue();
       }

       @GET
       @Produces(MediaType.APPLICATION_JSON)
       @Path("/propertyNames")
       public Set<String> getConfigPropertyNames() {
           ConfigSource configSource = getConfigSource(AzureKeyVaultConfigSource.class.getSimpleName());
           return configSource.getPropertyNames();
       }

       @GET
       @Produces(MediaType.APPLICATION_JSON)
       @Path("/properties")
       public Map<String, String> getConfigProperties() {
           ConfigSource configSource = getConfigSource(AzureKeyVaultConfigSource.class.getSimpleName());
           return configSource.getProperties();
       }

       private ConfigSource getConfigSource(String name) {
           return StreamSupport.stream(config.getConfigSources().spliterator(), false)
                   .filter(source -> source.getName().equals(name))
                   .findFirst()
                   .orElseThrow(() -> new RuntimeException("ConfigSource not found: " + name));
       }
   }
```

The `getConfigValue()` method uses the injected `Config` implementation to look up a value from the application configuration sources. Any value lookups on the `Config` implementation are found through the search algorithm defined by the MicroProfile Config specification. The `azure-microprofile-config-keyvault` library adds Azure Key Vault as a configuration source.

The `getConfigSource()` method avoids the search algorithm and goes straight to the `AzureKeyVaultConfigSource` to resolve properties. This method is used by the `getConfigPropertyNames()` and `getConfigProperties()` methods.

## Run on Azure Container Apps

In this section, you containerize the app, configure a user-assigned managed identity to access the Azure Key Vault, and deploy the containerized app on Azure Container Apps.

Switch back to the terminal where you ran the app locally, and use it throughout this section.

### Set up an Azure Container Registry

You use the Azure Container Registry to containerize the app and store the app image.

First, create an Azure Container Registry with a unique name, for example, **acrejb010424**.

```azurecli
   export ACR_NAME=acrejb010424
   az acr create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name $ACR_NAME \
       --sku Basic
```

Wait a few minutes after this command returns before continuing.

### Containerize the app

Next, containerize the app and push the app image to your Azure Container Registry. Make sure you're in the path of the sample app, for example, **azure-microprofile/integration-tests/open-liberty-sample**.

```azurecli
   az acr build \
       --registry ${ACR_NAME} \
       --image open-liberty-mp-azure-keyvault:latest \
       .
```

You should see build output that concludes with a message similar to `Run ID: ca1 was successful after 1m28s`. If you don't see a similar message, troubleshoot and resolve the problem before continuing.

Use the following commands to retrieve connection information required for accessing the image when you deploy the app on Azure Container Apps later.

```azurecli
   export ACR_LOGIN_SERVER=$(az acr show \
       --name $ACR_NAME \
       --query 'loginServer' \
       --output tsv)
```

### Set up a user-assigned managed identity

As stated earlier, the library uses [Default Azure credential](/azure/developer/java/sdk/identity-azure-hosted-auth#default-azure-credential) to authenticate in Azure. When you deploy the app to Azure Container Apps, you set the environment variable `AZURE_CLIENT_ID` to configure [DefaultAzureCredential](/azure/developer/java/sdk/identity-azure-hosted-auth#configure-defaultazurecredential) to authenticate as a user-defined managed identity, which has permissions to access the Azure Key Vault and is assigned to Azure Container Apps later.

First, use the following commands to create a user-assigned managed identity with a unique name, for example, **uamiejb010424**. For more information, see [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azcli#create-a-user-assigned-managed-identity-1).

```azurecli
   export USER_ASSIGNED_IDENTITY_NAME=uamiejb010424
   az identity create \
       --resource-group ${RESOURCE_GROUP_NAME} \
       --name ${USER_ASSIGNED_IDENTITY_NAME}
```

Next, use the following commands to grant it permissions to get and list secrets from the Azure Key Vault. For more information, see [Assign the access policy](/azure/key-vault/general/assign-access-policy?tabs=azure-cli#assign-the-access-policy).

```azurecli
   export USER_ASSIGNED_IDENTITY_OBJECT_ID="$(az identity show \
       --resource-group "${RESOURCE_GROUP_NAME}" \
       --name "${USER_ASSIGNED_IDENTITY_NAME}" \
       --query 'principalId' \
       --output tsv)"

   az keyvault set-policy --name "${KEY_VAULT_NAME}" \
       --resource-group "${RESOURCE_GROUP_NAME}" \
       --secret-permissions get list \
       --object-id "${USER_ASSIGNED_IDENTITY_OBJECT_ID}"
```

The output must contain the following JSON in order to be considered successful:

```json
   "permissions": {
     "certificates": null,
     "keys": null,
     "secrets": [
       "list",
       "get"
     ],
     "storage": null
   }
```

If the output doesn't contain this JSON, troubleshoot and resolve the problem before continuing.

Then, use the following commands to retrieve the ID and client ID of the user-assigned managed identity so you can assign it to your Azure Container Apps later for accessing the Azure Key Vault:

```azurecli
   export USER_ASSIGNED_IDENTITY_ID="$(az identity show \
       --resource-group "${RESOURCE_GROUP_NAME}" \
       --name "${USER_ASSIGNED_IDENTITY_NAME}" \
       --query 'id' \
       --output tsv)"
   export USER_ASSIGNED_IDENTITY_CLIENT_ID="$(az identity show \
       --name "${USER_ASSIGNED_IDENTITY_NAME}" \
       --resource-group "${RESOURCE_GROUP_NAME}" \
       --query 'clientId' \
       --output tsv)"
   echo $USER_ASSIGNED_IDENTITY_ID
   echo $USER_ASSIGNED_IDENTITY_CLIENT_ID
```

### Deploy the app on Azure Container Apps

You containerized the app and configured a user-assigned managed identity to access the Azure Key Vault. Now you can deploy the containerized app on Azure Container Apps.

First, create an environment for Azure Container Apps. An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace. Use the [az containerapp env create](/cli/azure/containerapp/env#az-containerapp-env-create) command to create an environment with a unique name (for example, **acaenvejb010424**), as shown in the following example:

```azurecli
   export ACA_ENV=acaenvejb010424
   az containerapp env create \
       --resource-group $RESOURCE_GROUP_NAME \
       --location eastus \
       --name $ACA_ENV
```

Next, use the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command to create a Container Apps instance with a unique name (for example, **acaappejb010424**) to run the app after pulling the image from the Container Registry, as shown in the following example:

```azurecli
   export ACA_NAME=acaappejb010424
   az containerapp create \
       --resource-group ${RESOURCE_GROUP_NAME} \
       --name ${ACA_NAME} \
       --environment ${ACA_ENV} \
       --image ${ACR_LOGIN_SERVER}/open-liberty-mp-azure-keyvault:latest  \
       --registry-server $ACR_LOGIN_SERVER \
       --registry-identity system \
       --user-assigned ${USER_ASSIGNED_IDENTITY_ID} \
       --env-vars \
           AZURE_CLIENT_ID=${USER_ASSIGNED_IDENTITY_CLIENT_ID} \
           AZURE_KEYVAULT_URL=${AZURE_KEYVAULT_URL} \
       --target-port 9080 \
       --ingress 'external'
```

> [!NOTE]
> You assign the user-assigned managed identity to the Container Apps instance with the parameter `--user-assigned ${USER_ASSIGNED_IDENTITY_ID}`.
>
> The Container Apps instance can access the Azure Key Vault with two environment variables provided in the parameters `--env-vars AZURE_CLIENT_ID=${USER_ASSIGNED_IDENTITY_CLIENT_ID} AZURE_KEYVAULT_URL=${AZURE_KEYVAULT_URL}`. Remember, the `AZURE_KEYVAULT_URL` environment variable is consulted due to the Environment Variables Mapping Rules defined by the MicroProfile Config specification.

Then, retrieve a fully qualified url to access the app by using the following command:

```azurecli
   export APP_URL=https://$(az containerapp show \
       --resource-group ${RESOURCE_GROUP_NAME} \
       --name ${ACA_NAME} \
       --query properties.configuration.ingress.fqdn \
       --output tsv)
```

Finally, run the following commands again to test the sample running on the Container Apps instance:

```azurecli
   # Get the value of secret "secret" stored in the Azure key vault. You should see 1234 in the response.
   echo $(curl -s ${APP_URL}/config/value/secret -X GET)

   # Get the value of secret "anotherSecret" stored in the Azure key vault. You should see 5678 in the response.
   echo $(curl -s  ${APP_URL}/config/value/anotherSecret -X GET)

   # Get the names of secrets stored in the Azure key vault. You should see ["anotherSecret","secret"] in the response.
   echo $(curl -s  ${APP_URL}/config/propertyNames -X GET)

   # Get the name-value paris of secrets stored in the Azure key vault. You should see {"anotherSecret":"5678","secret":"1234"} in the response.
   echo $(curl -s  ${APP_URL}/config/properties -X GET)
```

You should see the expected outputs described in the comments. If you don't see them, the app could still be starting up. Wait for a while and try again.

## Clean up resources

To avoid Azure charges, you should clean up unneeded resources. When the resources are no longer needed, run the following commands to clean up the resources.

```azurecli
   az keyvault delete \
       --resource-group "${RESOURCE_GROUP_NAME}" \
       --name "${KEY_VAULT_NAME}"

   az keyvault purge \
       --name "${KEY_VAULT_NAME}" \
       --no-wait

   az group delete \
       --name ${RESOURCE_GROUP_NAME} \
       --yes \
       --no-wait
```

## Next steps

You can learn more from the following references:

- [Azure Container Apps](https://azure.microsoft.com/products/container-apps)
- [Jakarta EE on Azure](/azure/developer/java/ee)
- [Azure Extensions for MicroProfile](https://github.com/Azure/azure-microprofile)
- [MicroProfile](http://microprofile.io)
- [MicroProfile Config Specification](https://download.eclipse.org/microprofile/microprofile-config-3.1/microprofile-config-spec-3.1.html)
- [MicroProfile Config APIs](https://microprofile.io/specifications/microprofile-config/)
- [Open Liberty](https://openliberty.io/)
- [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
- [Liberty Maven Plugin](https://github.com/OpenLiberty/ci.maven#liberty-maven-plugin)
- [Open Liberty Container Images](https://github.com/OpenLiberty/ci.docker)
