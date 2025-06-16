---
title: Access data with Azure Cosmos DB NoSQL API
description: Learn how to configure an application created with the Spring Boot Initializer with Azure Cosmos DB for NoSQL.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.date: 01/18/2023
ms.topic: how-to
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Access data with Azure Cosmos DB NoSQL API

This article shows you how to add the [Spring Cloud Azure Starter for Spring Data for Azure Cosmos DB] to a custom application. This starter enables you to store data in and retrieve data from your Azure Cosmos DB database by using Spring Data and Azure Cosmos DB for NoSQL. The article starts by showing you how to create an Azure Cosmos DB via the Azure portal. Then, the article shows you how to use [Spring Initializr] to create a custom Spring Boot application that you can use with the Spring Boot Starter.

Azure Cosmos DB is a globally distributed database service that allows developers to work with data using various standard APIs, such as SQL, MongoDB, Graph, and Table APIs. Microsoft's Spring Boot Starter enables developers to use Spring Boot applications that easily integrate with Azure Cosmos DB for NoSQL.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]

## Create an Azure Cosmos DB by using the Azure portal

Use the following steps to create an Azure Cosmos DB instance:

1. Browse to the [Azure portal](https://portal.azure.com) and select **Create a resource**.

1. Select **Databases**, and then select **Azure Cosmos DB**.

1. On the **Create an Azure Cosmos DB account** screen, select **Azure Cosmos DB for NoSQL**.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-cosmos-db/azure-cosmos-db-nosql.png" alt-text="Screenshot of the Azure portal that shows the Create an Azure Cosmos DB account page with Azure Cosmos DB for NoSQL option highlighted." lightbox="media/configure-spring-boot-starter-java-app-with-cosmos-db/azure-cosmos-db-nosql.png":::

1. On the **Azure Cosmos DB** page, enter the following information:

   * Choose the **Subscription** you want to use for your database.
   * Specify whether to create a new **Resource group** for your database, or choose an existing resource group.
   * Enter a unique **Account Name**, which you use as the URI for your database. For example: **contosoaccounttest**.
   * Specify the **Location** for your database.
   * Select **Apply Free Tier Discount** if you want to create an account for demonstration purpose only.
   * Leave the rest of the default options and settings as is.

1. Select **Review + create**, review your specifications, and select **Create**.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-cosmos-db/create-azure-cosmos-db-account.png" alt-text="Screenshot of the Azure portal that shows the Create Azure Cosmos DB Account page with Azure Cosmos DB for NoSQL settings." lightbox="media/configure-spring-boot-starter-java-app-with-cosmos-db/create-azure-cosmos-db-account.png":::

1. When your database has been created, it's listed on your Azure **Dashboard**, and under the **All Resources** and **Azure Cosmos DB** pages. To create a database and a container for a newly created Azure Cosmos DB, see the [Add a database and a container](/azure/cosmos-db/nosql/quickstart-portal#create-container-database) section of [Quickstart: Create an Azure Cosmos DB account, database, container, and items from the Azure portal](/azure/cosmos-db/nosql/quickstart-portal). You can select your database for any of those locations to open the properties page for your cache.

1. When the properties page for your database is displayed, select **Keys** and copy your URI and access keys for your database. You use these values in your Spring Boot application.

   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-cosmos-db/azure-cosmos-db-keys.png" alt-text="Screenshot of the Azure portal that shows the Azure Cosmos DB account with the Keys page showing." lightbox="media/configure-spring-boot-starter-java-app-with-cosmos-db/azure-cosmos-db-keys.png":::

> [!IMPORTANT]
> In your newly created Azure Cosmos DB, assign the `Owner` role to the Azure account you're currently using. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Create a Spring Boot application with the Spring Initializr

Use the following steps to create a new Spring Boot application project with Azure support. As an alternative, you can use the [spring-cloud-azure-data-cosmos-sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/cosmos/spring-cloud-azure-starter-data-cosmos/spring-cloud-azure-data-cosmos-sample) sample in the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main) repo. Then, you can skip directly to [Build and test your app](#build-and-test-your-app).

1. Browse to <https://start.spring.io/>.

1. Specify the following options:

   * Generate a **Maven** project with **Java**.
   * Specify your **Spring Boot** version to **2.7.11**.
   * Specify the **Group** and **Artifact** names for your application.
   * Select **17** for the Java version.
   * Add **Azure Support** in the dependencies.

   > [!NOTE]
   > The Spring Initializr uses the **Group** and **Artifact** names to create the package name; for example: **com.example.wingtiptoysdata**.
   >
   > The version of Spring Boot may be higher than the version supported by Azure Support. After the project is automatically generated, you can manually change the Spring Boot version to the highest version supported by Azure, which you can find in [Spring-Versions-Mapping](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping).

1. When you've specified the options listed previously, select **GENERATE**.

1. When prompted, download the project to a path on your local computer and extract the files.

Your simple Spring Boot application is now ready for editing.

## Configure your Spring Boot application to use the Azure Spring Boot Starter

1. Locate the **pom.xml** file in the directory of your app; for example:

   **C:\SpringBoot\wingtiptoysdata\pom.xml**

   -or-

   **/users/example/home/wingtiptoysdata/pom.xml**

1. Open the **pom.xml** file in a text editor, and add the following to the `<dependencies>` element:

   ```xml
   <dependency>
     <groupId>com.azure.spring</groupId>
     <artifactId>spring-cloud-azure-starter-data-cosmos</artifactId>
   </dependency>
   ```

   > [!NOTE]
   > For more information about how to manage Spring Cloud Azure library versions by using a bill of materials (BOM), see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

1. Save and close the **pom.xml** file.

## Configure your Spring Boot application to use your Azure Cosmos DB

1. Locate the **application.properties** file in the **resources** directory of your app; for example:

   **C:\SpringBoot\wingtiptoysdata\src\main\resources\application.properties**

   -or-

   **/users/example/home/wingtiptoysdata/src/main/resources/application.properties**

1. Open the **application.properties** file in a text editor, and add the following lines to the file, and replace the sample values with the appropriate properties for your database:

   ```properties
   # Specify the DNS URI of your Azure Cosmos DB.
   spring.cloud.azure.cosmos.endpoint=https://contosoaccounttest.documents.azure.com:443/
   spring.cloud.azure.cosmos.key=your-cosmosdb-account-key

   # Specify the name of your database.
   spring.cloud.azure.cosmos.database=contosoaccounttest
   spring.cloud.azure.cosmos.populate-query-metrics=true
   ```

1. Save and close the **application.properties** file.

## Add sample code to implement basic database functionality

In this section, you create two Java classes for storing user data. Then, you modify your main application class to create an instance of the `User` class and save it to your database.

### Define a base class for storing user data

1. Create a new file named **User.java** in the same directory as your main application Java file.

1. Open the **User.java** file in a text editor, and add the following lines to the file to define a generic user class that stores and retrieve values in your database:

   ```java
   package com.example.wingtiptoysdata;

   import com.azure.spring.data.cosmos.core.mapping.Container;
   import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
   import org.springframework.data.annotation.Id;

   @Container(containerName = "mycollection")
   public class User {
       @Id
       private String id;
       private String firstName;
       @PartitionKey
       private String lastName;
       private String address;

       public User() {

       }

       public User(String id, String firstName, String lastName, String address) {
           this.id = id;
           this.firstName = firstName;
           this.lastName = lastName;
           this.address = address;
       }

       public String getId() {
           return id;
       }

       public void setId(String id) {
           this.id = id;
       }

       public String getFirstName() {
           return firstName;
       }

       public void setFirstName(String firstName) {
           this.firstName = firstName;
       }

       public String getLastName() {
           return lastName;
       }

       public void setLastName(String lastName) {
           this.lastName = lastName;
       }

       public String getAddress() {
           return address;
       }

       public void setAddress(String address) {
           this.address = address;
       }

       @Override
       public String toString() {
           return String.format("%s %s, %s", firstName, lastName, address);
       }
   }
   ```

1. Save and close the **User.java** file.

### Define a data repository interface

1. Create a new file named **UserRepository.java** in the same directory as your main application Java file.

1. Open the **UserRepository.java** file in a text editor, and add the following lines to the file to define a user repository interface that extends the default `ReactiveCosmosRepository` interface:

   ```java
   package com.example.wingtiptoysdata;

   import com.azure.spring.data.cosmos.repository.ReactiveCosmosRepository;
   import org.springframework.stereotype.Repository;
   import reactor.core.publisher.Flux;

   @Repository
   public interface UserRepository extends ReactiveCosmosRepository<User, String> {
       Flux<User> findByFirstName(String firstName);
   }
   ```

   The `ReactiveCosmosRepository` interface replaces the `DocumentDbRepository` interface from the previous version of the starter. The new interface provides synchronous and reactive APIs for basic save, delete, and find operations.

1. Save and close the **UserRepository.java** file.

### Modify the main application class

1. Locate the main application Java file in the package directory of your application, for example:

   `C:\SpringBoot\wingtiptoysdata\src\main\java\com\example\wingtiptoysdata\WingtiptoysdataApplication.java`

   -or-

   `/users/example/home/wingtiptoysdata/src/main/java/com/example/wingtiptoysdata/WingtiptoysdataApplication.java`

1. Open the main application Java file in a text editor, and add the following lines to the file:

   ```java
   package com.example.wingtiptoysdata;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;

   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.util.Assert;
   import reactor.core.publisher.Flux;
   import reactor.core.publisher.Mono;

   import java.util.Optional;

   @SpringBootApplication
   public class WingtiptoysdataApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(WingtiptoysdataApplication.class);

       @Autowired
       private UserRepository repository;

       public static void main(String[] args) {
           SpringApplication.run(WingtiptoysdataApplication.class, args);
       }

       public void run(String... var1) {
           this.repository.deleteAll().block();
           LOGGER.info("Deleted all data in container.");

           final User testUser = new User("testId", "testFirstName", "testLastName", "test address line one");

           // Save the User class to Azure Cosmos DB database.
           final Mono<User> saveUserMono = repository.save(testUser);

           final Flux<User> firstNameUserFlux = repository.findByFirstName("testFirstName");

           //  Nothing happens until we subscribe to these Monos.
           //  findById won't return the user as user isn't present.
           final Mono<User> findByIdMono = repository.findById(testUser.getId());
           final User findByIdUser = findByIdMono.block();
           Assert.isNull(findByIdUser, "User must be null");

           final User savedUser = saveUserMono.block();
           Assert.state(savedUser != null, "Saved user must not be null");
           Assert.state(savedUser.getFirstName().equals(testUser.getFirstName()), "Saved user first name doesn't match");

           firstNameUserFlux.collectList().block();

           final Optional<User> optionalUserResult = repository.findById(testUser.getId()).blockOptional();
           Assert.isTrue(optionalUserResult.isPresent(), "Cannot find user.");

           final User result = optionalUserResult.get();
           Assert.state(result.getFirstName().equals(testUser.getFirstName()), "query result firstName doesn't match!");
           Assert.state(result.getLastName().equals(testUser.getLastName()), "query result lastName doesn't match!");

           LOGGER.info("findOne in User collection get result: {}", result.toString());
       }
   }
   ```

1. Save and close the main application Java file.

## Build and test your app

1. Open a command prompt and navigate to the folder where your **pom.xml** file is located; for example:

   `cd C:\SpringBoot\wingtiptoysdata`

   -or-

   `cd /users/example/home/wingtiptoysdata`

1. Use the following command to build and run your application:

   ```bash
   ./mvnw clean
   ```

   This command runs the application automatically as part of the test phase. You can also use:

   ```bash
   ./mvnw spring-boot:run
   ```

   After some build and test output, your console window displays a message similar to the following example:

   ```output
   INFO 1365 --- [           main] c.e.w.WingtiptoysdataApplication         : Deleted all data in container.

   ... (omitting connection and diagnostics output) ...

   INFO 1365 --- [           main] c.e.w.WingtiptoysdataApplication         : findOne in User collection get result: testFirstName testLastName, test address line one
   ```

   These output messages indicate that the data was successfully saved to Azure Cosmos DB and then retrieved again.

## Clean up resources

If you're not going to continue to use this application, be sure to delete the resource group containing the Azure Cosmos DB you created earlier. You can delete the resource group from the Azure portal.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

### More resources

For more information about using Azure Cosmos DB and Java, see the following articles:

* [Azure Cosmos DB Documentation].

* [Azure Cosmos DB: Create a document database using Java and the Azure portal][Build a SQL API app with Java]

* [Spring Data for Azure Cosmos DB]

For more information about using Spring Boot applications on Azure, see the following articles:

* [Spring Cloud Azure Starter for Spring Data Azure Cosmos DB]

* [Deploy a Spring Boot application to Linux on Azure App Service](deploy-spring-boot-java-app-on-linux.md)

* [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](deploy-spring-boot-java-app-on-kubernetes.md)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

The **[Spring Framework]** is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available at <https://github.com/spring-guides/>. In addition to choosing from the list of basic Spring Boot projects, the **[Spring Initializr]** helps developers get started with creating custom Spring Boot applications.

<!-- URL List -->

[Azure Cosmos DB Documentation]: /azure/cosmos-db/
[Azure for Java Developers]: ../index.yml
[Build a SQL API app with Java]: /azure/cosmos-db/create-sql-api-java
[Spring Data for Azure Cosmos DB]: https://azure.microsoft.com/blog/spring-data-azure-cosmos-db-nosql-data-access-on-azure/
[Spring Cloud Azure Starter for Spring Data for Azure Cosmos DB]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-cosmos
[Working with Azure DevOps and Java]: https://azure.microsoft.com/services/devops/java/
[Spring Boot]: https://spring.io/projects/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/
