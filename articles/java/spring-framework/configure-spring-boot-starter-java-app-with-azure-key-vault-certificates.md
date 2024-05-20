---
title: "Enable HTTPS in Spring Boot with Azure Key Vault certificates"
description: In this tutorial, you secure your Spring Boot (including Azure Spring Apps) apps with TLS/SSL certificates using Azure Key Vault and managed identities for Azure resources.
ms.date: 07/22/2022
ms.topic: tutorial
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
author: KarlErickson
ms.author: hangwan
---

# Enable HTTPS in Spring Boot with Azure Key Vault certificates

This tutorial shows you how to secure your Spring Boot (including Azure Spring Apps) apps with TLS/SSL certificates using Azure Key Vault and managed identities for Azure resources.

Production-grade Spring Boot applications, whether in the cloud or on-premises, require end-to-end encryption for network traffic using standard TLS protocols. Most TLS/SSL certificates you come across are discoverable from a public root certificate authority (CA). Sometimes, however, this discovery isn't possible. When certificates aren't discoverable, the app must have some way to load such certificates, present them to inbound network connections, and accept them from outbound network connections.

Spring Boot apps typically enable TLS by installing the certificates. The certificates are installed into the local key store of the JVM that's running the Spring Boot app. With Spring on Azure, certificates aren't installed locally. Instead, Spring integration for Microsoft Azure provides a secure and frictionless way to enable TLS with help from Azure Key Vault and managed identity for Azure resources.

:::image type="content" source="media/configure-spring-boot-starter-java-app-with-azure-key-vault-certificates/spring-to-azure-key-vault-certificates.svg" alt-text="Diagram showing interaction of elements in this tutorial." border="false":::

> [!IMPORTANT]
> Currently, Spring Cloud Azure Certificate starter version 4.x or higher don't support TLS/mTLS, they only auto-configure the Key Vault certificate client. Therefore, if you want to use TLS/mTLS, you cannot migrate to version 4.x.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/).

- A supported [Java Development Kit (JDK)](/java/azure/jdk) with version 11.

- [Apache Maven](https://maven.apache.org/download.cgi) version 3.0 or higher.

- [Azure CLI](/cli/azure/install-azure-cli).

- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.

- An Azure virtual machine (VM) instance. If you don't have one, use the [az vm create](/cli/azure/vm?view=azure-cli-latest&preserve-view=true#az-vm-create) command and the Ubuntu image provided by UbuntuServer to create a VM instance with a system-assigned managed identity enabled. Grant the `Contributor` role to the system-assigned managed identity, and then set the access `scope` to your subscription.

- An Azure Key Vault instance. If you don't have one, see [Quickstart: Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal).

- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web** dependency, then select Java version 8 or higher.

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this article.

## Set a self-signed TLS/SSL certificate

The steps in this tutorial apply to any TLS/SSL certificate (including self-signed) stored directly in Azure Key Vault. Self-signed certificates aren't suitable for use in production, but are useful for dev and test applications.

This tutorial uses a self-signed certificate. To set the certificate, see [Quickstart: Set and retrieve a certificate from Azure Key Vault using the Azure portal](/azure/key-vault/certificates/quick-create-portal).

> [!NOTE]
> After setting the certificate, grant VM access to Key Vault by following the instructions in [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy?tabs=azure-portal).

## Secure connection through TLS/SSL certificate

You now have a VM and a Key Vault instance and have granted the VM access to Key Vault. The following sections show how to connect securely via TLS/SSL certificates from Azure Key Vault in the Spring Boot application. This tutorial demonstrates the following two scenarios:

- Run a Spring Boot application with secure inbound connections
- Run a Spring Boot application with secure outbound connections

> [!TIP]
> In the following steps, the code will be packaged into an executable file and uploaded to the VM. Don't forget to install [OpenJDK](https://openjdk.org/install/) in the VM.

### Run a Spring Boot application with secure inbound connections

When the TLS/SSL certificate for the inbound connection comes from Azure Key Vault, configure the application by following these steps:

1. Add the following dependencies to your *pom.xml* file:

   ```xml
   <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>azure-spring-boot-starter-keyvault-certificates</artifactId>
      <version>3.14.0</version>
   </dependency>
   ```

1. Configure Key Vault credentials in the *application.properties* configuration file.

   ```properties
   server.ssl.key-alias=<the name of the certificate in Azure Key Vault to use>
   server.ssl.key-store-type=AzureKeyVault
   server.ssl.trust-store-type=AzureKeyVault
   server.port=8443
   azure.keyvault.uri=<the URI of the Azure Key Vault to use>
   ```

   These values enable the Spring Boot app to perform the *load* action for the TLS/SSL certificate, as mentioned at the beginning of the tutorial. The following table describes the property values.

   | Property                      | Description                                                                                                            |
   |-------------------------------|------------------------------------------------------------------------------------------------------------------------|
   | `server.ssl.key-alias`        | The value of the `--name` argument you passed to `az keyvault certificate create`.                                     |
   | `server.ssl.key-store-type`   | Must be `AzureKeyVault`.                                                                                               |
   | `server.ssl.trust-store-type` | Must be `AzureKeyVault`.                                                                                               |
   | `server.port`                 | The local TCP port on which to listen for HTTPS connections.                                                           |
   | `azure.keyvault.uri`          | The `vaultUri` property in the return JSON from `az keyvault create`. You saved this value in an environment variable. |

   The only property specific to Key Vault is `azure.keyvault.uri`. The app is running on a VM whose system-assigned managed identity has been granted access to the Key Vault. Therefore, the app has also been granted access.

   These changes enable the Spring Boot app to load the TLS/SSL certificate. In the next step, you'll enable the app to perform the *accept* action for the TLS/SSL certificate, as mentioned at the beginning of the tutorial.

1. Edit the startup class file so that it has the following contents.

   ```java
   import org.springframework.boot.SpringApplication;
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
           return "Inbound TLS is working!!";
       }

       @GetMapping(value = "/exit")
       public void exit() {
           System.exit(0);
       }

   }
   ```

   Calling `System.exit(0)` from within an unauthenticated REST GET call is only for demonstration purposes. Don't use `System.exit(0)` in a real application.

   This code illustrates the *present* action mentioned at the beginning of this tutorial. The following list highlights some details about this code:

   - There's now a `@RestController` annotation on the `SsltestApplication` class generated by Spring Initializr.
   - There's a method annotated with `@GetMapping`, with a `value` for the HTTP call you make.
   - The `inbound` method simply returns a greeting when a browser makes an HTTPS request to the `/ssl-test` path. The `inbound` method illustrates how the server presents the TLS/SSL certificate to the browser.
   - The `exit` method causes the JVM to exit when invoked. This method is a convenience to make the sample easy to run in the context of this tutorial.

1. Run the following commands to compile the code and package it into an executable JAR file.

   ```bash
   mvn clean package
   ```

1. Verify that the network security group created within `<your-resource-group-name>` allows inbound traffic on ports 22 and 8443 from your IP address. To learn about configuring network security group rules to allow inbound traffic, see the [Work with security rules](/azure/virtual-network/manage-network-security-group#work-with-security-rules) section of [Create, change, or delete a network security group](/azure/virtual-network/manage-network-security-group).

1. Put the executable JAR file on the VM.

   ```bash
   cd target
   sftp azureuser@<your VM public IP address>
   put *.jar
   ```

   Now that you've built the Spring Boot app and uploaded it to the VM, use the following steps to run it on the VM and call the REST endpoint with `curl`.

1. Use SSH to connect to the VM, then run the executable JAR.

   ```bash
   set -o noglob
   ssh azureuser@<your VM public IP address> "java -jar *.jar"
   ```

1. Open a new Bash shell and execute the following command to verify that the server presents the TLS/SSL certificate.

   ```bash
   curl --insecure https://<your VM public IP address>:8443/ssl-test
   ```

1. Invoke the `exit` path to kill the server and close the network sockets.

   ```bash
   curl --insecure https://<your VM public IP address>:8443/exit
   ```

Now that you've seen the *load* and *present* actions with a self-signed TLS/SSL certificate, make some trivial changes to the app to see the *accept* action as well.

### Run a Spring Boot application with secure outbound connections

In this section, you modify the code in the previous section so that the TLS/SSL certificate for outbound connections comes from Azure Key Vault. Therefore, the *load*, *present*, and *accept* actions are satisfied from the Azure Key Vault.

1. Add the Apache HTTP client dependency to your *pom.xml* file:

   ```xml
   <dependency>
      <groupId>org.apache.httpcomponents</groupId>
      <artifactId>httpclient</artifactId>
      <version>4.5.13</version>
   </dependency>
   ```

1. Add a new rest endpoint called `ssl-test-outbound`. This endpoint opens up a TLS socket to itself and verifies that the TLS connection accepts the TLS/SSL certificate. Replace the previous part of the startup class with the following code.

   ```java
   import java.security.KeyStore;
   import javax.net.ssl.HostnameVerifier;
   import javax.net.ssl.SSLContext;
   import javax.net.ssl.SSLSession;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import com.azure.security.keyvault.jca.KeyVaultLoadStoreParameter;
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
           return "Inbound TLS is working!!";
       }

       @GetMapping(value = "/ssl-test-outbound")
       public String outbound() throws Exception {
           KeyStore azureKeyVaultKeyStore = KeyStore.getInstance("AzureKeyVault");
           KeyVaultLoadStoreParameter parameter = new KeyVaultLoadStoreParameter(
               System.getProperty("azure.keyvault.uri"));
           azureKeyVaultKeyStore.load(parameter);
           SSLContext sslContext = SSLContexts.custom()
                                              .loadTrustMaterial(azureKeyVaultKeyStore, null)
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

           return "Outbound TLS " +
               (response.getStatusCode() == HttpStatus.OK ? "is" : "is not")  + " Working!!";
       }

       @GetMapping(value = "/exit")
       public void exit() {
           System.exit(0);
       }

   }
   ```

1. Run the following commands to compile the code and package it into an executable JAR file.

   ```bash
   mvn clean package
   ```

1. Upload the app again using the same `sftp` command from earlier in this article.

   ```bash
   cd target
   sftp <your VM public IP address>
   put *.jar
   ```

1. Run the app on the VM.

   ```bash
   set -o noglob
   ssh azureuser@<your VM public IP address> "java -jar *.jar"
   ```

1. After the server is running, verify that the server accepts the TLS/SSL certificate. In the same Bash shell where you issued the previous `curl` command, run the following command.

   ```bash
   curl --insecure https://<your VM public IP address>:8443/ssl-test-outbound
   ```

   You should see the message `Outbound TLS is working!!`.

1. Invoke the `exit` path to kill the server and close the network sockets.

   ```bash
   curl --insecure https://<your VM public IP address>:8443/exit
   ```

You've now observed a simple illustration of the *load*, *present*, and *accept* actions with a self-signed TLS/SSL certificate stored in Azure Key Vault.

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure Key Vault certificates samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/keyvault/azure-spring-boot-starter-keyvault-certificates)
