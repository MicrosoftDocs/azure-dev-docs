---
title: Spring Data Azure Cosmos DB developer's guide
description: This guide describes what you should be aware of when you use the Spring Data Azure Cosmos DB SDK.
author: anfeldma-ms
ms.author: anfeldma
ms.topic: conceptual
ms.date: 11/23/2020
ms.custom: devx-track-java
---

# Spring Data Azure Cosmos DB developer's guide

This topic describes the features of [Spring Data Cosmos DB](https://github.com/microsoft/spring-data-cosmosdb) using the SQL API. This topic also includes guidance on common issues, workarounds, and diagnostic steps.

[Azure Cosmos DB](/azure/cosmos-db/introduction) is a globally distributed database service that allows developers to work with data using a variety of standard APIs. The Spring Data Cosmos DB SDK is based on the [Spring Data](https://spring.io/projects/spring-data) framework and provides integration with Azure Cosmos DB using the SQL API. You can find information on the support for other APIs in the following topics:

- [How to use Spring Data MongoDB API with Azure Cosmos DB](./configure-spring-data-mongodb-with-cosmos-db.md)
- [How to use Spring Data Apache Cassandra API with Azure Cosmos DB](./configure-spring-data-apache-cassandra-with-cosmos-db.md)
- [How to use the Spring Data Gremlin Starter with the Azure Cosmos DB SQL API](./configure-spring-data-gremlin-java-app-with-cosmos-db.md)

The Spring Data Cosmos DB SDK is available as open source on GitHub in the [azure-sdk-for-java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-spring-data-cosmos) repository. This repo has an active [Issues](https://github.com/Azure/azure-sdk-for-java/issues) list where you can file bugs or check for workarounds on issues that have already been filed. You can also check the [Releases](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/cosmos/azure-spring-data-cosmos/CHANGELOG.md) list to see if an issue has been fixed in a more recent version. 

## Available features

The following sections describe the features currently available.

### CrudRepository and ReactiveCrudRepository support

The Spring Data Cosmos DB SDK provides the `CosmosRepository` and `ReactiveCosmosRepository` interfaces, which extend the Spring Data `CrudRepository` and `ReactiveCrudRepository` interfaces.

The following example shows how to extend these interfaces.

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

Depending upon the usage, you need to enable both of the repositories separately in the `Configuration` class. For example:

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

You can define entities by adding the `@Container` annotation and specifying properties related to the collection, such as the collection name, request units (RUs), time to live, and auto-create collection flag.

By default, the collection name will be the class name of the user-domain class. To customize it, add the `@Container(containerName="myCustomCollectionName")` annotation to the domain class. The `containerName` field also supports [Spring Expression Language](https://docs.spring.io/spring/docs/3.0.x/reference/expressions.html) (SpEL) expressions, so you can provide collection names programmatically via configuration properties. For example, you can use expressions such as `containerName = "${dynamic.container.name}"` and `containerName = "#{@someBean.getContainerName()}"`.

There are two ways to map a field in a domain class to the `id` field of an Azure Cosmos DB document:

- Annotate the field with `@Id`.
- Set the name of the field to `id`.

The following example shows the use of the `@Container` and `@Id` annotations.

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
IndexingMode mode;     // The indexing policy mode; the options are Consistent, Lazy, or None.
String[] includePaths; // Included paths for indexing.
String[] excludePaths; // Excluded paths for indexing.
```

The SDK also supports partitioning. For more information, see [Partitioning and horizontal scaling in Azure Cosmos DB](/azure/cosmos-db/partition-data). To specify a field of a domain class to be partition key field, annotate it with `@PartitionKey`. Then, when you perform CRUD operations, specify your partition value.

The following example shows how to use the `@PartitionKey` annotation when performing CRUD operations.

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

The SDK also supports Spring Data custom query find operations, such as `findByAFieldAndBField`. For more information, see [Defining Query Methods](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.query-methods.details) in the Spring documentation.

## Best practices

The following sections describe best practices when using the SDK.

### Pulling configuration properties into the application

You can create a properties class which exposes **application.properties** settings as Java access methods. The structure of **application.properties** may be

```xml
cosmos.uri=${ACCOUNT_HOST}
cosmos.key=${ACCOUNT_KEY}
cosmos.secondaryKey=${SECONDARY_ACCOUNT_KEY}

# Populate query metrics
cosmos.queryMetricsEnabled=true
```

Mirroring this structure, create a Java class `CosmosProperties` structured as follows.

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

Notice this class has a member corresponding to each **application.properties** configuration property, and that for each member `CosmosProperties` exposes *get* and *set* methods. The `@ConfigurationProperties` annotation identifies the class as representing configuration properties, and the `prefix = "cosmos"` argument indicates that a given *member* of `CosmosProperties` maps to the `cosmos.member` property in **application.properties**.

In the next section, we will show how to incorporate your `CosmosProperties` class into the automated configuration flow. At configuration time, a `CosmosProperties` instance will be created and its instance methods will be populated with the configuration settings in **application.properties**. This properties instance allows your application to read and modify configuration properties at runtime.

### Configuring the application based on properties

Your next step is to create a configuration class which automates configuration of the application. To create the structure of your configuration class:

1. Extend the `AbstractCosmosConfiguration` class to set up the application's configuration (Cosmos DB key, URL, database name, and so on).
1. Add the `@Configuration` annotation.
1. Depending on your repository usage, add one or both of the `@EnableCosmosRepositories` and `@EnableReactiveCosmosRepositories` annotations.
1. Add the `@PropertySource("classpath:application.properties")` annotation, which signals to extract key/value pairs of properties from **application.properties**
1. Add the `@EnableConfigurationProperties` annotation, which points Spring Data to a class which can store key/value pairs from **application.properties**. This annotation takes the class definition as an argument; you should pass `CosmosProperties.class`.

The configuration class will utilize the following members:

1. Declare and define a log4j2 `logger` member which Spring Data will utilize for all log outputs
1. Declare an `@Autowired` `CosmosProperties` member, **this is where application.properties settings will be deposited**

The `AzureKeyCredential` feature enables you to rotate keys on the fly. To enable this, define an `AzureKeyCredential` member. You can switch keys by adding a `switchToSecondaryKey` method, as shown in the example below.

Next, you need to define how automated configuration should be carried out.
1. Define an `@Bean` `cosmosClientBuilder` method to handle client initialization using `CosmosClientBuilder`. The purpose of this method is to perform fundamental client setup i.e. specifying account endpoint URI and access key. Typically account endpoint URI and access key are defined in **application.properties**, which in turn will be populated into `properties`. You can initialize the `azureKeyCredential` member with `properties.getKey()`, and then feed `properties.getUri()` and `this.azureKeyCredential` to the `endpoint` and `key` builder methods respectively. 

Notice that in the example below, `cosmosClientBuilder` does not call `build()` on the client builder - it returns the unfinalized builder structure. Spring Data allows us to perform configuration in two stages - first  `cosmosClientBuilder` can apply basic configuration and return the configuration structure, then Spring Data will call a `cosmosConfig` method which allows you to define more advanced configuration such as metrics and diagnostics. Next we will walk through this advanced configuration in the `cosmosConfig` method:
1. Create an `@Bean` `cosmosConfig` method as shown below.
1. Azure Cosmos DB can return server-side diagnostics associated with each request. Spring Data allows you to transform the raw diagnostics output before it is logged, by defining a customer diagnostics processor. As shown below, define a class which implements `ResponseDiagnosticsProcessor` and overrides the `processResponseDiagnostics` method. You can define `processResponseDiagnostics` in order to control how diagnostics output is handled. The example below simply logs the raw diagnostics.
1. To enable diagnostics, and initialize the diagnostics processor, call the `responseDiagnosticsProcessor` builder method, passing a new instance of your customer processor class:

    ```java
    return CosmosConfig.builder()
                       .responseDiagnosticsProcessor(new ResponseDiagnosticsProcessorImplementation())
    ```
1. Azure Cosmos DB also has a more specific performance metrics functionality for queries, called query metrics. As shown in the previous section, the best practice is to have an **application.properties** setting which enables/disables query metrics. Apply this configuration setting by tacking on the `.enableQueryMetrics(properties.isQueryMetricsEnabled())` builder method in `cosmosConfig`.
1. Direct mode connectivity is recommended for minimum latency and maximum throughput so you can configure that in the client builder as well.

Once the advanced configuration in `cosmosConfig` is complete, we must trigger client creation by calling `build()` on the configuration structure; this generates an Azure Cosmos DB client instance based on your configuration settings.

The last step in defining the configuration process is to add an `@Override` method `getDatabaseName()` which return the name of your Azure Cosmos DB database as a string.

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

You can also customize the configuration to change the connection mode, maximum connection pool size, request timeout, and so on, as shown in the following example.

```java
    @Bean
    public CosmosConfig cosmosConfig() {

        // Set the connection mode to Direct (TCP) which applies to data plane operations
        DirectConnectionConfig directConnectionConfig = DirectConnectionConfig.getDefaultConfig(); 

        // Even in Direct mode, some control plane operations always pass through the gateway as HTTP requests (i.e. container/database CRUD.)
        // Optionally, you can customize connection properties for these specific operations which are
        // always Gateway mode
        GatewayConnectionConfig gatewayConnectionConfig = GatewayConnectionConfig.getDefaultConfig(); 

        // Set the maximum number of HTTP connections to 1000 per application.
        gatewayConnectionConfig.setMaxConnectionPoolSize(1000);

        // Set the request timeout to 10 seconds.
        gatewayConnectionConfig.setIdleConnectionTimeout(Duration.ofMillis(10000));

        return CosmosConfig.builder()
                           .responseDiagnosticsProcessor(new ResponseDiagnosticsProcessorImplementation())
                           .enableQueryMetrics(properties.isQueryMetricsEnabled())
                           .directMode(directConnectionConfig, gatewayConnectionConfig); // directMode() has an override which accepts Gateway config                        
                           .build();
    }
```

### Response diagnostics and query metrics

Spring Data Cosmos DB SDK supports response diagnostics string and query metrics since version 2.

To enable query metrics, set the `populateQueryMetrics` flag to **true** in the `application.properties` file. Then, follow the process described in the previous section to extend the `ResponseDiagnosticsProcessor` interface and implement the `processResponseDiagnostics` method to log the diagnostics information. Finally, pass an instance of your implementation to the `CosmosDbConfig.setResponseDiagnosticsProcessor` method. The following code shows an example implementation.

### Pagination and sorting

The Spring Data Cosmos DB SDK supports Spring Data paging and sorting. For more information, see [Special parameter handling](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.special-parameters) in the Spring documentation.

Based on the available request units (RUs) on the database account, Cosmos DB can return documents less than or equal to the requested size. For more information, see [Request Units in Azure Cosmos DB](/azure/cosmos-db/request-units).

You shouldn't rely on the `totalPageSize` value because the number of returned documents in each iteration is variable. Instead, you should iterate over a `Pageable` object as shown in the following example.

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

The following sections describe issues you should be aware of when using the Spring Data Cosmos DB SDK.

### Getting the correct Cosmos DB configuration

Extending the `AbstractCosmosConfiguration` interface can be tricky because of various annotations and configurations present in the class. The most common issue is with the `Enable Repositories` annotation.

If the repositories extend `CosmosRepository`, be sure to add the annotation `@EnableCosmosRepositories`. If the repositories extend `ReactiveCosmosRepository`, be sure to add the annotation `@EnableReactiveCosmosRepositories`. The following example demonstrates the use of these annotations.

```java
@Configuration
@PropertySource(value = {"classpath:application.properties"})
@EnableCosmosRepositories
@EnableReactiveCosmosRepositories
public class TestRepositoryConfig extends AbstractCosmosConfiguration {
    ...
}
```

While creating or customizing a `CosmosDBConfig` bean, be sure to use the `CosmosKeyCredential` object instead of using the key directly.

The `CosmosKeyCredential` feature enables you to rotate keys on the fly. You can switch keys using the `switchToSecondaryKey` method.

The `CosmosKeyCredential` should be a singleton object because the Cosmos DB SDK uses the same object internally to detect changes in the key value inside this object.

### Custom query execution

Spring Data Cosmos DB SDK 3.x.x supports `@query` annotation for defining customer queries!

The following code shows a simple example of how to execute offset and limit queries using `@query` annotation:

```java
@Repository
public interface SampleRepository extends CosmosRepository<SampleEntity, String> {

    ...

    @Query(value = "SELECT * from c OFFSET @skipCount LIMIT @takeCount")
    List<SampleEntity> findByName(@Param("skipCount") int skipCount, @Param("takeCount") int takeCount);
}
```

```java
final FeedOptions feedOptions = new FeedOptions();

// Enable cross-partition queries.
feedOptions.enableCrossPartitionQuery(true);

// Set the page size.
feedOptions.maxItemCount(20);

// Set the number of parallel operations on the client-side SDK when executing parallel queries.
feedOptions.maxDegreeOfParallelism(2);

// Populate query metrics from Cosmos DB.
feedOptions.populateQueryMetrics(true);

final String query = "SELECT * from c OFFSET " + skipCount + " LIMIT " + takeCount;

final CosmosClient cosmosClient = applicationContext.getBean(CosmosClient.class);

Flux<FeedResponse<CosmosItemProperties>> feedResponseFlux =
    cosmosClient.getDatabase(databaseId)
                .getContainer(collectionId)
                .queryItems(query, feedOptions);
    feedResponseFlux.subscribeOn(Schedulers.parallel())
                    .flatMap(feedResponse -> {
                        List<CosmosItemProperties> results =
                        feedResponseFlux.results();
                        log.info("Results are {}", results);
                        return feedResponse;
                    })
                    .subscribe();
```

### Enable diagnostics and query metrics

When debugging, it's helpful to have the response diagnostics string and query metrics from the Cosmos DB SDK. The Cosmos DB SDK logs the response diagnostics string on the client side. The back end logs the query metrics and provides them to the Cosmos DB SDK.

The `ResponseDiagnosticsProcessor.processResponseDiagnostics` method gets called after every API call in the Spring Data Cosmos DB SDK. Therefore, it's important that your implementation ensures high performance by being bug-free and avoiding complexity. For example, you shouldn't log the complete set of diagnostics information in this method because the amount of information involved would create a significant performance cost. You should also use the `Debug` logging level to avoid affecting the application performance.

The following code shows an example of how to implement the `ResponseDiagnosticsProcessor` interface.

```java
private static class ResponseDiagnosticsProcessorImplementation implements ResponseDiagnosticsProcessor {

    @Override
    public void processResponseDiagnostics(@Nullable ResponseDiagnostics responseDiagnostics) {

        // To log everything:
        if (log.isDebugEnabled()) {
            log.debug("Response diagnostics {}", responseDiagnostics);
        }

        // To log Cosmos DB response diagnostics:
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

## How to troubleshoot

The following sections describe ways of troubleshooting common issues.

### Connection issues

If you experience connection issues, be sure all the required annotations in the configuration class are present and correct, as described in the [Getting the correct Cosmos DB configuration](#getting-the-correct-cosmos-db-configuration) section.

### API exceptions

Version 2.2.1 of the Spring Data Cosmos DB SDK provides the following improvements to exception handling:

- All the APIs throw `CosmosDBAccessException`, which exposes a `cosmosClientException` field through a getter.
- The Cosmos DB SDK throws `CosmosClientException`, which you can use to implement any retry logic on the client-side.
- Common exceptions to retry are ones with the messages `Resource already exists`, `Request rate too large`, `Request timeout exception`, and so on.

### API or query slowness

If you experience high latencies on APIs or query executions, try logging diagnostics strings and query metrics as described in the [Enable Diagnostics and Query Metrics](#enable-diagnostics-and-query-metrics) section. Check for CPU usage, network bandwidth, and I/O disk space, which can be the root causes of client-side slowness.