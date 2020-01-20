---
author: yevster
ms.author: yebronsh
ms.topic: include
ms.date: 1/20/2020
---

### Inventory external resources

External resources, such as data sources, JMS message brokers, and others are injected via Java Naming and Directory Interface (JNDI). Some such resources may require migration or reconfiguration.

#### Inside your application

Inspect the *META-INF/context.xml* file. Look for `<Resource>` elements inside the `<Context>` element.

#### On the application server(s)

Inspect the *$CATALINA_BASE/conf/context.xml* and *$CATALINA_BASE/conf/server.xml* files as well as the *.xml* files found in *$CATALINA_BASE/conf/[engine-name]/[host-name]* directories.

In *context.xml* files, JNDI resources will be described by the `<Resource>` elements inside the top-level `<Context>` element.

In *server.xml* files, JNDI resources will be described by the `<Resource>` elements inside the `<GlobalNamingResources>` element.

#### Datasources

Datasources are JNDI resources with the `type` attribute set to `javax.sql.DataSource`. For each datasource, document the following information:

* What is the datasource name?
* What is the connection pool configuration?
* Where can I find the JDBC driver JAR file?

#### All other external resources

It isn't feasible to document every possible external dependency in this guide. It's your team's responsibility to verify that you can satisfy every external dependency of your application after the migration.
