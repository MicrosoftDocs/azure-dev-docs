---
title: Stop and start virtual machine
description: Use Azure SDK to stop and start a virtual machine.
ms.topic: conceptual
ms.date: 10/27/2021
ms.custom: devx-track-js
---

# Use Azure SDKs to manage a virtual machine.

Use the Azure SDKs to create, manage, and delete an Azure virtual machine. 

## Set up your development environment

- An Azure user account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- [Node.js LTS with NPM](https://nodejs.org/en/download), the Node.js package manager installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
- [Create a service principal](../../core/nodejs-sdk-azure-authenticate.md?tabs=azure-sdk-for-javascript#1-create-a-service-principal) and copy the `Tenant Id`, `Client ID`, `Client secret`.
- Use the Azure portal's [subscription page](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) to find your subscription ID, copy that value to use in these scripts. 

## Gather information about your Virtual machine

In order to programmatically stop and start your virtual machine, you need to collect and use several values:

* Service principal
    * Tenant Id
    * Client ID
    * Client secret
* Virtual machine
    * Subscription ID
    * Resource group
    * Virtual machine resource name

## List of virtual machines in subscription

To get the virtual machine resource name, use the following script to see all virtual machines in the subscription. Use the returned JSON's `name` value as the virtual machine resource name. 

:::code language="JavaScript" source="~/../js-e2e/resources/virtual-machines//list-vms.js"  :::

## Stop a virtual machine

You may want to stop (power off) your virtual machine when you aren't using it. 

1. Create a file named `stop-vm` or [copy the file from GitHub](https://github.com/Azure-Samples/js-e2e/blob/main/resources/virtual-machines/stop-vm.js).

    :::code language="JavaScript" source="~/../js-e2e/resources/virtual-machines/stop-vm.js"  :::

    SDK methods used in this script include:
    
    * VMs
        * [computeClient.virtualMachines.powerOff](/javascript/api/@azure/arm-compute/virtualmachines?view=azure-node-latest&preserve-view=true#powerOff_string__string__Models_VirtualMachinesPowerOffOptionalParams_)

1. Install the npm packages used in the Azure work:

    ```bash
    npm init -y && install @azure/identity @azure/arm-compute
    ```

1. For local development, change variables in file for authentication:

    ```javascript
    // Azure authentication in environment variables for DefaultAzureCredential
    const tenantId = process.env["AZURE_TENANT_ID"] || "REPLACE-WITH-YOUR-TENANT-ID"; 
    const clientId = process.env["AZURE_CLIENT_ID"] || "REPLACE-WITH-YOUR-CLIENT-ID"; 
    const secret = process.env["AZURE_CLIENT_SECRET"] || "REPLACE-WITH-YOUR-CLIENT-SECRET";
    const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"] || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID";
    ```

1. Change variables for resource naming:

    ```javascript
    const resourceGroupName = "REPLACE-WITH-YOUR-RESOURCE_GROUP-NAME";
    const vmResourceName = "REPLACE-WITH-YOUR-RESOURCE-NAME";
    ```

1. Run the code to create a VM:

    ```bash
    node stop-vm.js
    ```

    The output includes the operation ID:

    ```bash
    {
      "startTime":"2021-10-27T16:35:59.6006484+00:00",
      "endTime":"2021-10-27T16:35:59.850632+00:00",
      "status":"Succeeded",
      "name":"1773c5e7-d904-4f98-b2a6-6e2f2465407f"
    }
    ```

## Start a virtual machine

You may want to start your virtual machine if it is powered off. 

1. Create a file named `start-vm` or [copy the file from GitHub](https://github.com/Azure-Samples/js-e2e/blob/main/resources/virtual-machines/start-vm.js).

    :::code language="JavaScript" source="~/../js-e2e/resources/virtual-machines/start-vm.js"  :::

    SDK methods used in this script include:
    
    * VMs
        * [computeClient.virtualMachines.start](/javascript/api/@azure/arm-compute/virtualmachines?view=azure-node-latest&preserve-view=true#start_string__string__msRest_RequestOptionsBase_)

1. Install the npm packages used in the Azure work:

    ```bash
    npm init -y && install @azure/identity @azure/arm-compute
    ```

1. For local development, change variables in file for authentication:

    ```javascript
    // Azure authentication in environment variables for DefaultAzureCredential
    const tenantId = process.env["AZURE_TENANT_ID"] || "REPLACE-WITH-YOUR-TENANT-ID"; 
    const clientId = process.env["AZURE_CLIENT_ID"] || "REPLACE-WITH-YOUR-CLIENT-ID"; 
    const secret = process.env["AZURE_CLIENT_SECRET"] || "REPLACE-WITH-YOUR-CLIENT-SECRET";
    const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"] || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID";
    ```

1. Change variables for resource naming:

    ```javascript
    const resourceGroupName = "REPLACE-WITH-YOUR-RESOURCE_GROUP-NAME";
    const vmResourceName = "REPLACE-WITH-YOUR-RESOURCE-NAME";
    ```

1. Run the code to create a VM:

    ```bash
    node start-vm.js
    ```

    The output includes the operation ID:

    ```bash
    {
      "startTime":"2021-10-27T16:35:59.6006484+00:00",
      "endTime":"2021-10-27T16:35:59.850632+00:00",
      "status":"Succeeded",
      "name":"1773c5e7-d904-4f98-b2a6-6e2f2465407f"
    }
    ```

[!INCLUDE [javascript-azure-sdk-delete-resource-group](../../includes/azure-sdk-virtual-machine-delete-resource-group.md)]


## Next steps

* [Selecting hosting for your app](../select-hosting-service.md)
