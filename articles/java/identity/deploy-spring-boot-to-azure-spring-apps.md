---
title: Get started with securing java application with Microsoft Identity platform
description: Shows you how to enable your Java web app to restrict access to routes using app roles with the Microsoft identity platform
services: active-directory
documentationcenter: java
ms.date: 01/01/2024
ms.service: active-directory
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
ms.custom: devx-track-java, devx-track-extended-java
adobe-target: true
---

# Deploy your Java Spring Boot web app to Azure Spring Apps

This guidance assumes you have run through any of the Spring Boot Web app examples for enabling security with Microsoft Entra ID. 


## Prerequisites

You'll use the [Maven Plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps) to deploy a Java Spring Boot application to an app on [Azure Spring Apps](/azure/spring-apps/). Azure Spring Apps is a managed service for hosting Spring apps. 

If Maven isn't your preferred development tool, check out our similar tutorials for Java developers:
+ [IntelliJ IDEA](/azure/spring-apps/enterprise/how-to-intellij-deploy-apps)
+ [Visual Studio Code](https://code.visualstudio.com/docs/java/java-spring-apps)

For deployment you will need:

- An Azure subscription. 
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the Requirements section of Enterprise plan in Azure Marketplace.

## Prepare the Spring project

Use the following steps to prepare the project:

1. Use the following [Maven](https://maven.apache.org/what-is-maven.html) command to build the project:

   ```azurecli-interactive
   mvn clean package
   ```

1. Run the sample project locally by using the following command:

   ```azurecli-interactive
   mvn spring-boot:run
   ```

 ## Configure the Maven plugin

Use the following steps to deploy using the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps):

1. Run the following command in the root of the project to configure the app in Azure Spring Apps:

   ```bash
   mvn com.microsoft.azure:azure-spring-apps-maven-plugin:1.19.0:config
   ```

   The following list describes the command interactions:

   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number where you want to create your Azure Spring Apps instance, which defaults to the first subscription in the list. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Input the Azure Spring Apps name**: Enter the name for the spring apps instance you want to create. If you want to use the default name, press <kbd>Enter</kbd> directly.
   - **Input the resource group name**: Enter the name for the resource group you want to create your spring apps instance in. If you want to use the default name, press <kbd>Enter</kbd> directly.
   - **Skus**: Select the SKU you want to use for your spring apps instance. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Input the app name (demo)**: Provide an app name. If you use the default project artifact ID, press <kbd>Enter</kbd> directly.
   - **Runtimes**: Select the runtime you want to use for your spring apps instance. In this case you should use the default number, press <kbd>Enter</kbd> directly.
   - **Expose public access for this app (boot-for-azure)**: Press <kbd>y</kbd>.
   - **Confirm to save all the above configurations**: Press <kbd>y</kbd>. If you press <kbd>n</kbd>, the configuration isn't saved in the POM files.

    ```
    Summary of properties:
    Subscription id   : 12345678-1234-1234-1234-123456789101
    Resource group name : rg-ms-identity-spring-boot-webapp
    Azure Spring Apps name : cluster-ms-identity-spring-boot-webapp
    Runtime Java version : Java 11
    Region            : eastus
    Sku               : Standard
    App name          : ms-identity-spring-boot-webapp
    Public access     : true
    Instance count/max replicas : 1
    CPU count         : 1
    Memory size(GB)   : 2
    Confirm to save all the above configurations (Y/n):
    [INFO] Configurations are saved to: /home/user/ms-identity-java-spring-tutorial/1-Authentication/sign-in/pom.    xml
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  01:57 min
    [INFO] Finished at: 2024-02-14T13:50:44Z
    [INFO] ------------------------------------------------------------------------
    ```

After you've confirmed your choices, the plugin adds the below plugin element and prerequisite settings to your project's `pom.xml` file that configure your app to run in Azure Spring Apps.

The relevant portion of the `pom.xml` file should look similar to the following example.

```xml-interactive
<plugin>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-spring-apps-maven-plugin</artifactId>
    <version>1.19.0</version>
    <configuration>
        <subscriptionId>12345678-1234-1234-1234-123456789101</subscriptionId>
        <resourceGroup>rg-ms-identity-spring-boot-webapp</resourceGroup>
        <clusterName>cluster-ms-identity-spring-boot-webapp</clusterName>
        <region>eastus</region>
        <sku>Standard</sku>
        <appName>ms-identity-spring-boot-webapp</appName>
        <isPublic>true</isPublic>
        <deployment>
            <cpu>1</cpu>
            <memoryInGB>2</memoryInGB>
            <instanceCount>1</instanceCount>
            <runtimeVersion>Java 11</runtimeVersion>
            <resources>
                <resource>
                    <directory>${project.basedir}/target</directory>
                    <includes>
                        <include>*.jar</include>
                    </includes>
                </resource>
            </resources>
        </deployment>
    </configuration>
</plugin>     
```

You can modify the configurations for Azure Spring Apps directly in your `pom.xml`. Some common configurations are listed in the following table:

Property | Required | Description
---|---|---
`<subscriptionId>` | false | Specify the subscription ID.
`<resourceGroup>` | true | Azure Resource Group for your Azure Spring Apps instance.
`<clusterName>` | true | Specifies the Azure Spring Apps cluster name. In case you are using a subscription and resource group that already have an Azure Spring Apps instance deployed, you can also use this existing cluster to deploy to.
`<appName>` | true | The name of your app in Azure Spring Apps. 
`<region>` | false | Specifies the region to host your Azure Spring Apps; the default value is **eastus**. All valid regions at [Supported Regions](https://azure.microsoft.com/global-infrastructure/services/?products=app-service) section.
`<sku>` | false | The pricing tier for your Azure Spring Apps instance. The default value is **Basic** which is only suited for dev/test environments. 
`<runtime>` | false | The runtime environment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps:-Configuration-Details).
`<deployment>` | false | The deployment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps:-Configuration-Details). 

For the complete list of configurations, see the plugin reference documentation. All the Azure Maven Plugins share a common set of configurations. For these configurations see [Common Configurations](https://github.com/microsoft/azure-maven-plugins/wiki/Common-Configuration). For configurations specific to Azure Spring Apps, see [Azure Spring Apps: Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps:-Configuration-Details).

Be careful about the values of `<clusterName>` and `<appName>`. They're used later.

## Prepare the web app for deployment

When you deploy your application to Azure Spring Apps, your redirect URL will change to the redirect URL of your deployed app instance in Azure Spring Apps. You will need to change these settings in your `application.yml file`.

1. Navigate to your app's `src\main\resources\application.yml` file and change the value of `post-logout-redirect-uri` to your deployed app's domain name, which is `https://<cluster-name>-<app-name>.azuremicroservices.io`. For example, if you chose `cluster-ms-identity-spring-boot-webapp` for your Azure Spring Apps instance in the previous step and `ms-identity-spring-boot-webapp` for your app name, you must now use the value `https://cluster-ms-identity-spring-boot-webapp-ms-identity-spring-boot-webapp.azuremicroservices.io`.

```ini
post-logout-redirect-uri: https://cluster-ms-identity-spring-boot-webapp-ms-identity-spring-boot-webapp.azuremicroservices.io
```

1. After saving this file, you will need to rebuild your app.

 ```
 mvn clean package
 ```

## Update your Microsoft Entra ID App Registration

Since the redirect URI will change to your deployed app on Azure Spring Apps, you will also need to change the redirect URI in your Micorosft Entra ID App Registration. 

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page. 
1. Use the serach box to search for you app registration, for example `java-servlet-webapp-authentication`.
1. Open your app registration by clicking on its name. 
1. Select **Authentication** from the menu.
1. In the **Web** - **Redirect URIs** section, select **Add URI**.
1. Fill out the URI of your web app, appending **/login/oauth2/code/**, for example `https://<cluster-name>-<app-name>.azuremicroservices.io/login/oauth2/code/`.
1. Select **Save**. 

## Deploy the app

You are now ready to deploy your app to Azure Spring Apps. With all the configuration ready in your *pom.xml* file, you can now deploy your Java app to Azure with one single command.

1. Use the following command to deploy the app:

   ```bash
       mvn azure-spring-apps:deploy
   ```

   The following list describes the command interaction:

   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.

   After the command is executed, you can see from the following log messages that the deployment was successful:

   ```output
   [INFO] Deployment(default) is successfully created
   [INFO] Starting Spring App after deploying artifacts...
   [INFO] Deployment Status: Running
   [INFO]   InstanceName:demo-default-x-xxxxxxxxxx-xxxxx  Status:Running Reason:null       DiscoverStatus:UNREGISTERED
   [INFO]   InstanceName:demo-default-x-xxxxxxxxx-xxxxx  Status:Terminating Reason:null       DiscoverStatus:UNREGISTERED
   [INFO] Getting public url of app(demo)...
   [INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-demo.azuremicroservices.io

## Validate the app

After the deployment finishes, access the application with the output application URL. Use the following steps to check the app's logs to investigate any deployment issue:

1. Access the output application URL from the **Outputs** page of the **Deployment**.
1. From the navigation pane of the Azure Spring Apps instance **Overview** page, select **Logs** to check the app's logs.

## Next Steps

For more information and other deployment options, see the follwoing articles:

- [Quickstart: Deploy your first application to Azure Spring Apps](https://learn.microsoft.com/en-us/azure/spring-apps/enterprise/quickstart?tabs=Azure-portal%2CAzure-portal-maven-plugin-ent%2CConsumption-workload&pivots=sc-enterprise)
- [Spring Boot to Azure Spring Apps](https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-spring-boot-to-azure-spring-apps)