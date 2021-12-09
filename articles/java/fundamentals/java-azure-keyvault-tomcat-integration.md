---
title: Use Azure Key Vault to deliver TLS/SSL certificates to Apache Tomcat
description: Use Azure Key Vault to deliver TLS/SSL certificates to Apache Tomcat
ms.author: manriem
ms.topic: article
ms.date: 12/09/2021
---

# Use Azure Key Vault to deliver TLS/SSL certificates to Apache Tomcat

This article describes how to integrate Azure Key Vault into Apache Tomcat to deliver TLS/SSL certificates.

## Be sure the JVM is able to access the TLS/SSL certificates

Be sure you've followed all the steps outlined in [Use Azure Key Vault to deliver TLS/SSL certificates to the JVM](java-azure-keyvault-ssl-integration-jvm.md).

## Add the TLS/SSL configuration to server.xml

Add the following configuration to the *server.xml* file in Tomcat. Be sure to replace the *`<your-certificate>`* placeholder with the name of the certificate in Azure Key Vault that you want to use for server-side TLS/SSL.

```xml
<Connector port="8443"
               protocol="org.apache.coyote.http11.Http11NioProtocol"
               maxThreads="150"
               SSLEnabled="true">
    <SSLHostConfig>
        <Certificate
              certificateKeyAlias="<your-certificate>"
              certificateKeystoreFile=""
              certificateKeystorePassword=""
              certificateKeystoreType="DKS"
              certificateKeystoreProvider="AzureKeyVault" />
    </SSLHostConfig>
</Connector>
```

## Copy the JAR files into the server lib directory

Copy the *bootstrap.jar* and the *azure-security-keyvault-jca-X.Y.Z.jar* to the server *lib* directory of Tomcat.

## Set the required startup properties

Use the `JAVA_OPTS` environment variable to set up your environment before starting Tomcat, as shown in the following example:

```bash
JAVA_OPTS='-Djava.security.properties==my.java.security -Dazure.keyvault.uri=xxx -Dazure.keyvault.client-id=xxx -Dazure.keyvault.client-secret=xxx -Dazure.keyvault.tenant-id=xxx'
```

For the meaning of each of these properties, see [Use Azure Key Vault to deliver TLS/SSL certificates to the JVM](/azure/developer/java/fundamentals/java-azure-keyvault-ssl-integration-jvm#how-to-run-your-application).

## Next steps

> [!div class="nextstepaction"]
> [Java on Azure developer tools documentation](Java on Azure developer tools documentation)
