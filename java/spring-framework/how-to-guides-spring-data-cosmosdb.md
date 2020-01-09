# Developer's Guide

[Azure Cosmos DB](/azure/cosmos-db/introduction) is a globally distributed database service that allows developers to work with data using a variety of standard APIs, such as SQL, MongoDB, Cassandra, Graph, and Table.

[**Spring Data Azure Cosmos DB**](https://github.com/microsoft/spring-data-cosmosdb) provides initial Spring Data support for Azure Cosmos DB using the [SQL API](/azure/cosmos-db/sql-api-introduction), based on Spring Data framework. Currently it only supports SQL API, the other APIs are in the plan. 

This article covers features, common issues, workarounds, diagnostic steps, and tools when you use Spring Data CosmosDb SDK. This article describes tools and approaches to help you if you run into any issues.

Start with this list:
- Review the [available features](#available-features), and follow the [best practices](#best-practices).
- Go through [Common issues and workarounds](#common-issues-and-workarounds) section in this article.
- Take a look at [how to troubleshoot](#how-to-troubleshoot) section and troubleshoot the problem. 
- Look at the SDK, which is available [open source on GitHub](https://github.com/microsoft/spring-data-cosmosdb). It has an [issues section](https://github.com/microsoft/spring-data-cosmosdb/issues), which is actively monitored. Check to see if any similar issue with a workaround has already been filed.
- Refer to [releases](https://github.com/microsoft/spring-data-cosmosdb/releases) to make sure if the problem is already a fixed bug in another version.
- If you don't find a solution, then file a [GitHub issue](https://github.com/microsoft/spring-data-cosmosdb/issues).

## Available features 
#### CrudRepository and ReactiveCrudRepository support
- Spring Data supports both CrudRepository (CosmosRepository) and ReactiveCrudRepository (ReactiveCosmosRepository) API implementations.
```java
//  To extend CosmosRepository
@Repository
public interface SampleRepository extends CosmosRepository<SampleEntity, String> {
    List<SampleEntity> findByName(String name);
}

//  To extend ReactiveCosmosRepository
@Repository
public interface ReactiveSampleRepository extends ReactiveCosmosRepository<SampleEntity, String> {    Flux<SampleEntity> findByName(String name);
}
``` 
- Depending upon the usage, both of the repositories need to be enabled separately in the Configuration class. 
```java
@Configuration
@PropertySource(value = {"classpath:application.properties"})
@EnableCosmosRepositories
@EnableReactiveCosmosRepositories
public class TestRepositoryConfig extends AbstractCosmosConfiguration {
    ...
}
```

#### Define a Simple Entity
- Entities can be defined in following way
- Specify `@Document` annotation on an entity to specify properties related to collection, for example collection name, request units, time to live, auto create collection flag.
- There are two ways to map a field in domain class to `id` field of Azure Cosmos DB document.
    - annotate a field in domain class with `@Id`, this field will be mapped to document `id` in Cosmos DB. 
    - set name of this field to `id`, this field will be mapped to document `id` in Azure Cosmos DB.
```java
@Document(collection = "myCollection")
class MyDocument {
    
    @Id
    private String myId;

    @PartitionKey
    private String data;
    @Version
    private String _etag;
}
```
- Custom collection Name.
    By default, collection name will be class name of user domain class. To customize it, add the `@Document(collection="myCustomCollectionName")` annotation to the domain class. The collection field also supports SpEL expressions (for example, `collection = "${dynamic.collection.name}"` or `collection = "#{@someBean.getCollectionName()}"`) in order to provide collection names programmatically/via configuration properties.
- Custom IndexingPolicy
    By default, IndexingPolicy will be set by azure service. To customize, add annotation `@DocumentIndexingPolicy` to domain class. This annotation has four attributes to customize, see following:
  ```java
     boolean automatic;     // Indicate if indexing policy use automatic or not
     IndexingMode mode;     // Indexing policy mode, option Consistent|Lazy|None.
     String[] includePaths; // Included paths for indexing
     String[] excludePaths; // Excluded paths for indexing
  ```
- Supports [Azure Cosmos DB partition](/azure/cosmos-db/partition-data). To specify a field of domain class to be partition key field, just annotate it with `@PartitionKey`. When you do CRUD operation, pls specify your partition value. For more sample on partition CRUD, pls refer to [test here](./src/test/java/com/microsoft/azure/spring/data/cosmosdb/repository/integration/AddressRepositoryIT.java)
- Supports [Spring Data custom query](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.query-methods.details) find operation, e.g., `findByAFieldAndBField`

## Best Practices

#### Configuring Application
- Extend `AbstractCosmosConfiguration` to set up the application's configuration (Cosmosdb key, url, database name, etc.)
- Should be annotated with `@Configuration` annotation. 
- Depending upon repository usage, specify `@EnableCosmosRepositories` or `@EnableReactiveCosmosRepositories` annotation.
- Both of these annotations can be used simultaneously as well.
- CosmosKeyCredential feature provides capability to rotate keys on the fly. You can switch keys using `switchToSecondaryKey()`.  
 ```java
 @Configuration
 @EnableCosmosRepositories
 @Slf4j
 public class AppConfiguration extends AbstractCosmosConfiguration {
 
     @Value("${azure.cosmosdb.uri}")
     private String uri;
 
     @Value("${azure.cosmosdb.key}")
     private String key;
 
     @Value("${azure.cosmosdb.secondaryKey}")
     private String secondaryKey;
 
     @Value("${azure.cosmosdb.database}")
     private String dbName;
 
     @Value("${azure.cosmosdb.populateQueryMetrics}")
     private boolean populateQueryMetrics;
    
     private CosmosKeyCredential cosmosKeyCredential;
     
     public CosmosDBConfig getConfig() {
         this.cosmosKeyCredential = new CosmosKeyCredential(key);
         CosmosDbConfig cosmosdbConfig = CosmosDBConfig.builder(uri, 
             this.cosmosKeyCredential, dbName).build();
         cosmosdbConfig.setPopulateQueryMetrics(populateQueryMetrics);
         cosmosdbConfig.setResponseDiagnosticsProcessor(new ResponseDiagnosticsProcessorImplementation());
         return cosmosdbConfig;
     }
     
     public void switchToSecondaryKey() {
         this.cosmosKeyCredential.key(secondaryKey);
     }
}
```
- Customizing configuration to tweak connection mode, max connection pool size, request timeout, etc. 
```java
public CosmosDBConfig getConfig() {
    this.cosmosKeyCredential = new CosmosKeyCredential(key);
    ConnectionPolicy customizedConnectionPolicy = new ConnectionPolicy();
    //  Connection mode is Direct mode (TCP)
    customizedConnectionPolicy.setConnectionMode(ConnectionMode.DIRECT);
    //  Max http / tcp connections 1000 per application
    customizedConnectionPolicy.setMaxPoolSize(1000);
    //  Request timeout to 10 seconds. 
    customizedConnectionPolicy.requestTimeoutInMillis(10000);
    //  Idle connection timeout to 2 minutes
    customizedConnectionPolicy.idleConnectionTimeoutInMillis(120000);
    CosmosDBConfig cosmosDbConfig = CosmosDBConfig.builder(uri, this.cosmosKeyCredential, dbName)
                                                  .connectionPolicy(customizedConnectionPolicy)
                                                  .build();
    return cosmosDbConfig;
}
```
#### Response Diagnostics and Query Metrics
- Spring-data-cosmosdb SDK v2.2.x supports Response Diagnostics String and Query Metrics. 
- Set `populateQueryMetrics` flag to true in application.properties to enable query metrics.
- In addition to setting the flag, implement `ResponseDiagnosticsProcessor` to log diagnostics information.

```java
@Configuration
@EnableCosmosRepositories
@Slf4j
public class AppConfiguration extends AbstractCosmosConfiguration {
    ...
    @Value("${azure.cosmosdb.populateQueryMetrics}")
    private boolean populateQueryMetrics;

    private static class ResponseDiagnosticsProcessorImplementation implements ResponseDiagnosticsProcessor {
        
        @Override
        public void processResponseDiagnostics(@Nullable ResponseDiagnostics responseDiagnostics) {
            log.info("Response Diagnostics {}", responseDiagnostics);
        }
    }

}
```
#### Pagination and Sorting
- Spring-data-cosmosdb SDK supports [Spring Data pageable and sort](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.special-parameters).
- Based on available RUs on the database account, cosmosDB can return documents less than or equal to the requested size.
- Due to this variable number of returned documents in every iteration, user should not rely on the totalPageSize, and instead iterating over pageable should be done in this way.  
```java
    final Sort sort = Sort.by(Sort.Direction.DESC, "name");
    final CosmosPageRequest pageRequest = new CosmosPageRequest(0, pageSize, null, sort);
    Page<T> page = tRepository.findAll(pageRequest);
    List<T> pageContent = page.getContent();
    while(page.hasNext()) {
        Pageable nextPageable = page.nextPageable();
        page = repository.findAll(nextPageable);
        pageContent = page.getContent();
    }
```

## Common issues and workarounds
#### Getting correct CosmosDB configuration
- Extending `AbstractCosmosConfiguration` can be tricky because of various annotations and configurations present in the class. 
    - Most common issue of them being `Enable Repositories` annotation.
        - If the repositories extend `CosmosRepository` make sure to add this annotation `@EnableCosmosRepositories`
        - If the repositories extend `ReactiveCosmosRepository` make sure to add this annotation `@EnableReactiveCosmosRepositories`
        ```java
              @Configuration
              @PropertySource(value = {"classpath:application.properties"})
              @EnableCosmosRepositories
              @EnableReactiveCosmosRepositories
              public class TestRepositoryConfig extends AbstractCosmosConfiguration {
                  ...
              }
        ```
    - While creating or customizing `CosmosDBConfig` bean, make sure to use `CosmosKeyCredential` object instead of using the key directly.
    - CosmosKeyCredential feature provides capability to rotate keys on the fly. You can switch keys using switchToSecondaryKey().
    - `CosmosKeyCredential` should be a singleton object, as CosmosDB SDK uses the same object internally to detect changes in the key value inside this object. 
    
#### Custom query execution
- Query Annotation feature is not yet supported by spring-data-cosmosdb SDK. 
- Until then, custom and complex queries can be executed directly on `cosmosClient`, which is a bean exposed by spring application context. 
- Following shows a simple example on how to execute offset and limit queries using `cosmosClient` bean.
```java
    final FeedOptions feedOptions = new FeedOptions();
    //  cross partition query
    feedOptions.enableCrossPartitionQuery(true);
    //  page size
    feedOptions.maxItemCount(20);
    //  number of parallel operations on client-side SDK when executing parallel queries
    feedOptions.maxDegreeOfParallelism(2);
    //  populate query metrics from cosmosdb
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
    
#### Enable Diagnostics and Query Metrics  
- If debugging, it is helpful to have Diagnostics String and Query Metrics from CosmosDB SDK. 
- Response Diagnostics strings are logged by CosmosDB SDK whereas Query Metrics are logged by backend and are provided to CosmosDB SDK through `Query Response`
- `ResponseDiagnosticsProcessor.processResponseDiagnostics()` gets called after every API call in spring-data-cosmosdb SDK. Make sure to have a bug free implementation of this interface.
- It is important to have simple and optimal implementation, since it can affect application performance if implemented with too much complexity.
- Logging complete diagnostics can be costly as it contains numerous information, therefore should not be logged for all API calls. 
- Debug logging level should be used so it doesn't affect the application performance.  
- Following is an example of how to implement `ResponseDiagnosticsProcessor`
```java
private static class ResponseDiagnosticsProcessorImplementation implements ResponseDiagnosticsProcessor {
    
        @Override
        public void processResponseDiagnostics(@Nullable ResponseDiagnostics responseDiagnostics) {
            //  To log everything            
            if (log.isDebugEnabled()) {
                log.debug("Response Diagnostics {}", responseDiagnostics);
            }
            
            //  To log cosmos response diagnostics 
            if (responseDiagnostics != null && log.isDebugEnabled()) {
                CosmosResponseDiagnostics cosmosResponseDiagnostics = responseDiagnostics.getCosmosResponseDiagnostics();
                log.debug("Cosmos Response Diagnostics {}", cosmosResponseDiagnostics);
            }
    
            //  To log just request latency
            if (responseDiagnostics != null && log.isDebugEnabled()) {
                CosmosResponseDiagnostics cosmosResponseDiagnostics = responseDiagnostics.getCosmosResponseDiagnostics();
                log.debug("Request latency {}", cosmosResponseDiagnostics.requestLatency());
            }
            
            //  To log query metrics
            if (responseDiagnostics != null && log.isDebugEnabled()) {
                FeedResponseDiagnostics feedResponseDiagnostics =
                    responseDiagnostics.getFeedResponseDiagnostics();
                log.debug("Query metrics {}", feedResponseDiagnostics);
            }
        }
    }
```  

## How to troubleshoot
#### Connection issues
- If experiencing connection issues, make sure all required annotations in the configuration class are present and correct. 
- Refer to [Getting correct CosmosDB configuration](#getting-correct-cosmosdb-configuration) section to verify the annotations.

#### API exceptions
- Starting v2.2.1 of spring-data-cosmosdb SDK, exception handling is better than before.
- All the APIs return `CosmosDBAccessException`, which exposes `cosmosClientException` through getter. 
- `CosmosClientException` is thrown by Cosmos DB SDK and can be used to implement any retriable logic on the client-side.
- `CosmosClientException` is thrown by Cosmos DB SDK and can be used to implement any retriable logic on the client-side.
- Common retriable exceptions are `Resource already exists`, `Request rate too large`, `Request timeout exception`, etc.    

#### API or Query slowness
- If experiencing high latencies on APIs or Query executions, logging diagnostics strings and query metrics is the best bet. 
- Refer to [Enable Diagnostics and Query Metrics](#enable-diagnostics-and-query-metrics) section to enable, and log diagnostics strings and query metrics.
- Check for CPU usage, network bandwidth, and I/O disk space, which can be the root causes of client-side slowness.

#### Bug fixes
- Refer to [releases](https://github.com/microsoft/spring-data-cosmosdb/releases) to check for any bug fixes and new features.   
