---
title: Deploy a Spring/Tomcat app to App Service with Azure Database for MySQL
description: End-to-end tutorial for Java App Service with MySQL
author: KarlErickson
ms.author: karler
ms.date: 11/12/2019
ms.service: app-service
ms.topic: article
---

# Deploy a Spring app to App Service with MySQL

This tutorial walks you through the process of building, configuring, deploying, troubleshooting and scaling Java web apps in App Service Linux.

This tutorial builds on the popular Spring PetClinic sample app. In this topic, you will test an HSQLDB version of the app locally, then deploy it to [Azure App Service](/azure/app-service/containers). After that, you will configure and deploy a version that uses [Azure Database for MySQL](/azure/mysql). Finally, you will learn how to access the app logs and scale out by increasing the number of workers running your app.

## Prerequisites

* [Azure CLI](/cli/azure/overview)
* [Java 8](http://java.oracle.com/)
* [Maven 3](http://maven.apache.org/)
* [Git](https://github.com/)
* [Tomcat](https://tomcat.apache.org/download-80.cgi)
* [MySQL CLI](http://dev.mysql.com/downloads/mysql/)

## Get the sample

To get started with the sample app, clone and prepare the source repo using the following commands.

# [bash](#tab/bash)

```bash
git clone --recurse-submodules https://github.com/Azure-Samples/e2e-java-experience-in-app-service-linux.git
cd e2e-java-experience-in-app-service-linux
yes | cp -rf .prep/* .
```

# [PowerShell](#tab/powershell)

```ps
git clone --recurse-submodules https://github.com/Azure-Samples/e2e-java-experience-in-app-service-linux.git
cd e2e-java-experience-in-app-service-linux
xcopy .\.prep . /s /e /h /q /y
```

# [Cmd](#tab/cmd)

```bash
git clone --recurse-submodules https://github.com/Azure-Samples/e2e-java-experience-in-app-service-linux.git
cd e2e-java-experience-in-app-service-linux
xcopy .\.prep . /s /e /h /q /y
```
---


## Build and run the HSQLDB sample locally

First, we'll test the sample locally using using HSQLDB as the database.

Navigate to the HSQLDB version of the sample and then build it.

```bash
cd initial-hsqldb/spring-framework-petclinic
mvn package
```

Next, set the TOMCAT_HOME environment variable to the location of your Tomcat installation.

# [bash](#tab/bash)

```bash
export TOMCAT_HOME=<Tomcat install directory>
```

# [PowerShell](#tab/powershell)

```ps
$TOMCAT_HOME="<Tomcat install directory>"
````

# [Cmd](#tab/cmd)

```bash
set TOMCAT_HOME=<Tomcat install directory>
```
---

Then, update the *pom.xml* file to configure Maven for a Tomcat WAR file deployment. Add the following XML as a child of the existing `<plugins>` element. If necessary, change `1.7.11` to the current version of the [Cargo Maven 2 Plugin](https://mvnrepository.com/artifact/org.codehaus.cargo/cargo-maven2-plugin).

```xml
<plugin>
    <groupId>org.codehaus.cargo</groupId>
    <artifactId>cargo-maven2-plugin</artifactId>
    <version>1.7.11</version>
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

Then, launch Tomcat.

# [bash](#tab/bash)

```bash
${TOMCAT_HOME}/bin/catalina.sh run
```

# [PowerShell](#tab/powershell)

```ps
& $TOMCAT_HOME/bin/catalina.bat run
````

# [Cmd](#tab/cmd)

```bash
%TOMCAT_HOME%\bin\catalina.bat run
```
---

You can now navigate your browser to [http://localhost:8080](http://localhost:8080) to see the running app and get a feel for how it works. When you are finished, select Ctrl+C at the Bash prompt to stop Tomcat.

## Deploy to Azure App Service

Now that you've seen it running locally, we'll deploy the app to Azure.

First, set the following environment variables.

# [bash](#tab/bash)

```bash
export RESOURCEGROUP_NAME=<resource group>
export WEBAPP_NAME=<web app>
export WEBAPP_PLAN_NAME=${WEBAPP_NAME}-appservice-plan
export REGION=<region>
```

# [PowerShell](#tab/powershell)

```ps
$RESOURCEGROUP_NAME="<resource group>"
$WEBAPP_NAME="<web app>"
$WEBAPP_PLAN_NAME="$WEBAPP_NAME-appservice-plan"
$REGION="<region>"
````

# [Cmd](#tab/cmd)

```bash
set RESOURCEGROUP_NAME=<resource group>
set WEBAPP_NAME=<web app>
set WEBAPP_PLAN_NAME=%WEBAPP_NAME%-appservice-plan
set REGION=<region>
```
---

Maven will use these values to create the Azure resources with the names you provide. By using environment variables, you can keep your account secrets out of your project files.

Next, update the *pom.xml* file to configure Maven for an Azure deployment. Add the following XML after the `<plugin>` element you added previously. If necessary, change `1.9.0` to the current version of the [Maven Plugin for Azure App Service](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme).

```xml
<plugin>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-webapp-maven-plugin</artifactId>
    <version>1.9.0</version>
    <configuration>
        <schemaVersion>v2</schemaVersion>
        <resourceGroup>${RESOURCEGROUP_NAME}</resourceGroup>
        <appServicePlanName>${WEBAPP_PLAN_NAME}</appServicePlanName>
        <appName>${WEBAPP_NAME}</appName>
        <region>${REGION}</region>
        <runtime>
            <os>linux</os>
            <javaVersion>jre8</javaVersion>            
            <webContainer>TOMCAT 8.5</webContainer>
        </runtime>
    </configuration>
</plugin>
```

Next, sign in to Azure.

```azurecli
az login
```

Then deploy the app to App Service Linux.

```bash
mvn azure-webapp:deploy
```

You can now navigate to `https://<app-name>.azurewebsites.net` (after replacing `<app-name>`) to see the running app.

## Set up Azure Database for MySQL

Next, we'll switch to using MySQL instead of HSQLDB. We'll create a MySQL server instance on Azure and add a database, then we'll update the app configuration with the new database connection info.

First, set the following environment variables for use in later steps.

# [bash](#tab/bash)

```bash
export MYSQL_SERVER_NAME=<server>
export MYSQL_SERVER_FULL_NAME=${MYSQL_SERVER_NAME}.mysql.database.azure.com
export MYSQL_SERVER_ADMIN_LOGIN_NAME=<admin>
export MYSQL_SERVER_ADMIN_PASSWORD=<password>
export MYSQL_DATABASE_NAME=<database>
export DOLLAR=\$
```

# [PowerShell](#tab/powershell)

```ps
$MYSQL_SERVER_NAME="<server>"
$MYSQL_SERVER_FULL_NAME="$MYSQL_SERVER_NAME.mysql.database.azure.com"
$MYSQL_SERVER_ADMIN_LOGIN_NAME="<admin>"
$MYSQL_SERVER_ADMIN_PASSWORD="<password>"
$MYSQL_DATABASE_NAME="<database>"
$DOLLAR="$"
````

# [Cmd](#tab/cmd)

```bash
set MYSQL_SERVER_NAME=<server>
set MYSQL_SERVER_FULL_NAME=%MYSQL_SERVER_NAME%.mysql.database.azure.com
set MYSQL_SERVER_ADMIN_LOGIN_NAME=<admin>
set MYSQL_SERVER_ADMIN_PASSWORD=<password>
set MYSQL_DATABASE_NAME=<database>
set DOLLAR=$
```
---

Next, create and initialize the database server. Use [az mysql up](/cli/azure/ext/db-up/mysql?view=azure-cli-latest#ext-db-up-az-mysql-up) for the initial configuration. Then use [az mysql server configuration set](/cli/azure/mysql/server/configuration?view=azure-cli-latest#az-mysql-server-configuration-set) to increase the connection timeout and set the server timezone.

# [bash](#tab/bash)

```bash
az mysql up \
    --resource-group ${RESOURCEGROUP_NAME} \
    --server-name ${MYSQL_SERVER_NAME} \
    --database-name ${MYSQL_DATABASE_NAME} \
    --admin-user ${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
    --admin-password ${MYSQL_SERVER_ADMIN_PASSWORD}

az mysql server configuration set --name wait_timeout \
    --resource-group ${RESOURCEGROUP_NAME} \
    --server ${MYSQL_SERVER_NAME} --value 2147483

az mysql server configuration set --name time_zone \
    --resource-group ${RESOURCEGROUP_NAME} \
    --server ${MYSQL_SERVER_NAME} --value -8:00
```

# [PowerShell](#tab/powershell)

```ps
az mysql up `
    --resource-group $RESOURCEGROUP_NAME `
    --server-name $MYSQL_SERVER_NAME `
    --database-name $MYSQL_DATABASE_NAME `
    --admin-user $MYSQL_SERVER_ADMIN_LOGIN_NAME `
    --admin-password $MYSQL_SERVER_ADMIN_PASSWORD

az mysql server configuration set --name wait_timeout `
    --resource-group $RESOURCEGROUP_NAME `
    --server $MYSQL_SERVER_NAME --value 2147483

az mysql server configuration set --name time_zone `
    --resource-group $RESOURCEGROUP_NAME `
    --server $MYSQL_SERVER_NAME --value -8:00
````

# [Cmd](#tab/cmd)

```bash
set MYSQL_SERVER_NAME=<server>
set MYSQL_SERVER_FULL_NAME=%MYSQL_SERVER_NAME%.mysql.database.azure.com
set MYSQL_SERVER_ADMIN_LOGIN_NAME=<admin>
set MYSQL_SERVER_ADMIN_PASSWORD=<password>
set MYSQL_DATABASE_NAME=<database>
set DOLLAR=$
```
---

Then, use the MySQL CLI to create the database.

# [bash](#tab/bash)

```bash
mysql -u ${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
 -h ${MYSQL_SERVER_FULL_NAME} -P 3306 -p
```

# [PowerShell](#tab/powershell)

```ps
mysql -u $MYSQL_SERVER_ADMIN_LOGIN_NAME `
 -h $MYSQL_SERVER_FULL_NAME -P 3306 -p
````

# [Cmd](#tab/cmd)

```bash
mysql -u %MYSQL_SERVER_ADMIN_LOGIN_NAME% ^
 -h %MYSQL_SERVER_FULL_NAME% -P 3306 -p
```
---

At the MySQL CLI prompt, run the following command, replacing `<database name>` with same value you specified earlier for the `MYSQL_DATABASE_NAME` environment variable.

```console
CREATE DATABASE <database name>;
```

MySQL is now ready for use.

## Configure the app for MySQL

Next, we'll add the connection info to the MySQL version of the app, then deploy it to App Service.

First, navigate to the correct folder at the Bash prompt.

```bash
cd ../../initial-mysql/spring-framework-petclinic
```

Then, update the *pom.xml* file to make MySQL the active configuration. Remove the `<activation>` element from the HSQLDB profile and put it in the MySQL profile instead, as shown here. The rest of the snippet shows the existing configuration. Note how the environment variables you set previously are used by Maven to configure your MySQL access.

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

Next, update the *pom.xml* file to configure Maven for an Azure deployment and for MySQL use. Add the following XML after the `<plugin>` element you added previously. If necessary, change `1.9.0` to the current version of the [Maven Plugin for Azure App Service](/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme).

```xml
<plugin>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-webapp-maven-plugin</artifactId>
    <version>1.9.0</version>
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

Next, build the app, then test it locally by deploying and running it with Tomcat.


# [bash](#tab/bash)

```bash
mvn package
mvn cargo:deploy
${TOMCAT_HOME}/bin/catalina.sh run
```

# [PowerShell](#tab/powershell)

```ps
mvn package
mvn cargo:deploy
& $TOMCAT_HOME/bin/catalina.bat run
````

# [Cmd](#tab/cmd)

```bash
mvn package
mvn cargo:deploy
%TOMCAT_HOME%\bin\catalina.bat run
```
---

You can now view the app locally at [http://localhost:8080](http://localhost:8080). The app will look and behave the same as before, but using Azure Database for MySQL instead of HSQLDB. When you are finished, select Ctrl+C at the Bash prompt to stop Tomcat.

Finally, deploy the app to App Service.

```bash
mvn azure-webapp:deploy
```

You can now navigate to `https://<app-name>.azurewebsites.net` to see the running app using App Service and Azure Database for MySQL.

## Access the app logs

If you need to troubleshoot, you can look at the app logs. To open the remote log stream on your local machine, use the following command.

# [bash](#tab/bash)

```bash
az webapp log tail --name ${WEBAPP_NAME} \
    --resource-group ${RESOURCEGROUP_NAME}
```

# [PowerShell](#tab/powershell)

```ps
az webapp log tail --name $WEBAPP_NAME `
    --resource-group $RESOURCEGROUP_NAME
````

# [Cmd](#tab/cmd)

```bash
az webapp log tail --name %WEBAPP_NAME% ^
    --resource-group %RESOURCEGROUP_NAME%
```
---

When you are finished viewing the logs, select Ctrl+C to halt the stream.

The log stream is also available at `https://<app-name>.scm.azurewebsites.net/api/logstream`.

## Scale out

To support increased traffic to your app, you can scale out to multiple instances using the following command.

# [bash](#tab/bash)

```bash
az appservice plan update --number-of-workers 2 \
    --name ${WEBAPP_PLAN_NAME} \
    --resource-group ${RESOURCEGROUP_NAME}
```

# [PowerShell](#tab/powershell)

```ps
az appservice plan update --number-of-workers 2 `
    --name $WEBAPP_PLAN_NAME `
    --resource-group $RESOURCEGROUP_NAME
````

# [Cmd](#tab/cmd)

```bash
az appservice plan update --number-of-workers 2 ^
    --name %WEBAPP_PLAN_NAME% ^
    --resource-group %RESOURCEGROUP_NAME%
```
---

Congratulations! You built and scaled out a Java Web app using Spring Framework, JSP, Spring Data, Hibernate, JDBC, App Service Linux and Azure Database for MySQL.

## Clean up resources

In the preceding sections, you created Azure resources in a resource group. If you don't expect to use these resources in the future, delete the resource group by running the following command.


# [bash](#tab/bash)

```bash
az group delete --name ${RESOURCEGROUP_NAME}
```

# [PowerShell](#tab/powershell)

```ps
az group delete --name $RESOURCEGROUP_NAME
````

# [Cmd](#tab/cmd)

```bash
az group delete --name %RESOURCEGROUP_NAME%
```
---

## Next steps

Next, check out the other configuration and CI/CD options available for Java with App Service.

> [!div class="nextstepaction"]
> [Configure a Linux Java app for Azure App Service](/azure/app-service/containers/configure-language-java)
> [!div class="nextstepaction"]
> [Build and deploy to a Java web app using Azure Pipelines](/azure/devops/pipelines/ecosystems/java-webapp?view=azure-devops&tabs=java-tomcat)
> [!div class="nextstepaction"]
> [Deploy to Azure App Service by using the Jenkins plugin](/azure/jenkins/deploy-jenkins-app-service-plugin)
