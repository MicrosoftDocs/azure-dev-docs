---
title: Use Azure Key Vault to Deliver TLS/SSL Certificates to Apache Tomcat
description: Use Azure Key Vault to deliver TLS/SSL certificates to Apache Tomcat
author: KarlErickson
ms.author: karler
ms.reviewer: manriem
ms.topic: how-to
ms.date: 12/09/2021
ms.custom: devx-track-java, devx-track-extended-java
---

# Use Azure Key Vault to deliver TLS/SSL certificates to Apache Tomcat

This article describes how to integrate Azure Key Vault into Apache Tomcat to deliver TLS/SSL certificates.

## Be sure the JVM can access the TLS/SSL certificates

Be sure you followed all the steps outlined in [Use Azure Key Vault to deliver TLS/SSL certificates to the JVM](java-azure-keyvault-ssl-integration-jvm.md).

## Add the TLS/SSL configuration to server.xml

Add the following configuration to the **server.xml** file in Tomcat. Be sure to replace the `<your-certificate>` placeholder with the name of the certificate in Azure Key Vault that you want to use for server-side TLS/SSL.

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

## Set the required startup properties

Use the `JAVA_OPTS` and `CLASSPATH` environment variables to set up your environment before starting Tomcat. One way to specify the environment variables is by creating a **setenv.sh** or **setenv.bat** script in the Tomcat **bin** directory.

> [!NOTE]
> You can also use other approaches to set the environment variables. We've tested by running Tomcat's **catalina.sh** script or **catalina.bat** script, and by running the Tomcat for Windows Service.

### [Linux](#tab/linux)

```bash
export JAVA_OPTS="-Djava.security.properties==/xxx/my.java.security"
export CLASSPATH="/xxx/azure-security-keyvault-jca.jar"
```

### [Windows](#tab/windows)

```cmd
set "JAVA_OPTS=%JAVA_OPTS% -Djava.security.properties==C:\xxx\my.java.security"
set CLASSPATH=C:\xxx\azure-security-keyvault-jca.jar
```

---

The following example of `JAVA_OPTS` covers local testing using a service principal:

```bash
export JAVA_OPTS='-Djava.security.properties==/xxx/my.java.security -Dazure.keyvault.uri=xxx -Dazure.keyvault.client-id=xxx -Dazure.keyvault.client-secret=xxx -Dazure.keyvault.tenant-id=xxx'
```

This example covers cloud deployments using a user-assigned managed identity:

```bash
export JAVA_OPTS='-Djava.security.properties==/xxx/my.java.security -Dazure.keyvault.uri=xxx -Dazure.keyvault.managed-identity=<your-managed-identity>'
```

This example covers cloud deployments using a system-assigned managed identity:

```bash
export JAVA_OPTS='-Djava.security.properties==/xxx/my.java.security -Dazure.keyvault.uri=xxx'
```

For the meaning of each of these properties, see [Use Azure Key Vault to deliver TLS/SSL certificates to the JVM](./java-azure-keyvault-ssl-integration-jvm.md#how-to-run-your-application).

## Next steps

> [!div class="nextstepaction"]
> [Java on Azure developer tools documentation](index.yml)
