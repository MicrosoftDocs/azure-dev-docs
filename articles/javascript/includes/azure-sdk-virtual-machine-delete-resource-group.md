---
ms.custom: devx-track-js, devx-track-azurecli
ms.topic: include
ms.date: 10/27/2021
---

## Clean up resources

When you are done with the virtual machine, delete the resource group.

1. Create a file named `delete-resources.js` or [copy the file from GitHub](https://github.com/Azure-Samples/js-e2e/blob/main/resources/virtual-machines/delete-resources.js).

    :::code language="JavaScript" source="~/../js-e2e/resources/virtual-machines/delete-resources.js" highlight="31" :::

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
    
    * Resource groups - [resourceClient.resourcegroups.delete](/javascript/api/@azure/arm-resources/resourcegroups?preserve-view=true&view=azure-node-latest#deleteMethod_string__msRest_RequestOptionsBase_)