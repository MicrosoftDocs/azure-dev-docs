---
title: "Walkthrough, Part 3: Authenticate Python apps with Azure services"
description: An examination of the example third-party API implementation using Azure Functions and how the endpoint is secured with an access key.
ms.date: 05/28/2025
ms.topic: how-to
ms.custom: devx-track-python
---

# Part 3: Example third-party API implementation

[Previous part: Authentication requirements](walkthrough-tutorial-authentication-02.md)

In our example scenario, the main application consumes a third-party API that is secured with an access key. This section demonstrates the API using Azure Functions, but the same principles apply regardless of how or where the API is implemented—whether you host the application on another cloud provider or a traditional web server.

The key aspect is that any client requests to the protected endpoint must include the access key, which the app must manage securely. This section provides an overview of how to implement such an API using Azure Functions, but you can adapt the principles to your specific needs.

## Example third-party API implementation

The example third-party API is a simple endpoint that returns a random number between 1 and 999. The API is secured with an access key, which must be provided in the request to access the endpoint. For demonstration purposes, this API is deployed to the endpoint, `https://msdocs-example-api.azurewebsites.net/api/RandomNumber`. To call the API, however, you must provide the access key `d0c5atM1cr0s0ft` either in a `?code=` URL parameter or in an `'x-functions-key'` property of the HTTP header. For example, after you deploy the app and API, try this URL in  a browser or curl: `https://msdocs-example-api.azurewebsites.net/api/RandomNumber?code=d0c5atM1cr0s0ft`.

If the access key is valid, the endpoint returns a JSON response that contains a single property, "value", the value of which is a number between 1 and 999, such as `{"value": 959}`.

The endpoint is implemented in Python and deployed to Azure Functions. The code is as follows:

:::code language="python" source="~/../python-integrated-authentication/third_party_api/RandomNumber/__init__.py":::

In the sample repository, this code is found under *third_party_api/RandomNumber/\_\_init\_\_.py*. The folder, *RandomNumber*, provides the name of the function and *\_\_init\_\_.py* contains the code. Another file in the folder, *function.json*, describes when the function is triggered. Other files in the *third_party_api* parent folder provide details for the Azure Function app that hosts the function itself.

To deploy the code, the sample's provisioning script performs the following steps:

1. Create a backing storage account for Azure Functions with the Azure CLI command, [`az storage account create`](/cli/azure/storage/account#az-storage-account-create) for managing state and internal operations.

1. Create an Azure Functions app with the Azure CLI command, [`az function app create`](/cli/azure/functionapp#az-functionapp-create).

1. After waiting 60 seconds for the host to be fully provisioned, deploy the code using the [Azure Functions Core Tools](/azure/azure-functions/functions-run-local?tabs=linux%2Ccsharp%2Cbash) command, [`func azure functionapp publish`](/azure/azure-functions/functions-run-local?tabs=linux%2Ccsharp%2Cbash#project-file-deployment).

1. Assign the access key, `d0c5atM1cr0s0ft`, to the function. (See [Securing Azure Functions](/azure/azure-functions/security-concepts) for a background on function keys.)

    In the provisioning script, this step is accomplished using the [az functionapp function keys set](/cli/azure/functionapp/function/keys#az-functionapp-function-keys-set) Azure CLI command.

    Comments are included to show how to do this step through a REST API call to the [Functions Key Management API](https://github.com/Azure/azure-functions-host/wiki/Key-management-API) if desired. To call that REST API, another REST API call must be done first to retrieve the Function app's master key.

You can also assign access keys through the [Azure portal](https://portal.azure.com). On the page for the Functions app, select **Functions**, then select the specific function to secure (which is named `RandomNumber` in this example). On the function's page, select **Function Keys** to open the page where you can create and manage these keys.

> [!div class="nextstepaction"]
> [Part 4 - Main app implementation >>>](walkthrough-tutorial-authentication-04.md)
