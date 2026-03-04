---
ms.service: azure
ms.topic: include
ms.date: 03/03/2026
author: bmitchell287
ms.author: brendm
---

## Authenticate to Azure services from your app

The [Azure Identity library](/java/api/com.azure.identity) provides various *credentials* - implementations of `TokenCredential` that support different scenarios and Microsoft Entra authentication flows. The following steps show you how to use [ClientSecretCredential](/java/api/com.azure.identity.clientsecretcredential) when you work with service principals locally and in production.

### Implement the code

Add the `azure-identity` dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

You access Azure services by using specialized client classes from the various Azure SDK client libraries. For any Java code that creates an Azure SDK client object in your app, follow these steps:

1. Import the `ClientSecretCredentialBuilder` class from the `com.azure.identity` package.
1. Create a `ClientSecretCredential` object by using `ClientSecretCredentialBuilder` with the `tenantId`, `clientId`, and `clientSecret`.
1. Pass the `ClientSecretCredential` instance to the Azure SDK client object builder's `credential` method.

An example of this approach is shown in the following code segment:

```java
import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;

String tenantId = System.getenv("AZURE_TENANT_ID");
String clientId = System.getenv("AZURE_CLIENT_ID");
String clientSecret = System.getenv("AZURE_CLIENT_SECRET");

ClientSecretCredential credential = new ClientSecretCredentialBuilder()
    .tenantId(tenantId)
    .clientId(clientId)
    .clientSecret(clientSecret)
    .build();

BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
    .endpoint("https://<account-name>.blob.core.windows.net")
    .credential(credential)
    .buildClient();
```
