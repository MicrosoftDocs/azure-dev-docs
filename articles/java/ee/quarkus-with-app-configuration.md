---
title: Quickstart for Azure App Configuration with Java Quarkus
description: Shows you how to create a Java Quarkus app with Azure App Configuration to centralize storage and management of application settings separate from your code.
author: KarlErickson
ms.topic: quickstart
ms.date: 03/31/2025
ms.custom: devx-track-java, mode-api, passwordless-java, devx-track-javaee-quarkus, devx-track-javaee-quarkus-app-configuration
ms.author: karler
ms.reviewer: jiangma
---

# Quickstart: Create a Java Quarkus app with Azure App Configuration

In this quickstart, you incorporate Azure App Configuration into a Java Quarkus app to centralize storage and management of application settings separate from your code.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- Azure CLI - [Install the Azure CLI](/cli/azure/install-azure-cli) 2.68.0 or above to run Azure CLI commands.
- An App Configuration store. [Create a store](/azure/azure-app-configuration/quickstart-azure-app-configuration-create?tabs=azure-cli#create-an-app-configuration-store).
- A supported [Java Development Kit (JDK)](/java/azure/jdk) with version 17.
- [Apache Maven](https://maven.apache.org/download.cgi) version 3.9.8 or above.

## Add a key-value

Add the following key-value to the App Configuration store. For more information about how to add key-values to a store using the Azure CLI, go to [Create a key-value](/azure/azure-app-configuration/quickstart-azure-app-configuration-create?tabs=azure-cli#create-a-key-value).

| Key | Value |
|---|---|
| /application/config.message | Hello |

## Create a Quarkus app

In this section, you create a Quarkus app with the Azure App Configuration extension and the REST extension. The REST extension is used to create a REST service that returns the configuration value from the App Configuration store.
For more information, see [Quarkus Azure App Configuration](https://quarkus.io/extensions/io.quarkiverse.azureservices/quarkus-azure-app-configuration/).

Create a Quarkus app using the following Maven command:

```bash
mvn io.quarkus.platform:quarkus-maven-plugin:create \
    -DprojectGroupId=com.example \
    -DprojectArtifactId=quarkus-app-configuration \
    -Dextensions='io.quarkiverse.azureservices:quarkus-azure-app-configuration,rest' \
    -DjavaVersion="17"
```

The app is created in a new directory named *quarkus-app-configuration*. Here is the primary structure of the app:

```output
quarkus-app-configuration
├── src
│   ├── main/java/com/example
│   │   ├── GreetingResource.java
│   └── test/java/com/example
│       └── GreetingResourceTest.java
├── pom.xml
```

The `pom.xml` file contains the dependencies for the app, including the Azure App Configuration extension and the REST extension. For example:

```xml
<dependency>
    <groupId>io.quarkiverse.azureservices</groupId>
    <artifactId>quarkus-azure-app-configuration</artifactId>
</dependency>
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-rest</artifactId>
</dependency>
```

The `GreetingResource.java` file contains the REST service, you modify this file to return the configuration value from the App Configuration store later.

The `GreetingResourceTest.java` file contains the unit test for the REST service. You modify this file to assert the value returned from the REST service equals the value in the App Configuration store later.

## Connect to an App Configuration store

Now that you have an App Configuration store and a Quarkus app with the Azure App Configuration extension, you can connect the app to the store.

### Code the application

To use the Quarkus Azure App Configuration extension to have your application communicate with the App Configuration store that you create, configure the application by using the following steps.

1. Open the Java file named *GreetingResource.java* in the *src/main/java/com/example* directory, and replace the contents with the following code:

   ```java
   package com.example;

   import jakarta.ws.rs.GET;
   import jakarta.ws.rs.Path;
   import jakarta.ws.rs.Produces;
   import jakarta.ws.rs.core.MediaType;

   import org.eclipse.microprofile.config.inject.ConfigProperty;

   @Path("/hello")
   public class GreetingResource {

       @ConfigProperty(name = "/application/config.message")
       String value;

       @GET
       @Produces(MediaType.TEXT_PLAIN)
       public String hello() {
            return value;
       }
   }
   ```

   The modified code uses the MicroProfile Config `@ConfigProperty` annotation to inject the value of the key `/application/config.message` from the App Configuration store into the `value` field, and returns the value in the REST service.

1. Open the auto-generated unit test named *GreetingResourceTest.java* in the *src/test/java/com/example* directory, and replace the contents with the following code:

   ```java
   package com.example;

   import io.quarkus.test.junit.QuarkusTest;
   import org.junit.jupiter.api.Test;

   import javax.inject.Inject;

   import static io.restassured.RestAssured.given;
   import static org.hamcrest.CoreMatchers.is;

   @QuarkusTest
   public class GreetingResourceTest {
       @Test
       public void testHelloEndpoint() {
           given()
               .when().get("/hello")
               .then()
               .statusCode(200)
               .body(is("Hello"));
       }
   }
   ```

   The modified code asserts that the value returned from the REST service equals the value in the App Configuration store, which is **Hello** for the key `/application/config.message` that you added earlier.

These are all required code changes to the application. Before running the application, you need to configure the authentication and connection to the App Configuration store.

### Authenticate to the App Configuration store

Besides authentication with access keys, the Quarkus Azure App Configuration extension supports authentication with Microsoft Entra ID using the `DefaultAzureCredential` from Azure Identity client library. 

You use Microsoft Entra ID for authentication in this quickstart. For more information, see [Azure Identity library overview](/java/api/overview/azure/identity-readme#defaultazurecredential).

First, find the resource group name and App Configuration store name you created earlier, and use these values to define the following variables:

```bash
RESOURCE_GROUP_NAME="<resource-group-name>"
APP_CONFIG_NAME="<app-configuration-store-name>"
``` 

Next, run the following commands to assign the **App Configuration Data Reader** role to the signed-in user:

```azurecli
# Retrieve the app configuration resource ID
APP_CONFIGURATION_RESOURCE_ID=$(az appconfig show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name "${APP_CONFIG_NAME}" \
    --query 'id' \
    --output tsv)
# Assign the "App Configuration Data Reader" role to the current signed-in identity
az role assignment create \
    --assignee $(az ad signed-in-user show --query 'id' --output tsv) \
    --role "App Configuration Data Reader" \
    --scope $APP_CONFIGURATION_RESOURCE_ID
```

Then, export the endpoint of the App Configuration store to an environment variable `QUARKUS_AZURE_APP_CONFIGURATION_ENDPOINT`:

```azurecli
export QUARKUS_AZURE_APP_CONFIGURATION_ENDPOINT=$(az appconfig show \
  --resource-group "${RESOURCE_GROUP_NAME}" \
  --name "${APP_CONFIG_NAME}" \
  --query endpoint -o tsv)
```

The value of environment variable `QUARKUS_AZURE_APP_CONFIGURATION_ENDPOINT` is fed into config property `quarkus.azure.app.configuration.endpoint` of the Quarkus Azure App Configuration extension, in order to set up the connection to the Azure App Configuration store. You can also configure this property in the `application.properties` file under the `src/main/resources` directory, for example:

```properties
quarkus.azure.app.configuration.endpoint=<your-app-configuration-store-endpoint>
```

### Build and run the app locally

Now the app is ready to run locally. Use the following commands to build and run the app in JVM mode:

```bash
# Build, test and package the app
mvn clean package

# Run the app
java -jar ./target/quarkus-app/quarkus-run.jar
```

After your application is running, use *curl* to test your application, for example:

```bash
curl localhost:8080/hello
```

You should see **Hello** from the output, which is the value of the key `/application/config.message` you added to the App Configuration store.
Press <kbd>Control</kbd>+<kbd>C</kbd> to stop the application.

Optionally, you can run the sample in native mode. To do this, you need to have GraalVM installed, or use a builder image to build the native executable. For more information, see the [Building a Native Executable](https://quarkus.io/guides/building-native-image). This quickstart uses Docker as container runtime to build a Linux native executable. If you haven't installed Docker, you can download it from the [Docker website](https://www.docker.com/products/docker-desktop).

Run the following command to build and execute the native executable in a Linux environment:

```bash
mvn package -Dnative -Dquarkus.native.container-build
./target/storage-blob-1.0.0-SNAPSHOT-runner
```

## Clean up resources

To avoid Azure charges, you should clean up unneeded resources. When the App Configuration store is no longer needed, use the [`az group delete`](/cli/azure/group#az-group-delete) command to remove the resource group and all related resources.

```azurecli
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
```

## Next steps

In this quickstart, you created a new App Configuration store and used it with a Java Quarkus app. To learn more, explore the following resources:

> [!div class="nextstepaction"]
> [Quarkus Azure App Configuration](https://quarkus.io/extensions/io.quarkiverse.azureservices/quarkus-azure-app-configuration/)
> [!div class="nextstepaction"]
> [Secure Quarkus applications with Microsoft Entra ID using OpenID Connect](./quarkus-with-microsoft-entra-id.md)
> [!div class="nextstepaction"]
> [Deploy a Java application with Quarkus on Azure Container Apps](./deploy-java-quarkus-app.md)
> [!div class="nextstepaction"]
> [Deploy a Java application with Quarkus on an Azure Kubernetes Service cluster](/azure/aks/howto-deploy-java-quarkus-app)
> [!div class="nextstepaction"]
> [Deploy serverless Java apps with Quarkus on Azure Functions](/azure/azure-functions/functions-create-first-quarkus)
