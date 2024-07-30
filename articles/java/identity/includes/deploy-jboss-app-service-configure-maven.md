---
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
---

The deployment process to Azure App Service uses your Azure credentials from the Azure CLI automatically. If the Azure CLI isn't installed locally, then the Maven plugin authenticates with OAuth or device sign-in. For more information, see [authentication with Maven plugins](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

Use the following steps to configure the plugin:

1. Run the Maven command shown next to configure the deployment. This command helps you to set up the App Service operating system, Java version, and Tomcat version.

   ```bash
   mvn com.microsoft.azure:azure-webapp-maven-plugin:2.12.0:config
   ```

1. For **Create new run configuration**, press <kbd>Y</kbd>, then press <kbd>Enter</kbd>.

1. For **Define value for OS**, press <kbd>2</kbd> for Linux, then press <kbd>Enter</kbd>.

1. For **Define value for javaVersion**, press <kbd>2</kbd> for Java 11, then press <kbd>Enter</kbd>.

1. For **Define value for webContainer**, press <kbd>1</kbd> for JBosseap7, then press <kbd>Enter</kbd>.

1. For **Define value for pricingTier**, press **Enter** to select the default **P1v3** tier.

1. For **Confirm**, press <kbd>Y</kbd>, then press <kbd>Enter</kbd>.

The following example shows the output of the deployment process:

```output
Please confirm webapp properties
AppName : msal4j-servlet-auth-1707220080695
ResourceGroup : msal4j-servlet-auth-1707220080695-rg
Region : centralus
PricingTier : P1v3
OS : Linux
Java Version: Java 11
Web server stack: JBosseap 7
Deploy to slot : false
Confirm (Y/N) [Y]:
[INFO] Saving configuration to pom.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  26.196 s
[INFO] Finished at: 2024-02-06T11:48:16Z
[INFO] ------------------------------------------------------------------------
```

After you've confirmed your choices, the plugin adds the plugin configuration and required settings to your project's *pom.xml* file to configure your app to run in Azure App Service.

The relevant portion of the *pom.xml* file should look similar to the following example:

```xml
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

You can modify the configurations for App Service directly in your *pom.xml*. Some common configurations are listed in the following table:

| Property         | Required | Description                                                                                                                                                                                                                                                                     | Version |
|------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `schemaVersion`  | false    | The version of the configuration schema. Supported values are `v1` and `v2`.                                                                                                                                                                                                    | 1.5.2   |
| `subscriptionId` | false    | The subscription ID.                                                                                                                                                                                                                                                            | 0.1.0+  |
| `resourceGroup`  | true     | The Azure resource group for your app.                                                                                                                                                                                                                                          | 0.1.0+  |
| `appName`        | true     | The name of your app.                                                                                                                                                                                                                                                           | 0.1.0+  |
| `region`         | false    | The region in which to host your app. The default value is `centralus`. For valid regions, see [Supported Regions](https://azure.microsoft.com/global-infrastructure/services/?products=app-service).                                                                           | 0.1.0+  |
| `pricingTier`    | false    | The pricing tier for your app. The default value is **P1v2** for a production workload. The recommended minimum value for Java development and testing is `B2`. For more information, see [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) | 0.1.0+  |
| `runtime`        | false    | The runtime environment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details).                                                                                           | 0.1.0+  |
| `deployment`     | false    | The deployment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details).                                                                                                    | 0.1.0+  |

For the complete list of configurations, see the plugin reference documentation. All the Azure Maven plugins share a common set of configurations. For these configurations, see [Common Configurations](https://github.com/microsoft/azure-maven-plugins/wiki/Common-Configuration). For configurations specific to Azure App Service, see [Azure app: Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App:-Configuration-Details).

Be sure to save aside the `appName` and `resourceGroup` values for later use.
