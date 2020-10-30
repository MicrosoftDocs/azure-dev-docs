---
title: Tutorial on reading a secret from Azure Key Vault in a Spring Boot application
description: Tutorial on reading a secret from Azure Key Vault in a Spring Boot application
services: key-vault
documentationcenter: java
ms.date: 08/15/2020
ms.service: key-vault
ms.tgt_pltfrm: multiple
ms.topic: tutorial
ms.workload: identity
ms.custom: devx-track-java, devx-track-azurecli
---

# Tutorial: Reading a secret from Azure Key Vault in a Spring Boot application

Spring Boot applications externalize sensitive information such as usernames and passwords.  Externalizing sensitive information enables better maintainability, testability, and security.  Storing secrets outside of the code is better than hard coding the information, or inlining it at build time.

This tutorial describes how to create a Spring Boot app that reads a value from Azure Key Vault, then deploy the app to Azure App Service and Azure Spring Cloud.

> [!div class="checklist"]
> * Create the Azure Key Vault and store a secret
> * Create the app with Spring Initializr
> * Add Key Vault integration to the app
> * Deploy to Azure App Service
> * Redeploy to Azure App Service with Managed identities for Azure resources
> * Deploy to Azure Spring Cloud

## Prerequisites

* An active Azure subscription.
  * If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
* [Install the Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli?preserve-view=true&view=azure-cli-latest) and the Azure Spring Cloud extension with command: `az extension add --name spring-cloud`
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.
* The `curl` command.  Most UNIX-like operating systems have this command pre-installed.  OS-specific clients are available at [the official curl website](https://curl.haxx.se/).
* The `jq` command. Most UNIX-like operating systems have this command pre-installed.  OS-specific clients are available at [the official jq website](https://stedolan.github.io/jq/).

## Create a new Azure Key Vault

The following sections show you how to log in to Azure and create an Azure Key Vault.

### Sign into Azure and set your subscription

First, use the following steps to authenticate using the Azure CLI.

1. Optionally, log out and delete some authentication files to remove any lingering credentials:

   ```azurecli
   az logout
   rm ~/.azure/accessTokens.json
   rm ~/.azure/azureProfile.json
   ```

1. Sign into your Azure account by using the Azure CLI:

   ```azurecli
   az login
   ```

   Follow the instructions to complete the sign-in process.

1. List your subscriptions:

   ```azurecli
   az account list
   ```

   Azure will return a list of your subscriptions. Copy the `id` for the subscription that you want to use; for example:

   ```json
   [
     {
       "cloudName": "AzureCloud",
       "id": "ssssssss-ssss-ssss-ssss-ssssssssssss",
       "name": "Converted Windows Azure MSDN - Visual Studio Ultimate",
       "state": "Enabled",
       "tenantId": "tttttttt-tttt-tttt-tttt-tttttttttttt",
       "user": {
         "name": "contoso@microsoft.com",
         "type": "user"
       }
     }
   ]
   ```

1. Specify the GUID for the subscription you want to use with Azure; for example:

   ```azurecli
   az account set -s ssssssss-ssss-ssss-ssss-ssssssssssss
   ```

### Create a service principal for use in by your app

Azure AD *service principals* provide access to Azure resources within your subscription. You can think of a service principal as a user identity for a service.  "Service" is any application, service, or platform, including the sample app built in this tutorial, that needs to access Azure resources. You can configure a service principal with access rights scoped only to those resources you specify. Then, configure your application or service to use the service principal's credentials to access those resources.

Create a service principal with this command.

```azurecli
az ad sp create-for-rbac --name contososp
```

The value of the `name` option must be unique within your subscription.  Save aside the values returned from the command for use later in the tutorial.  The return JSON will look something like the following.

```json
{
  "appId": "8r7o486s-o5q9-450s-8457-pr26p86n0497",
  "displayName": "ejbcontososp",
  "name": "http://ejbcontososp",
  "password": "4bt.lCKJKlbYLn_3XF~wWtUwyHU0jKggu2",
  "tenant": "72s988os-86s1-41ns-91no-2d7cd011db47"
}
```

### Create the Key Vault instance

The following procedure creates and initializes the Key Vault.

1. Determine which Azure region will hold your resources.
   1. You can review the [list of regions and their locations](https://azure.microsoft.com/regions/).
   1. You can use the `az account list-locations` command to find the correct `Name` for your chosen region.

      ```azurecli
      az account list-locations -o table
      ```

      In this tutorial, we'll use `eastus`.
1. Create a resource group to hold the Key Vault and the App Service app.  The value must be unique within the Azure subscription.  In this tutorial, we'll use `contosorg`.

   ```azurecli
   az group create --name contosorg --location eastus
   ```

1. Create a new Key Vault in the resource group.

   ```azurecli
   az keyvault create \
       --resource-group contosorg \
       --name contosokv \
       --enabled-for-deployment true \
       --enabled-for-disk-encryption true \
       --enabled-for-template-deployment true \
       --location eastus
       --query properties.vaultUri \
       --sku standard 
   ```

    > [!NOTE]
    > The value of the `--name` option must be unique within the Azure subscription.

   This table explains the options shown above.

   | Parameter | Description |
   |---|---|
   | `enabled-for-deployment` | Specifies the [Key Vault deployment option](/cli/azure/keyvault). |
   | `enabled-for-disk-encryption` | Specifies the [Key Vault encryption option](/cli/azure/keyvault). |
   | `enabled-for-template-deployment` | Specifies the [Key Vault encryption option](/cli/azure/keyvault). |
   | `location` | Specifies the [Azure region](https://azure.microsoft.com/regions/) where your resource group will be hosted. |
   | `name` | Specifies a unique name for your Key Vault. |
   | `query` | Retrieve the Key Vault URI from the response.  You need the URI to complete this tutorial. |
   | `sku` | Specifies the [Key Vault SKU option](/cli/azure/keyvault). |

   The Azure CLI will display the URI for Key Vault, which you'll use later; for example:

   ```output
   "https://contosokv.vault.azure.net/"
   ```

1. Configure the Key Vault to allow `get` and `list` operations from that Managed identity.  The value of the `object-id` is the `appId` from the `az ad sp create-for-rbac` command above.

   ```azurecli
   az keyvault set-policy --name contosokv --spn http://ejbcontososp --secret-permissions get list
   ```

   The output will be a JSON object full of information about the Key Vault.  It will have a `type` entry with value `Microsoft.KeyVault/vaults`.

   This table explains the properties shown above.

   | Parameter | Description |
   |---|---|
   | name | The name of the Key Vault. |
   | spn | The `name` from the output of `az ad sp create-for-rbac` command above. |
   | secret-permissions | The list of operations to allow from the named principal. |

    > [!NOTE]
    > While the principle of least privilege recommends granting the smallest possible set of privileges to a resource, the design of the Key Vault integration requires at least `get` and `list`.

1. Store a secret in your new Key Vault.  A common use case is to store a JDBC connection string.  For example:

   ```azurecli
   az keyvault secret set --name "connectionString" \
       --vault-name "contosokv" \
       --value "jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;"
   ```

   This table explains the options shown above.

   | Parameter | Description |
   |---|---|
   | `name` | Specifies the name of your secret. |
   | `value` | Specifies the value of your secret. |
   | `vault-name` | Specifies your Key Vault name from earlier. |

   The Azure CLI will display the results of your secret creation; for example:

   ```json
   {
     "attributes": {
       "created": "2020-08-24T21:48:09+00:00",
       "enabled": true,
       "expires": null,
       "notBefore": null,
       "recoveryLevel": "Purgeable",
       "updated": "2020-08-24T21:48:09+00:00"
     },
     "contentType": null,
     "id": "https://contosokv.vault.azure.net/secrets/connectionString/123456789abcdef123456789abcdef",
     "kid": null,
     "managed": null,
     "tags": {
       "file-encoding": "utf-8"
     },
     "value": "jdbc:sqlserver://.database.windows.net:1433;database=DATABASE;"
   }
   ```

Now that you've created a Key Vault and stored a secret, the next section will show you how to create an app with Spring Initializr.

## Create the app with Spring Initializr

This section shows how to use Spring Initializr and `RestController` to create and run a Spring Boot application locally.

1. Browse to <https://start.spring.io/>.
1. Select the choices as shown in the picture following this list.
   1. **Project**: `Maven Project`
   1. **Language**: `Java`
   1. **Spring Boot**: `2.3.3`
   1. **Group**: `com.contoso`  (You can put any valid Java package name here.)
   1. **Artifact**: *keyvault* (You can put any valid Java class name here.)
   1. **Packaging**: `Jar`
   1. **Java**: `11` (You can choose 8, but this tutorial was validated with 11.)
1. Select **Add Dependencies...**.
1. In the text field, type `Spring Web` and press Ctrl+Enter.
1. In the text field type `Azure Key Vault` and press Enter.  Your screen should look like the following.
   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-key-vault/spring-initializr-choices.png" alt-text="Spring Initializr with correct choices selected.":::
1. At the bottom of the page, select **Generate**.
1. When prompted, download the project to a path on your local computer.  For discussion, we'll use a directory *keyvault* in the current user's home directory.  The values above will give you a *keyvault.zip* file in that directory.

Follow these steps to examine the application and run it locally.

1. Unzip the *keyvault.zip* file.  The file layout will look like the following.  We'll ignore the *test* directory and its contents in this tutorial.

   ```bash
   ├── HELP.md
   ├── mvnw
   ├── mvnw.cmd
   ├── pom.xml
   └── src
       ├── main
       │   ├── java
       │   │   └── com
       │   │       └── contoso
       │   │           └── keyvault
       │   │               └── KeyvaultApplication.java
       │   └── resources
       │       ├── application.properties
       │       ├── static
       │       └── templates
   ```

1. Open the *KeyvaultApplication.java* file in a text editor.  Modify the file to make it look like the following.

   * The class is annotated with `@RestController`.  `@RestController` tells Spring Boot that the class can respond to RESTful HTTP requests.
   * The class has a method annotated with `@GetMapping(get)`.  `@GetMapping` tells Spring Boot to send HTTP requests with the path `/get` to that method, allowing the response from that method to be returned to the HTTP client.
   * The class has a private instance variable `connectionString`.  The value of this instance variable is returned from the `get()` method.

   ```java
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RestController;

   @SpringBootApplication
   @RestController
   public class KeyvaultApplication {

      public static void main(String[] args) {
        SpringApplication.run(KeyvaultApplication.class, args);
      }

     @GetMapping("get")
     public String get() {
       return connectionString;
     }

     private String connectionString = "defaultValue\n";  

     public void run(String... varl) throws Exception {
       System.out.println(String.format("\nConnection String stored in Azure Key Vault:\n%s\n",connectionString));
     }  

   }
   ```

1. In the top level *keyvault* directory, where the *pom.xml* file is located, enter `mvn spring-boot:run`.  
1. The message **Completed initialization** in the command output means the server is ready.  In a separate shell window, enter this command.

   ```bash
   $ curl http://localhost:8080/get
   ```

   The output will show `defaultValue`.

1. Kill the process that is running from `mvn spring-boot:run`.  You can type Ctrl-C or you can use the `jps` command to get the pid of the `Launcher` process and kill it.

The next section will show how to add Key Vault integration to your locally running application.

## Add Key Vault integration to the app

The following steps will show the necessary modifications to the Spring Boot application `KeyvaultApplication`.

Just as Key Vault allows externalizing secrets from application code, Spring configuration allows externalizing configuration from code.  The simplest form of Spring configuration is the *application.properties* file.  In a Maven project, this file is located at *src/main/resources/application.properties*.  Spring Initializer helpfully includes a zero length file at this location.

Follow these steps to add the necessary configuration to this file.

1. Open *src/main/resources/application.properties* in an editor and make it have the following contents, adjusting the values for your Azure subscription.

   ```txt
   azure.keyvault.client-id=685on005-ns8q-4o04-8s16-n7os38o2ro5n
   azure.keyvault.client-key=4bt.lCKJKlbYLn_3XF~wWtUwyHU0jKggu2
   azure.keyvault.enabled=true
   azure.keyvault.tenant-id=72s988os-86s1-41ns-91no-2q7pq011qo47
   azure.keyvault.uri=https://contosokv.vault.azure.net/
   ```

   This table explains the properties shown above.

   | Parameter | Description |
   |---|---|
   | azure.keyvault.client-id | The `appId` from the return JSON from `az ad sp create-for-rbac`.|
   | azure.keyvault.client-key | The `password` from the return JSON from `az ad sp create-for-rbac`.|
   | azure.keyvault.enabled | This configuration can be useful when `enabled` or `disabled` should be set at deployment time.  For more information on Spring configuration, see the [Spring documentation](https://docs.spring.io/spring-boot/docs/2.2.2.RELEASE/reference/htmlsingle/#boot-features-external-config).
   | azure.keyvault.tenant-id | The `tenant` from the return JSON from `az ad sp create-for-rbac`.|
   | azure.keyvault.uri | The value output from the `az keyvault create` command above. |

   The complete list of properties available is documented in [the property reference](https://aka.ms/azure-spring-boot-starter-keyvault-secrets).

1. Save the file and close it.

Make one simple changes to the *KeyvaultApplication.java* file (or whatever the class name is in your case).

1. Open *src/main/java/com/contoso/keyvault/KeyvaultApplication.java* in a text editor.
1. Add this import.

   ```java
   import org.springframework.beans.factory.annotation.Value;
   ```

1. Add an annotation to the `connectionString` instance variable.

   ```java
   @Value("${connectionString}")
   private String connectionString;  
   ```

   The Key Vault integration provides a Spring `PropertySource` that is populated from the values of the Key Vault.  Some more implementation details are available in the [reference documentation](https://aka.ms/azure-spring-boot-starter-keyvault-secrets).

1. In the top level *keyvault* directory, where the *pom.xml* file is located, enter `mvn clean package spring-boot:run`.  
1. The message **initialization completed** in the command output means the server is ready.  In a separate shell window, enter this command.

   ```bash
   $ curl http://localhost:8080/get
   ```

   The output will show `jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE` instead of `defaultValue`.

1. Kill the process that is running from `mvn spring-boot:run`.  You can type Ctrl-C or you can use the `jps` command to get the pid of the `Launcher` process and kill it.


The next section will show you how to deploy this app to Azure App Service.

## Deploy to Azure App Service

Follow the steps in this section to deploy the `KeyvaultApplication` to Azure App Service.

### Use the Azure Maven Web App Plugin to deploy the application to Azure App Service

Follow these steps to make your POM ready to deploy `KeyvaultApplication` to Azure App Service.

1. In the top level *keyvault* directory, open the *pom.xml* file.
1. In the `<build><plugins>` section, add the `azure-webapp-maven-plugin` by inserting this XML.

   ```xml
    <plugin>
     <groupId>com.microsoft.azure</groupId>
     <artifactId>azure-webapp-maven-plugin</artifactId>
     <version>1.12.0</version>
    </plugin>
   ```

   > [!NOTE]
   > Don't worry about the formatting.  The `azure-webapp-maven-plugin` will reformat the entire POM during this process.

1. Save and close the *pom.xml*.
1. At a command line, invoke the `config` goal of the newly added plugin.  The maven plugin will ask you some questions and edit *pom.xml* file based on the answers.  You'll further edit the POM.

   ```bash
   mvn azure-webapp:config
   ```

1. For the `Subscription`, ensure you have select the same subscription id with the Key Vault you created.
1. For the `Web App`, you can either select an existing Web App or select `<create>` to create a new one, if you select an existing Web App, it will jump directly to the last **confirm** step.
1. For the `OS`, ensure `linux` is selected.
1. For the `javaVersion`, ensure the Java version you chose in Spring Initializr is chosen.  We chose `11` above, so we choose 11 here.
1. Accept the defaults for the remaining questions.
1. When asked to confirm, answer Y to continue or N to start answering the questions again.  When the plugin completes running, you're ready to edit the POM.

Follow these steps to make further necessary edits to the POM.

1. In the top level *keyvault* directory, open the *pom.xml* file.
1. Find the `azure-webapp-maven-plugin` entry in the `<plugins> section.
1. Modify the value of the `<resourceGroup>`, `<appName>`, and `<region>`.  
   1. Set the value for `<resourceGroup>` to be what you specified when you created the Key Vault.
   1. Choose a sensible value for `<appName>` that is unique within your subscription.
   1. Set the value for `<region>` to be what you specified when you created the Key Vault.
1. Include an `<appSettings>` element that causes the server to listen on TCP port 80.
1. The complete modified `<plugin>` for `azure-webapp-maven-plugin` is shown next.  The values you must modify are indicated with `*`.

   ```xml
   <plugins> 
     <plugin> 
       <groupId>org.springframework.boot</groupId>  
       <artifactId>spring-boot-maven-plugin</artifactId> 
     </plugin>  
     <plugin> 
       <groupId>com.microsoft.azure</groupId>  
       <artifactId>azure-webapp-maven-plugin</artifactId>  
       <version>1.12.0</version>  
       <configuration>
         <schemaVersion>V2</schemaVersion>
         *<subscriptionId>********-****-****-****-************</subscriptionId>
         *<resourceGroup>contosorg</resourceGroup>
         *<appName>contosokeyvault</appName>
         <pricingTier>P1v2</pricingTier>
         *<region>eastus</region>
         <runtime>
           <os>linux</os>
           <javaVersion>java 11</javaVersion>
           <webContainer>Java SE</webContainer>
         </runtime>
         *<!-- Begin of App Settings  -->
         *<appSettings>
         *  <property>
         *    <name>JAVA_OPTS</name>
         *    <value>-Dserver.port=80</value>
         *  </property>
         *</appSettings>
         *<!-- End of App Settings  -->          
         <deployment>
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
   </plugins>
   ```

1. Save and close the POM.
1. Deploy the app to Azure App Service.

   ```bash
   mvn -DskipTests clean package azure-webapp:deploy
   ```

1. The command may take several minutes, depending on many factors beyond your control.  When you see output like this, you know your app has been successfully deployed.

   ```bash
   [INFO] Deploying the zip package contosokeyvault-22b7c1a3-b41b-4082-a9f0-9339723fa36a11893059035499017844.zip...
   [INFO] Successfully deployed the artifact to https://contosokeyvault.azurewebsites.net
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time:  01:45 min
   [INFO] Finished at: 2020-08-16T22:47:48-04:00
   [INFO] ------------------------------------------------------------------------
   ```

1. Wait three to five minutes to allow the deployment to complete.  Then you may access the deployment with a `curl` command like the one above, but this time using the hostname shown in your `BUILD SUCCESS` output.  For example, this `curl` command output indicates success.

   ```bash
   curl https://contosokeyvault.azurewebsites.net/get
   jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;
   ```

You've now deployed your app to Azure App Service.

## Redeploy to Azure App Service and use Managed identities for Azure resources

This section describes how to associate an identity with the Azure resource for the app.  This is required so that Azure can apply security and track access.  Paying for only the resources you use is a foundational principle of cloud computing.  Such fine-grained resource tracking is only possible if every resource is associated with an identity.  Azure App Service and Azure Key Vault are two of the many Azure services that take advantage of Managed identities for Azure resources.  Learn more about this important technology at [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)

> [!NOTE]
> Managed identities for Azure resources is the new name for the service formerly known as Managed Service Identity (MSI).

Follow these steps to create the Managed identity for the Azure App Service app and then allow that identity to access the Key Vault.

1. Create a Managed identity for the App Service app.  Replace the options with the values of your `<resourceGroup>` and `<appName>` elements from your POM.

   ```azurecli
   az webapp identity assign --resource-group contosorg --name contosokeyvault
   ```

   The output will be similar to the following.  Note down the value of `principalId` for the next step.

   ```json
   {
     "principalId": "2r7s6r00-92o9-4sq7-n10r-popq294ssr8s",
     "tenantId": "72s988os-86s1-41ns-91no-2q7pq011qo47",
     "type": "SystemAssigned",
     "userAssignedIdentities": null
   }
   ```

1. Edit the *application.properties* so that it names the Managed identity for Azure resources created in the preceding step.

   1. Remove the `azure.keyvault.client-key`.
   1. Update the `azure.keyvault.client-id` to have a value from the `principalId` from the preceding step.  The completed file should now look like this.

   ```bash
   azure.keyvault.client-id=56rqs994-0o66-43o3-9roo-8e3534d0cb23
   azure.keyvault.enabled=true
   azure.keyvault.tenant-id=72s988os-86s1-41ns-91ab-2q7pq011qo47
   azure.keyvault.uri=https://contosokv.vault.azure.net/    
   ```

1. Configure the Key Vault allows `get` and `list` operations from that Managed identity.  The value of the `object-id` is the `principalId` from the preceding output.

   ```azurecli
   az keyvault set-policy --name contosokv \
     --object-id 2r7s6r00-92o9-4sq7-n10r-popq294ssr8s --secret-permissions get list
   ```

   The output will be a JSON object full of information about the Key Vault.  It will have a `type` entry with value `Microsoft.KeyVault/vaults`

   This table explains the properties shown above.

   | Parameter | Description |
   |---|---|
   | name | The name of the Key Vault. | 
   | object-id | The `principalId` from the preceding command. |
   | secret-permissions | The list of operations to allow from the named principal. |

1. Package and redeploy the application.

   ```bash
   mvn -DskipTests clean package azure-webapp:deploy
   ```

1. For good measure, wait a few more minutes to allow the deployment to settle down.  Then you may contact the deployment with a `curl` command like the one above, but this time using the hostname shown in your `BUILD SUCCESS` output.  For example, this `curl` command output indicates success.

   ```bash
   curl https://contosokeyvault.azurewebsites.net/get
   jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;
   ```

Instead of returning `defaultValue`, the value for `connectionString` is looked up and returned from the Key Vault.  In the next section, we'll deploy the same app to Azure Spring Cloud.

## Deploy to Azure Spring Cloud

Azure Spring Cloud is a fully managed platform for deploying and running your Spring Boot applications in Azure.  For an overview of Azure Spring Cloud, see [What is Azure Spring Cloud?
](/azure/spring-cloud/spring-cloud-overview)

This section will use the existing Spring Boot app and Key Vault created previously with a new instance of Azure Spring Cloud.

The following steps will show how to create an Azure Spring Cloud resource and deploy the app to it.  Make sure you installed the Azure CLI extension for Azure Spring Cloud as shown in the [Prerequisites](#prerequisites).

1. Decide on a name for the service instance.  To use Azure Spring Cloud within your Azure subscription, you must create an Azure resource of type Azure Spring Cloud.  As with all other Azure resources, the service instance must stay within a resource group.  Use the resource group you already created to hold the service instance.  Create the service instance with this command. 

   ```bash
   az spring-cloud create --resource-group "contosorg" --name "contososvc" 
   ```

   This command takes several minutes to complete.

1. Create a Spring Cloud App within the service.

   ```bash
   az spring-cloud app create --resource-group "contosorg" --name "contosoascsapp" --assign-identity --is-public true
     --runtime-version Java_11 --service "contososvc"
   ```

   This table explains the options shown above.

   | Parameter | Description |
   |---|---|
   | assign-identity | Causes the service to create an identity for Managed identities for Azure resources. |
   | is-public | Assign a public DNS domain name to the service. |
   | name | The name of the app. |
   | resource-group | The name of the resource group where you created the existing service instance. |
   | runtime-version | The Java runtime version.  **The value must match the value chosen in Spring Initializr above.** |
   | service | The name of the existing service. |

   To understand the difference between *service* and *app*, see [Understand app and deployment in Azure Spring Cloud](/azure/spring-cloud/spring-cloud-concept-understand-app-and-deployment).

1. Get the Managed identity for the Azure resource.  Use it to configure the existing Key Vault to allow access from this App.

   ```bash
   SERVICE_IDENTITY=$(az spring-cloud app show --resource-group "contosorg" --name "contosoascsapp" --service "contososvc" | jq -r '.identity.principalId')
   az keyvault set-policy --name "contosokv" --object-id <the value of the environment variable SERVICE_IDENTITY> --secret-permissions set get list
   ```

1. Because the existing Spring Boot app already has an *application.properties* file with the necessary configuration, we can deploy this app directly to Spring Cloud using the following command.  Run the command in the directory containing the POM.

   ```bash
   az spring-cloud app deploy --resource-group "contosorg" --name "contosoascsapp" --jar-path target/keyvault-0.0.1-SNAPSHOT.jar \
     --service "contososvc"
   ```

   This command creates a *Deployment* within the app, within the service.  For more details on the concepts of service instances, apps, and Deployments see [Understand app and deployment in Azure Spring Cloud](/azure/spring-cloud/spring-cloud-concept-understand-app-and-deployment).

   If the deployment isn't successful, configure the logs for troubleshooting as described in [Configure application logs](https://aka.ms/azure-spring-cloud-configure-logs).  The logs will likely have useful information to diagnose and resolve the problem.

1. When the app has been successfully deployed, you can use `curl` to verify the Key Vault integration is working.  Because you specified `--is-public`, the default URL for your service is `https://<service name>-<app name>.azuremicroservices.io/`.  Replacing the proper values and appending the value of the `@GetMapping` annotation, we have this `curl` command.

   ```bash
   curl https://contososvc-contosoascsapp.azuremicroservices.io/get
   ```

   The output will show `jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE`.

## Summary

You created a new Java web application using the **Spring Initializr**.  You created an Azure Key Vault to store sensitive information, and then configured your application to retrieve information from your Key Vault.  After testing it locally, you deployed the app to Azure App Service and Azure Spring Cloud.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Configure a Spring Boot Initializer app to use Application Insights](configure-spring-boot-java-applicationinsights.md)
