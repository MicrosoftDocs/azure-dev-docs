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

This tutorial will demonstrate how to configure a [MicroProfile](http://microprofile.io) application to retrieve secrets from [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) using the [MicroProfile Config APIs](https://microprofile.io/project/eclipse/microprofile-config) to create a direct connection to Azure Key Vault. Developers benefit from a standard API for retrieving and injecting configuration data into their microservices by using the MicroProfile Config APIs.

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

This sample makes use of [Open Liberty](https://openliberty.io/) and [MicroProfile](https://microprofile.io/) to create a tiny Java war file that you can run locally on your machine. The sample also demonstrates how to containerize and run the application on Azure.

This sample also makes use of a free and open source library that creates a config source (using the MicroProfile Config API) for Azure Key Vault. You can learn more about this library, and review the code, on the [project GitHub page](https://github.com/Azure/azure-microprofile/tree/main/config-keyvault). You can focus on configuration of the library and retrieving secrets stored in Azure Key Vault by using this library, and you don't need to write any Azure-specific code.

Here are the steps required to run this code on your local machine, starting with creating an Azure Key Vault resource.

## Creating an Azure Key Vault resource

You use the Azure CLI to create the Azure Key Vault resource and populate it with two secrets.

First, sign into the Azure and set a subscription to be the current active subscription.

```azurecli-interactive
az login
az account set --subscription <subscription-id>
```

Next, create a resource group with a unique name, for example, *mp-kv-rg-ejb010424*.

```azurecli-interactive
RESOURCE_GROUP_NAME=mp-kv-rg-ejb010424
az group create \
    --name ${RESOURCE_GROUP_NAME} \
    --location eastus
```

Now create an Azure Key Vault resource with a unique name (for example, *kvejb010424*), add two secrets, and export the Key Vault uri as an environment variable.

```azurecli-interactive
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

```azurecli-interactive
git clone https://github.com/Azure/azure-microprofile.git
cd azure-microprofile/integration-tests/open-liberty-sample
mvn package liberty:run
```

> [!NOTE]
> The library uses [Default Azure credential](/azure/developer/java/sdk/identity-azure-hosted-auth#default-azure-credential) to authenticate in Azure.
> Since you've authenticated an account via the Azure CLI `az login` command locally, `DefaultAzureCredential` authenticates with that account to access the Azure Key Vault.

Wait until you see the similar output **The defaultServer server is ready to run a smarter planet**. Open a new terminal and run the following commands to test the sample.

```azurecli-interactive
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

## Running on Azure Container Apps

In this section, you containerize the app, configure a user-assigned managed identity to access the Azure Key Vault, and deploy the containerized app on Azure Container Apps.

### Setting up an Azure Container Registry

You use the Azure Container Registry to containerize the app and store the app image. Switch back to the termial where you ran the app locally.

First, create an Azure Container Registry with a unique name, for example, *acrejb010424*.

```azurecli-interactive
ACR_NAME=acrejb010424
az acr create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $ACR_NAME \
    --sku Basic \
    --admin-enabled
```

Next, containerize the app and push the app image to your Azure Azure Container Registry. Make sure you're in the path of the sample app, for example, *azure-microprofile/integration-tests/open-liberty-sample*.

```azurecli-interactive
az acr build \
    --registry ${ACR_NAME} \
    --image open-liberty-mp-azure-keyvault:latest \
    .
```

Then, retrieve connection information that is required for accessing the image when you deploy the app on Azure Container Apps later.

```azurecli-interactive
ACR_LOGIN_SERVER=$(az acr show \
    --name $ACR_NAME \
    --query 'loginServer' \
    --output tsv)
ACR_USER_NAME=$(az acr credential show \
    --name $ACR_NAME \
    --query 'username' \
    --output tsv)
ACR_PASSWORD=$(az acr credential show \
    --name $ACR_NAME \
    --query 'passwords[0].value' \
    --output tsv)
```

### Setting up an user-assigned managed identity

As you notice before, the library uses [Default Azure credential](/azure/developer/java/sdk/identity-azure-hosted-auth#default-azure-credential) to authenticate in Azure. When you deploy the app to Azure Container Apps, you set environment variable `AZURE_CLIENT_ID` to configure [DefaultAzureCredential](/azure/developer/java/sdk/identity-azure-hosted-auth#configure-defaultazurecredential) to authenticate as a user-defined managed identity, which has required permissions to access the Azure Key Vault and is assigned to Azure Container Apps later.

First, create an user-assigned managed identity with a unique name, for example, *uamiejb010424*. See [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azcli#create-a-user-assigned-managed-identity-1) for more information.

```azurecli-interactive
USER_ASSIGNED_IDENTITY_NAME=uamiejb010424
az identity create \
    -g ${RESOURCE_GROUP_NAME} \
    -n ${USER_ASSIGNED_IDENTITY_NAME}
```

Next, grant it permissions to get and list secrets from the Azure Key Vault. See [Assign the access policy](/azure/key-vault/general/assign-access-policy?tabs=azure-cli#assign-the-access-policy) for more information.

```azurecli-interactive
USER_ASSIGNED_IDENTITY_OBJECT_ID="$(az identity show \
    --name "${USER_ASSIGNED_IDENTITY_NAME}" \
    --resource-group "${RESOURCE_GROUP_NAME}" \
    --query 'principalId' -o tsv)"

az keyvault set-policy --name "${KEY_VAULT_NAME}" \
    --resource-group "${RESOURCE_GROUP_NAME}" \
    --secret-permissions get list \
    --object-id "${USER_ASSIGNED_IDENTITY_OBJECT_ID}"
```

Then, retrieve id and client id of the user-assigned managed identity so you can assign it to your Azure Container Apps later for acccessing the Azure Key Vault.

```azurecli-interactive
USER_ASSIGNED_IDENTITY_ID="$(az identity show \
    --name "${USER_ASSIGNED_IDENTITY_NAME}" \
    --resource-group "${RESOURCE_GROUP_NAME}" \
    --query 'id' -o tsv)"
USER_ASSIGNED_IDENTITY_CLIENT_ID="$(az identity show \
    --name "${USER_ASSIGNED_IDENTITY_NAME}" \
    --resource-group "${RESOURCE_GROUP_NAME}" \
    --query 'clientId' -o tsv)"
```

### Deploying the app on Azure Container Apps

You have containerized the app and configured a user-assigned managed identity to access the Azure Key Vault, you can deploy the containerized app on Azure Container Apps now.

First, create an environment for Azure Container Apps. An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace. Use the [az containerapp env create](/cli/azure/containerapp/env#az-containerapp-env-create) command to create an environment with a unique name (for example, *acaenvejb010424*), as shown in the following example.

```azurecli-interactive
ACA_ENV=acaenvejb010424
az containerapp env create \
    --resource-group $RESOURCE_GROUP_NAME \
    --location eastus \
    --name $ACA_ENV
```

Next, use the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command to create a Container Apps instance with a unique name (for example, *acaappejb010424*) to run the app after pulling the image from the Container Registry.

```azurecli-interactive
ACA_NAME=acaappejb010424
az containerapp create \
    --name ${ACA_NAME} \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --environment ${ACA_ENV} \
    --image ${ACR_LOGIN_SERVER}/open-liberty-mp-azure-keyvault:latest  \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USER_NAME \
    --registry-password $ACR_PASSWORD \
    --user-assigned ${USER_ASSIGNED_IDENTITY_ID} \
    --env-vars AZURE_CLIENT_ID=${USER_ASSIGNED_IDENTITY_CLIENT_ID} AZURE_KEYVAULT_URL=${AZURE_KEYVAULT_URL} \
    --target-port 9080 \
    --ingress 'external'
```

> [!NOTE]
> You assign the user-assigned managed identity to the Container Apps instance with the parameter `--user-assigned ${USER_ASSIGNED_IDENTITY_ID}`.
> The Container Apps instance can access the Azure Key Vault with two environment variables provided in the parameter `--env-vars AZURE_CLIENT_ID=${USER_ASSIGNED_IDENTITY_CLIENT_ID} AZURE_KEYVAULT_URL=${AZURE_KEYVAULT_URL}`.

Then, retrieve a fully qualified url to access the app by using the following command.

```azurecli-interactive
APP_URL=https://$(az containerapp show \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name ${ACA_NAME} \
    --query properties.configuration.ingress.fqdn -o tsv)
```

Finally, run the similar commands again to test the sample running on the Container Apps instance.

```azurecli-interactive
# Get the value of secret "secret" stored in the Azure key vault. You should see 1234 in the response.
echo $(curl -s ${APP_URL}/config/value/secret -X GET)

# Get the value of secret "anotherSecret" stored in the Azure key vault. You should see 5678 in the response.
echo $(curl -s  ${APP_URL}/config/value/anotherSecret -X GET)

# Get the names of secrets stored in the Azure key vault. You should see ["anotherSecret","secret"] in the response.
echo $(curl -s  ${APP_URL}/config/propertyNames -X GET)

# Get the name-value paris of secrets stored in the Azure key vault. You should see {"anotherSecret":"5678","secret":"1234"} in the response.
echo $(curl -s  ${APP_URL}/config/properties -X GET)
```

You should see the expected outputs described above. If you don't see them, the app may be starting. Wait for a while and try again.

## Cleaning up resources

To avoid Azure charges, you should clean up unneeded resources. When the resources are no longer needed, run the following commands to clean up the resources.

```azurecli-interactive
az keyvault delete \
    --name "${KEY_VAULT_NAME}" \
    --resource-group "${RESOURCE_GROUP_NAME}"

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

* [Azure Container Apps](https://azure.microsoft.com/products/container-apps)
* [Jakarta EE on Azure](/azure/developer/java/ee)
* [Azure Extensions for MicroProfile](https://github.com/Azure/azure-microprofile)
* [MicroProfile](http://microprofile.io)
* [MicroProfile Config APIs](https://microprofile.io/project/eclipse/microprofile-config) 
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
* [Liberty Maven Plugin](https://github.com/OpenLiberty/ci.maven#liberty-maven-plugin)
* [Open Liberty Container Images](https://github.com/OpenLiberty/ci.docker)
