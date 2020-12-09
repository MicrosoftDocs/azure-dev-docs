---
title: Spring Data Azure Cosmos DB developer's guide
description: This guide describes the features, issues, workarounds, and diagnostic steps to be aware of when you use the Spring Data Azure Cosmos DB SDK.
author: anfeldma-ms
ms.author: anfeldma
ms.topic: conceptual
ms.date: 11/23/2020
ms.custom: devx-track-java
---

# Spring Data Azure Cosmos DB developer's guide

This article describes the features of [Spring Data Azure Cosmos DB](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-spring-data-cosmos) when it uses the SQL API. The article also includes guidance on common issues, workarounds, and diagnostic steps.

With [Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/introduction), a globally distributed database service, developers can work with data by using a variety of standard APIs. The Spring Data Azure Cosmos DB SDK is based on the [Spring Data](https://spring.io/projects/spring-data) framework, and it provides integration with Azure Cosmos DB by using the SQL API. For information about support for other APIs, see:

- [Use the Spring Data MongoDB API with Azure Cosmos DB](./configure-spring-data-mongodb-with-cosmos-db.md)
- [Use the Spring Data Apache Cassandra API with Azure Cosmos DB](./configure-spring-data-apache-cassandra-with-cosmos-db.md)
- [Use the Spring Data Gremlin Starter with the Azure Cosmos DB SQL API](./configure-spring-data-gremlin-java-app-with-cosmos-db.md)

The Spring Data Azure Cosmos DB SDK is available as open source on GitHub in the [azure-sdk-for-java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-spring-data-cosmos) repository. This repo maintains an active [issues list](https://github.com/Azure/azure-sdk-for-java/issues) where you can file bugs or check for workarounds on issues that have already been filed. You can also check the [release history](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/cosmos/azure-spring-data-cosmos/CHANGELOG.md) page to see whether an issue has been fixed in a more recent version. 

## Available features

The following sections describe the features that are currently available in the Spring Data Azure Cosmos DB SDK.

### CrudRepository and ReactiveCrudRepository support

The Spring Data Azure Cosmos DB SDK provides the `CosmosRepository` and `ReactiveCosmosRepository` interfaces, which extend the Spring Data `CrudRepository` and `ReactiveCrudRepository` interfaces.

The following example shows how to extend these interfaces:

```java
@Repository
public interface SampleRepository extends CosmosRepository<SampleEntity, String> {
    List<SampleEntity> findByName(String name);
}

@Repository
public interface ReactiveSampleRepository extends ReactiveCosmosRepository<SampleEntity, String> {
    Flux<SampleEntity> findByName(String name);
}
```

Depending upon their intended usage, you need to enable each repository separately in the `Configuration` class. For example:

```java
@Configuration
@EnableConfigurationProperties(CosmosProperties.class)
@EnableCosmosRepositories
@EnableReactiveCosmosRepositories
@PropertySource("classpath:application.properties")
public class TestRepositoryConfig extends AbstractCosmosConfiguration {
    ...
}
```

### Define a simple entity

You can define entities by adding the `@Container` annotation and specifying properties that are related to the collection, such as the collection name, request units (RUs), time to live, and autocreate collection flag.

By default, the collection name is the class name of the user-domain class. To customize it, add the `@Container(containerName="myCustomCollectionName")` annotation to the domain class. The `containerName` field also supports [Spring Expression Language](https://docs.spring.io/spring/docs/3.0.x/reference/expressions.html) (SpEL) expressions, so you can provide collection names programmatically via configuration properties. For example, you can use expressions such as `containerName = "${dynamic.container.name}"` and `containerName = "#{@someBean.getContainerName()}"`.

You can map a field in a domain class to the `id` field of an Azure Cosmos DB document in either of two ways:

- Annotate the field with `@Id`.
- Set the name of the field to `id`.

The use of the `@Container` and `@Id` annotations is shown in the following examples:

```java
@Container(containerName = "myContainer")
class MyDocument {

    @Id
    private String myId;

    @PartitionKey
    private String data;

    @Version
    private String _etag;
}
```

By default, `IndexingPolicy` is set by the Azure service. To customize it, add the annotation `@DocumentIndexingPolicy` to the domain class. This annotation has four attributes:

```java
boolean automatic;     // Indicates whether the indexing policy is automatic.
IndexingMode mode;     // The indexing policy mode. The options are Consistent, Lazy, or None.
String[] includePaths; // The included paths for indexing.
String[] excludePaths; // The excluded paths for indexing.
```

The SDK supports partitioning. For more information, see [Partitioning and horizontal scaling in Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/partitioning-overview). To specify a field of a domain class as a partition key field, annotate it with `@PartitionKey`. Then, when you perform CRUD operations, specify your partition value.

The following example shows how to use the `@PartitionKey` annotation when you perform CRUD operations.

```java
@Container(ru = "400")
public class Address {
    @Id
    String postalCode;

    @PartitionKey
    String city;

    String street;
    String country;
    String phoneNumber;

    ...
}

class AddressService {

    @Autowired
    AddressRepository repository;

    final Address newAddress = new Address("12345", "Seattle");

    // There's no need to specify a partition key in the save operation.
    repository.save(updatedAddress);

    // Provide a partition key when performing a find-by-id operation.
    final Optional<Address> addressById = repository.findById("12345", new PartitionKey("city"));

    final Address foundAddress = addressById.get();

    // Provide a partition key when performing a delete-by-id operation.
    repository.deleteById(foundAddress.getPostalCode(), new PartitionKey(foundAddress.getCity())); 
}
```

The SDK also supports Spring Data custom query find operations, such as `findByAFieldAndBField`. For more information, see the "Defining Query Methods" section of [Spring Data Commons - Reference Documentation](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.query-methods.details).

## Best practices

The following sections describe best practices for using the SDK.

### Pull configuration properties into the application

You can create a properties class, which exposes **application.properties** settings as Java access methods. The structure of **application.properties** might be:

```xml
cosmos.uri=${ACCOUNT_HOST}
cosmos.key=${ACCOUNT_KEY}
cosmos.secondaryKey=${SECONDARY_ACCOUNT_KEY}

# Populate query metrics
cosmos.queryMetricsEnabled=true
```

Mirroring this structure, create a Java class `CosmosProperties` structured as follows:

```java
@ConfigurationProperties(prefix = "cosmos")
public class CosmosProperties {

    private String uri;

    private String key;

    private String secondaryKey;

    private boolean queryMetricsEnabled;

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getSecondaryKey() {
        return secondaryKey;
    }

    public void setSecondaryKey(String secondaryKey) {
        this.secondaryKey = secondaryKey;
    }

    public boolean isQueryMetricsEnabled() {
        return queryMetricsEnabled;
    }

    public void setQueryMetricsEnabled(boolean enableQueryMetrics) {
        this.queryMetricsEnabled = enableQueryMetrics;
    }
}
```

Note that this class has a member that corresponds to each **application.properties** configuration property and that, for each member, `CosmosProperties` exposes the `get` and `set` methods. The `@ConfigurationProperties` annotation identifies the class as representing configuration properties, and the `prefix = "cosmos"` argument indicates that a specified *member* of `CosmosProperties` maps to the `cosmos.member` property in **application.properties**.

The next section shows how to incorporate your `CosmosProperties` class into the automated configuration flow. At configuration time, a `CosmosProperties` instance is created and its instance methods are populated with the configuration settings in **application.properties**. This properties instance allows your application to read and modify configuration properties at runtime.

### Configure the application based on properties

Your next step is to create a configuration class that automates the configuration of the application, as shown here:

```java
@Configuration
@EnableConfigurationProperties(CosmosProperties.class)
@EnableCosmosRepositories
@EnableReactiveCosmosRepositories
@PropertySource("classpath:application.properties")
public class AppConfiguration extends AbstractCosmosConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(QuickstartSampleConfiguration.class);

    @Autowired
    private CosmosProperties properties;

    private AzureKeyCredential azureKeyCredential;

    @Bean
    public CosmosClientBuilder cosmosClientBuilder() {
        this.azureKeyCredential = new AzureKeyCredential(properties.getKey());
        return new CosmosClientBuilder()
            .endpoint(properties.getUri())
            .key(this.azureKeyCredential)
    }

    @Bean
    public CosmosConfig cosmosConfig() {
        DirectConnectionConfig directConnectionConfig = DirectConnectionConfig.getDefaultConfig();        
        return CosmosConfig.builder()
                           .responseDiagnosticsProcessor(new ResponseDiagnosticsProcessorImplementation())
                           .enableQueryMetrics(properties.isQueryMetricsEnabled())
                           .directMode(directConnectionConfig);                           
                           .build();
    }

    @Override
    protected String getDatabaseName() {
        return "testdb";
    }

    private static class ResponseDiagnosticsProcessorImplementation implements ResponseDiagnosticsProcessor {

        @Override
        public void processResponseDiagnostics(@Nullable ResponseDiagnostics responseDiagnostics) {
            logger.info("Response Diagnostics {}", responseDiagnostics);
        }
    }

    public void switchToSecondaryKey() {
        this.cosmosKeyCredential.key(secondaryKey);
    }
}
```

Let's walk through how the preceding example is created. To create the structure of your configuration class, do the following:

1. Extend the `AbstractCosmosConfiguration` class to set up the application's configuration (the Azure Cosmos DB key, URL, database name, and so on).
1. Add the `@Configuration` annotation.
1. Depending on your repository usage, add one or both of the `@EnableCosmosRepositories` and `@EnableReactiveCosmosRepositories` annotations.
1. Add the `@PropertySource("classpath:application.properties")` annotation, which signals to extract key-value pairs of properties from **application.properties**.
1. Add the `@EnableConfigurationProperties` annotation, which points Spring Data to a class that can store key-value pairs from **application.properties**. This annotation takes the class definition as an argument. You should pass `CosmosProperties.class`.

The configuration class utilizes the following members:

* Declare and define a log4j2 `logger` member, which Spring Data will utilize for all log outputs.
* Declare an `@Autowired` `CosmosProperties` member, which is where **application.properties** settings will be deposited.

By using the `AzureKeyCredential` feature, you can rotate keys on the fly. To enable the feature, define an `AzureKeyCredential` member. You can switch keys by adding a `switchToSecondaryKey` method, as shown in the preceding example code.

Next, you need to define how the automated configuration should be carried out.
1. Define an `@Bean` `cosmosClientBuilder` method to handle the client initialization by using `CosmosClientBuilder`. The purpose of this method is to perform a fundamental client setup (that is, specify an account endpoint URI and access key). The account endpoint URI and access key are ordinarily defined in **application.properties**, which in turn is populated into `properties`. 
1. You can initialize the `azureKeyCredential` member by using `properties.getKey()`. 
1. You can then feed `properties.getUri()` to the `endpoint` builder method and `this.azureKeyCredential` to the `key` builder method. 

In the preceding example, note that `cosmosClientBuilder` doesn't call `build()` on the client builder. It returns the unfinalized builder structure. With Spring Data, you can perform the configuration in two stages: First  `cosmosClientBuilder` can apply the basic configuration and return the configuration structure, and then Spring Data calls a `cosmosConfig` method, with which you can define a more advanced configuration, such as metrics and diagnostics. 

Next, let's walk through this advanced configuration in the `cosmosConfig` method:
1. Create an `@Bean` `cosmosConfig` method, as discussed earlier.
   
   Azure Cosmos DB can return server-side diagnostics that are associated with each request. With Spring Data, you can transform the raw diagnostics output before it's logged, by defining a customer diagnostics processor. 

1. As shown earlier, define a class that implements `ResponseDiagnosticsProcessor` and overrides the `processResponseDiagnostics` method. You can define `processResponseDiagnostics` to control how diagnostics output is handled. The preceding example simply logs the raw diagnostics.

1. To enable diagnostics and initialize the diagnostics processor, call the `responseDiagnosticsProcessor` builder method, which passes a new instance of your customer processor class, as shown here:

    ```java
    return CosmosConfig.builder()
                       .responseDiagnosticsProcessor(new ResponseDiagnosticsProcessorImplementation())
    ```

   Azure Cosmos DB also has a more specific performance metrics functionality for queries, called query metrics. As shown in the previous section, the best practice is to have an **application.properties** setting that enables and disables query metrics. 
   
1. Apply this configuration setting by tacking on the `.enableQueryMetrics(properties.isQueryMetricsEnabled())` builder method in `cosmosConfig`.

1. We recommend Direct mode connectivity for minimum latency and maximum throughput, so you can configure that in the client builder as well.

1. After the advanced configuration in `cosmosConfig` is complete, trigger client creation by calling `build()` on the configuration structure. This generates an Azure Cosmos DB client instance that's based on your configuration settings.

1. The last step in defining the configuration process is to add an `@Override` method,  `getDatabaseName()`, which returns the name of your Azure Cosmos DB database as a string.

### Customize the configuration

You can also customize the configuration to change the connection mode, maximum connection pool size, request timeout, and so on, as shown in the following example:

```java
    @Bean
    public CosmosConfig cosmosConfig() {

        // Set the connection mode to Direct (TCP), which applies to data plane operations.
        DirectConnectionConfig directConnectionConfig = DirectConnectionConfig.getDefaultConfig(); 

        // Even in Direct mode, some control plane operations always pass through the gateway as HTTP requests (that is, container/database CRUD [create, retrieve, update, and delete]).
        // Optionally, you can customize connection properties for these specific operations, which are always Gateway mode.
        GatewayConnectionConfig gatewayConnectionConfig = GatewayConnectionConfig.getDefaultConfig(); 

        // Set the maximum number of HTTP connections to 1000 per application.
        gatewayConnectionConfig.setMaxConnectionPoolSize(1000);

        // Set the request timeout to 10 seconds.
        gatewayConnectionConfig.setIdleConnectionTimeout(Duration.ofMillis(10000));

        return CosmosConfig.builder()
                           .responseDiagnosticsProcessor(new ResponseDiagnosticsProcessorImplementation())
                           .enableQueryMetrics(properties.isQueryMetricsEnabled())
                           .directMode(directConnectionConfig, gatewayConnectionConfig); // directMode() has an override that accepts Gateway config.                        
                           .build();
    }
```

### Response diagnostics and query metrics

As of version 2, the Spring Data Azure Cosmos DB SDK supports response diagnostics string and query metrics.

To enable query metrics, set the `queryMetricsEnabled` flag to **true** in the `application.properties` file. 

Then, follow the process described in the previous section to extend the `ResponseDiagnosticsProcessor` interface and implement the `processResponseDiagnostics` method to log the diagnostics information. 

Finally, pass an instance of your implementation to the `CosmosDbConfig.setResponseDiagnosticsProcessor` method.

### Pagination and sorting

The Spring Data Azure Cosmos DB SDK supports Spring Data paging and sorting. For more information, see the "Special parameter handling" section of [Spring Data Commons - Reference Documentation](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.special-parameters).

Based on the available request units (RUs) on the database account, Azure Cosmos DB can return documents less than or equal to the requested size. For more information, see [Request units in Azure Cosmos DB](/azure/cosmos-db/request-units).

You shouldn't rely on the `totalPageSize` value, because the number of returned documents in each iteration is variable. Instead, you should iterate over a `Pageable` object, as shown in the following example:

```java
final Sort sort = Sort.by(Sort.Direction.DESC, "name");
final CosmosPageRequest pageRequest = new CosmosPageRequest(0, pageSize,   null, sort);
Page<T> page = tRepository.findAll(pageRequest);
List<T> pageContent = page.getContent();
while(page.hasNext()) {
    Pageable nextPageable = page.nextPageable();
    page = repository.findAll(nextPageable);
    pageContent = page.getContent();
}
```

## Common issues and workarounds

The following sections describe issues to be aware of when you use the Spring Data Azure Cosmos DB SDK.

### Get the correct Azure Cosmos DB configuration

Extending the `AbstractCosmosConfiguration` interface can be tricky because of various annotations and configurations that are present in the class. The most common issue is with the `Enable Repositories` annotation.

If the repositories extend `CosmosRepository`, add the `@EnableCosmosRepositories` annotation. If the repositories extend `ReactiveCosmosRepository`, add the `@EnableReactiveCosmosRepositories` annotation. The use of these annotations is demonstrated in the following example:

```java
@Configuration
@EnableConfigurationProperties(CosmosProperties.class)
@EnableCosmosRepositories
@EnableReactiveCosmosRepositories
@PropertySource("classpath:application.properties")
public class TestRepositoryConfig extends AbstractCosmosConfiguration {
    ...
}
```

While you're creating or customizing a `CosmosDBConfig` bean, be sure to use the `AzureKeyCredential` object instead of using the key directly.

By using the `AzureKeyCredential` feature, you can rotate keys on the fly. You can switch keys by using the `switchToSecondaryKey` method.

The `AzureKeyCredential` should be a singleton object, because the Azure Cosmos DB SDK uses the same object internally to detect changes in the key value inside this object.

### Custom query execution

Spring Data Azure Cosmos DB SDK 3.x.x supports `@query` annotation for defining custom queries.

A simple example of how to define offset and limit queries by using `@query` annotation is shown in the following code:

```java
@Repository
public interface SampleRepository extends CosmosRepository<SampleEntity, String> {

    ...

    @Query(value = "SELECT * from c OFFSET @skipCount LIMIT @takeCount")
    List<SampleEntity> findByName(@Param("skipCount") int skipCount, @Param("takeCount") int takeCount);
}
```

### Enable diagnostics and query metrics

When you're debugging, it's helpful to have the response diagnostics string and query metrics from the Azure Cosmos DB SDK. The Azure Cosmos DB SDK logs the response diagnostics string on the client side. The back end logs the query metrics and provides them to the Azure Cosmos DB SDK.

The `ResponseDiagnosticsProcessor.processResponseDiagnostics` method gets called after every API call in the Spring Data Azure Cosmos DB SDK. Therefore, it's important to have your implementation ensure high performance by being bug-free and avoiding complexity. For example, you shouldn't log the complete set of diagnostics information in this method, because the amount of information involved would create a significant performance cost. You should also use the `Debug` logging level to avoid affecting application performance.

An example of how to implement the `ResponseDiagnosticsProcessor` interface is shown in the following code:

```java
private static class ResponseDiagnosticsProcessorImplementation implements ResponseDiagnosticsProcessor {

    @Override
    public void processResponseDiagnostics(@Nullable ResponseDiagnostics responseDiagnostics) {

        // To log everything:
        if (log.isDebugEnabled()) {
            log.debug("Response diagnostics {}", responseDiagnostics);
        }

        // To log the Azure Cosmos DB response diagnostics:
        if (responseDiagnostics != null && log.isDebugEnabled()) {
            CosmosResponseDiagnostics cosmosResponseDiagnostics = responseDiagnostics.getCosmosResponseDiagnostics();
            log.debug("Cosmos DB response diagnostics {}", cosmosResponseDiagnostics);
        }

        // To log just the request latency:
        if (responseDiagnostics != null && log.isDebugEnabled()) {
            CosmosResponseDiagnostics cosmosResponseDiagnostics = responseDiagnostics.getCosmosResponseDiagnostics();
            log.debug("Request latency {}", cosmosResponseDiagnostics.requestLatency());
        }

        // To log query metrics:
        if (responseDiagnostics != null && log.isDebugEnabled()) {
            FeedResponseDiagnostics feedResponseDiagnostics =
                responseDiagnostics.getFeedResponseDiagnostics();
            log.debug("Query metrics {}", feedResponseDiagnostics);
        }
    }
}
```

## Troubleshoot common issues

The following sections describe ways to troubleshoot common issues.

### Connection issues

If you experience connection issues, make sure that all the required annotations in the configuration class are present and correct, as described in the ["Get the correct Azure Cosmos DB configuration"](#get-the-correct-azure-cosmos-db-configuration) section.

### Naming changes

Version 3.1.0+ of the Spring Data Azure Cosmos DB SDK has the following notable changes to the names and interfaces of classes, methods, annotations, and Maven artifacts:
* Updated group ID to `com.azure`.
* Updated artifact ID to `azure-spring-data-cosmos`.
* Updated sync APIs return types to `Iterable` types instead of `List`.
* Changed `CosmosDbFactory` to `CosmosFactory`.
* Changed `CosmosDBConfig` to `CosmosConfig`.
* Changed `CosmosDBAccessException` to `CosmosAccessException`.
* Changed `Document` annotation to `Container` annotation.
* Changed `DocumentIndexingPolicy` annotation to `CosmosIndexingPolicy` annotation.
* Changed `DocumentQuery` to `CosmosQuery`.
* Changed the **application.properties** flag `populateQueryMetrics` to `queryMetricsEnabled`.

### Key bug fixes

Version 3.1.0+ of the Spring Data Azure Cosmos DB SDK has the following key bug fixes:
* Fixed an issue where annotated queries don't pick the annotated container name.
* Scheduling diagnostics logging task to parallel threads to avoid blocking Netty input/output (I/O) threads.
* Fixed optimistic locking on delete operation.
* Fixed issue with escaping queries for the IN clause.
* Fixed issue by allowing long data type for @Id.
* Fixed issue by allowing Boolean, long, int, and double as data types for @PartitionKey annotation.
* Fixed IgnoreCase and AllIgnoreCase keywords for ignore case queries.
* Removed default request unit value of 4000 when creating containers automatically.
* Fixed nested partition key bug when used with @GeneratedValue annotation.

### API or query slowness

If you experience high latencies on APIs or query executions, try logging diagnostics strings and query metrics as described in the [Enable diagnostics and query metrics](#enable-diagnostics-and-query-metrics) section. Check for CPU usage, network bandwidth, and I/O disk space, which can be the root causes of client-side slowness.
