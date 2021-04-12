---
title: Azure SDK for JavaScript Identity credential
description: Once you have your Azure subscription, you need to know how to authenticate to the Azure platform to use the Azure SDKs for JavaScript.
ms.topic: conceptual
ms.date: 04/12/2021
ms.custom: devx-track-js
---

# Set up development environment to use Azure SDK for JavaScript credential

Once you have your [Azure subscription](https://azure.microsoft.com/free/), you need to know how to authenticate to the Azure platform to use the Azure SDKs for JavaScript. 

## Authenticate to the Azure platform

Generally for most services and functionality, you need to authenticate with a [Identity credential method](https://www.npmjs.com/package/@azure/identity) to create a token. The token is passed to the SDK to authorize your use. There are several credential methods, some require more extensive setup but are built for production service use. 

Each npm Azure SDK package's `readme.md` has the specific instructions to authenticate to the Azure platform and use the SDK. 

## Azure authentication for quickstarts and tutorials

To use a quickstart or tutorial for the Azure services, the quickest credential method is [interactive login](). With this method, you complete a few quick steps:
1. You run the code.
1. A message displays with an authentication URL and a token. 
1. Open a browser to that URL and enter the token. Depending on your Azure authentication requirements, a second authentication step may be required.
1. When you have completed the authentication, you can close the browser.
1. The code continues to run.

Because this method requires an interactive login each time the code runs, you will want to replace this method with a non-interactive credential method once you are ready to begin your development work to the Azure platform. 

Because this code doesn't use any authentication secrets, you can check code using this credential method into source control. 

## Azure authentication for development and production use

When you are ready to begin your development work, we recommend you select the **DefaultAzureCredential**. This credential method provides the benefit of using the same code in development and production without needing to store or use secrets.  

This method requires setup on both the local development environment or the remote product environment. 

## 1. Create a service principal

Create a service principal and configure its access to Azure resources. The service principal is **required** to use the DefaultAzureCredential.

1. Create the service principal with the Azure [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac) command with the Azure CLI or [Cloud Shell](https://shell.azure.com). 

    ```bash
    az ad sp create-for-rbac --name YOUR-SERVICE-PRINCIPAL-NAME
    ```

2. The response from the command includes secrets you need to store securely such as in [Azure Key Vault](/azure/key-vault/):

    ```json
    {
      "appId": "YOUR-SERVICE-PRINCIPAL-ID",
      "displayName": "YOUR-SERVICE-PRINCIPAL-NAME",
      "name": "http://YOUR-SERVICE-PRINCIPAL-NAME",
      "password": "!@#$%",
      "tenant": "YOUR-TENANT-ID"
    }
    ```

## 2. Configure your environment variables

In both the local and Azure cloud environments, you need to configure the following environment variables. Do not change the name because the Azure Identity SDK requires these exact environment names. 

These environment variables are **REQUIRED for the context to use DefaultAzureCredential**. 

* `AZURE_TENANT_ID`: `YOUR-TENANT-ID` from the service principal output above.
* `AZURE_CLIENT_ID`: `YOUR-SERVICE-PRINCIPAL-ID` from the service principal output above.
* `AZURE_CLIENT_SECRET`: `YOUR-TENANT-ID` from the service principal output above.

## 3. Create Azure resources with service principal 

Use the new service principal to authenticate with Azure. 

# [Azure SDK for JavaScript](#tab/azure-sdk-for-javascript)

1. Install the [Azure SDK for Identity](https://www.npmjs.com/package/@azure/identity).

    ```bash
    npm install @azure/identity
    ```

1. Install the [Azure Resource Manager SDK](https://www.npmjs.com/package/@azure/arm-resources). 

    ```bash
    npm install @azure/arm-resources
    ```

1. Create a default credential in your JavaScript file.

    ```javascript
    // import Azure npm dependency for Identity credential method
    const { DefaultAzureCredential } = require("@azure/identity");
    const credentials = new DefaultAzureCredential();
    ```

1. Pass the credential to any of the Azure Service SDKs in the client constructor parameter for the credential in your JavaScript file. The following code lists all resource groups.

    ```javascript
    const { ResourceManagementClient } = require("@azure/arm-resources");
    const resourceManagement = new ResourceManagementClient(credentials, subscriptionId);

    resourceManagement.resourceGroups.list()
    .then(result=>{console.log(JSON.stringify(result))})
    .catch(err=>{console.log(err)});
    ```

# [Azure CLI](#tab/azure-cli-create-resource)

1. In the same Azure CLI terminal you used to create the service principal, log off to stop using your personal account.

    ```bash
    az logout
    ```
    
1. Log in using your service principal. 

    ```bash
    az login --service-principal \
        --username YOUR-SERVICE-PRINCIPAL-ID \
        --password YOUR-PASSWORD \
        --tenant YOUR-TENANT-ID
    ```

1.  Create a new resource. This Azure CLI command is specific to [each service](/cli/azure/service-page/list%20a%20-%20z). 

---

## Next steps

* Create a resource group with the Azure SDK for JavaScript, `@azure/arm-resources`.