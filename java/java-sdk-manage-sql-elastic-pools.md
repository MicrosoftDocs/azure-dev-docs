---
title: Manage SQL database elastic pools with Java | Microsoft Docs
description: Sample code to create and configure Azure SQL databases using the Azure SDK for Java
author: rloutlaw
manager: douge
ms.assetid: 9b461de8-46bc-4650-8e9e-59531f4e2a53
ms.topic: article
ms.service: Azure
ms.devlang: java
ms.technology: Azure
ms.date: 3/30/2017
ms.author: routlaw;asirveda
---

# Manage Azure SQL databases in elastic pools from your Java applications

[This sample](https://github.com/Azure-Samples/sql-database-java-manage-sql-dbs-in-elastic-pool) creates a SQL database server with an [elastic pool](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool) to manage and scale resources for mulitple databases in a single plan.

## Run the sample

Create an [authentication file](https://github.com/Azure/azure-sdk-for-java/blob/master/AUTH.md) and set an environment variable `AZURE_AUTH_LOCATION` with the full path to the file on your computer. Then run:

```
git clone https://github.com/Azure-Samples/sql-database-java-manage-sql-dbs-in-elastic-pool
cd sql-database-java-manage-sql-dbs-in-elastic-pool
mvn clean compile exec:java
```

[View the complete code sample on GitHub](https://github.com/Azure-Samples/sql-database-java-manage-sql-dbs-in-elastic-pool)

## Authenticate with Azure

[!INCLUDE [auth-include](includes/java-auth-include.md)]

## Create a SQL database server with an elastic pool

```java
SqlServer sqlServer = azure.sqlServers().define(sqlServerName)
                    .withRegion(Region.US_EAST)
                    .withNewResourceGroup(rgName)
                    .withAdministratorLogin(administratorLogin)
                    .withAdministratorPassword(administratorPassword)
                    // Use ElasticPoolEditions.STANDARD as the edition
                    // and create two databases
                    .withNewElasticPool(elasticPoolName, ElasticPoolEditions.STANDARD, 
                        database1Name, database2Name)
                    .create();
```

See the [ElasticPoolEditions class reference](https://docs.microsoft.com/java/api/com.microsoft.azure.management.sql._elastic_pool_editions) for current edition values. Review the [SQL database elastic pool documentation](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool) to compare edition resource characteristics. 

## Change Database Transaction Unit (DTU) settings in an elastic pool

```java
// Set an pool of 200 eDTUs to share between the databases
// and ensure that a database always has 10 DTUs available but never uses more than 50
elasticPool = elasticPool.update()
                    .withDtu(200)
                    .withDatabaseDtuMin(10)
                    .withDatabaseDtuMax(50)
                    .apply();
```

Review the [DTUs and eDTUs documentation](https://docs.microsoft.com/azure/sql-database/sql-database-what-is-a-dtu) to learn more about allocating resources to SQL databases.

## Create a new database and add it to an elastic pool

```java
// Add a newly created database to the elastic pool
SqlDatabase anotherDatabase = sqlServer.databases().define(anotherDatabaseName).create();
elasticPool.update().withExistingDatabase(anotherDatabase).apply();            
```

The API creates `anotherDatabase` at [S0 tier](https://docs.microsoft.com/azure/sql-database/sql-database-service-tiers) in the first statement. Moving `anotherDatabase` to the elastic pool assigns the database resources based on the pool settings.

## Remove a database from an elastic pool
```java
// Assign an edition since the database resources are no longer managed in the pool 
anotherDatabase = anotherDatabase.update()
                     .withoutElasticPool()
                     .withEdition(DatabaseEditions.STANDARD)
                     .apply();
```

See the [DatabaseEditions class reference](https://docs.microsoft.com/java/api/com.microsoft.azure.management.sql._database_editions) for values to pass to `withEdition()`.

## List current database activities in an elastic pool
```java
// get a list of in-flight elastic operations on databases in the pool and log them 
for (ElasticPoolDatabaseActivity databaseActivity : elasticPool.listDatabaseActivities()) {
    System.out.println("Database " + databaseActivity.databaseName() 
        + " performing operation " + databaseActivity.operation() + 
        " with objective " + databaseActivity.requestedServiceObjective());
}
```

Database activities include moving a database in or out of an elastic pool and updating databases in an elastic pool.


## List databases in an elastic pool
```java
// Log a list of databases in the elastic pool 
for (SqlDatabase databaseInServer : elasticPool.listDatabases()) {
    System.out.println(databaseInServer.name());
}
```

Review the methods in [com.microsoft.azure.management.sql.SqlDatabase](https://docs.microsoft.com/java/api/com.microsoft.azure.management.sql._sql_database) to query the databases in more detail.

## Delete an elastic pool
```java
sqlServer.elasticPools().delete(elasticPoolName);
```

The elastic pool must be empty before deleting it.

## Sample code summary.

The sample creates a SQL server with two databases managed in a single elasic pool. The elastic pool resource limits are updated, then additional databases are added to the pool. The code then reads the elastic pool's configuration and state. 

The sample deletes all resources it created before exiting.

| Class used in sample | Notes |
|-------|-------|
| [SqlServer](https://docs.microsoft.com/java/api/com.microsoft.azure.management.sql._sql_server) | SQL DB server in Azure created by `azure.sqlServers().define()...create()` fluent chain. Provides methods to create and work with elastic pools and databases. 
| [SqlDatabase](https://docs.microsoft.com/java/api/com.microsoft.azure.management.sql._sql_database) | Client side object representing a SQL database. Created through `sqlServer().define()...create()`. 
| [DatabaseEditions](https://docs.microsoft.com/java/api/com.microsoft.azure.management.sql._database_editions) | Constant static fields used to set database resources when creating a database outside of an elastic pool or when moving a database out of an elastic pool  
| [SqlElasticPool](https://docs.microsoft.com/java/api/com.microsoft.azure.management.sql._sql_elastic_pool) | Created from the `withNewElasticPool()` section of the fluent chain that created the SqlServer in Azure. Provides methods to set resource limits for databases running in the elastic pool and for the elastic pool itself. 
| [ElasticPoolEditions](https://docs.microsoft.com/java/api/com.microsoft.azure.management.sql._elastic_pool_editions) | Class of constant fields defining the resources available to an elastic pool. See [SQL database elastic pool documentation](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool) for tier details. 
| [ElasticPoolDatabaseActivity](https://docs.microsoft.com/java/api/com.microsoft.azure.management.sql._elastic_pool_database_activity) | Retreived from `SqlElasticPool.listDatabaseActivities()`. Each object of this type represents an activity performed on a database in the elastic pool.
| [ElasticPoolActivity](https://docs.microsoft.com/java/api/com.microsoft.azure.management.sql._elastic_pool_activity) | Retrieved in a List from `SqlElasticPool.listActivities()`. Each of object in the list represents an activity performed on the elastic pool (not the databases in the elastic pool).

## Next steps

[!INCLUDE [next-steps](includes/java-next-steps.md)]