---
title: How to use the Spring Boot Starter for Azure Key Vault
description: Learn how to configure a Spring Boot Initializer app with the Azure Key Vault starter.
services: key-vault
documentationcenter: java
author: rmcmurray
manager: mbaldwin
editor: ''
ms.assetid:
ms.author: robmcm
ms.date: 12/19/2018
ms.devlang: java
ms.service: key-vault
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
---

# How to use the Spring Boot Starter for Azure Key Vault

## Overview

This article demonstrates creating an app with the **[Spring Initializr]** that uses the Spring Boot Starter for Azure Key Vault to retrieve a connection string that is stored as a secret in a key vault.

## Prerequisites

The following prerequisites are required in order to complete the steps in this article:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

## Create an app using Spring Initializr

1. Browse to <https://start.spring.io/>.

1. Specify that you want to generate a **Maven** project with **Java**, enter the **Group** and **Aritifact** names for your application, and then click the link to **Switch to the full version** of the Spring Initializr.

   ![Specify Group and Aritifact names][secrets-01]

1. Scroll down to the **Azure** section and check the box for **Azure Key Vault**.

   ![Select Azure Key Vault starter][secrets-02]

1. Scroll to the bottom of the page and click the button to **Generate Project**.

   ![Generate Spring Boot project][secrets-03]

1. When prompted, download the project to a path on your local computer.

## Sign into Azure

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

1. Create a resource group for the Azure resources you will use for your key vault; for example:
   ```azurecli
   az group create --name wingtiptoysresources --location westus
   ```
   Where:

   | Parameter | Description |
   |---|---|
   | `name` | Specifies a unique name for your resource group. |
   | `location` | Specifies the [Azure region](https://azure.microsoft.com/regions/) where your resource group will be hosted. |

   The Azure CLI will display the results of your resource group creation; for example:  

   ```json
   {
     "id": "/subscriptions/ssssssss-ssss-ssss-ssss-ssssssssssss/resourceGroups/wingtiptoysresources",
     "location": "westus",
     "managedBy": null,
     "name": "wingtiptoysresources",
     "properties": {
       "provisioningState": "Succeeded"
     },
     "tags": null
   }
   ```

2. Create an Azure service principal from your application registration; for example:
   ```shell
   az ad sp create-for-rbac --name "wingtiptoysuser"
   ```
   Where:

   | Parameter | Description |
   |---|---|
   | `name` | Specifies the name for your Azure service principal. |

   The Azure CLI will return a JSON status message that contains the *appId* and *password*, which you will use later as the client id and client password; for example:

   ```json
   {
     "appId": "iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii",
     "displayName": "wingtiptoysuser",
     "name": "http://wingtiptoysuser",
     "password": "pppppppp-pppp-pppp-pppp-pppppppppppp",
     "tenant": "tttttttt-tttt-tttt-tttt-tttttttttttt"
   }
   ```

3. Create a new key vault in the resource group; for example:
   ```azurecli
   az keyvault create --name wingtiptoyskeyvault --resource-group wingtiptoysresources --location westus --enabled-for-deployment true --enabled-for-disk-encryption true --enabled-for-template-deployment true --sku standard --query properties.vaultUri
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

   ```
   "https://wingtiptoyskeyvault.vault.azure.net"
   ```

4. Set the access policy for the Azure service principal you created earlier; for example:
   ```azurecli
   az keyvault set-policy --name wingtiptoyskeyvault --secret-permission set get list delete --spn "iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii"
   ```
   Where:

   | Parameter | Description |
   |---|---|
   | `name` | Specifies your key vault name from earlier. |
   | `secret-permission` | Specifies the [security policies](/cli/azure/keyvault) for your key vault. |
   | `spn` | Specifies the GUID for your application registration from earlier. |

   The Azure CLI will display the results of your security policy creation; for example:  

   ```json
   {
     "id": "/subscriptions/ssssssss-ssss-ssss-ssss-ssssssssssss/...",
     "location": "westus",
     "name": "wingtiptoyskeyvault",
     "properties": {
       ...
       ... (A long list of values will be displayed here.)
       ...
     },
     "resourceGroup": "wingtiptoysresources",
     "tags": {},
     "type": "Microsoft.KeyVault/vaults"
   }
   ```

5. Store a secret in your new key vault; for example:
   ```azurecli
   az keyvault secret set --vault-name "wingtiptoyskeyvault" --name "connectionString" --value "jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;"
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
     "id": "https://wingtiptoyskeyvault.vault.azure.net/secrets/connectionString/123456789abcdef123456789abcdef",
     "kid": null,
     "managed": null,
     "tags": {
       "file-encoding": "utf-8"
     },
     "value": "jdbc:sqlserver://wingtiptoys.database.windows.net:1433;database=DATABASE;"
   }
   ```

## Configure and compile your app

1. Extract the files from the Spring Boot project archive files that you downloaded earlier into a directory.

2. Navigate to the *src/main/resources* folder in your project and open the *application.properties* file in a text editor.

3. Add the values for your key vault using values from the steps that you completed earlier in this tutorial; for example:
   ```yaml
   azure.keyvault.uri=https://wingtiptoyskeyvault.vault.azure.net/
   azure.keyvault.client-id=iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii
   azure.keyvault.client-key=pppppppp-pppp-pppp-pppp-pppppppppppp
   ```
   Where:

   |          Parameter          |                                 Description                                 |
   |-----------------------------|-----------------------------------------------------------------------------|
   |    `azure.keyvault.uri`     |           Specifies the URI from when you created your key vault.           |
   | `azure.keyvault.client-id`  |  Specifies the *appId* GUID from when you created your service principal.   |
   | `azure.keyvault.client-key` | Specifies the *password* GUID from when you created your service principal. |


4. Navigate to the main source code file of your project; for example: */src/main/java/com/wingtiptoys/secrets*.

5. Open the application's main Java file in a file in a text editor; for example: *SecretsApplication.java*, and add the following lines to the file:

   ```java
   package com.wingtiptoys.secrets;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.beans.factory.annotation.Value;
   import org.springframework.boot.CommandLineRunner;

   @SpringBootApplication
   public class SecretsApplication implements CommandLineRunner {

      @Value("${connectionString}")
      private String connectionString;

      public static void main(String[] args) {
         SpringApplication.run(SecretsApplication.class, args);
      }

      public void run(String... varl) throws Exception {
         System.out.println(String.format("\nConnection String stored in Azure Key Vault:\n%s\n",connectionString));
      }
   }
   ```
   This code example retrieves the connection string from the key vault and displays it to the command line.

6. Save and close the Java file.

## Build and test your app

1. Navigate to the directory where the *pom.xml* file for your Spring Boot app is located:

1. Build your Spring Boot application with Maven; for example:

   ```bash
   mvn clean package
   ```

   Maven will display the results of your build.

   ![Spring Boot application build status][build-application-01]

1. Run your Spring Boot application with Maven; the application will display the connection string from your key vault. For example:

   ```bash
   mvn spring-boot:run
   ```

   ![Spring Boot run time message][build-application-02]

## Summary

In this tutorial, you created a new Java web application using the **[Spring Initializr]**, created an Azure Key Vault to store sensitive information, and then configured your application to retrieve information from your key vault.

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/java/azure/spring-framework)

### Additional Resources

For more information about using Azure Key Vaults, see the following articles:

* [Key Vault Documentation].

* [Get started with Azure Key Vault]

For more information about using Spring Boot applications on Azure, see the following articles:

* [Deploy a Spring Boot Application to the Azure App Service](deploy-spring-boot-java-web-app-on-azure.md)

* [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](deploy-spring-boot-java-app-on-kubernetes.md)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

<!-- URL List -->

[Key Vault Documentation]: /azure/key-vault/
[Get started with Azure Key Vault]: /azure/key-vault/key-vault-get-started
[Azure for Java Developers]: /java/azure/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[secrets-01]: media/configure-spring-boot-starter-java-app-with-azure-key-vault/secrets-01.png
[secrets-02]: media/configure-spring-boot-starter-java-app-with-azure-key-vault/secrets-02.png
[secrets-03]: media/configure-spring-boot-starter-java-app-with-azure-key-vault/secrets-03.png

[build-application-01]: media/configure-spring-boot-starter-java-app-with-azure-key-vault/build-application-01.png
[build-application-02]: media/configure-spring-boot-starter-java-app-with-azure-key-vault/build-application-02.png
