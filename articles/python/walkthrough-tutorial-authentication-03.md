---
title: "Walkthrough, Part 3: Authenticate Python apps with Azure services"
description: An examination of the example third-party API implementation using Azure Functions and how the endpoint is secured with an access key.
ms.date: 08/24/2020
ms.topic: conceptual
---

# Part 3: Example third-party API implementation

[Previous part: Authentication challenges](walkthrough-tutorial-authentication-02.md)

In our example scenario, the main app's public endpoint uses a third-party API that's secured by an access key. This section shows an implementation of the third-party API using Azure Functions, but the API could be implemented in other ways and deployed to a different cloud server or web host. The only important aspect is that the endpoint protected by a specific access key that must be included in any client requests. Any app that invokes this API, then, must securely manage that key.

For demonstration purposes, this API is deployed to the endpoint, `https://msdocs-api-example.azurewebsites.net/api/RandomNumber`. If you attempt to invoke this API either in a browser or via curl, you get an error because the endpoint is secured.

To call this API, you must provide the access key `d0c5atM1cr0s0ft` either in a `?code=` URL parameter or in an `'x-functions-key'` property of the HTTP header. For example, try this URL: `https://msdocs-api-example.azurewebsites.net/api/RandomNumber?code=d0c5atM1cr0s0ft`.

If the access key is valid, the endpoint returns a JSON response that contains a single property, "value", the value of which is a number between 1 and 999, such as `{"value": 959}`.

The endpoint is implemented in Python and deployed to Azure Functions. The code is as follows:

```python
import logging
import random
import json

import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('RandomNumber invoked via HTTP trigger.')

    random_value = random.randint(1, 1000)
    dict = { "value" : random_value }
    return func.HttpResponse(json.dumps(dict))
```

To deploy the code, the sample's provisioning script performs the following steps:

1. Create a backing storage account for Azure Functions with the Azure CLI command, [`az storage account create`](/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create).

1. Create an Azure Functions "app" to host the code with the Azure CLI command, [`az function app create`](/cli/azure/functionapp?view=azure-cli-latest#az-functionapp-create).

1. After waiting 60 seconds for the host to be fully provisioned, deploy the code using the [Azure Functions Core Tools](/azure/azure-functions/functions-run-local?tabs=linux%2Ccsharp%2Cbash) command, [`func azure functionapp publish`](/azure/azure-functions/functions-run-local?tabs=linux%2Ccsharp%2Cbash#project-file-deployment)

1. Assign the access key, `d0c5atM1cr0s0ft`, to the function. (See [Securing Azure Functions](/azure/azure-functions/security-concepts) for a background on function keys.)

    In the provisioning script, this step is accomplished through a REST API call to the [Functions Key Management API](https://github.com/Azure/azure-functions-host/wiki/Key-management-API) because the Azure CLI doesn't presently support this particular feature. To call that REST API, the provisioning script must first use another REST API call to retrieve the Function app's master key.

    You can also assign access keys through the [Azure portal](https://portal.azure.com). On the page for the Functions app, select **Functions**, then select the specific function to secure (which is named `RandomNumber` in this example). On the function's page, select **Function Keys** to open the page where you can create and manage these keys.

> [!div class="nextstepaction"]
> [Part 4 - Example main app implementation >>>](walkthrough-tutorial-authentication-04.md)
