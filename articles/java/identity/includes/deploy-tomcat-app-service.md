---
ms.author: bbanerjee
ms.topic: include
ms.date: 01/01/2024
ms.custom: devx-track-java
---

#### [Deploy the sample to Azure App Service](#tab/appsvc)

You'll use the [Maven Plugin for Azure App Service Web Apps](https://github.com/microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md) to deploy a Java web application to a Linux Tomcat server in [Azure App Service](/azure/app-service/). App Service provides a highly scalable, self-patching web app hosting service. 

If Maven isn't your preferred development tool, check out our similar tutorials for Java developers:
+ [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app)
+ [Eclipse](/azure/developer/java/toolkit-for-eclipse/create-hello-world-web-app)
+ [Visual Studio Code](https://code.visualstudio.com/docs/java/java-webapp)


##### Configure the Maven plugin

The deployment process to Azure App Service uses your Azure credentials from the Azure CLI automatically. If the Azure CLI isn't installed locally, then the Maven plugin authenticates with OAuth or device sign-in. For more information, see [authentication with Maven plugins](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

Run the Maven command shown next to configure the deployment. This command helps you to set up the App Service operating system, Java version, and Tomcat version.

```cli
mvn com.microsoft.azure:azure-webapp-maven-plugin:2.12.0:config
```

1. For **Create new run configuration**, type **Y**, then **Enter**.
1. For **Define value for OS**, type **1** for Windows, or **2** for Linux, then **Enter**.
1. For **Define value for javaVersion**, type **2** for Java 11, then **Enter**.
1. For **Define value for webContainer**, type **4** for Tomcat 9.0, then **Enter**.
1. For **Define value for pricingTier**, press **Enter** to select the default **P1v2** tier.
1. For **Confirm**, type **Y**, then **Enter**.

    ```
    Please confirm webapp properties
    AppName : msal4j-servlet-auth-1707209552268
    ResourceGroup : msal4j-servlet-auth-1707209552268-rg
    Region : centralus
    PricingTier : P1v2
    OS : Linux
    Java Version: Java 11
    Web server stack: Tomcat 9.0
    Deploy to slot : false
    Confirm (Y/N) [Y]: [INFO] Saving configuration to pom.
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  37.112 s
    [INFO] Finished at: 2024-02-06T08:53:02Z
    [INFO] ------------------------------------------------------------------------
    ```

After you've confirmed your choices, the plugin adds the above plugin element and requisite settings to your project's `pom.xml` file that configure your web app to run in Azure App Service.

The relevant portion of the `pom.xml` file should look similar to the following example.

```xml-interactive
<build>
    <plugins>
        <plugin>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>>azure-webapp-maven-plugin</artifactId>
            <version>x.xx.x</version>
            <configuration>
                <schemaVersion>v2</schemaVersion>
                <resourceGroup>your-resourcegroup-name</resourceGroup>
                <appName>your-app-name</appName>
            ...
            </configuration>
        </plugin>
    </plugins>
</build>           
```

You can modify the configurations for App Service directly in your `pom.xml`. Some common configurations are listed in the following table:

Property | Required | Description | Version
---|---|---|---
`<schemaVersion>` | false | Specify the version of the configuration schema. Supported values are: `v1`, `v2`. | 1.5.2
`<subscriptionId>` | false | Specify the subscription ID. | 0.1.0+
`<resourceGroup>` | true | Azure Resource Group for your Web App. | 0.1.0+
`<appName>` | true | The name of your Web App. | 0.1.0+
`<region>` | false | Specifies the region to host your Web App; the default value is **centralus**. All valid regions at [Supported Regions](https://azure.microsoft.com/global-infrastructure/services/?products=app-service) section. | 0.1.0+
`<pricingTier>` | false | The pricing tier for your Web App. The default value is **P1v2** for production workload, while **B2** is the recommended minimum for Java dev/test. For more information, see [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/)| 0.1.0+
`<runtime>` | false | The runtime environment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details). | 0.1.0+
`<deployment>` | false | The deployment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details). | 0.1.0+

For the complete list of configurations, see the plugin reference documentation. All the Azure Maven Plugins share a common set of configurations. For these configurations see [Common Configurations](https://github.com/microsoft/azure-maven-plugins/wiki/Common-Configuration). For configurations specific to App Service, see [Azure Web App: Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details).

Be careful about the values of `<appName>` and `<resourceGroup>` (`helloworld-1690440759246` and `helloworld-1690440759246-rg` accordingly in the demo). They're used later.

##### Prepare the web app for deployment

When you deploy your application to App Service, your redirect URL will change to the redirect URL of your deployed Web App instance. You will need to change these settings in your `properties file`.

1. Navigate to your app's `authentication.properties` file and change the value of `app.homePage` to your deployed app's domain name. For example, if you chose `example-domain` for your app name in the previous step, you must now use the value  `https://example-domain.azurewebsites.net`. Be sure that you have also changed the protocol from `http` to `https`.

```ini
# app.homePage is by default set to dev server address and app context path on the server
# for apps deployed to azure, use https://your-sub-domain.azurewebsites.net
app.homePage=https://msal4j-servlet-auth-1707140924941.azurewebsites.net
```

> [!IMPORTANT]
> In this same `authentication.properties` file you have a setting for your `aad.secret`. It is not a good practice to deploy this value to App Service. Neither is it a good practice to leave this value in your code and potentially push it up to your git repository. For removing this secret value from your code, you can find more detailed guidance in the [Deploy to App Service - Remove secret](../tomcat-deploy-to-app-service.md) section. This guidance adds extra steps for pushing the secret value to [Key Vault](https://learn.microsoft.com/azure/key-vault/general/basic-concepts) and to use [Key Vault References](https://learn.microsoft.com/azure/app-service/app-service-key-vault-references?tabs=azure-cli). 

##### Update your Microsoft Entra ID App Registration

Since the redirect URI will change to your deployed Web App to Azure App Service, you will also need to change the redirect URI in your Micorosft Entra ID App Registration. 

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page. 
1. Use the serach box to search for you app registration, for example `java-servlet-webapp-authentication`.
1. Open your app registration by clicking on its name. 
1. Select **Authentication** from the menu.
1. In the **Web** - **Redirect URIs** section, select **Add URI**.
1. Fill out the URI of your web app, appending **/auth/redirect**, for example `https://msal4j-servlet-auth-1707140924941.azurewebsites.net/auth/redirect`.
1. Select **Save**. 

##### Deploy the app

You are now ready to deploy your Web App to Azure App Service. Make sure you are logged into your Azure environment to execute the deployment. 

```cli
az login
```

With all the configuration ready in your *pom.xml* file, you can now deploy your Java app to Azure with one single command.

```cli
mvn package azure-webapp:deploy
```

Once deployment is completed, your application is ready at `http://<appName>.azurewebsites.net/`. Open the url with your local web browser, you should see the start page of the `msal4j-servlet-auth` application.

#### [Run the sample locally](#tab/local)

To run the sample on Tomcat:

1. In your Tomcat installation, ensure there is a entry in tomcat/conf/server.xml for the address you want to host your application on

     - By default, our samples just expect to connect to http://localhost:8080 or https://localhost:8443, as defined in the app.homePage value in authentication.properties file

1. Copy the .war file you generated with Maven to the /webapps/ directory in your Tomcat installation, and start the Tomcat server

1. Once Tomcat starts, open your browser and navigate to whatever URL you defined in step 1, and you should be able to access the application

---