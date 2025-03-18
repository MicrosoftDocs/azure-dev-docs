---
author: KarlErickson
ms.author: karler
ms.date: 03/18/2025
---

### Set up data sources

There are three core steps when registering a data source with JBoss Enterprise Application Platform (EAP): uploading the Java Database Connectivity (JDBC) driver, adding the JDBC driver as a module, and registering the module. For more information, see [Datasource Management](https://docs.redhat.com/en/documentation/red_hat_jboss_enterprise_application_platform/8.0/html/configuration_guide/datasource_management) in the JBoss EAP documentation. App Service is a stateless hosting service, so the configuration commands for adding and registering the data source module must be scripted and applied as the container starts.

To set up data sources, use the following steps.

1. Obtain your database's JDBC driver.

1. Create an XML module definition file for the JDBC driver. The example shown is a module definition for PostgreSQL. Be sure to replace the `resource-root path` value with the path to the JDBC driver you use.

   ```xml
   <?xml version="1.0" ?>
   <module xmlns="urn:jboss:module:1.1" name="org.postgres">
       <resources>
       <!-- ***** IMPORTANT: REPLACE THIS PLACEHOLDER *******-->
       <resource-root path="/home/site/deployments/tools/postgresql-42.2.12.jar" />
       </resources>
       <dependencies>
           <module name="javax.api"/>
           <module name="javax.transaction.api"/>
       </dependencies>
   </module>
   ```

1. Put your JBoss CLI commands into a file named **jboss-cli-commands.cli**. The JBoss commands must add the module and register it as a data source. The example shows the JBoss CLI commands for PostgreSQL.

   [!INCLUDE [security-note](../../includes/security-note.md)]

   ```bash
   module add --name=org.postgres --resources=/home/site/deployments/tools/postgresql-42.2.12.jar --module-xml=/home/site/deployments/tools/postgres-module.xml

   /subsystem=datasources/jdbc-driver=postgres:add(driver-name="postgres",driver-module-name="org.postgres",driver-class-name=org.postgresql.Driver,driver-xa-datasource-class-name=org.postgresql.xa.PGXADataSource)

   data-source add --name=postgresDS --driver-name=postgres --jndi-name=java:jboss/datasources/postgresDS --connection-url=${POSTGRES_CONNECTION_URL,env.POSTGRES_CONNECTION_URL:jdbc:postgresql://db:5432/postgres} --user-name=${POSTGRES_SERVER_ADMIN_FULL_NAME,env.POSTGRES_SERVER_ADMIN_FULL_NAME:postgres} --password=${POSTGRES_SERVER_ADMIN_PASSWORD,env.POSTGRES_SERVER_ADMIN_PASSWORD:example} --use-ccm=true --max-pool-size=5 --blocking-timeout-wait-millis=5000 --enabled=true --driver-class=org.postgresql.Driver --exception-sorter-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLExceptionSorter --jta=true --use-java-context=true --valid-connection-checker-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLValidConnectionChecker
   ```

1. Create a startup script called **startup_script.sh** that calls the JBoss CLI commands. The example shows how to call your **jboss-cli-commands.cli** file. Later you configure App Service to run this script when the instance starts.

   ```bash
   $JBOSS_HOME/bin/jboss-cli.sh --connect --file=/home/site/deployments/tools/jboss-cli-commands.cli
   ```

1. Using an FTP client of your choice, upload your JDBC driver, **jboss-cli-commands.cli**, **startup_script.sh**, and the module definition to **/site/deployments/tools/**.

1. Configure your site to run **startup_script.sh** when the container starts. In the Azure portal, navigate to **Configuration > General Settings > Startup Command**. Set the startup command field to **/home/site/deployments/tools/startup_script.sh**, then select **Save**.

1. Restart the web app, which causes it to run the configuration script.

1. Update the Java Transaction API (JTA) datasource configuration for your application.
Open the **src/main/resources/META-INF/persistence.xml** file for your app and find the `<jta-data-source>` element. Replace its contents as shown here:

   ```bash
   <jta-data-source>java:jboss/datasources/postgresDS</jta-data-source>
   ```

[!INCLUDE [build-and-deploy-war-to-app-service](build-and-deploy-war-to-app-service.md)]
