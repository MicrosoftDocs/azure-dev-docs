---
title: Authenticate with the Azure management modules for Node.js
description: Authenticate with a service principal into the Azure management modules for Node.js
ms.topic: how-to
ms.date: 10/19/2020
ms.custom: devx-track-js
---

# Authenticate with the Azure management modules for JavaScript

All [SDK client libraries](azure-sdk-library-package-index.md) require authentication via a `credentials` object when being
instantiated. There are multiple ways of authenticating and creating the required
credentials.

Authentication, like all software and services, has been improved over the years. It is important to know which authentication library your service or services 
uses. 

The authentication libraries include the following:

* @azure/identity - newest authentication package
* @azure/ms-rest-nodeauth
* @azure/ms-rest-browserauth

Older authentication packages are in use. If you are using those packages, you should consider migrating off the older authentication methods for a more security and robust experience. 

## Best practices with Azure SDK client library authentication

Each npm package will show authentication for that exact client library. Do not mix and match authentication packages and code unless all packages use the same authentication package on the npm package page. 

## Azure Identity SDK client library

The Azure Identity library is the newest authentication package for Azure. Review the [list of supported libraries](https://www.npmjs.com/package/@azure/identity#client-libraries-supporting-authentication-with-azure-identity) using Azure Identity.

The [@azure/identity](https://www.npmjs.com/package/@azure/identity) library simplifies authentication against Azure Active Directory for Azure SDK libraries. It provides a set of TokenCredential implementations which can be passed into SDK libraries to authenticate API requests. It supports token authentication using an Azure Active Directory service principal or managed identity.

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");
 
// Enter your storage account name
const account = "<account>";
const defaultAzureCredential = new DefaultAzureCredential();
 
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  defaultAzureCredential
);
```

## Azure ms-rest-* SDK client libraries
With the `@azure` scoped [client libraries](azure-sdk-library-package-index.md#modern-javascripttypescript-libraries), you need a token to use a service. You get the token by using an Azure SDK client authentication method, which returns a credential. 

```javascript
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
msRestNodeAuth.interactiveLogin().then((credential) => {
}).catch((err) => {
    // service code goes here
    console.error(err);
});
```

You pass that credential to a specific Azure service client library, such as the Storage service used in this next code sample. The client library takes the credential, and generates a token for you. The service uses the token to validate your requests. 

```javascript
// service code - this is an example only and not best practices for code flow
const { BlobServiceClient } = require('@azure/storage-blob');
const billingManagementClient = new billing.BillingManagementClient(credential, subscriptionId);
billingManagementClient.enrollmentAccounts.list().then((enrollmentList) => {
    console.log("The result is:");
    console.log(result);
})
```

The client library manages the token, and knows when to refresh the token. You, as the developer with your code base, don't have to manage this.

## Older Azure SDK client authentication 

Older Azure SDK clients will eventually migrate to the new modern authentication used above. Until that migration, the older client libraries use different authentication clients or may authentication with an entirely separate mechanism entirely such as resource keys. 

For best results with older client libraries: 
* Each npm package will show authentication for that exact client library. 
* If your current code uses the `@azure/ms

## Authentication with Azure services while developing

Common methods to create the required credential while you are developing:

| Azure authentication type|Purpose|
|--|--|
|**Service principal**|This authentication is the _recommended method_. Learn how to [create an Azure service principal](node-sdk-azure-authenticate-principal.md). A service principal allows you to have a connection to Azure that is separate from your personal Azure account. It can be a temporary account or it can be a longer living account to act in place of your personal account.|
| **Interactive**| This is the easiest way to authenticate when you are trying Azure services. It requires logging in with your personal account with a browser. |
|**Basic**|This authentication requires you to enter your personal username and password. This is the least secure method and is not recommended.| 

## Authentication with Azure services and production code

Common methods to create the required credential in your production code:

|Azure authentication type|Purpose|
|--|--|
|**Managed Service Identity (MSI)**|[MSI authentication](/azure/active-directory/managed-identities-azure-resources/overview) is best for production scenarios. You aren't going to use it in your local development environment. [Services](/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities) that support MSI.|
|**Certificates**|[Certificates](/azure/cloud-services/cloud-services-certs-create) need to be uploaded to Azure either using the [Portal](/azure/cloud-services/cloud-services-configure-ssl-certificate-portal).|

## JavaScript authentication samples for Azure

|Authentication package|Sample authentication scripts|
|--|--|
|[@azure/ms-rest-nodeauth](https://www.npmjs.com/package/@azure/ms-rest-nodeauth) <br>(recommended)|[Service Principal with Certificate](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/authFileWithSpCert.ts)<br>[Service Principal from file](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/authFileWithSpSecret.ts)<br>[Interactive](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/interactivePersonalAccount.ts)<br>[Basic](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/usernamePassword.ts)|
|[@azure/ms-rest-browserauth](https://www.npmjs.com/package/@azure/ms-rest-browserauth)<br>(recommended)|[Authentication with popup (create-react-app)](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/authentication-with-popup)<br>[React without pop-up](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/react-app)<br>[HTML with Login button](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/vanilla)|
|[ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure)|[Service principal](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#service-principal-authentication)<br>[Interactive](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#interactive-login)<br>[Basic](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#basic-authentication)|

[!INCLUDE [chrome-note](includes/chrome-note.md)]

## Next steps	

* [Deploy a static website to Azure from Visual Studio Code](tutorial-vscode-static-website-node-01.md)