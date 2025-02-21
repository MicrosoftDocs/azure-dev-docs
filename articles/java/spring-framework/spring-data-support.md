---
title: Spring Data support
description: This article describes how Spring Cloud Azure and Spring Data can be used together.
ms.date: 08/10/2023
author: KarlErickson
ms.author: seal
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Data support

**This article applies to:** ✅ Version 4.19.0 ✅ Version 5.20.0

This article describes how Spring Cloud Azure and Spring Data can be used together.

## Spring Data Azure Cosmos DB support

[Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) is a globally distributed database service that allows developers to work with data using various standard APIs, such as SQL, MongoDB, Graph, and Azure Table storage.

### Dependency setup

```xml
<dependency>
   <groupId>com.azure.spring</groupId>
   <artifactId>spring-cloud-azure-starter-data-cosmos</artifactId>
</dependency>
```

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Microsoft Entra ID for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-microsoft-entra-id).

The following table lists the configurable properties of `spring-cloud-azure-starter-data-cosmos`:

> [!div class="mx-tdBreakAll"]
> | Property                                                           | Description                                                                                                     |
> |--------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure.cosmos*.enabled                                | A value that indicates whether Azure Cosmos DB Service is enabled. The default value is `true`.                    |
> | *spring.cloud.azure.cosmos*.database                               | The Azure Cosmos DB database ID.                                                                                      |
> | *spring.cloud.azure.cosmos*.endpoint                               | The URI to connect Azure Cosmos DB.                                                                                   |
> | *spring.cloud.azure.cosmos*.key                                    | The PrivateKey to connect Azure Cosmos DB.                                                                            |
> | *spring.cloud.azure.cosmos*.credential.client-certificate-password | The password of the certificate file.                                                                           |
> | *spring.cloud.azure.cosmos*.credential.client-certificate-path     | The path of a PEM certificate file to use when performing service principal authentication with Azure.          |
> | *spring.cloud.azure.cosmos*.credential.client-id                   | The client ID to use when performing service principal authentication with Azure.                               |
> | *spring.cloud.azure.cosmos*.credential.client-secret               | The client secret to use when performing service principal authentication with Azure.                           |
> | *spring.cloud.azure.cosmos*.credential.managed-identity-enabled    | Whether to enable managed identity. The default value is `false`.                                                                             |
> | *spring.cloud.azure.cosmos*.credential.password                    | The password to use when performing username/password authentication with Azure.                                |
> | *spring.cloud.azure.cosmos*.credential.username                    | The username to use when performing username/password authentication with Azure.                                |
> | *spring.cloud.azure.cosmos*.populate-query-metrics                 | A value that indicates whether to populate diagnostics strings and query metrics. The default value is `false`. |
> | *spring.cloud.azure.cosmos*.consistency-level                      | A [consistency level](/azure/cosmos-db/consistency-levels) for Azure Cosmos DB.                                 |

### Key concepts

The following list shows the key concepts of the Spring Data support:

* The Spring Data `CrudRepository` and `ReactiveCrudRepository`, which provide the following basic CRUD functionality:

    * save
    * findAll
    * findOne by ID
    * deleteAll
    * delete by ID
    * delete entity

* The Spring Data [@Id](https://github.com/spring-projects/spring-data-commons/blob/db62390de90c93a78743c97cc2cc9ccd964994a5/src/main/java/org/springframework/data/annotation/Id.java) annotation. There are two ways to map a field in a domain class to the `id` of an Azure Cosmos DB document:

    * Annotate a field in domain class with `@Id`. This field will be mapped to document `id` in Azure Cosmos DB.
    * Set the name of this field to `id`. This field will be mapped to document `id` in Azure Cosmos DB.

  > [!NOTE]
  > If both ways are applied, the `@Id` annotation has higher priority.

* Custom collection names. By default, collection name will be class name of user domain class. To customize it, add annotation `@Document(collection="myCustomCollectionName")` to your domain class, that's all.

* Supports [Azure Cosmos DB partition](/azure/cosmos-db/partitioning-overview). To specify a field of your domain class to be a partition key field, annotate it with `@PartitionKey`. When you do CRUD operations, specify your partition value. For more examples, see [AddressRepositoryIT.java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/spring/azure-spring-data-cosmos/src/test/java/com/azure/spring/data/cosmos/repository/integration/AddressRepositoryIT.java) on GitHub.

* Supports [Spring Data custom query](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.query-methods.details) find operation.

* Supports [spring-boot-starter-data-rest](https://spring.io/projects/spring-data-rest).

* Supports List and nested types in domain classes.

### Basic usage

#### Use a private key to access Azure Cosmos DB

The simplest way to connect Azure Cosmos DB with `spring-cloud-azure-starter-data-cosmos` is with a primary key. Add the following properties:

```yaml
spring:
  cloud:
    azure:
      cosmos:
        key: ${AZURE_COSMOS_KEY}
        endpoint: ${AZURE_COSMOS_ENDPOINT}
        database: ${AZURE_COSMOS_DATABASE}
```

#### Define an entity

Define an entity as a Document in Azure Cosmos DB, as shown in the following example:

```java
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

The `id` field will be used as the document `id` in Azure Cosmos DB. Alternately, you can annotate any field with `@Id` to map it to the document `id`.

The annotation `@Container(containerName = "mycollection")` is used to specify the collection name of your document in Azure Cosmos DB.

#### Create repositories

To create repositories, extend the `ReactiveCosmosRepository` interface, which provides Spring Data repository support.

```java
@Repository
public interface UserRepository extends ReactiveCosmosRepository<User, String> {
    Flux<User> findByFirstName(String firstName);
}
```

Currently, the `ReactiveCosmosRepository` interface provides basic save, delete, and find operations. More operations will be supported later.

#### Create an application class

The following example creates an application class with all the components:

```java
@SpringBootApplication
public class CosmosSampleApplication implements CommandLineRunner {

private static final Logger LOGGER = LoggerFactory.getLogger(CosmosSampleApplication.class);

    @Autowired
    private UserRepository repository;

    @Autowired
    private CosmosProperties properties;

    public static void main(String[] args) {
        SpringApplication.run(CosmosSampleApplication.class, args);
    }

    public void run(String... var1) {
        final User testUser = new User("testId", "testFirstName",
                "testLastName", "test address line one");

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
        Assert.state(savedUser.getFirstName().equals(testUser.getFirstName()),
                "Saved user first name doesn't match");

        firstNameUserFlux.collectList().block();

        final Optional<User> optionalUserResult = repository.findById(testUser.getId()).blockOptional();
        Assert.isTrue(optionalUserResult.isPresent(), "Cannot find user.");

        final User result = optionalUserResult.get();
        Assert.state(result.getFirstName().equals(testUser.getFirstName()),
                "query result firstName doesn't match!");
        Assert.state(result.getLastName().equals(testUser.getLastName()),
                "query result lastName doesn't match!");
        LOGGER.info("findOne in User collection get result: {}", result.toString());

    }

    @PostConstruct
    public void setup() {
        // For this example, remove all of the existing records.
        this.repository.deleteAll().block();
    }
}
```

This example includes an autowired `UserRepository` interface to support save, delete, and find operations.

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/cosmos) on GitHub.

Apart from using the `spring-cloud-azure-starter-data-cosmos` library, you can directly use `azure-spring-data-cosmos` library for more complex scenarios. For more information, see [Spring Data for Azure Cosmos DB client library](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/spring/azure-spring-data-cosmos).
