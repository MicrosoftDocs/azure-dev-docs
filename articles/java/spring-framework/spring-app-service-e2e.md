---
title: Deploy a Spring/Tomcat app to App Service with Azure Database for MySQL
description: End-to-end tutorial for Java App Service with MySQL
author: KarlErickson
ms.author: hangwan
ms.date: 08/28/2024
ms.topic: article
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java, devx-track-azurecli
---

# Deploy a Spring app to App Service with MySQL

> [!NOTE]
> For Spring applications, we recommend using Azure Spring Apps. However, you can still use Azure App Service as a destination. For more information, see [Choose the right Azure services for your Java applications](../get-started/choose.md).

This tutorial walks you through the process of building, configuring, deploying, troubleshooting and scaling Java web apps in App Service Linux.

This tutorial builds on the popular Spring PetClinic sample app. In this topic, you'll test an HSQLDB version of the app locally, then deploy it to [Azure App Service](/azure/app-service/containers). After that, you'll configure and deploy a version that uses [Azure Database for MySQL](/azure/mysql). Finally, you'll learn how to access the app logs and scale out by increasing the number of workers running your app.

## Prerequisites

* [Azure CLI](/cli/azure/overview)
* [Java 8](http://java.oracle.com/)
* [Maven 3](http://maven.apache.org/)
* [Git](https://github.com/)
* [Tomcat 9](https://tomcat.apache.org/download-80.cgi)
* [MySQL CLI](http://dev.mysql.com/downloads/mysql/)

## Get the sample

To get started with the sample app, clone and prepare the source repo using the following commands.

# [Bash](#tab/bash)

```bash
git clone https://github.com/spring-petclinic/spring-framework-petclinic.git
cd spring-framework-petclinic
```

# [PowerShell](#tab/powershell)

```ps
git clone https://github.com/spring-petclinic/spring-framework-petclinic.git
cd spring-framework-petclinic
```

# [Cmd](#tab/cmd)

```cmd
git clone https://github.com/spring-petclinic/spring-framework-petclinic.git
cd spring-framework-petclinic
```
---

## Build and run the HSQLDB sample locally

First, we'll test the sample locally by using HSQLDB as the database.

Build the HSQLDB version of the sample app.

```bash
mvn package
```

Next, set the TOMCAT_HOME environment variable to the location of your Tomcat installation.

# [Bash](#tab/bash)

```bash
export TOMCAT_HOME=<Tomcat install directory>
```

# [PowerShell](#tab/powershell)

```ps
$env:TOMCAT_HOME="<Tomcat install directory>"
```

# [Cmd](#tab/cmd)

```cmd
set TOMCAT_HOME=<Tomcat install directory>
```
---

Then, update *pom.xml* file for deploying the WAR file. Add the following XML as a child of the existing `<plugins>` element. If necessary, change `1.9.11` to the current version of the [Cargo Maven 3 Plugin](https://mvnrepository.com/artifact/org.codehaus.cargo/cargo-maven3-plugin).

```xml
<plugin>
    <groupId>org.codehaus.cargo</groupId>
    <artifactId>cargo-maven3-plugin</artifactId>
    <version>1.9.11</version>
    <configuration>
        <container>
            <containerId>tomcat9x</containerId>
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

# [Bash](#tab/bash)

```bash
${TOMCAT_HOME}/bin/catalina.sh run
```

# [PowerShell](#tab/powershell)

```ps
& $env:TOMCAT_HOME/bin/catalina.bat run
```

# [Cmd](#tab/cmd)

```cmd
%TOMCAT_HOME%\bin\catalina.bat run
```
---

You can now navigate your browser to `http://localhost:8080` to see the running app and get a feel for how it works. When you're finished, select Ctrl+C at the Bash prompt to stop Tomcat.

## Deploy to Azure App Service

Now that you've seen it running locally, we'll deploy the app to Azure.

First, set the following environment variables. For `REGION`, use `West US 2` or other regions you can find [here](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=app-service).

# [Bash](#tab/bash)

```bash
export RESOURCEGROUP_NAME=<resource group>
export WEBAPP_NAME=<web app>
export WEBAPP_PLAN_NAME=${WEBAPP_NAME}-appservice-plan
export REGION=<region>
```

# [PowerShell](#tab/powershell)

```ps
$env:RESOURCEGROUP_NAME="<resource group>"
$env:WEBAPP_NAME="<web app>"
$env:WEBAPP_PLAN_NAME="$env:WEBAPP_NAME-appservice-plan"
$env:REGION="<region>"
$env:SUBSCRIPTION_ID="<subscription_id>"
```

# [Cmd](#tab/cmd)

```cmd
set RESOURCEGROUP_NAME=<resource group>
set WEBAPP_NAME=<web app>
set WEBAPP_PLAN_NAME=%WEBAPP_NAME%-appservice-plan
set REGION=<region>
set SUBSCRIPTION_ID=<subscription_id>
```
---

Maven will use these values to create the Azure resources with the names you provide. By using environment variables, you can keep your account secrets out of your project files.

Next, update the *pom.xml* file to configure Maven for an Azure deployment. Add the following XML after the `<plugin>` element you added previously. If necessary, change `2.5.0` to the current version of the [Maven Plugin for Azure App Service](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md).

```xml
<plugin>
  <groupId>com.microsoft.azure</groupId>
  <artifactId>azure-webapp-maven-plugin</artifactId>
  <version>2.5.0</version>
  <configuration>
    <schemaVersion>v2</schemaVersion>
    <subscriptionId>${SUBSCRIPTION_ID}</subscriptionId>
    <resourceGroup>${RESOURCEGROUP_NAME}</resourceGroup>
    <appName>${WEBAPP_NAME}</appName>
    <region>${REGION}</region>
    <pricingTier>P1v2</pricingTier>
    <runtime>
      <os>Linux</os>
      <javaVersion>Java 8</javaVersion>
      <webContainer>TOMCAT 9.0</webContainer>
    </runtime>
    <deployment>
      <resources>
        <resource>
          <directory>${project.basedir}/target</directory>
          <includes>
            <include>*.war</include>
          </includes>
        </resource>
      </resources>
    </deployment>
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

# [Bash](#tab/bash)

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
$env:MYSQL_SERVER_NAME="<server>"
$env:MYSQL_SERVER_FULL_NAME="$env:MYSQL_SERVER_NAME.mysql.database.azure.com"
$env:MYSQL_SERVER_ADMIN_LOGIN_NAME="<admin>"
$env:MYSQL_SERVER_ADMIN_PASSWORD="<password>"
$env:MYSQL_DATABASE_NAME="<database>"
$env:DOLLAR="$"
```

# [Cmd](#tab/cmd)

```cmd
set MYSQL_SERVER_NAME=<server>
set MYSQL_SERVER_FULL_NAME=%MYSQL_SERVER_NAME%.mysql.database.azure.com
set MYSQL_SERVER_ADMIN_LOGIN_NAME=<admin>
set MYSQL_SERVER_ADMIN_PASSWORD=<password>
set MYSQL_DATABASE_NAME=<database>
set DOLLAR=$
```
---

Next, create and initialize the database server. Use [az mysql up](/cli/azure/mysql#az-mysql-up) for the initial configuration. Then use [az mysql server configuration set](/cli/azure/mysql/server/configuration#az-mysql-server-configuration-set) to increase the connection timeout and set the server timezone.

# [Bash](#tab/bash)

```azurecli
az extension add --name db-up

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
    --server ${MYSQL_SERVER_NAME} --value=-8:00
```

# [PowerShell](#tab/powershell)

```azurecli
az extension add --name db-up

az mysql up `
    --resource-group $env:RESOURCEGROUP_NAME `
    --server-name $env:MYSQL_SERVER_NAME `
    --database-name $env:MYSQL_DATABASE_NAME `
    --admin-user $env:MYSQL_SERVER_ADMIN_LOGIN_NAME `
    --admin-password $env:MYSQL_SERVER_ADMIN_PASSWORD

az mysql server configuration set --name wait_timeout `
    --resource-group $env:RESOURCEGROUP_NAME `
    --server $env:MYSQL_SERVER_NAME --value 2147483

az mysql server configuration set --name time_zone `
    --resource-group $env:RESOURCEGROUP_NAME `
    --server $env:MYSQL_SERVER_NAME --value=-8:00
```

# [Cmd](#tab/cmd)

```azurecli
az extension add --name db-up

az mysql up ^
    --resource-group %RESOURCEGROUP_NAME% ^
    --server-name %MYSQL_SERVER_NAME% ^
    --database-name %MYSQL_DATABASE_NAME% ^
    --admin-user %MYSQL_SERVER_ADMIN_LOGIN_NAME% ^
    --admin-password %MYSQL_SERVER_ADMIN_PASSWORD%

az mysql server configuration set --name wait_timeout ^
    --resource-group %RESOURCEGROUP_NAME% ^
    --server %MYSQL_SERVER_NAME% --value 2147483

az mysql server configuration set --name time_zone ^
    --resource-group %RESOURCEGROUP_NAME% ^
    --server %MYSQL_SERVER_NAME% --value=-8:00
```
---

Then, use the MySQL CLI to connect to your database on Azure.

# [Bash](#tab/bash)

```bash
mysql -u ${MYSQL_SERVER_ADMIN_LOGIN_NAME}@${MYSQL_SERVER_NAME} \
 -h ${MYSQL_SERVER_FULL_NAME} -P 3306 -p
```

# [PowerShell](#tab/powershell)

```ps
mysql -u $env:MYSQL_SERVER_ADMIN_LOGIN_NAME@$env:MYSQL_SERVER_NAME `
 -h $env:MYSQL_SERVER_FULL_NAME -P 3306 -p
```

# [Cmd](#tab/cmd)

```cmd
mysql -u %MYSQL_SERVER_ADMIN_LOGIN_NAME%@%MYSQL_SERVER_NAME% ^
 -h %MYSQL_SERVER_FULL_NAME% -P 3306 -p
```

---

At the MySQL CLI prompt, run the following command to verify your database named with same value you specified earlier for the `MYSQL_DATABASE_NAME` environment variable.

```console
show databases;
```

MySQL is now ready for use.

## Configure the app for MySQL

Next, we'll add the connection info to the MySQL version of the app, then deploy it to App Service.

Update the *pom.xml* file to make MySQL the active configuration. Remove the `<activation>` element from the H2 profile and put it in the MySQL profile instead, as shown here. The rest of the snippet shows the existing configuration. Note how the environment variables you set previously are used by Maven to configure your MySQL access.

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
        <jdbc.username>${DOLLAR}{MYSQL_SERVER_ADMIN_LOGIN_NAME}@${DOLLAR}{MYSQL_SERVER_FULL_NAME}</jdbc.username>
        <jdbc.password>${DOLLAR}{MYSQL_SERVER_ADMIN_PASSWORD}</jdbc.password>
    </properties>
    ...
</profile>
```

Next, update the *pom.xml* file to configure Maven for an Azure deployment and for MySQL use. Add the following XML after the `<plugin>` element you added previously. If necessary, change `2.5.0` to the current version of the [Maven Plugin for Azure App Service](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md).

```xml
<plugin>
  <groupId>com.microsoft.azure</groupId>
  <artifactId>azure-webapp-maven-plugin</artifactId>
  <version>2.5.0</version>
  <configuration>
    <schemaVersion>v2</schemaVersion>
    <subscriptionId>${SUBSCRIPTION_ID}</subscriptionId>
    <resourceGroup>${RESOURCEGROUP_NAME}</resourceGroup>
    <appName>${WEBAPP_NAME}</appName>
    <region>${REGION}</region>
    <pricingTier>P1v2</pricingTier>
    <runtime>
      <os>Linux</os>
      <javaVersion>Java 8</javaVersion>
      <webContainer>TOMCAT 9.0</webContainer>
    </runtime>
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
    <deployment>
      <resources>
        <resource>
          <directory>${project.basedir}/target</directory>
          <includes>
            <include>*.war</include>
          </includes>
        </resource>
      </resources>
    </deployment>
  </configuration>
</plugin>
```

Next, build the app, then test it locally by deploying and running it with Tomcat.

# [Bash](#tab/bash)

```bash
mvn package
mvn cargo:deploy
${TOMCAT_HOME}/bin/catalina.sh run
```

# [PowerShell](#tab/powershell)

```ps
mvn package
mvn cargo:deploy
& $env:TOMCAT_HOME/bin/catalina.bat run
```

# [Cmd](#tab/cmd)

```cmd
mvn package
mvn cargo:deploy
%TOMCAT_HOME%\bin\catalina.bat run
```
---

You can now view the app locally at `http://localhost:8080`. The app will look and behave the same as before, but using Azure Database for MySQL instead of HSQLDB. When you're finished, select Ctrl+C at the Bash prompt to stop Tomcat.

Finally, deploy the app to App Service.

```bash
mvn azure-webapp:deploy
```

You can now navigate to `https://<app-name>.azurewebsites.net` to see the running app using App Service and Azure Database for MySQL.

## Access the app logs

If you need to troubleshoot, you can look at the app logs. To open the remote log stream on your local machine, use the following command.

# [Bash](#tab/bash)

```azurecli
az webapp log tail --name ${WEBAPP_NAME} \
    --resource-group ${RESOURCEGROUP_NAME}
```

# [PowerShell](#tab/powershell)

```azurecli
az webapp log tail --name $env:WEBAPP_NAME `
    --resource-group $env:RESOURCEGROUP_NAME
```

# [Cmd](#tab/cmd)

```azurecli
az webapp log tail --name %WEBAPP_NAME% ^
    --resource-group %RESOURCEGROUP_NAME%
```

---

When you're finished viewing the logs, select Ctrl+C to halt the stream.

The log stream is also available at `https://<app-name>.scm.azurewebsites.net/api/logstream`.

## Scale out

To support increased traffic to your app, you can scale out to multiple instances using the following command.

# [Bash](#tab/bash)

```azurecli
az appservice plan update --number-of-workers 2 \
    --name ${WEBAPP_PLAN_NAME} \
    --resource-group ${RESOURCEGROUP_NAME}
```

# [PowerShell](#tab/powershell)

```azurecli
az appservice plan update --number-of-workers 2 `
    --name $env:WEBAPP_PLAN_NAME `
    --resource-group $env:RESOURCEGROUP_NAME
```

# [Cmd](#tab/cmd)

```azurecli
az appservice plan update --number-of-workers 2 ^
    --name %WEBAPP_PLAN_NAME% ^
    --resource-group %RESOURCEGROUP_NAME%
```
---

Congratulations! You built and scaled out a Java Web app using Spring Framework, JSP, Spring Data, Hibernate, JDBC, App Service Linux and Azure Database for MySQL.

## Clean up resources

In the preceding sections, you created Azure resources in a resource group. If you don't expect to use these resources in the future, delete the resource group by running the following command.

# [Bash](#tab/bash)

```azurecli
az group delete --name ${RESOURCEGROUP_NAME}
```

# [PowerShell](#tab/powershell)

```azurecli
az group delete --name $env:RESOURCEGROUP_NAME
```

# [Cmd](#tab/cmd)

```azurecli
az group delete --name %RESOURCEGROUP_NAME%
```
---

## Next steps

Next, check out the other configuration and CI/CD options available for Java with App Service.

> [!div class="nextstepaction"]
> [Configure a Linux Java app for Azure App Service](/azure/app-service/containers/configure-language-java)
> [!div class="nextstepaction"]
> [Build and deploy to a Java web app using Azure Pipelines](/azure/devops/pipelines/ecosystems/java-webapp?tabs=java-tomcat)
> [!div class="nextstepaction"]
> [Deploy to Azure App Service by using the Jenkins plugin](/azure/jenkins/deploy-jenkins-app-service-plugin)
