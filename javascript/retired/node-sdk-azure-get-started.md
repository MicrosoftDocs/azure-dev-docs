---
title: Get started with the Azure modules for Node.js
description: Get started with authentication and resource management with Azure modules for Node.js
author: karlerickson
manager: douge
ms.author: karler
ms.date: 06/17/2017
ms.topic: conceptual
ms.prod: azure
ms.devlang: nodejs
ms.service: azure-nodejs
---

# Get started with the Azure modules for Node.js

This guide walks you through installing Azure Node.js modules, authenticating to Azure with a service principal, and running sample code that creates resources in your Azure subscription and connects to Azure cloud services.

## Prerequisites

- An Azure account. If you don't have one , [get a free trial](https://azure.microsoft.com/free/)
- [Node.js](https://nodejs.org)
- [Azure Cloud Shell](/azure/cloud-shell/quickstart) or [Azure CLI 2.0](/cli/azure/install-az-cli2).

[!INCLUDE [azure-cloud-shell](../includes/cloud-shell-try-it.md)]

## Prepare your environment

Create a new project in an empty directory and install the following npm modules:

```bash
cd azure-node-quickstart
npm init -y
npm install --save azure ms-rest-azure azure-arm-compute azure-arm-network azure-storage azure-arm-storage
```

## Set up authentication

Your Node.js applications need read and create permissions in your Azure subscription to run the sample code in this guide. Create a service principal and configure your application to run with its credentials. Service principals are a non-interactive account associated with your identity to which you grant only the privileges your app needs to run.

[Create a service principal using the Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli) and capture the output. You'll need to provide a [secure password](/azure/active-directory/active-directory-passwords-policy) in the password argument instead of `MY_SECURE_PASSWORD`.

```azurecli-interactive
az ad sp create-for-rbac --name AzureNodeTest --password MY_SECURE_PASSWORD
```

```json
{
  "appId": "a487e0c1-82af-47d9-9a0b-af184eb87646d",
  "displayName": "AzureNodeTest",
  "name": "http://AzureNodeTest",
  "password": password,
  "tenant": ""
}
```

Export the values for *appId*, *password* and *tenant* as environment variables:

```bash
export AZURE_ID a487e0c1-82af-47d9-9a0b-af184eb87646d
export AZURE_PASS password
export AZURE_TENANT XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

Get the ID for your subscription with [az account show](/cli/azure/account#show)

```azurecli-interactive
az account show
```

```json
{
   "environmentName": "AzureCloud",
   "id": "306943934-0323-4ae4d-a42b-f6613d1664ac",
   "isDefault": true
}
```

Export the subscription ID as an environment variable

```bash
export AZURE_SUB 306943934-0323-4ae4d-a42b-f6613d1664ac
```

## Create a Linux virtual machine

Create a new file *createVM.js* in the current directory with the following code. Update the value of `adminPass` with a good password.

```javascript
'use strict';

const MsRest = require('ms-rest-azure');
const ComputeManagementClient = require('azure-arm-compute');
const NetworkManagementClient = require('azure-arm-network');

MsRest.loginWithServicePrincipalSecret(
    process.env.AZURE_ID, process.env.AZURE_PASS, process.env.AZURE_TENANT, (err, credentials) => {

        let adminPass = YOUR_VALUE_HERE;
        const networkClient = new NetworkManagementClient(credentials, process.env.AZURE_SUB);
        const computeClient = new ComputeManagementClient(credentials, process.env.AZURE_SUB);

        let nicParameters = {
            location: "eastus",
            ipConfigurations: [
                {
                    name: "vmnetinterface",
                    privateIPAllocationMethod: 'Dynamic',
                }
            ]
        };

        const vnetParameters = {
            location: "eastus",
            addressSpace: {
                addressPrefixes: ['10.0.0.0/16']
            },
            dhcpOptions: {
                dnsServers: ['10.1.1.1', '10.1.2.4']
            },
            subnets: [{ name: "mynodesubnet", addressPrefix: '10.0.0.0/24' }],
        };

        let vmParameters = {
            location: "eastus",
            osProfile: {
                computerName: "newLinuxVM",
                adminUsername: "testadmin",
                adminPassword: admin_password
            },
            hardwareProfile: {
                vmSize: 'Basic_A1'
            },
            networkProfile: {
                networkInterfaces: [
                    {
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

        let publicIPParameters = {
            location: "eastus",
            publicIPAllocationMethod: 'Dynamic'
        };

        networkClient.virtualNetworks.createOrUpdate("myResourceGroup", "mynodevnet", vnetParameters)
            .then(function (vnetwork) {
                networkClient.subnets.get("myResourceGroup", "mynodevnet", "mynodesubnet")
                    .then(function (subnetInfo) {
                        nicParameters.ipConfigurations[0].subnet = subnetInfo;
                        networkClient.publicIPAddresses.createOrUpdate("myResourceGroup", "myLinuxPublicIP", publicIPParameters)
                            .then(function (publicIP) {
                                nicParameters.ipConfigurations[0].publicIPAddress = publicIP;
                                networkClient.networkInterfaces.createOrUpdate("myResourceGroup", "vmnetinterface", nicParameters)
                                    .then(function (vmNetworkInterface) {
                                        vmParameters.networkProfile.networkInterfaces[0].id = vmNetworkInterface.id;
                                        computeClient.virtualMachines.createOrUpdate("myResourceGroup", "newLinuxVM", vmParameters, (err, data) => {
                                            if (err) return console.log(err);
                                            console.log("Created new Linux VM");
                                        });
                                    });
                            });
                    });
            });
    });
```

Run the code from the command line:

```bash
node createVM.js
```

Once the code completes, get the IP of your new virtual machine and log in with SSH using the value for `adminPass` from your code.

```azurecli-interactive
az vm list-ip-addresses --name newLinuxVM
```

```bash
ssh testadmin@*vm_ip_address*
```

## Write a blob to Azure Storage

Create a new file *uploadFile.js* in the current directory with the following code.

```javascript
'use strict'

const MsRest = require('ms-rest-azure');
const storage = require('azure-storage');
const storageManagementClient = require('azure-arm-storage');

MsRest.loginWithServicePrincipalSecret(process.env.AZURE_ID, process.env.AZURE_PASS, process.env.AZURE_TENANT, (err, credentials) => {
    const client = new storageManagementClient(credentials, process.env.AZURE_SUB);

    const createParameters = {
        location: 'eastus',
        sku: {
            name: 'Standard_LRS'
        },
        kind: 'BlobStorage',
        accessTier: 'Hot'
    };

    const blobAccountName = "nodedemo" + Math.random().toString(10).substr(4, 7);

    client.storageAccounts.create("myResourceGroup", blobAccountName, createParameters, (err, result, httpRequest, response) => {
        if (err) console.log(err);

        // get a connection string for the account
        client.storageAccounts.listKeys("myResourceGroup", blobAccountName, (err, result) => {
            if (err) console.log(err);

            // get a storage key and use it to connect to the azure-storage module
            const blobSvc = storage.createBlobService(blobAccountName, result.keys[0].value);
            blobSvc.createContainerIfNotExists('mycontainer', { publicAccessLevel: 'blob' }, function (error, result, response) {
                if (!error) {
                    blobSvc.createBlockBlobFromText('mycontainer', 'myblob', 'Hello Azure!', function (error, result, response) {
                        if (!error) {
                            console.log("File uploaded to " + "https://" + blobAccountName + ".blob.core.windows.net/mycontainer/myblob");
                        }
                    });
                }
            });

        });
    });
});
```

Run the command and then copy and paste the URL from the output into your web browser to view the file in Azure Storage:

```bash
node uploadFile.js
```

## Clean up resources

Delete the resource group to remove the resources created in this guide.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

Explore more [sample Node.js code](https://azure.microsoft.com/resources/samples/?platform=nodejs) you can use in your apps.

## Reference 

A [reference](/javascript/api/overview/azure/) is available for all packages.

## Get help and give feedback

Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure+node.js). Report bugs and open issues against the Azure modules for Node.js on the [project GitHub](https://github.com/Azure/azure-sdk-for-node).
