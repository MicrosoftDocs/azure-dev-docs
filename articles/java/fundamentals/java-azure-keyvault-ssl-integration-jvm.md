---
title: Use Azure Key Vault to deliver SSL certificates to the JVM
description: SSL, JVM, Azure Key Vault
ms.author: manriem
ms.topic: article
ms.date: 11/17/2021
---

# Use Azure Key Vault to deliver SSL certificates to the JVM

This article describes how to integrate Azure Key Vault into the JVM to deliver SSL certificates.

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

## Create a client ID and client secret

To create an Azure client ID and an Azure client secret use the command line below. 

Please store the values returned such as appId, password, tenant.

```shell
  export CLIENT_NAME=myclient
  az ad sp create-for-rbac --skip-assignment --name ${CLIENT_NAME}
  export CLIENT_ID=$(az ad sp list --display-name ${CLIENT_NAME} | jq -r '.[0].appId')
  az ad app credential reset --id ${CLIENT_ID}
```

Store the values returned, which will be used later.

Make sure the `client-id` can access target Key Vault. To grant access, use the command line below:

```shell
  az keyvault set-policy --name ${KEY_VAULT} \
        --spn ${CLIENT_ID} \
        --secret-permissions get list \
        --certificate-permissions get list \
        --key-permissions get list
```

Note `KEY_VAULT` refers to the name of the Key Vault you want to use:

## Client/server side SSL examples

If you need some examples for client/server side SSL, see [here](https://docs.microsoft.com/en-us/java/api/overview/azure/security-keyvault-jca-readme?view=azure-java-stable#examples) for more information.
