---
title: Tutorial Secure Spring Boot Apps using Azure Key Vault certificates
description: Tutorial Secure Spring Boot Apps using Azure Key Vault certificates
services: key-vault
documentationcenter: java
ms.date: 01/19/2021
ms.service: key-vault
ms.tgt_pltfrm: multiple
ms.topic: tutorial
ms.workload: identity
ms.custom: devx-track-java, devx-track-azurecli
ms.author: edburns
---

# Tutorial: Secure Spring Boot Apps using Azure Key Vault certificates

Production grade Spring Boot applications, whether in the cloud or on-premise, require end-to-end encryption for network traffic using standard SSL protocols. Most SSL certificates you encounter are discoverable from a public root certificate authority (CA). Sometimes, this is not possible.  When certificates are not discoverable, the app must have some way to **load** such certificates and to **present** them to inbound network connections and **accept** them from outbound network connections. This tutorial shows you how to secure your Spring Boot (including Azure Spring Cloud) Apps with SSL certificates using Azure Key Vault and Managed Identities for Azure Resources.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a GNU/Linux VM with system assigned managed identity
> * Create an Azure Key Vault
> * Create a self-signed SSL certificate
> * Store the self-signed SSL certificate in the Azure Key Vault
> * Run a Spring Boot application where the SSL certificate for inbound connections comes from Azure Key Vault
> * Run a Spring Boot application where the SSL certificate for outbound connections comes from Azure Key Vault

## Prerequisites

[!INCLUDE [curl](includes/prerequisites-curl.md)]
[!INCLUDE [jq](includes/prerequisites-jq.md)]
[!INCLUDE [Azure CLI](includes/prerequisites-azure-cli.md)]
- [!INCLUDE [free subscription](includes/quickstarts-free-trial-note.md)]

Spring Boot apps typically enable SSL by installing the certificates. The certificates are installed into the local key store of the JVM that is running the Spring Boot app. Instead of installing certificates locally, Spring integration for Microsoft Azure provides a secure and frictionless way to enable SSL with help from Azure Key Vault and Managed security for Azure resources.

<!-- https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/spring/azure-spring-doc-resource/spring-to-azure-keyvault-certificates.ai -->
:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-key-vault-certificates/spring-to-azure-keyvault-certificates.svg" alt-text="Diagram showing interaction of elements in this tutorial." border="false":::

## Create a GNU/Linux VM with system assigned managed identity

In this section, you use the Azure CLI to create an Azure VM with a system assigned managed identity and prepare it to run the Spring Boot application. For an overview of Managed identities for Azure resources see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)

1. Open a bash shell.

1. Sign out and delete some authentication files to remove any lingering credentials:

   ```azurecli
   az logout
   rm ~/.azure/accessTokens.json
   rm ~/.azure/azureProfile.json
   ```

1. Sign in to your Azure CLI.

    ```azurecli
    az login
    ```

1. Set the subscription ID.

    ```azurecli
    az account set -s <your-subscription-id>
    ```

1. Create an Azure resource group. Take note of the resource group name for later use.

    ```azurecli
    az group create -n <your-resource-group-name> \
    -l <your-resource-group-region>
    ```

1. Obtain the URN for the VM you want to create. This example uses the certified Azul Zulu for Azure – Enterprise Edition VM image. For complete information about Azul Zulu for Azure, see [Download Java for Azure](https://www.azul.com/downloads/azure-only/zulu/).

   ```azurecli
   az vm image list -f Zulu -l <your-region> --all | grep urn
   "urn": "azul:azul-zulu11-ubuntu-2004:zulu-jdk11-ubtu2004:20.11.0",
   ...
   "urn": "azul:azul-zulu8-ubuntu-2004:zulu-jdk8-ubtu2004:20.11.0",
   "urn": "azul:azul-zulu8-windows-2019:azul-zulu8-windows2019:20.11.0",
   ```

   This command may take a while to complete. Select the value for JDK 11 on ubuntu.

1. Accept the terms for the image. This is necessary to allow the VM to be created.

   ```azurecli
   az vm image terms accept --urn azul:azul-zulu11-ubuntu-2004:zulu-jdk11-ubtu2004:20.11.0
   ```

1. Create the VM instance with system assigned managed identity enabled, assigning the **Owner** role in the resource group scope.

   ```azurecli
   az vm create --debug --resource-group <your-resource-group-name> \
   --name <your-vm-name> --image azul:azul-zulu11-ubuntu-2004:zulu-jdk11-ubtu2004:20.11.0 \
   --generate-ssh-keys --assign-identity \
   --scope "/subscriptions/<your-subscription-id>/resourcegroups/<your-resource-group-name>" \
   --admin-username azureuser --role owner
   ```

   In the JSON output, note down the value of the `publicIpAddress` and `systemAssignedIdentity` properties, you'll use them later in the tutorial.

## Create and configure an Azure Key Vault

Follow the steps in this section to create an Azure Key Vault and grant the system assigned managed identity of the VM permission to access it for certificates.

1. Create an Azure Key Vault within the resource group.

   ```azurecli
   az keyvault create --name <your-key-vault-name> --resource-group <your-resource-group-name> \
   --location <your-resource-group-region>
   export KEY_VAULT_URI=$(az keyvault show --name ${KEY_VAULT} | jq -r '.properties.vaultUri')
   ```

   Take note of the **KEY_VAULT_URI**. You'll use it later.

1. Grant the VM permission to use the Key Vault for certificates.

   ```azurecli
   az keyvault set-policy --name <your-key-vault-name> \
   --secret-permissions get list --certificate-permissions get list import \
   --object-id <your-systemAssignedIdentity>
   ```

## Create and store a self-signed SSL certificate

The steps in this tutorial apply to any SSL certificate (including self-signed) stored directly in Azure Key Vault. **Self-signed certificates aren't not suitable for use in production, but are useful for dev and test applications.** This tutorial uses a self-signed certificate, which you will create in the following command.

```azurecli
az keyvault certificate create --vault-name <your-key-vault-name> \
   --name mycert \
   --policy "$(az keyvault certificate get-default-policy)"
```

## Run a Spring Boot application where the SSL certificate for inbound connections comes from Azure Key Vault

Follow the steps in this section to create a Spring Boot starter application.

1. Browse to <https://start.spring.io/>.
1. Select the choices as shown in the picture following this list.
   1. **Project**: `Maven Project`
   1. **Language**: `Java`
   1. **Spring Boot**: `2.3.7`
   1. **Group**: `com.contoso`  (You can put any valid Java package name here.)
   1. **Artifact**: *ssltest* (You can put any valid Java class name here.)
   1. **Packaging**: `Jar`
   1. **Java**: `11`
1. Select **Add Dependencies...**.
1. In the text field, type `Spring Web` and press Ctrl+Enter.
1. In the text field type `Azure Support` and press Enter.  Your screen should look like the following.
   :::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-key-vault-certificates/spring-initializr-choices.png" alt-text="Spring Initializr with correct choices selected.":::
1. At the bottom of the page, select **Generate**.
1. When prompted, download the project to a path on your local computer.  For discussion, we'll use a directory *ssltest* in the current user's home directory.  The values above will give you a *ssltest.zip* file in that directory.

### Enable the Spring Boot app to load the SSL certificate

1. Unzip the *ssltest.zip* file.

1. Remove the **test** directory and its subdirectories. We ignore the test in this tutorial, so the directory can be safely deleted.

1. The file layout will look like the following.

   ```bash
    ├── HELP.md
    ├── mvnw
    ├── mvnw.cmd
    ├── pom.xml
    └── src
        └── main
            ├── java
            │   └── com
            │       └── contoso
            │           └── ssltest
            │               └── SsltestApplication.java
            └── resources
                ├── application.properties
                ├── static
                └── templates
   ```

1. Modify the POM to add a dependency on `azure-spring-boot-starter-keyvault-certificates`

   Add the dependency on `azure-spring-boot-starter-keyvault-certificates` by adding the following code to the `<dependencies>` section of the POM.

   ```xml
   <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>azure-spring-boot-starter-keyvault-certificates</artifactId>
      <version>3.0.0-beta.2</version>
   </dependency>
   ```

1. Edit the **src/main/resources/application.properties** file and make it have the following contents.

   ```properties
   server.port=8443
   server.ssl.key-alias=mycert
   server.ssl.key-store-type=AzureKeyVault
   server.ssl.trust-store-type=AzureKeyVault
   azure.keyvault.uri=https://<your-key-vault-name>.vault.azure.net/
   ```

   These values enable the Spring Boot app to perform the **load** action for the SSL certificate. The following table describes the property values.

   | Property Name | Explanation |
   |---------------|-------------|
   |server.port|The local TCP port on which to listen for https connections.|
   |server.ssl.key-alias|The value of the `--name` argument you passed to `az keyvault certificate create`.|
   |server.ssl.key-store-type|Must be `AzureKeyVault`|
   |server.ssl.trust-store-type|Must be `AzureKeyVault`|
   |azure.keyvault.uri|The `vaultUri` property in the return JSON from `az keyvault create`. You saved this aside in an environment variable.|

   Note that the only Key Vault specific property is the `azure.keyvault.uri`. The permission to access the Key Vault is granted because the app is running on a VM whose system assigned managed identity has been granted access to the Key Vault.

These changes enable the Spring Boot app to **load** the SSL certificate. The next section takes this further by enabling the app to **accept** the SSL certificate.

### Create a Simple Spring Boot REST Controller

1. Edit the **src/main/java/com/contoso/ssltest/SsltestApplication.java** file and make it have the following contents.

   ```java
   package com.contoso.ssltest;

   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RestController;

   @SpringBootApplication
   @RestController
   public class SsltestApplication {

     public static void main(String[] args) {
       SpringApplication.run(SsltestApplication.class, args);
     }

     @GetMapping(value = "/ssl-test")
     public String inbound(){
       return "Inbound SSL is Working!!";
     }

     @GetMapping(value = "/exit")
     public void exit() {
       System.exit(0);
     }

   }
   ```

   This code illustrates the **present** action mentioned at the beginning of this tutorial. Here's some things to notice about the above code.

   * We've added the `@RestController` annotation to the `SsltestApplication` generated by Spring Initializr.
   * We've added a method annotated with `@GetMapping`, with a `value` for the http call we intend to do.
   * The `inbound` method simply returns a greeting when a browser makes an https request to the `/ssl-test` path. The **inbound** method illustrates how the server **presents** the SSL certificate to the browser.
   * The `exit` method will cause the JVM to exit when invoked. This is a convenience to make the sample easy to run in the context of this tutorial.

1. Open a new bash shell, and change to the **ssltest** directory. Run the following command.

   ```bash
   mvn clean package
   ```

   Maven compiles the code, and packages it up into an executable JAR file

1. Put the executable jar file on the VM.

   Verify the network security group created within `<your-resource-group-name>` allows inbound traffic on ports 22 and 8443 from your IP address. To learn about configuring network security group rules to allow inbound traffic please see **Work with security rules** in [Manage network security groups](/azure/virtual-network/manage-network-security-group).  Once you are sure you have allowed inbound traffic from your IP address to your VM on ports 22 and 8434, the following commands will put the jar file on the VM.

   ```bash
   cd target
   sftp azureuser@<your-vm-publicIpAddress>
   put *.jar
   ```

### Run the app on the server

Now that you have built the Spring Boot app and uploaded it to the VM, run it on the VM and call the REST endpoint with curl.

1. Use SSH to connect to the VM, then run the executable jar.

   ```bash
   set -o noglob
   ssh azureuser@<your-vm-publicIpAddress> "java -jar *.jar"
   ```

1. Verify that the server **presents** the SSL certificate by executing the following `curl` command.  Open a new bash shell and execute this command.

   ```bash
   curl https://<your-vm-publicIpAddress>:8443/ssl-test
   ```

   **You should see message about the failed legitimacy of the server. Because the certificate is self-signed., the message is expected.** Add the `--insecure` option to the `curl` command and you should see the message `Inbound SSL is Working!!`.

1. Invoke the `exit` path to kill the server and close the network sockets.

   ```bash
   curl https://<your-vm-publicIpAddress>:8443/exit
   ```

Now that we've illustrated the **load** and **present** actions with a self-signed SSL certificate let's make some trivial changes to the app to illustrate the **accept** action.

## Run a Spring Boot application where the SSL certificate for outbound connections comes from Azure Key Vault

This section will modify the code in the previous section so that the **load**, **present** and **accept** actions are satisfied from the Azure Key Vault.

### Modify the `SsltestApplication` to illustrate outbound SSL connections

We'll add a new rest endpoint, `ssl-test-outbound` that opens up an SSL socket to itself, and verifies that the SSL connection accepts the SSL certificate. To make it easier to paste the app straight into your editor, here is the complete *SsltestApplication.java* source file.

```java
   package com.contoso.ssltest;


   import java.security.GeneralSecurityException;
   import java.security.KeyStore;
   import javax.net.ssl.HostnameVerifier;
   import javax.net.ssl.SSLContext;
   import javax.net.ssl.SSLSession;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.http.HttpStatus;
   import org.springframework.http.ResponseEntity;
   import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RestController;
   import org.springframework.web.client.RestTemplate;

   import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
   import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
   import org.apache.http.impl.client.CloseableHttpClient;
   import org.apache.http.impl.client.HttpClients;
   import org.apache.http.ssl.SSLContexts;

   @SpringBootApplication
   @RestController
   public class SsltestApplication {

     public static void main(String[] args) {
       SpringApplication.run(SsltestApplication.class, args);
     }

     @GetMapping(value = "/ssl-test")
     public String inbound(){
       return "Inbound SSL is Working!!";
     }

     @GetMapping(value = "/ssl-test-outbound")
     public String outbound() throws GeneralSecurityException {
       KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
       SSLContext sslContext = SSLContexts.custom()
         .loadTrustMaterial(ks, new TrustSelfSignedStrategy())
         .build();

       HostnameVerifier allowAll = (String hostName, SSLSession session) -> true;
       SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext, allowAll);

       CloseableHttpClient httpClient = HttpClients.custom()
         .setSSLSocketFactory(csf)
         .build();

       HttpComponentsClientHttpRequestFactory requestFactory =
         new HttpComponentsClientHttpRequestFactory();

       requestFactory.setHttpClient(httpClient);
       RestTemplate restTemplate = new RestTemplate(requestFactory);
       String sslTest = "https://localhost:8443/ssl-test";

       ResponseEntity<String> response
         = restTemplate.getForEntity(sslTest, String.class);

       return "Outbound SSL " +
         (response.getStatusCode() == HttpStatus.OK ? "is" : "is not")  + " Working!!";
     }

     @GetMapping(value = "/exit")
     public void exit() {
       System.exit(0);
     }

   }
```

Next, re-build the app and re-upload it to the VM, and re-run it.

1. Add the dependency on Apache HTTP Client by adding the following code to the `<dependencies>` section of the POM.

   ```xml
   <dependency>
      <groupId>org.apache.httpcomponents</groupId>
      <artifactId>httpclient</artifactId>
      <version>4.5.13</version>
      </dependency>
   ```

1. Build the app.

   ```bash
   cd ssltest
   mvn clean package
   ```

1. Re-upload the app using the same sftp command from above.

   ```bash
   cd target
   sftp <your-vm-publicIpAddress>
   put *.jar
   ```

1. On the VM, run the app.

   ```bash
   set -o noglob
   ssh azureuser@<your-vm-publicIpAddress> "java -jar *.jar"
   ```

1. Once the server is running, in the same bash shell where you issued the previous curl command, verify that the server **accepts** the SSL certificate by executing the following curl command.

   ```bash
   curl --insecure https://<your-vm-publicIpAddress>:8443/ssl-test-outbound
   ```

   You should see the message `Outbound SSL is Working!!`.

1. Invoke the `exit` path to kill the server and close the network sockets.

   ```bash
   curl https://<your-vm-publicIpAddress>:8443/exit
   ```

You've observed a simple illustration of the **load**, **present** and **accept** actions with a self-signed SSL certificate stored in Azure Key Vault.

## Clean up resources

If you're not going to continue to use this application, delete
the Key Vault with the following steps:

1. Open a command prompt.

1. Enter the following commands.

   ```azurecli
   az group delete --yes --no-wait --name <your-resource-group-name>
   ```

On completion, the Key Vault and the VM will be cleaned up.

## Next steps

Explore other things you can do with Spring and Azure.

> [!div class="nextstepaction"]
> [More Spring Boot Starters](spring-boot-starters-for-azure.md)
