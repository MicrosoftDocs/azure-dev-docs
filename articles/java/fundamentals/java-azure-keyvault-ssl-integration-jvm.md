---
title: Use Azure Key Vault to Deliver TLS/SSL Certificates to the JVM
description: Use Azure Key Vault to deliver TLS/SSL certificates to the JVM
author: KarlErickson
ms.author: karler
ms.reviewer: manriem
ms.topic: how-to
ms.date: 12/09/2021
ms.custom: devx-track-java, devx-track-extended-java
---

# Use Azure Key Vault to deliver TLS/SSL certificates to the JVM

This article describes how to integrate Azure Key Vault into the JVM to deliver TLS/SSL certificates.

## Add the JCA provider to the java.security file

To register the JCA provider, the JVM needs to know about it. To accomplish this task, use the following steps:

1. Make a copy of the **java.security** file inside your JVM installation, and name the file **my.java.security**.
1. Inside the file, look for the line `security.provider.<maximum-value>`. Replace the `<maximum-value>` placeholder with the maximum value at this position among all entries. For example: `security.provider.13=SunPKCS11`.
1. Increment the number of this entry by 1. For example, `security.provider.13` should become `security.provider.14`.
1. Add the following line:

   ```text
   security.provider.14=com.azure.security.keyvault.jca.KeyVaultJcaProvider
   ```

> [!NOTE]
> Be sure that each `security.provider.<X>` entry has a different number value for `<X>`, and keep them incrementally ordered starting with 1.

## How to run your application

To run your application, use the following steps and replace the `<...>` placeholders with your own values:

1. Add the **azure-security-keyvault-jca-X.Y.Z.jar** file to the classpath. For example, if you want to integrate with Tomcat 9, then you should add the full path of the file **azure-security-keyvault-jca-X.Y.Z.jar** to the Java classpath by using **tomcat9w.exe**.
1. Add `-Djava.security.properties==my.java.security` to the command line.
1. Add `-Dazure.keyvault.uri=<your-keyvault-uri>` to the command line to indicate which Azure Key Vault to use. For example: `-Dazure.keyvault.uri=https://some.vault.azure.net/`.
1. Add the arguments indicated in the following list, depending on your scenario:

   * If you authenticate using a service principal, add the following arguments:

     * `-Dazure.keyvault.tenant-id=<your-tenant-id>`
     * `-Dazure.keyvault.client-id=<your-client-id>`
     * `-Dazure.keyvault.client-secret=<your-client-secret>`

   * If you authenticate using a system-assigned managed identity, no more arguments are required.

   * If you authenticate using a user-assigned managed identity, add the following argument:

     * `-Dazure.keyvault.managed-identity=<object-id-of-your-user-managed-identity>`

For more information about these authentication scenarios, see [Application and service principal objects in Microsoft Entra ID](/azure/active-directory/develop/app-objects-and-service-principals) and [How managed identities for Azure resources work with Azure virtual machines](/azure/active-directory/managed-identities-azure-resources/how-managed-identities-work-vm).

### Use a service principal

To create an Azure client ID and an Azure client secret, use the following command, replacing the `<...>` placeholders with your own values. Be sure to store the values returned, such as `appId`, `password`, and `tenant`.

```azurecli
export CLIENT_NAME=<your-client-name>
az ad sp create-for-rbac --skip-assignment --name ${CLIENT_NAME}
export CLIENT_ID=$(az ad sp list --display-name ${CLIENT_NAME} | jq -r '.[0].appId')
az ad app credential reset --id ${CLIENT_ID}
```

Store the values returned so you can use them later.

Be sure the client specified by `CLIENT_ID` can access the target Key Vault. To grant access, use the following command, replacing the `<your-key-vault-name>` placeholder:

```azurecli
az keyvault set-policy \
    --name <your-key-vault-name> \
    --spn ${CLIENT_ID} \
    --secret-permissions get list \
    --certificate-permissions get list \
    --key-permissions get list
```

### Use a managed identity

To enable a system-assigned managed identity or create a user-assigned managed identity, follow the instructions at [Configure managed identities for Azure resources on an Azure VM using Azure CLI](/azure/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm)

After getting the object ID of the managed identity, use the following command to create the access policy of your Key Vault for your managed identity:

```azurecli
az keyvault set-policy \
    --name <your-key-vault-name> \
    --object-id <object-id-of-your-managed-identity> \
    --secret-permissions get list \
    --certificate-permissions get list \
    --key-permissions get list
```

> [!NOTE]
> The object ID of the managed identity is also called the principal ID when using a user-assigned managed identity.

## Client/server side TLS/SSL examples

For examples of client/server-side TLS/SSL, see the [Examples](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/keyvault/azure-security-keyvault-jca/README.md#examples) section of the [Azure Key Vault JCA client library for Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/keyvault/azure-security-keyvault-jca/README.md).

## Next steps

> [!div class="nextstepaction"]
> [Java on Azure developer tools documentation](index.yml)
