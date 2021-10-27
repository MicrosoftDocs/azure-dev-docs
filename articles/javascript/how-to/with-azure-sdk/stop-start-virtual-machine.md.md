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

You may want to set up your virtual machine to stop (power off) when you aren't using it. 

1. Create a file named `stop-vm` or [copy the file from GitHub](https://github.com/Azure-Samples/js-e2e/blob/main/resources/virtual-machines/stop-vm.js).

    :::code language="JavaScript" source="~/../js-e2e/resources/virtual-machines/stop-vm.js"  :::

    SDK methods used in this script include:
    
    * VMs
        * [computeClient.virtualMachines.poweroff](/javascript/api/@azure/arm-compute/virtualmachines?view=azure-node-latest&preserve-view=true#createOrUpdate_string__string__VirtualMachine__msRest_RequestOptionsBase_)

1. Install the npm packages used in the Azure work:

    ```bash
    npm init -y && install @azure/identity @azure/arm-compute @azure/arm-network @azure/arm-resources @azure/arm-storage
    ```

1. For local development, change variables in file for authentication:

    ```javascript
    // Azure authentication in environment variables for DefaultAzureCredential
    const tenantId =
      process.env["AZURE_TENANT_ID"] || "REPLACE-WITH-YOUR-TENANT-ID";
    const clientId =
      process.env["AZURE_CLIENT_ID"] || "REPLACE-WITH-YOUR-CLIENT-ID";
    const secret =
      process.env["AZURE_CLIENT_SECRET"] || "REPLACE-WITH-YOUR-CLIENT-SECRET";
    const subscriptionId =
      process.env["AZURE_SUBSCRIPTION_ID"] || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID";    
    ```

1. Change variables for resource naming:

    ```javascript
    // CHANGE THIS - used as prefix for naming resources
    const yourAlias = "johnsmith";
    
    // CHANGE THIS - used to add tags to resources
    const projectName = "azure-samples-create-vm"
    ```

1. Run the code to create a VM:

    ```bash
    node create-vm.js
    ```

    The output includes the resource group name:

    ```bash
    success - resource group name: johnsmith-testrg1689
    ```

## Clean up resources

When you are done with the virtual machine, delete the resource group.

1. Create a file named `delete-resources.js` or [copy the file from GitHub](https://github.com/Azure-Samples/js-e2e/blob/main/resources/virtual-machines/delete-resources.js).

    :::code language="JavaScript" source="~/../js-e2e/resources/virtual-machines/delete-resources.js"  :::

1. For local development, change variables in file for authentication:

    ```javascript
    // Azure authentication in environment variables for DefaultAzureCredential
    const tenantId =
      process.env["AZURE_TENANT_ID"] || "REPLACE-WITH-YOUR-TENANT-ID";
    const clientId =
      process.env["AZURE_CLIENT_ID"] || "REPLACE-WITH-YOUR-CLIENT-ID";
    const secret =
      process.env["AZURE_CLIENT_SECRET"] || "REPLACE-WITH-YOUR-CLIENT-SECRET";
    const subscriptionId =
      process.env["AZURE_SUBSCRIPTION_ID"] || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID";    
    ```

1. Get the resource group name, which was returned as the last line from the creation script and change the variable in the delete script:

    ```javascript
    const resourceGroupName = "REPLACE-WITH-YOUR-RESOURCE_GROUP-NAME";
    ```

1. Run the code to create a VM:

    ```bash
    node delete-resources.js
    ```
    
    The delete may take a few minutes.

    SDK methods used in this script include:
    
    * Resource groups
        * [resourceClient.resourcegroups.createOrUpdate](/javascript/api/@azure/arm-resources/resourcegroups?view=azure-node-latest&preserve-view=true#createOrUpdate_string__ResourceGroup__msRest_RequestOptionsBase_)

## Next steps

* [Selecting hosting for your app](../select-hosting-service.md)
