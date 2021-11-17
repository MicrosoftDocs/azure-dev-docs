---
title: Use Azure Key Vault to deliver SSL certificates to the JVM
description: SSL, JVM, Azure Key Vault
ms.author: manriem
ms.topic: article
ms.date: 11/17/2021
---

# Use Azure Key Vault to deliver SSL certificates to the JVM

This article describes how to integrate Azure Key Vault into the JVM to deliver SSL certificates.

## Download the Azure Key Vault JCA provider from Maven central

1. Go to https://repo1.maven.org/maven2/com/azure/azure-security-keyvault-jca/
2. Click on the version you want to download (e.g 2.2.0)
3. Click on the JAR file to use (e.g azure-security-keyvault-jca-2.2.0.jar).

## Create the bootstrap.jar

The JCA provider JAR that we publish on Maven Central does not automatically register itself. Note this is by design so you can also programmatically enable the provider.

In order for the JCA provider to be able to automatically register itself you will need to create a separate JAR file that contains the required metadata.

1. On your filesystem create a `bootstrap` directory. 
2. Inside of the `bootstrap` directory, create the `META-INF/services` directory. 
1. Inside of the `services` directory, create a file named `java.security.provider`.
1. Add a single line with the following content to the `java.security.provider` file.

```
com.azure.security.keyvault.jca.KeyVaultJcaProvider
```

5. From the `bootstrap` directory use `java -jar ../bootstrap.jar *` to create the `bootstrap.jar` file.

## Add the JCA Provider to the java.security file

To register the JCA provider the JVM needs to know about it.

Perform the following steps:

1. Make a copy of the `java.security` file inside of your JVM installation, name it `my.java.security`.
1. Inside the file look for the line `security.provider.1`
1. Move all the entries up one
1. If you are on Java 8 add the following line:

```
security.provider.1=com.azure.security.keyvault.jca.KeyVaultJcaProvider
```

5. If you are on Java 11 add the following line:

```
security.provider.1=AzureKeyVault
```

__Note make sure that each security.provider.X entry does not have the same value for X and keep them incrementally ordered starting with 1__

## How to run your application

1. Add the `bootstrap.jar` to the classpath.
1. Add the `azure-security-keyvault-jca-X.Y.Z.jar` to the classpath.
1. Add `-Djava.security.file=my.java.security` to the command line.

To tell your application which Azure Key Vault to use you will need to pass the following arguments to the command line:

* `-Dazure.keyvault.uri=your-keyvault-uri`
* `-Dazure.keyvault.tenant-id=your-tenant-id`
* `-Dazure.keyvault.client-id=your-client-id`
* `-Dazure.keyvault.client-secret=your-client-secret`
* `-Dazure.keyvault.managed-identity=your-managed-identity`

Note that if you use `client-id` and `client-secret` you should not pass a `managed-identity` and vice versa.

## Client/server side SSL examples

If you need some examples for client/server side SSL, see [here](java/api/overview/azure/security-keyvault-jca-readme#examples) for more information.
