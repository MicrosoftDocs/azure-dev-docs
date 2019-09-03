---
title: 
description: End-to-end tutorial for Java App Service with MySQL
author: KarlErickson
manager: barbkess
ms.author: karler
ms.date: 08/38/2019
ms.service: app-service
ms.devlang: java
ms.topic: article
---

# Deploy a Spring app to App Service with MySQL

This tutorial walks you through the process of building, configuring, deploying, troubleshooting and scaling Java Web apps in App Service Linux.

This tutorial builds on the popular Spring PetClinic sample application. In this topic, you will test an HSQLDB version of the app locally, then deploy it to Azure App Service. After that, you will configure and deploy a MySQL version. Finally, you will learn how to access the app logs, and increase the number of workers to scale out.

## Prerequisites

* [Azure CLI](http://docs.microsoft.com/cli/azure/overview)
* [Java 8](http://java.oracle.com/)
* [Maven 3](http://maven.apache.org/)
* [Git](https://github.com/)
* [Tomcat](https://tomcat.apache.org/download-80.cgi)
* [MySQL CLI](http://dev.mysql.com/downloads/mysql/)

## Get the sample

To get started with the sample, clone and prepare it using the following commands.

```bash
git clone --recurse-submodules https://github.com/Azure-Samples/e2e-java-experience-in-app-service-linux.git
cd e2e-java-experience-in-app-service-linux
yes | cp -rf .prep/* .
```

## Build and run the HSQLDB sample locally

First, test the sample locally using using HSQLDB as the database. Navigate to the HSQLDB version of the sample and then build it.

```bash
cd initial-hsqldb/spring-framework-petclinic
mvn package
```

Next, set the TOMCAT_HOME environment variable to the location of your Tomcat installation.

```bash
export TOMCAT_HOME=<Tomcat install directory>
```

Next, update the *pom.xml* file to configure Maven for a Tomcat WAR file deployment. Add the following XML as a child of the existing `<plugins>` element. If necessary, change `1.7.7` to the current version of the [Cargo Maven 2 Plugin](https://mvnrepository.com/artifact/org.codehaus.cargo/cargo-maven2-plugin).

```xml
<plugin>
    <groupId>org.codehaus.cargo</groupId>
    <artifactId>cargo-maven2-plugin</artifactId>
    <version>1.7.7</version>
    <configuration>
        <container>
            <containerId>tomcat8x</containerId>
            <type>installed</type>
            <home>${TOMCAT_HOME}</home>
        </container>
        <configuration>
            <type>existing</type>
            <home>${TOMCAT_HOME}</home>
        </configuration>
        <deployables>
            <deployable>
                <groupId>${project.groupId}</groupId>
                <artifactId>${project.artifactId}</artifactId>
                <type>war</type>
                <properties>
                    <context>/</context>
                </properties>
            </deployable>
        </deployables>
    </configuration>
</plugin>
```

With this configuration in place, you can deploy the app locally to Tomcat.

```bash
mvn cargo:deploy
```

Finally, launch the Catalina server from your Tomcat install directory.

```bash
cd ${TOMCAT_HOME}
./bin/catalina.sh run
```

You can now navigate your browser to [http://localhost:8080](http://localhost:8080) to see the running app and get a feel for how it works.

## Deploy to Azure App Service

Now that you've seen it running locally, deploy the app to Azure.

First, set the following environment variables. Maven will use these values to create the Azure resources with the names you provide. By using environment variables, you can keep your account secrets out of your source files.

```bash
export RESOURCEGROUP_NAME=<resource group>
export WEBAPP_NAME=<web app>
export WEBAPP_PLAN_NAME=${WEBAPP_NAME}-appservice-plan
export REGION=<region>
```

Then, update the *pom.xml* file to configure Maven for an Azure deployment. Add the following XML after the `<plugin>` element you added previously. If necessary, change `1.7.0` to the current version of the [Maven Plugin for Azure App Service](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme).

```xml
<plugin>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-webapp-maven-plugin</artifactId>
    <version>1.7.0</version>
    <configuration>
        <resourceGroup>${RESOURCEGROUP_NAME}</resourceGroup>
        <appServicePlanName>${WEBAPP_PLAN_NAME}</appServicePlanName>
        <appName>${WEBAPP_NAME}</appName>
        <region>${REGION}</region>
        <linuxRuntime>tomcat 8.5-jre8</linuxRuntime>
    </configuration>
</plugin>
```

Next, sign in to Azure and deploy the app to App Service Linux.

```bash
az login
mvn azure-webapp:deploy
```

You can now navigate to `https://<app name>.azurewebsites.net` to see the running app.

## Create a MySQL instance on Azure

Now, you can switch the app to use MySQL instead of HSQLDB. You'll create a MySQL server instance on Azure and add a database, then you'll update your app configuration with the new database connection info.

First, set the following environment variables for use in later steps.

<!-- Maybe should link to validation rules - e.g. no punctuation in database name, strong password, admin length max 15, etc. -->

```bash
export MYSQL_SERVER_NAME=<server>
export MYSQL_SERVER_FULL_NAME=${MYSQL_SERVER_NAME}.mysql.database.azure.com
export MYSQL_SERVER_ADMIN_LOGIN_NAME=<admin>
export MYSQL_SERVER_ADMIN_PASSWORD=<password>
export MYSQL_DATABASE_NAME=<database>
export DOLLAR=\$
```

Next, use [az mysql up](/cli/azure/ext/db-up/mysql?view=azure-cli-latest#ext-db-up-az-mysql-up) to create and initialize the database server.

<!-- say something about the timeout and timezone after understanding the requirement for these -->

<!-- timeout of 2147483 is ~25 days. default is 8 hours. is the change necessary? -->

<!-- time_zone: US/Pacific gave an error. "Named time zones can be used only if the time zone information tables in the mysql database have been created and populated." See https://dev.mysql.com/doc/refman/8.0/en/time-zone-support.html. -->

```azurecli
az mysql up \
    --resource-group ${RESOURCEGROUP_NAME} \
    --server-name ${MYSQL_SERVER_NAME} \
    --database-name ${MYSQL_DATABASE_NAME} \
    --admin-user ${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
    --admin-password ${MYSQL_SERVER_ADMIN_PASSWORD}

// increase connection timeout
az mysql server configuration set --name wait_timeout \
 --resource-group ${RESOURCEGROUP_NAME} \
 --server ${MYSQL_SERVER_NAME} --value 2147483

// set server timezone
az mysql server configuration set --name time_zone \
 --resource-group ${RESOURCEGROUP_NAME} \
 --server ${MYSQL_SERVER_NAME} --value -8:00
```

<!-- REMOVE NEXT SECTION? 
     confirm whether this is even needed. Does az mysql up handle this, too? -->

Next, use the MySQL CLI to create the database.

```bash
mysql -u ${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
 -h ${MYSQL_SERVER_FULL_NAME} -P 3306 -p
```

At the MySQL CLI prompt, run the following command.

```console
CREATE DATABASE ${MYSQL_DATABASE_NAME};
```

<!-- environment variables didn't work for me inside MySQL CLI. need to use placeholder instead I think, if we still need this section. -->

Next, update the *pom.xml* file to make MySQL the active configuration. Remove the `<activation>` element from the HSQLDB profile and put it in the MySQL profile instead, as shown here. As you can see, the environment variables you set previously are being used by Maven to configure your MySQL access.

```xml
<profile>
    <id>MySQL</id>
    <activation>
        <activeByDefault>true</activeByDefault>
    </activation>
    <properties>
        <db.script>mysql</db.script>
        <jpa.database>MYSQL</jpa.database>
        <jdbc.driverClassName>com.mysql.jdbc.Driver</jdbc.driverClassName>
        <jdbc.url>jdbc:mysql://${DOLLAR}{MYSQL_SERVER_FULL_NAME}:3306/${DOLLAR}{MYSQL_DATABASE_NAME}?useUnicode=true</jdbc.url>
        <jdbc.username>${DOLLAR}{MYSQL_SERVER_ADMIN_LOGIN_NAME}</jdbc.username>
        <jdbc.password>${DOLLAR}{MYSQL_SERVER_ADMIN_PASSWORD}</jdbc.password>
    </properties>
    ...
</profile>
```

<!-- remove the ellipsis? say more about JDBC etc here?  -->

Then, update the *pom.xml* file to configure Maven for an Azure deployment and for MySQL use. Add the following XML after the `plugin` element you added previously. If necessary, change `1.7.0` to the current version of the [Maven Plugin for Azure App Service](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme).

```xml
<plugin>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-webapp-maven-plugin</artifactId>
    <version>1.7.0</version>
    <configuration>

        <resourceGroup>${RESOURCEGROUP_NAME}</resourceGroup>
        <appServicePlanName>${WEBAPP_PLAN_NAME}</appServicePlanName>
        <appName>${WEBAPP_NAME}</appName>
        <region>${REGION}</region>

        <linuxRuntime>tomcat 8.5-jre8</linuxRuntime>

        <appSettings>
            <property>
                <name>MYSQL_SERVER_FULL_NAME</name>
                <value>${MYSQL_SERVER_FULL_NAME}</value>
            </property>
            <property>
                <name>MYSQL_SERVER_ADMIN_LOGIN_NAME</name>
                <value>${MYSQL_SERVER_ADMIN_LOGIN_NAME}</value>
            </property>
            <property>
                <name>MYSQL_SERVER_ADMIN_PASSWORD</name>
                <value>${MYSQL_SERVER_ADMIN_PASSWORD}</value>
            </property>
            <property>
                <name>MYSQL_DATABASE_NAME</name>
                <value>${MYSQL_DATABASE_NAME}</value>
            </property>
        </appSettings>

    </configuration>
</plugin>
```

