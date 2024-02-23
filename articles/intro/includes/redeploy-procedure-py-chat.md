---
ms.custom: overview, devx-track-python
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

Use this procedure to deploy the chat app to use the load balanced resources. This procedure works whether you're deploying the chat app for the first time or have already deployed it.

1. Collect the following information from the Load balancer sample's `.env` file found in the `.azure` folder.

    |Property|Example value|
    |---|---|
    |RESOURCE_GROUP_NAME| `<ENVIRONMENT-NAME>-rg`|
    |CONTAINER_APP_URL|`https://<ACA-URL>.<LOCATION>.azurecontainerapps.io`|

1. Open the dev container for the chat app. 
1. Sign in to Azure CLI:

    ```bash
    az login --use-device-code
    ```

1. Finish the sign in instructions. 
1. Run the following bash script to configure the chat app to use the load balancer.

    ```bash
    bash scripts/load-balance-aca-setup.sh <RESOURCE-GROUP-NAME> <CONTAINER-APP-URL>
    ```

1. Sign in to Azure Developer CLI

    ```bash
    azd auth login --use-device-code
    ```

1. Finish the sign in instructions.
1. Deploy the chat app.

    ```bash
    azd up
    ```

    If this is your first time deploying the chat app, you need to select the Azure subscription, and regions for the services.
    
    
    