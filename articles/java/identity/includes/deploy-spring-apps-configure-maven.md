---
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
---

Run the following command in the root of the project to configure the app using the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps):

```bash
mvn com.microsoft.azure:azure-spring-apps-maven-plugin:1.19.0:config
```

The following list describes the command interactions:

- **OAuth2 login**: You need to authorize the sign-in to Azure based on the OAuth2 protocol.
- **Select subscription**: Select the subscription list number where you want to create your Azure Spring Apps instance, which defaults to the first subscription in the list. If you want to use the default number, press <kbd>Enter</kbd>.
- **Input the Azure Spring Apps name**: Enter the name for the spring apps instance you want to create. If you want to use the default name, press <kbd>Enter</kbd>.
- **Input the resource group name**: Enter the name for the resource group you want to create your spring apps instance in. If you want to use the default name, press <kbd>Enter</kbd>.
- **Skus**: Select the SKU you want to use for your spring apps instance. If you want to use the default number, press <kbd>Enter</kbd>.
- **Input the app name (demo)**: Provide an app name. If you want to use the default project artifact ID, press <kbd>Enter</kbd>.
- **Runtimes**: Select the runtime you want to use for your spring apps instance. In this case, you should use the default number, so press <kbd>Enter</kbd>.
- **Expose public access for this app (boot-for-azure)**: Press <kbd>y</kbd>.
- **Confirm to save all the above configurations**: Press <kbd>y</kbd>. If you press <kbd>n</kbd>, the configuration isn't saved in the *.pom* file.

The following example shows the output of the deployment process:

```output
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
[INFO] Configurations are saved to: /home/user/ms-identity-msal-java-samples/4-spring-web-app/1-Authentication/sign-in/pom.    xml
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  01:57 min
[INFO] Finished at: 2024-02-14T13:50:44Z
[INFO] ------------------------------------------------------------------------
```

After you've confirmed your choices, the plugin adds the required plugin element and settings to your project's *pom.xml* file to configure your app to run in Azure Spring Apps.

The relevant portion of the *pom.xml* file should look similar to the following example:

```xml
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

You can modify the configurations for Azure Spring Apps directly in your *pom.xml* file. Some common configurations are listed in the following table:

| Property         | Required | Description                                                                                                                                                                                                               |
|------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `subscriptionId` | false    | The subscription ID.                                                                                                                                                                                                      |
| `resourceGroup`  | true     | The Azure resource group for your Azure Spring Apps instance.                                                                                                                                                             |
| `clusterName`    | true     | The Azure Spring Apps cluster name. In case you're using a subscription and resource group that already have an Azure Spring Apps instance deployed, you can also use this existing cluster to deploy to.                 |
| `appName`        | true     | The name of your app in Azure Spring Apps.                                                                                                                                                                                |
| `region`         | false    | The region in which to host your Azure Spring Apps instance. The default value is `eastus`. For valid regions, see [Supported Regions](https://azure.microsoft.com/global-infrastructure/services/?products=app-service). |
| `sku`            | false    | The pricing tier for your Azure Spring Apps instance. The default value is `Basic`, which is suited only for development and test environments.                                                                           |
| `runtime`        | false    | The runtime environment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps:-Configuration-Details).                                 |
| `deployment`     | false    | The deployment configuration. For more information, see [Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps:-Configuration-Details).                                          |

For the complete list of configurations, see the plugin reference documentation. All the Azure Maven plugins share a common set of configurations. For these configurations, see [Common Configurations](https://github.com/microsoft/azure-maven-plugins/wiki/Common-Configuration). For configurations specific to Azure Spring Apps, see [Azure Spring Apps: Configuration Details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps:-Configuration-Details).

Be sure to save aside the `clusterName` and `appName` values for later use.
