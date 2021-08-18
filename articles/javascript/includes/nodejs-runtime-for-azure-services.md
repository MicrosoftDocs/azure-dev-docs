---
ms.custom: devx-track-js
ms.topic: include
ms.date: 07/28/2021
---

In order to host your JavaScript apps in an Azure hosting environment, make sure your local development environment Node.js runtime mimics the Azure hosting runtime you intend to use. 

* Azure [App service](/azure/app-service/) uses the Node.js runtime engine. To show all supported Node.js versions, run the following command in the [Cloud Shell](https://shell.azure.com):

    ```azurecli-interactive
    az webapp list-runtimes | grep node
    ```
* Azure [Static Web App run times](/azure/static-web-apps/apis) are only relevant to the Function APIs. 

* Azure [Functions supported Node.js versions](/azure/azure-functions/functions-reference-node?tabs=v2#node-version) are based on which version of Functions you use. 

* Custom run times - a custom runtime is supported in the following ways:

    * [Virtual machines](/azure/virtual-machines/)
    * Containers - [single](/azure/container-instances/), [web app](/azure/app-service/), [Kubernetes](/azure/aks/)
    * (serverless) Functions - use [custom handlers](/azure/azure-functions/functions-custom-handlers)