---
author: mnriem
ms.author: manriem
ms.date: 2/28/2020
---

### Create a Docker image for WildFly

To create a Dockerfile, you'll need the following prerequisites:

* A supported JDK.
* An install of WildFly.
* Your JVM runtime options.
* A way to pass in environment variables (if applicable).

You can then perform the steps described in the following sections, where applicable. You can use the [WildFly Container Quickstart repo](https://github.com/Azure/wildfly-container-quickstart) as a starting point for your Dockerfile and web application.

1. [Configure KeyVault FlexVolume](#configure-keyvault-flexvolume)
2. [Set up data sources](#set-up-data-sources)
3. [Set up JNDI resources](#set-up-jndi-resources)
4. [Review WildFly configuration](#review-wildfly-configuration)

#### Configure KeyVault FlexVolume

Create an Azure KeyVault and populate all the necessary secrets. For more information, see [Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI](/azure/key-vault/quick-create-cli). Then, configure a [KeyVault FlexVolume](https://github.com/Azure/kubernetes-keyvault-flexvol/blob/master/README.md) to make those secrets accessible to pods.

You will also need to update the startup script used to bootstrap WildFly. This script must import the certificates into the keystore used by WildFly before starting the server.

#### Set up data sources

To configure WildFly to access a data source, you'll need to add the JDBC driver JAR to your Docker image, and then execute the appropriate JBoss CLI commands. These commands must set up the data source when building your Docker image.

The following steps provide instructions for PostgreSQL, MySQL and SQL Server.

1. Download the JDBC driver for [PostgreSQL](https://jdbc.postgresql.org/download.html), [MySQL](https://dev.mysql.com/downloads/connector/j/), or [SQL Server](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server).

    Unpack the downloaded archive to get the driver .jar file.

1. Create a file with a name like `module.xml` and add the following markup. Replace the `<module name>` placeholder (including the angle brackets) with `org.postgres` for PostgreSQL, `com.mysql` for MySQL, or `com.microsoft` for SQL Server. Replace `<JDBC .jar file path>` with the name of the .jar file from the previous step, including the full path to the location you will place the file in your Docker image, for example in `/opt/database`.

    ```xml
    <?xml version="1.0" ?>
    <module xmlns="urn:jboss:module:1.1" name="<module name>">
        <resources>
           <resource-root path="<JDBC .jar file path>" />
        </resources>
        <dependencies>
            <module name="javax.api"/>
            <module name="javax.transaction.api"/>
        </dependencies>
    </module>
    ```

1. Create a file with a name like `datasource-commands.cli` and add the following code. Replace `<JDBC .jar file path>` with the value you used in the previous step. Replace `<module file path>` with the file name and path from the previous step, for example `/opt/database/module.xml`.

    **PostgreSQL**

    ```console
    batch
    module add --name=org.postgres --resources=<JDBC .jar file path> --module-xml=<module file path>
    /subsystem=datasources/jdbc-driver=postgres:add(driver-name=postgres,driver-module-name=org.postgres,driver-class-name=org.postgresql.Driver,driver-xa-datasource-class-name=org.postgresql.xa.PGXADataSource)
    data-source add --name=postgresDS --driver-name=postgres --jndi-name=java:jboss/datasources/postgresDS --connection-url=$DATABASE_CONNECTION_URL --user-name=$DATABASE_SERVER_ADMIN_FULL_NAME --password=$DATABASE_SERVER_ADMIN_PASSWORD --use-ccm=true --max-pool-size=5 --blocking-timeout-wait-millis=5000 --enabled=true --driver-class=org.postgresql.Driver --exception-sorter-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLExceptionSorter --jta=true --use-java-context=true --valid-connection-checker-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLValidConnectionChecker
    reload
    run batch
    shutdown
    ```

    **MySQL**

    ```console
    batch
    module add --name=com.mysql --resources=<JDBC .jar file path> --module-xml=<module file path>
    /subsystem=datasources/jdbc-driver=mysql:add(driver-name=mysql,driver-module-name=com.mysql,driver-class-name=com.mysql.cj.jdbc.Driver)
    data-source add --name=mysqlDS --jndi-name=java:jboss/datasources/mysqlDS --connection-url=$DATABASE_CONNECTION_URL --driver-name=mysql --user-name=$DATABASE_SERVER_ADMIN_FULL_NAME --password=$DATABASE_SERVER_ADMIN_PASSWORD --use-ccm=true --max-pool-size=5 --blocking-timeout-wait-millis=5000 --enabled=true --driver-class=com.mysql.cj.jdbc.Driver --jta=true --use-java-context=true --exception-sorter-class-name=com.mysql.cj.jdbc.integration.jboss.ExtendedMysqlExceptionSorter
    reload
    run batch
    shutdown
    ```

    **SQL Server**

    ```console
    batch
    module add --name=com.microsoft --resources=<JDBC .jar file path> --module-xml=<module file path>
    /subsystem=datasources/jdbc-driver=sqlserver:add(driver-name=sqlserver,driver-module-name=com.microsoft,driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver,driver-datasource-class-name=com.microsoft.sqlserver.jdbc.SQLServerDataSource)
    data-source add --name=sqlDS --jndi-name=java:jboss/datasources/sqlDS --driver-name=sqlserver --connection-url=$DATABASE_CONNECTION_URL --validate-on-match=true --background-validation=false --valid-connection-checker-class-name=org.jboss.jca.adapters.jdbc.extensions.mssql.MSSQLValidConnectionChecker --exception-sorter-class-name=org.jboss.jca.adapters.jdbc.extensions.mssql.MSSQLExceptionSorter
    reload
    run batch
    shutdown
    ```

1. Update the the JTA datasource configuration for your application:

    Open the `src/main/resources/META-INF/persistence.xml` file for your app and find the `<jta-data-source>` element. Replace its contents as shown here:

    **PostgreSQL**

    ```xml
    <jta-data-source>java:jboss/datasources/postgresDS</jta-data-source>
    ```

    **MySQL**

    ```xml
    <jta-data-source>java:jboss/datasources/mysqlDS</jta-data-source>
    ```

    **SQL Server**

    ```xml
    <jta-data-source>java:jboss/datasources/postgresDS</jta-data-source>
    ```

1. Add the following to your `Dockerfile` so the data source is created when you build your Docker image

    ```console
    RUN /bin/bash -c '<WILDFLY_INSTALL_PATH>/bin/standalone.sh --start-mode admin-only &' && \
    sleep 30 && \
    <WILDFLY_INSTALL_PATH>/bin/jboss-cli.sh -c --file=/opt/database/datasource-commands.cli && \
    sleep 30
    ```

1. Determine the `DATABASE_CONNECTION_URL` to use as they are different for each database server, and different than the values on the Azure portal. The URL formats shown here are required for use by WildFly:

    **PostgreSQL**

    ```console
    jdbc:postgresql://<database server name>:5432/<database name>?ssl=true
    ```

    **MySQL**

    ```console
    jdbc:mysql://<database server name>:3306/<database name>?ssl=true\&useLegacyDatetimeCode=false\&serverTimezone=GMT
    ```

    **SQL Server**

    ```console
    jdbc:sqlserver://<database server name>:1433;database=<database name>;user=<admin name>;password=<admin password>;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
    ```

1. When creating your deployment YAML at a later stage you will need to pass the following environment variables, `DATABASE_CONNECTION_URL`, `DATABASE_SERVER_ADMIN_FULL_NAME` and `DATABASE_SERVER_ADMIN_PASSWORD` with the appropriate values.

For more info on configuring database connectivity with WildFly, see [PostgreSQL](https://developer.jboss.org/blogs/amartin-blog/2012/02/08/how-to-set-up-a-postgresql-jdbc-driver-on-jboss-7), [MySQL](https://docs.jboss.org/jbossas/docs/Installation_And_Getting_Started_Guide/5/html/Using_other_Databases.html#Using_other_Databases-Using_MySQL_as_the_Default_DataSource), or [SQL Server](https://docs.jboss.org/jbossas/docs/Installation_And_Getting_Started_Guide/5/html/Using_other_Databases.html#d0e3898).

#### Set up JNDI resources

To set up each JNDI resource you need to configure on WildFly, you will generally use the following steps:

1. Download the necessary JAR files and copy them into the Docker image.
2. Create a WildFly *module.xml* file referencing those JAR files.
3. Create any configuration needed by the specific JNDI resource.
4. Create JBoss CLI script to be used during Docker build to register the JNDI resource.
5. Add everything to Dockerfile.
6. Pass the appropriate environment variables in your deployment YAML.

The example below shows the steps needed to create the JNDI resource for JMS connectivity to Azure Service Bus.

1. Download the [Apache Qpid JMS provider](https://qpid.apache.org/components/jms/index.html)

    Unpack the downloaded archive to get the .jar files.

1. Create a file with a name like `module.xml` and add the following markup in `/opt/servicebus`. Make sure the version numbers of the JAR files align with the names of the JAR files of the previous step.

    ```xml
    <?xml version="1.0" ?>
    <module xmlns="urn:jboss:module:1.1" name="org.jboss.genericjms.provider">
     <resources>
      <resource-root path="proton-j-0.31.0.jar"/>
      <resource-root path="qpid-jms-client-0.40.0.jar"/>
      <resource-root path="slf4j-log4j12-1.7.25.jar"/>
      <resource-root path="slf4j-api-1.7.25.jar"/>
      <resource-root path="log4j-1.2.17.jar"/>
      <resource-root path="netty-buffer-4.1.32.Final.jar" />
      <resource-root path="netty-codec-4.1.32.Final.jar" />
      <resource-root path="netty-codec-http-4.1.32.Final.jar" />
      <resource-root path="netty-common-4.1.32.Final.jar" />
      <resource-root path="netty-handler-4.1.32.Final.jar" />
      <resource-root path="netty-resolver-4.1.32.Final.jar" />
      <resource-root path="netty-transport-4.1.32.Final.jar" />
      <resource-root path="netty-transport-native-epoll-4.1.32.Final-linux-x86_64.jar" />
      <resource-root path="netty-transport-native-kqueue-4.1.32.Final-osx-x86_64.jar" />
      <resource-root path="netty-transport-native-unix-common-4.1.32.Final.jar" />
      <resource-root path="qpid-jms-discovery-0.40.0.jar" />
     </resources>
     <dependencies>
      <module name="javax.api"/>
      <module name="javax.jms.api"/>
     </dependencies>
    </module>
    ```

1. Create a `jndi.properties` file in `/opt/servicebus`.

    ```console
    connectionfactory.${MDB_CONNECTION_FACTORY}=amqps://${DEFAULT_SBNAMESPACE}.servicebus.windows.net?amqp.idleTimeout=120000&jms.username=${SB_SAS_POLICY}&jms.password=${SB_SAS_KEY}
    queue.${MDB_QUEUE}=${SB_QUEUE}
    topic.${MDB_TOPIC}=${SB_TOPIC}
    ```

1. Create a file with a name like `servicebus-commands.cli` and add the following code.

    ```console
    batch
    /subsystem=ee:write-attribute(name=annotation-property-replacement,value=true)
    /system-property=property.mymdb.queue:add(value=myqueue)
    /system-property=property.connection.factory:add(value=java:global/remoteJMS/SBF)
    /subsystem=ee:list-add(name=global-modules, value={"name" => "org.jboss.genericjms.provider", "slot" =>"main"}
    /subsystem=naming/binding="java:global/remoteJMS":add(binding-type=external-context,module=org.jboss.genericjms.provider,class=javax.naming.InitialContext,environment=[java.naming.factory.initial=org.apache.qpid.jms.jndi.JmsInitialContextFactory,org.jboss.as.naming.lookup.by.string=true,java.naming.provider.url=/opt/servicebus/jndi.properties])
    /subsystem=resource-adapters/resource-adapter=generic-ra:add(module=org.jboss.genericjms,transaction-support=XATransaction)
    /subsystem=resource-adapters/resource-adapter=generic-ra/connection-definitions=sbf-cd:add(class-name=org.jboss.resource.adapter.jms.JmsManagedConnectionFactory, jndi-name=java:/jms/${MDB_CONNECTION_FACTORY})
    /subsystem=resource-adapters/resource-adapter=generic-ra/connection-definitions=sbf-cd/config-properties=ConnectionFactory:add(value=${MDB_CONNECTION_FACTORY})
    /subsystem=resource-adapters/resource-adapter=generic-ra/connection-definitions=sbf-cd/config-properties=JndiParameters:add(value="java.naming.factory.initial=org.apache.qpid.jms.jndi.JmsInitialContextFactory;java.naming.provider.url=/opt/servicebus/jndi.properties")
    /subsystem=resource-adapters/resource-adapter=generic-ra/connection-definitions=sbf-cd:write-attribute(name=security-application,value=true)
    /subsystem=ejb3:write-attribute(name=default-resource-adapter-name, value=generic-ra)
    run-batch
    reload
    shutdown
    ```

1. Add the following to your `Dockerfile` so the JNDI resource is created when you build your Docker image

    ```console
    RUN /bin/bash -c '<WILDFLY_INSTALL_PATH>/bin/standalone.sh --start-mode admin-only &' && \
    sleep 30 && \
    <WILDFLY_INSTALL_PATH>/bin/jboss-cli.sh -c --file=/opt/servicebus/servicebus-commands.cli && \
    sleep 30
    ```

1. When creating your deployment YAML at a later stage you will need to pass the following environment variables, `MDB_CONNECTION_FACTORY`, `DEFAULT_SBNAMESPACE` and `SB_SAS_POLICY`, `SB_SAS_KEY`, `MDB_QUEUE`, `SB_QUEUE`, `MDB_TOPIC` and `SB_TOPIC` with the appropriate values.

#### Review WildFly configuration

Review the [WildFly Admin Guide](https://docs.wildfly.org/18/Admin_Guide.html) to cover any additional pre-migration steps not covered by the previous guidance.
