---
title: How to use the Spring Boot Starter for Azure Key Vault
description: Learn how to configure a Spring Boot Initializer app with the Azure Key Vault starter.
services: key-vault
documentationcenter: java
ms.date: 10/29/2019
ms.service: key-vault
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
---

# How to use the Spring Boot Starter for Azure Key Vault

This article demonstrates creating an app with the **[Spring Initializr]** that uses the Spring Boot Starter for Azure Key Vault to retrieve a connection string that is stored as a secret in a key vault.

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

## Create an app using Spring Initializr

The following procedure creates the application using Spring Initializr.

1. Browse to <https://start.spring.io/>.

1. Specify that you want to generate a **Maven** project with **Java**.  

1. Enter the **Group** and **Artifact** names for your application.

1. In the **Dependencies** section, enter **Azure Key Vault**.

1. Scroll to the bottom of the page and click **Generate**.

   ![Generate Spring Boot project][secrets-01]

1. When prompted, download the project to a path on your local computer.

## Sign into Azure

The following procedure authenticates the user in Azure CLI.

1. Open a command prompt.

1. Sign into your Azure account by using the Azure CLI:

   ```azurecli
   az login
   ```

Follow the instructions to complete the sign-in process.

1. List your subscriptions:

   ```azurecli
   az account list
   ```

   Azure will return a list of your subscriptions, and you will need to copy the GUID for the subscription that you want to use; for example:

   ```json
   [
     {
       "cloudName": "AzureCloud",
       "id": "ssssssss-ssss-ssss-ssss-ssssssssssss",
       "isDefault": true,
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

1. Specify the GUID for the account you want to use with Azure; for example:

   ```azurecli
   az account set -s ssssssss-ssss-ssss-ssss-ssssssssssss
   ```

## Create a new Azure Key Vault

The following procedure creates and initializes the key vault.

1. Create a resource group for the Azure resources you will use for your key vault; for example:

   ```azurecli
   az group create --name vged-rg2 --location westus
   ```

   Where:

   | Parameter | Description |
   |---|---|
   | `name` | Specifies a unique name for your resource group. |
   | `location` | Specifies the [Azure region](https://azure.microsoft.com/regions/) where your resource group will be hosted. |

   The Azure CLI will display the results of your resource group creation; for example:  

   ```json
   {
     "id": "/subscriptions/ssssssss-ssss-ssss-ssss-ssssssssssss/resourceGroups/vged-rg2",
     "location": "westus",
     "managedBy": null,
     "name": "vged-rg2",
     "properties": {
       "provisioningState": "Succeeded"
     },
     "tags": null
   }
   ```

2. Create a new key vault in the resource group; for example:

   ```azurecli
   az keyvault create --name vgedkeyvault --resource-group vged-rg2 --location westus --enabled-for-deployment true --enabled-for-disk-encryption true --enabled-for-template-deployment true --sku standard --query properties.vaultUri
   ```

   Where:

   | Parameter | Description |
   |---|---|
   | `name` | Specifies a unique name for your key vault. |
   | `location` | Specifies the [Azure region](https://azure.microsoft.com/regions/) where your resource group will be hosted. |
   | `enabled-for-deployment` | Specifies the [key vault deployment option](/cli/azure/keyvault). |
   | `enabled-for-disk-encryption` | Specifies the [key vault encryption option](/cli/azure/keyvault). |
   | `enabled-for-template-deployment` | Specifies the [key vault encryption option](/cli/azure/keyvault). |
   | `sku` | Specifies the [key vault SKU option](/cli/azure/keyvault). |
   | `query` | Specifies a value to retrieve from the response, which is the key vault URI that you will need to complete this tutorial. |

   The Azure CLI will display the URI for key vault, which you will use later; for example:  

   ```azurecli
   "https://vgedkeyvault.vault.azure.net"
   ```

3. Store a secret in your new key vault; for example:

   ```azurecli
   az keyvault secret set --vault-name "vgedkeyvault" --name "connectionString" --value "jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;"
   ```

   Where:

   | Parameter | Description |
   |---|---|
   | `vault-name` | Specifies your key vault name from earlier. |
   | `name` | Specifies the name of your secret. |
   | `value` | Specifies the value of your secret. |

   The Azure CLI will display the results of your secret creation; for example:  

   ```json
   {
     "attributes": {
       "created": "2017-12-01T09:00:16+00:00",
       "enabled": true,
       "expires": null,
       "notBefore": null,
       "recoveryLevel": "Purgeable",
       "updated": "2017-12-01T09:00:16+00:00"
     },
     "contentType": null,
     "id": "https://vgedkeyvault.vault.azure.net/secrets/connectionString/123456789abcdef123456789abcdef",
     "kid": null,
     "managed": null,
     "tags": {
       "file-encoding": "utf-8"
     },
     "value": "jdbc:sqlserver://.database.windows.net:1433;database=DATABASE;"
   }
   ```

## Configure and compile your app

Use the following procedure to configure and compile your application.

1. Extract the files from the Spring Boot project archive files that you downloaded earlier into a directory.

2. Navigate to the *src/main/resources* folder in your project and open the *application.properties* file in a text editor.

3. Add the values for your key vault using values from the steps that you completed earlier in this tutorial; for example:

   ```yaml
   azure.keyvault.uri=https://vgedkeyvault.vault.azure.net/
   azure.keyvault.enabled=true
   ```

   Where:

   |          Parameter          |                                 Description                                 |
   |-----------------------------|-----------------------------------------------------------------------------|
   |    `azure.keyvault.uri`     |           Specifies the URI from when you created your key vault.           |
    
    
4. Navigate to the main source code file of your project; for example: */src/main/java/com/vged/secrets*.

5. Open the application's main Java file in a file in a text editor; for example: *SecretsApplication.java*, and add the following lines to the file:

   ```java
   package com.vged.secrets;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.beans.factory.annotation.Value;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RestController;
   
   @SpringBootApplication
   @RestController
   public class SecretsApplication implements CommandLineRunner {

      @Value("${connectionString}")
      private String connectionString;

      public static void main(String[] args) {
         SpringApplication.run(SecretsApplication.class, args);
      }
   
      @GetMapping("get")
      public String get() {
         return connectionString;
      }
   
      public void run(String... varl) throws Exception {
         System.out.println(String.format("\nConnection String stored in Azure Key Vault:\n%s\n",connectionString));
      }
   }
   ```
   This code example retrieves the connection string from the key vault and displays it to the url `https://{your-appservice-name}.azurewebsites.net/get`.

6. Save and close the Java file.

7. Disable the test and build the JAR file using Maven.
    
   ```shell
   mvn clean package
   ```

## Configure Maven Plugin for Azure App Service

This section helps you to configure your Spring Boot project to enable your app to be deployed on Azure App Service.

1.  Follow the link to [Configure Maven Plugin for Azure App Service].
    
    This link creates a new Azure App Service. If you want to deploy your app on an existing one, you can re-configure the deployment by the command `mvn azure-webapp:config` and choose Application part to config.
    
    ```cmd
    [INFO] Scanning for projects...                                                     
    [INFO]                                                                              
    [INFO] ----------------------< com.wingtiptoys:secrets >-----------------------     
    [INFO] Building secrets 0.0.1-SNAPSHOT                                              
    [INFO] --------------------------------[ jar ]---------------------------------     
    [INFO]                                                                              
    [INFO] --- azure-webapp-maven-plugin:1.9.0:config (default-cli) @ secrets ---       
    Please choose which part to config                                                  
    1. Application                                                                      
    2. Runtime                                                                          
    3. DeploymentSlot                                                                   
    Enter index to use: 1                                                              
    Define value for appName(Default: ********):                                      
    Define value for resourceGroup(Default: ********):                                 
    Define value for region(Default: ********):                                           
    Define value for pricingTier(Default: P1v2):                                        
    1. b1                                                                               
    2. b2                                                                               
    3. b3                                                                               
    4. d1                                                                               
    5. f1                                                                               
    6. p1v2 [*]                                                                         
    7. p2v2                                                                             
    8. p3v2                                                                             
    9. s1                                                                               
    10. s2                                                                              
    11. s3                                                                              
    Enter index to use:                                                                 
    Please confirm webapp properties                                                                                                          
    ```
    
    You can also edit the `<configuration>` section of `<azure-webapp-maven-plugin>` in `pom.xml` directly. Modify the `<resourceGroup>`,`<appName>` and `<region>` value to your specific App Service.

2. Assign identity to App Service and take down the `principalId` for the next step.

   ```cmd
   az webapp identity assign --name your-appservice-name \
      --resource-group vged-rg2
   ```
   
3. Grant permission to MSI.

   ```cmd
   az keyvault set-policy --name vgedkeyvault \
       --object-id your-managed-identity-objectId \
       --secret-permissions get list
   ```

## Deploy the app to Azure and Run App Service

Now you are ready to deploy your web app on Azure. To do so, use the following steps:

1. Rebuild the JAR file using Maven if you made any changes to the pom.xml file.

   ```cmd
   mvn clean package
   ```
   
2. Deploy your app on Azure by using Maven.

   ```cmd
   mvn azure-webapp:deploy
   ```
   
3. Restart your App Service.

4. Check this URL in browser: `https://{your-appservice-name}.azurewebsites.net/get` to get your `connectionString`.
   

## Summary

In this tutorial, you created a new Java web application using the **[Spring Initializr]**, created an Azure Key Vault to store sensitive information, and then configured your application to retrieve information from your key vault.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/azure/java/spring-framework)

### Additional Resources

For more information about using Azure Key Vaults, see the following articles:

* [Key Vault Documentation].

* [Get started with Azure Key Vault]

For more information about using Spring Boot applications on Azure, see the following articles:

* [Deploy a Spring Boot Application to the Azure App Service](deploy-spring-boot-java-app-from-container-registry-using-maven-plugin.md)

* [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](deploy-spring-boot-java-app-on-kubernetes.md)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

For more information about using managed identities for App Service, see the [Using managed identities for App Service].

<!-- URL List -->

[Key Vault Documentation]: /azure/key-vault/
[Get started with Azure Key Vault]: /azure/key-vault/key-vault-get-started
[Azure for Java Developers]: /azure/java/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/
[Using managed identities for App Service]: https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity?tabs=javascript
[Configure Maven Plugin for Azure App Service]: https://docs.microsoft.com/en-us/azure/java/spring-framework/deploy-spring-boot-java-app-with-maven-plugin#configure-maven-plugin-for-azure-app-service

<!-- IMG List -->

[secrets-01]: media/configure-spring-boot-starter-java-app-with-azure-key-vault/secrets-01.png
[secrets-02]: media/configure-spring-boot-starter-java-app-with-azure-key-vault/secrets-02.png
[secrets-03]: media/configure-spring-boot-starter-java-app-with-azure-key-vault/secrets-03.png

[build-application-01]: media/configure-spring-boot-starter-java-app-with-azure-key-vault/build-application-01.png
[build-application-02]: media/configure-spring-boot-starter-java-app-with-azure-key-vault/build-application-02.png
