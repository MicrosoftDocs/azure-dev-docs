---
title: Authenticate to Azure with SDK
description: To authenticate to Azure, create a service principal to use the Azure SDKs for JavaScript.
ms.topic: how-to
ms.date: 10/26/2021
ms.custom: devx-track-js
---

# Authenticate to Azure for development and runtime environments

To authenticate to Azure, create a service principal to use the Azure SDKs for JavaScript.

## Authenticate to the Azure platform

Generally for most services and functionality, you need to authenticate with a [Identity credential method](https://www.npmjs.com/package/@azure/identity) to create a token. The token is passed to the SDK to authorize your use. There are several credential methods, some require more extensive setup but are built for production service use. 

Find package-specific instructions to authenticate in each [npm Azure SDK package's](../azure-sdk-library-package-index.md) `readme.md`. 

## Interactive authentication for quickstarts and tutorials

To use a quickstart or tutorial for the Azure services, the quickest credential method is [interactive login](https://github.com/Azure/azure-sdk-for-js/blob/hotfix/identity_1.3.0/sdk/identity/identity/samples/AzureIdentityExamples.md#authenticating-a-user-account-interactively-in-the-browser). With this method, you complete a few quick steps:
1. You run the code.
1. A message displays with an authentication URL and a token. 
1. Open a browser to that URL and enter the token. Depending on your Azure authentication requirements, a second authentication step may be required.
1. When you have completed the authentication, you can close the browser.
1. The code continues to run.

An example of interactive login authentication in a browser requires the configuration setting for the tenant and client ID for the Azure Active Directory application you are authenticating to. An example of this code is:

```javascript
function withInteractiveBrowserCredential() {
  const credential = new InteractiveBrowserCredential({
    tenantId: "<YOUR_TENANT_ID>",
    clientId: "<YOUR_CLIENT_ID>"
  });

  const client = new SecretClient("https://key-vault-name.vault.azure.net", credential);
}
```

Because this method requires an interactive login each time the code runs, you will want to replace this method with a non-interactive credential method once you are ready to begin your development work for the Azure platform. 

Because this code doesn't use any authentication secrets, you can check this code to source control. 

## Azure authentication for development and production use

When you are ready to _begin_ your development work, we recommend you select the following credentials: 

|Local development|Deployed application|
|--|--|
|**ClientSecretCredential**. After you create your service principal and retrieve your client ID, tenant ID, and secret, this credential is quick to use and doesn't require environment variables.|When you plan to deploy to production, use the **DefaultAzureCredential** which requires environment variables. This credential method provides the benefit of not needing to store or use secrets in source control.  |

There are other [credential classes](https://www.npmjs.com/package/@azure/identity#credential-classes), which allow you to control authentication for specific purposes. 

## 1. Create a service principal

Create a service principal and configure its access to Azure resources. The service principal is **required** to use the DefaultAzureCredential.

1. Create the service principal with the Azure [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac) command with the Azure CLI or [Cloud Shell](https://shell.azure.com). 

    ```azurecli
    az ad sp create-for-rbac --name YOUR-SERVICE-PRINCIPAL-NAME --role Contributor
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

You can also create a service principal with:
* [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal)
* [PowerShell](/azure/active-directory/develop/howto-authenticate-service-principal-powershell) 

## 2. Configure your environment variables

In the Azure cloud environments, you need to configure the following environment variables. Do not change the names because the Azure Identity SDK requires these exact environment names. These environment variables are **REQUIRED for the context to use DefaultAzureCredential**. 

   * `AZURE_TENANT_ID`: `tenant` from the service principal output above. 
   * `AZURE_CLIENT_ID`: `appId` from the service principal output above.
   * `AZURE_CLIENT_SECRET`: `password` from the service principal output above.

## 3. List Azure subscriptions with service principal 

Use the new service principal to authenticate with Azure and list your subscriptions. 

# [Azure SDK for JavaScript](#tab/azure-sdk-for-javascript)

1. Install the dependencies: [Azure SDK for Identity](https://www.npmjs.com/package/@azure/identity), [Azure Subscriptions SDK](https://www.npmjs.com/package/@azure/arm-subscriptions).

    ```bash
    npm install @azure/identity @azure/arm-subscriptions --save
    ```

1. Create a JavaScript file, named [list.js](https://github.com/Azure-Samples/js-e2e/blob/main/resources/subscriptions/list.js), with the following code:

    :::code language="JavaScript" source="~/../js-e2e/resources/subscriptions/list.js" highlight="4-24"  :::

1. If you aren't setting environment variables, replace the credential strings with your values.
 
    ```javascript
    const tenantId = process.env["AZURE_TENANT_ID"] || "REPLACE-WITH-YOUR-TENANT-ID"; 
    const clientId = process.env["AZURE_CLIENT_ID"] || "REPLACE-WITH-YOUR-CLIENT-ID"; 
    const secret = process.env["AZURE_CLIENT_SECRET"] || "REPLACE-WITH-YOUR-CLIENT-SECRET";
    ```

1. Run the file to view the resource group list:

    ```bash
    node list.js
    ```

1. View complete sample code and package.json:

    * [https://github.com/Azure-Samples/js-e2e/blob/main/resources/subscriptions/list.js](https://github.com/Azure-Samples/js-e2e/blob/main/resources/subscriptions/list.js)

# [Azure CLI](#tab/azure-cli-list-subscriptions)

1. In the same Azure CLI terminal you used to create the service principal, log off to stop using your personal account.

    ```azurecli
    az logout
    ```
    
1. Log in using your service principal. 

    ```azurecli
    az login --service-principal \
        --username YOUR-SERVICE-PRINCIPAL-ID \
        --password YOUR-PASSWORD \
        --tenant YOUR-TENANT-ID
    ```

1.  List all resource groups: 

    ```azurecli
    az account list --output table
    ```

---

## Next steps

* [View resource operation history](../how-to/with-azure-sdk/list-resource-operation-history.md)
* [Create web app with a secure domain name](../how-to/add-custom-domain-to-web-app.md)
* You can also create a service principal with:
  * [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal)
  * [PowerShell](/azure/active-directory/develop/howto-authenticate-service-principal-powershell)
