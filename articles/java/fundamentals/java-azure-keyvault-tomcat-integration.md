---
title: Use Azure Key Vault to deliver SSL certificates to Apache Tomcat
description: SSL, JVM, Azure Key Vault
ms.author: manriem
ms.topic: article
ms.date: 11/17/2021
---

# Use Azure Key Vault to deliver SSL certificates to Apache Tomcat

This article describes how to integrate Azure Key Vault into Apache Tomcat to deliver SSL certificates.

## Make sure the JVM is able to access the SSL certificates

Make sure you have followed all the steps outlined in [Use Azure Key Vault to deliver SSL certificates to the JVM](https://docs.microsoft.com/azure/developer/java/fundamentals/java-azure-keyvault-ssl-integration-jvm)


## Add the SSL configuration to server.xml

Add the following configuration to the `server.xml` file in Tomcat. Adjust the value of certificateKeyAlias to match to the name of the certificate in Azure Key Vault you want to use for server-side SSL.

```
<Connector port="8443" 
               protocol="org.apache.coyote.http11.Http11NioProtocol"
               maxThreads="150"
               SSLEnabled="true">
    <SSLHostConfig>
        <Certificate 
              certificateKeyAlias="mycert"
              certificateKeystoreFile=""
              certificateKeystorePassword=""
              certificateKeystoreType="DKS"
              certificateKeystoreProvider="AzureKeyVault" />
    </SSLHostConfig>
</Connector>
```

## Copy the JAR files into the server lib directory

Copy the `bootstrap.jar` and the `azure-security-keyvault-jca-X.Y.Z.jar` to the server lib directory of Tomcat.

## Set the required startup properties

As Apache Tomcat supports a JAVA_OPTS environment variable please use it to setup your environment before starting Tomcat.

An example is given below

```
JAVA_OPTS='-Djava.security.properties==my.java.security -Dazure.keyvault.uri=xxx -Dazure.keyvault.client-id=xxx -Dazure.keyvault.client-secret=xxx -Dazure.keyvault.tenant-id=xxx'
 ```

 See [Use Azure Key Vault to deliver SSL certificates to the JVM](https://docs.microsoft.com/azure/developer/java/fundamentals/java-azure-keyvault-ssl-integration-jvm#how-to-run-your-application) for the meaning of each of these properties.
