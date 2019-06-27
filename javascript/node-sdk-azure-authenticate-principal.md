---
title: Create an Azure service principal with Node.js
description: Learn how to use service principal authentication via Node.js 
author: KarlErickson
manager: douge
ms.author: karler
ms.date: 06/17/2017
ms.topic: article
ms.prod: azure
ms.devlang: nodejs
ms.service: azure-nodejs
---

# Create an Azure service principal with Node.js 

When an app needs to access resources, you can set up an identity for the app and authenticate the app with its own credentials. This identity is known as a *service principal*. Essentially, you create keys for your Azure Active Directory account that you provide to the SDK to authenticate rather than requiring user intervention or username/password.

The service principal approach enables you to:
- Assign permissions to the app identity that are different than your own permissions. Typically, these permissions are restricted to exactly what the app needs to do.
- Use a certificate for authentication when running an unattended script.

This topic shows you three techniques for creating a service principal.

- Azure portal
- Azure CLI 2.0
- Azure SDK for Node.js

## Create a service principal using the Azure portal

Follow the steps outlined in the topic, 
[Use portal to create an Azure Active Directory application and service principal that can access resources](https://azure.microsoft.com/documentation/articles/resource-group-create-service-principal-portal/), to generate the service principal.

## Create a service principal using the Azure CLI 2.0

Creating a service principal using the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-az-cli2) can be 
accomplished with the following steps:

1. Download the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-az-cli2).

2. Open a terminal window.

3. Type the following command to start the login process:

	```shell
	$ az login
    ```

4. Calling `az login` results in a URL and a code. Browse to the specified URL, enter the code, and login with your Azure identity (this may happen automatically if you're already logged in). 
You'll then be able to access your account via the CLI.

5. Get your subscription and tenant id:

	```shell
	$ az account list
    ```

	The following shows an example of the output:

	```shell
	{
	"cloudName": "AzureCloud",
	"id": "<subscriptionId>",
	"isDefault": true,
	"name": "<subscriptionName>",
	"registeredProviders": [],
	"state": "Enabled",
	"tenantId": "<tenantId>",
		"user": {
			"name": "hello@example.com",
			"type": "user"
		}
	}
    ```

	**Note the subscription ID as it will be used in Step 7.**

6. Create a service principal to get a JSON object containing the other pieces of information you need to authenticate with Azure.

	```shell
	$ az ad sp create-for-rbac
    ```

	The following shows an example of the output:

	```shell
	{
	"appId": "<appId>",
	"displayName": "<displayName>",
	"name": "<name>",
	"password": "<password>",
	"tenant": "<tenant>"
	}
    ```

	**Note the tenant, name, and password values as they'll be used in Step 7.**

7. Set up the environment variables - replacing the &lt;subscriptionId>, &lt;tenant>, &lt;name>, and &lt;password> placeholders 
with the values you obtained in steps 4 and 5. 

	**Using bash**

	```shell
	export azureSubId='<subscriptionId>'
	export azureServicePrincipalTenantId='<tenant>'
	export azureServicePrincipalClientId='<name>'
	export azureServicePrincipalPassword='<password>'
    ```

	**Using PowerShell**

	```shell
	$env:azureSubId='<subscriptionId>'
	$env:azureServicePrincipalTenantId='<tenant>'
	$env:azureServicePrincipalClientId='<name>'
	$env:azureServicePrincipalPassword='<password>'
    ```

## Create a service principal using the Azure SDK for Node.js

To programmatically create a service principal using JavaScript, use the 
[ServicePrincipal script](https://github.com/Azure/azure-sdk-for-node/tree/master/Documentation/ServicePrincipal).   

## Using the service principal

Once you have a service principal, the following JavaScript code snippet 
illustrates how to use the service principal keys to authenticate with the 
Azure SDK for Node.js. Modify the following placeholders: &lt;clientId or appId>, &lt;secret or password>,
and &lt;domain or tenant>,

```javascript
const Azure = require('azure');
const MsRest = require('ms-rest-azure');

MsRest.loginWithServicePrincipalSecret(
  <clientId or appId>,
  <secret or password>,
  <domain or tenant>,
  (err, credentials) => {
    if (err) throw err

    let storageClient = Azure.createARMStorageManagementClient(credentials, '<azure-subscription-id>');

    // ..use the client instance to manage service resources.
  }
);
```
