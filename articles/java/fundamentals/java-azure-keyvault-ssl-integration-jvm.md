---
title: Use Azure Key Vault to deliver TLS/SSL certificates to the JVM
description: Use Azure Key Vault to deliver TLS/SSL certificates to the JVM
ms.author: manriem
ms.topic: article
ms.date: 12/09/2021
---

# Use Azure Key Vault to deliver TLS/SSL certificates to the JVM

This article describes how to integrate Azure Key Vault into the JVM to deliver TLS/SSL certificates.

## Create the bootstrap.jar

The JCA provider JAR published on Maven Central doesn't automatically register itself. This behavior is by design so that you can programmatically enable the provider.

To enable the JCA provider to automatically register itself, you'll need to create a separate JAR file that contains the required metadata. To create this file, use the following steps:

1. On your filesystem, create a *bootstrap* directory.
1. Inside the *bootstrap* directory, create the *META-INF/services* directory.
1. Inside the *services* directory, create a file named *java.security.provider*.
1. Add a single line with the following line to the *java.security.provider* file.

   ```text
   com.azure.security.keyvault.jca.KeyVaultJcaProvider
   ```

1. From the *bootstrap* directory, run the command `java cf ../bootstrap.jar *` to create the *bootstrap.jar* file.

## Add the JCA provider to the java.security file

To register the JCA provider, the JVM needs to know about it. To accomplish this task, use the following steps:

1. Make a copy of the *java.security* file inside your JVM installation, and name the file *my.java.security*.
1. Inside the file, look for the line `security.provider.1`.
1. Increment the numbers for all the entries by 1. For example, `security.provider.1` should become `security.provider.2`.
1. If you're on Java 8, add the following line:

   ```text
   security.provider.1=com.azure.security.keyvault.jca.KeyVaultJcaProvider
   ```

1. If you're on Java 11, add the following line:

   ```text
   security.provider.1=AzureKeyVault
   ```

> [!NOTE]
> Be sure that each `security.provider.<X>` entry has a different number value for `<X>`, and keep them incrementally ordered starting with 1.

## How to run your application

To run your application, use the following steps:

1. Add the *bootstrap.jar* file to the classpath.
1. Add the *azure-security-keyvault-jca-X.Y.Z.jar* to the classpath.
1. Add `-Djava.security.file=my.java.security` to the command line.

To tell your application which Azure Key Vault to use, you'll need to pass the following arguments to the command line, replacing the *`<...>`* placeholders with your own values.

* `-Dazure.keyvault.uri=<your-keyvault-uri>`
* `-Dazure.keyvault.tenant-id=<your-tenant-id>`
* `-Dazure.keyvault.client-id=<your-client-id>`
* `-Dazure.keyvault.client-secret=<your-client-secret>`
* `-Dazure.keyvault.managed-identity=<your-managed-identity>`

> [!NOTE]
> If you use `client-id` and `client-secret`, you shouldn't use `managed-identity`, and if you use `managed-identity`, you shouldn't use `client-id` and `client-secret`.

## Create a client ID and client secret

To create an Azure client ID and an Azure client secret, use the following command, replacing the *`<...>`* placeholders with your own values. Be sure to store the values returned, such as `appId`, `password`, `tenant`.

```azurecli
CLIENT_NAME=<your-client-name>
az ad sp create-for-rbac --skip-assignment --name ${CLIENT_NAME}
CLIENT_ID=$(az ad sp list --display-name ${CLIENT_NAME} | jq -r '.[0].appId')
az ad app credential reset --id ${CLIENT_ID}
```

Store the values returned so you can use them later.

Be sure the client specified by `CLIENT_ID` can access the target Key Vault. To grant access, use the following command, replacing the *`<your-key-vault-name>`* placeholder:

```azurecli
az keyvault set-policy \
    --name <your-key-vault-name> \
    --spn ${CLIENT_ID} \
    --secret-permissions get list \
    --certificate-permissions get list \
    --key-permissions get list
```

## Client/server side TLS/SSL examples

For examples of client/server-side TLS/SSL, see the [Examples](/java/api/overview/azure/security-keyvault-jca-readme#examples) section of [Azure Key Vault JCA client library for Java](/java/api/overview/azure/security-keyvault-jca-readme).

## Next steps

> [!div class="nextstepaction"]
> [Java on Azure developer tools documentation](index.yml)
