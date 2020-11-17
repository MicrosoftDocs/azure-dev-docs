---
title: Get started with the Azure SDK for Java
description: Learn how to create Azure cloud resources and connect and use them in your Java applications.
keywords: Azure, Java, SDK, API, authenticate, get-started
author: rloutlaw
ms.date: 04/16/2017
ms.topic: article
ms.service: multiple
ms.assetid: b1e10b79-f75e-4605-aecd-eed64873e2d3
ms.custom: seo-java-august2019, devx-track-java, devx-track-azurecli
---

# Get started with cloud development using Java on Azure

This guide walks you through setting up a development environment for Azure development in Java. You'll then create some Azure resources and connect to them to perform some basic tasks, like uploading a file or deploying a web application. When you're done, you'll be ready to start using Azure services in your own Java applications.

[!INCLUDE [chrome-note](includes/chrome-note.md)]

## Prerequisites

- An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/)
- [Azure Cloud Shell](/azure/cloud-shell/quickstart) or [Azure CLI 2.0](/cli/azure/install-az-cli2).
- [Java 8](https://docs.microsoft.com/azure/developer/java/fundamentals/java-jdk-long-term-support) (included in Azure Cloud Shell)
- [Maven 3](https://maven.apache.org/download.cgi) (included in Azure Cloud Shell)

## Set up authentication

Your Java application needs read and create permissions in your Azure subscription to run the sample code in this tutorial. Create a service principal and configure your application to run with its credentials. Service principals provide a way to create a non-interactive account associated with your identity to which you grant only the privileges your app needs to run.

[Create a service principal using the Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli) and capture the output.

```azurecli-interactive
az ad sp create-for-rbac --name AzureJavaTest
```

Which gives you a reply in the following format:

```json
{
  "appId": "a487e0c1-82af-47d9-9a0b-af184eb87646d",
  "displayName": "AzureJavaTest",
  "name": "http://AzureJavaTest",
  "password": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "tenant": "tttttttt-tttt-tttt-tttt-tttttttttttt"
}
```

Next, configure the environment variables with the following:

- <code>AZURE_SUBSCRIPTION_ID</code>: use the *id* value from `az account show` in the Azure CLI 2.0.
- <code>AZURE_CLIENT_ID</code>: use the *appId* value from the output taken from a service principal output.
- <code>AZURE_CLIENT_SECRET</code>: use the *password* value from the service principal output.
- <code>AZURE_TENANT_ID</code>: use the *tenant* value from the service principal output.

For more options of authentication, please refer to [Azure Identity](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity#azure-identity-client-library-for-java).

## Tooling

### Create a new Maven project

> [!NOTE]
> This guide uses Maven build tool to build and run the sample code, but other build tools such as Gradle also work with the Azure libraries for Java.

Create a Maven project from the command line in a new directory on your system:

```shell
mkdir java-azure-test
cd java-azure-test
mvn archetype:generate -DgroupId=com.fabrikam -DartifactId=AzureApp \
-DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

This creates a basic Maven project under the `testAzureApp` folder. Add the following entries into the project `pom.xml` to import the libraries used in the sample code in this tutorial.

```XML
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.2.0</version>
</dependency>
<dependency>
    <groupId>com.azure.resourcemanager</groupId>
    <artifactId>azure-resourcemanager</artifactId>
    <version>2.0.0</version>
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-storage-blob</artifactId>
    <version>12.8.0</version>
</dependency>
<dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
    <version>6.2.1.jre8</version>
</dependency>
<!-- Only for SQL sample as it's still in preview -->
<dependency>
    <groupId>com.azure.resourcemanager</groupId>
    <artifactId>azure-resourcemanager-sql</artifactId>
    <version>2.0.0-beta.5</version>
</dependency>
```

Add a `build` entry under the top-level `project` element to use the [maven-exec-plugin](https://www.mojohaus.org/exec-maven-plugin/) to run the samples:

```XML
<build>
    <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>exec-maven-plugin</artifactId>
            <configuration>
                <mainClass>com.fabrikam.AzureApp</mainClass>
            </configuration>
        </plugin>
    </plugins>
</build>
 ```

### Install the Azure Toolkit for Intellij

The [Azure toolkit](../toolkit-for-intellij/index.yml) is necessary if you're going to be deploying web apps or APIs programmatically but is not currently used for any other kinds of development. The following is a summary of the installation process. For a quickstart, visit [Azure Toolkit for IntelliJ quickstart](../toolkit-for-intellij/create-hello-world-web-app.md).

- Select the **File** menu and then select **Settings...**.

- Select **Browse repositories...** and then search "Azure" and install the **Azure toolkit for Intellij**.

- Restart Intellij.

### Install the Azure Toolkit for Eclipse

The [Azure toolkit](../toolkit-for-eclipse/index.yml) is necessary if you're going to be deploying web apps or APIs programmatically but is not currently used for any other kinds of development. The following is a summary of the installation process. For a quickstart, visit [Azure Toolkit for Eclipse quickstart](../toolkit-for-eclipse/create-hello-world-web-app.md).

- Select the **Help** menu and then select **Install New software**.

- In the **Work with:** field enter `http://dl.microsoft.com/eclipse/` and press enter.

- Then, select the checkbox next to **Azure toolkit for Java** and uncheck the checkbox for **Contact all update sites during install to find required software**. Then select next.

## Create a Linux virtual machine

Create a new file named `AzureApp.java` in the project's `src/main/java/com/fabrikam` directory and paste in the following block of code. Update the `userName` and `sshKey` variables with real values for your machine. The code creates a new Linux VM with name `testLinuxVM` in a resource group `sampleResourceGroup` running in the US East Azure region.

```java
package com.fabrikam;

import com.azure.core.credential.TokenCredential;
import com.azure.core.http.policy.HttpLogDetailLevel;
import com.azure.core.management.AzureEnvironment;
import com.azure.core.management.Region;
import com.azure.core.management.profile.AzureProfile;
import com.azure.identity.AzureAuthorityHosts;
import com.azure.identity.EnvironmentCredentialBuilder;
import com.azure.resourcemanager.AzureResourceManager;
import com.azure.resourcemanager.compute.models.KnownLinuxVirtualMachineImage;
import com.azure.resourcemanager.compute.models.VirtualMachine;
import com.azure.resourcemanager.compute.models.VirtualMachineSizeTypes;

public class AzureApp {

    public static void main(String[] args) {

        final String userName = "YOUR_VM_USERNAME";
        final String sshKey = "YOUR_PUBLIC_SSH_KEY";

        try {
            TokenCredential credential = new EnvironmentCredentialBuilder()
                    .authorityHost(AzureAuthorityHosts.AZURE_PUBLIC_CLOUD)
                    .build();

            // if you do not set tenant ID and subscription ID via environment variables
            // change to create azure profile with tenantId, subscriptionId and azure environment
            AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);

            AzureResourceManager azureResourceManager = AzureResourceManager.configure()
                    .withLogLevel(HttpLogDetailLevel.BASIC)
                    .authenticate(credential, profile)
                    .withDefaultSubscription();

            // create a Ubuntu virtual machine in a new resource group
            VirtualMachine linuxVM = azureResourceManager.virtualMachines().define("testLinuxVM")
                    .withRegion(Region.US_EAST)
                    .withNewResourceGroup("sampleVmResourceGroup")
                    .withNewPrimaryNetwork("10.0.0.0/24")
                    .withPrimaryPrivateIPAddressDynamic()
                    .withoutPrimaryPublicIPAddress()
                    .withPopularLinuxImage(KnownLinuxVirtualMachineImage.UBUNTU_SERVER_16_04_LTS)
                    .withRootUsername(userName)
                    .withSsh(sshKey)
                    .withUnmanagedDisks()
                    .withSize(VirtualMachineSizeTypes.STANDARD_D3_V2)
                    .create();

        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }
}
```

Run the sample from the command line:

```shell
mvn compile exec:java
```

You'll see some REST requests and responses in the console as the SDK makes the underlying calls to the Azure REST API to configure the virtual machine and its resources. When the program finishes, verify the virtual machine in your subscription with the Azure CLI 2.0:

```azurecli-interactive
az vm list --resource-group sampleVmResourceGroup
```

Once you've verified that the code worked, use the CLI to delete the VM and its resources.

```azurecli-interactive
az group delete --name sampleVmResourceGroup
```

## Deploy a web app from a GitHub repo

Replace the main method in `AzureApp.java` with the one below, updating the `appName` variable to a unique value before running the code. This code deploys a web application from the `master` branch in a public GitHub repo into a new [Azure App Service Web App](/azure/app-service-web/app-service-web-overview) running in the free pricing tier.

```java
    public static void main(String[] args) {
        try {

            final String appName = "YOUR_APP_NAME";

            TokenCredential credential = new EnvironmentCredentialBuilder()
                    .authorityHost(AzureAuthorityHosts.AZURE_PUBLIC_CLOUD)
                    .build();

            // if you do not set tenant ID and subscription ID via environment variables
            // change to create azure profile with tenantId, subscriptionId and azure environment
            AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);
            
            AzureResourceManager azureResourceManager = AzureResourceManager.configure()
                    .withLogLevel(HttpLogDetailLevel.BASIC)
                    .authenticate(credential, profile)
                    .withDefaultSubscription();

            WebApp app = azureResourceManager.webApps().define(appName)
                    .withRegion(Region.US_WEST2)
                    .withNewResourceGroup("sampleWebResourceGroup")
                    .withNewWindowsPlan(PricingTier.FREE_F1)
                    .defineSourceControl()
                    .withPublicGitRepository(
                            "https://github.com/Azure-Samples/app-service-web-java-get-started")
                    .withBranch("master")
                    .attach()
                    .create();

        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }
```

Run the code as before using Maven:

```shell
mvn clean compile exec:java
```

Open a browser pointed to the application using the CLI:

```azurecli-interactive
az appservice web browse --resource-group sampleWebResourceGroup --name YOUR_APP_NAME
```

Remove the web app and plan from your subscription once you've verified the deployment.

```azurecli-interactive
az group delete --name sampleWebResourceGroup
```

## Connect to an Azure SQL database

Replace the current main method in `AzureApp.java` with the code below, setting real values for the variables.
This code creates a new SQL database with a firewall rule allowing remote access,  and then connects to it using the SQL Database JBDC driver.

```java
    public static void main(String args[])
    {
        // create the db using the management libraries
        try {
            TokenCredential credential = new EnvironmentCredentialBuilder()
                    .authorityHost(AzureAuthorityHosts.AZURE_PUBLIC_CLOUD)
                    .build();

            // if you do not set tenant ID and subscription ID via environment variables
            // change to create azure profile with tenantId, subscriptionId and azure environment
            AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);

            SqlServerManager sqlServerManager = SqlServerManager.configure()
                    .withLogLevel(HttpLogDetailLevel.BASIC)
                    .authenticate(credential, profile);

            final String adminUser = "YOUR_USERNAME_HERE";
            final String sqlServerName = "YOUR_SERVER_NAME_HERE";
            final String sqlDbName = "YOUR_DB_NAME_HERE";
            final String dbPassword = "YOUR_PASSWORD_HERE";
            final String firewallRuleName = "YOUR_RULE_NAME_HERE";

            SqlServer sampleSQLServer = sqlServerManager.sqlServers().define(sqlServerName)
                    .withRegion(Region.US_EAST)
                    .withNewResourceGroup("sampleSqlResourceGroup")
                    .withAdministratorLogin(adminUser)
                    .withAdministratorPassword(dbPassword)
                    .defineFirewallRule(firewallRuleName)
                        .withIpAddressRange("0.0.0.0","255.255.255.255")
                        .attach()
                    .create();

            SqlDatabase sampleSQLDb = sampleSQLServer.databases().define(sqlDbName).create();

            // assemble the connection string to the database
            final String domain = sampleSQLServer.fullyQualifiedDomainName();
            String url = "jdbc:sqlserver://"+ domain + ":1433;" +
                    "database=" + sqlDbName +";" +
                    "user=" + adminUser+ "@" + sqlServerName + ";" +
                    "password=" + dbPassword + ";" +
                    "encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;";

            // connect to the database, create a table and insert a entry into it
            Connection conn = DriverManager.getConnection(url);

            String createTable = "CREATE TABLE CLOUD ( name varchar(255), code int);";
            String insertValues = "INSERT INTO CLOUD (name, code ) VALUES ('Azure', 1);";
            String selectValues = "SELECT * FROM CLOUD";
            Statement createStatement = conn.createStatement();
            createStatement.execute(createTable);
            Statement insertStatement = conn.createStatement();
            insertStatement.execute(insertValues);
            Statement selectStatement = conn.createStatement();
            ResultSet rst = selectStatement.executeQuery(selectValues);

            while (rst.next()) {
                System.out.println(rst.getString(1) + " "
                        + rst.getString(2));
            }


        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.out.println(e.getStackTrace().toString());
        }
    }
```

Run the sample from the command line:

```shell
mvn clean compile exec:java
```

Then clean up the resources using the CLI:

```azurecli-interactive
az group delete --name sampleSqlResourceGroup
```

## Write a blob into a new storage account

Replace the current main method in `AzureApp.java` with the code below. This code creates an [Azure storage account](/azure/storage/common/storage-introduction) and then uses the Azure Storage libraries for Java to create a new text file in the cloud.

```java
    public static void main(String[] args) {

        try {
            TokenCredential tokenCredential = new EnvironmentCredentialBuilder()
                    .authorityHost(AzureAuthorityHosts.AZURE_PUBLIC_CLOUD)
                    .build();

            // if you do not set tenant ID and subscription ID via environment variables
            // change to create azure profile with tenantId, subscriptionId and azure environment
            AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);

            AzureResourceManager azureResourceManager = AzureResourceManager.configure()
                    .withLogLevel(HttpLogDetailLevel.BASIC)
                    .authenticate(tokenCredential, profile)
                    .withDefaultSubscription();

            // create a new storage account
            String storageAccountName = "YOUR_STORAGE_ACCOUNT_NAME_HERE";
            StorageAccount storage = azureResourceManager.storageAccounts().define(storageAccountName)
                    .withRegion(Region.US_WEST2)
                    .withNewResourceGroup("sampleStorageResourceGroup")
                    .create();

            // create a storage container to hold the file
            List<StorageAccountKey> keys = storage.getKeys();
            PublicEndpoints endpoints = storage.endPoints();
            String accountName = storage.name();
            String accountKey = keys.get(0).value();
            String endpoint = endpoints.primary().blob();

            StorageSharedKeyCredential credential = new StorageSharedKeyCredential(accountName, accountKey);

            BlobServiceClient storageClient =new BlobServiceClientBuilder()
                    .endpoint(endpoint)
                    .credential(credential)
                    .buildClient();

            // Container name must be lower case
            BlobContainerClient blobContainerClient = storageClient.getBlobContainerClient("helloazure");
            blobContainerClient.create();

            // Make the container public
            blobContainerClient.setAccessPolicy(PublicAccessType.CONTAINER, null);

            // write a blob to the container
            String fileName = "helloazure.txt";
            String textNew = "Hello Azure";

            BlobClient blobClient = blobContainerClient.getBlobClient(fileName);
            InputStream is = new ByteArrayInputStream(textNew.getBytes());
            blobClient.upload(is, textNew.length());

        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }
```

Run the sample from the command line:

```shell
mvn clean compile exec:java
```

You can browse for the `helloazure.txt` file in your storage account through the Azure portal or with [Azure Storage Explorer](/azure/vs-azure-tools-storage-explorer-blobs).

Clean up the storage account using the CLI:

```azurecli-interactive
az group delete --name sampleStorageResourceGroup
```

## Explore more samples

To learn more about how to use the Azure management libraries for Java to manage resources and automate tasks, see our sample code for [virtual machines](java-sdk-azure-virtual-machine-samples.md), [web apps](java-sdk-azure-web-apps-samples.md) and [SQL database](java-sdk-azure-sql-database-samples.md).

## Reference and release notes

A [reference](/java/api) is available for all packages.

## Get help and give feedback

Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure+java). Report bugs and open issues against the Azure libraries for Java on the [project GitHub](https://github.com/Azure/azure-sdk-for-java).
