---
title: Azure modules for JavaScript
description: Overview of the Azure management and service modules for JavaScript
author: KarlErickson
ms.author: karler
manager: douge
ms.date: 06/17/2017
ms.topic: article
ms.prod: azure
ms.devlang: nodejs
ms.service: azure-nodejs
---

# Azure modules for JavaScript

Manage Azure resources and connect to services from your JavaScript applications with the Azure modules for JavaScript. The code is available as [npm modules](../node-sdk-azure-install.md) for use in your projects. 

## Manage Azure resources

Use management modules to create and query resources from your apps or to build your own Azure automation tools. 

For example, to create a Linux VM using an existing network interface, you would write the following code:

```javascript
const msRestAzure = require('ms-rest-azure');
const ComputeManagementClient = require('azure-arm-compute');

// read in service principal values from env variables
const clientId = process.env['CLIENT_ID'];
const domain = process.env['DOMAIN'];
const secret = process.env['APPLICATION_SECRET'];
const subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];

msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, function (err, credentials, subscriptions) {
    if (err) return console.log(err);
    const computeClient = new ComputeManagementClient(credentials, subscriptionId);
    // customize the VM 
    const vmParameters = {
        location: "eastus",
        osProfile: {
            computerName: "newLinuxVM",
            adminUsername: adminUsername,
            adminPassword: adminPassword
        },
        linuxConfiguration: {
            ssh: {
                publicKeys: [mySshKey]
            }
        },
        hardwareProfile: {
            vmSize: 'Basic_A1'
        },
        networkProfile: {
            networkInterfaces: [
                {
                    id: myNetworkInterfaceId,
                    primary: true
                }
            ]
        },
        storageProfile: {
            imageReference: {
                publisher: 'Canonical',
                offer: 'UbuntuServer',
                sku: '16.04-LTS',
                version: 'latest'
            },
        }
    };
 
    // create the VM
    computeClient.virtualMachines.createOrUpdate("myResourceGroup", "newLinuxVM", vmParameters, function (err, data) {
        if (err) return console.log(err);
    });

});
```

Review the [install instructions](../node-sdk-azure-install.md) for a full list of the modules and the [get started article](../node-sdk-azure-get-started.md) to set up authentication and run sample code to create and update resources against your own Azure subscription. 

## Connect to Azure services

In addition to using the Azure modules to create and manage resources within Azure, you can also use packages to connect and use Azure cloud services in your apps. For example, you might update a table SQL Database or upload files to Azure Storage. Select the package you need for a particular service from the [complete list](../node-sdk-azure-install.md) and visit the [JavaScript developer center](https://azure.microsoft.com/develop/nodejs/) for tutorials and sample code to learn how to use the modules in your apps.

For example, to print out the contents of every blob in an Azure storage container:

```javascript
var azure = require('azure-storage');
var blobService = azure.createBlobService(storageConnectionString);
blobService.listBlobsSegmented('testcontainer', null, function(error, result, response) {
   if (err) return console.log(err);
   console.log(result);
});
```

## Sample code and reference

The following samples cover common tasks with the Azure management modules and have code ready to use in your own apps:

- [Virtual machines](../node-samples-services-compute.md)
- [Web apps](../node-samples-services-web-and-mobile.md)
- [SQL Database](../node-samples-services-database.md)
   
A [reference](https://docs.microsoft.com/javascript/api) is available for all modules in both the service and management modules. New features, breaking changes, and migration instructions from previous versions are available in the [release notes](https://github.com/Azure/azure-sdk-for-node/releases).
