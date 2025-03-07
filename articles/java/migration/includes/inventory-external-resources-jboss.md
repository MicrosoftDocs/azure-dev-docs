---
author: KarlErickson
ms.author: karler
ms.date: 05/27/2021
---

### Inventory external resources

External resources, such as data sources, JMS message brokers, and others are injected via Java Naming and Directory Interface (JNDI). Some such resources may require migration or reconfiguration.

#### Inside your application

Inspect the **WEB-INF/jboss-web.xml** and/or **WEB-INF/web.xml** files. Look for `<Resource>` elements inside the `<Context>` element.

#### Datasources

Datasources are JNDI resources with the `type` attribute set to `javax.sql.DataSource`. For each datasource,     document the following information:

* What is the datasource name?
* What is the connection pool configuration?
* Where can I find the JDBC driver JAR file?

For more information, see [About JBoss EAP Datasources](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.3/html/configuration_guide/datasource_management) in the JBoss EAP documentation.

#### All other external resources

It isn't feasible to document every possible external dependency in this guide. It's your team's responsibility to verify that you can satisfy every external dependency of your application after the migration.
