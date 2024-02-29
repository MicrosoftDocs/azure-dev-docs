---
ms.custom: overview, devx-track-python
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Deploy Azure Container Apps load balancer

To deploy the Azure Container App, use the dev container:

* Open in  [GitHub Codespaces](https://codespaces.new/Azure-Samples/openai-aca-lb) or [Visual Studio Code with your local computer](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/azure-samples/openai-aca-lb.git) repo to your local machine and open dev container with Visual Studio Code

1. To deploy the load balancer to Azure, sign in to Azure Developer CLI (AZD).

    ```bash
    azd auth login --use-device-code
    ```

1. Finish the sign in instructions.
1. Deploy the load balancer app.

    ```bash
    azd up
    ```

    You will need to select a subscription and region for the deployment. These don't have to be the same subscription and region as the chat app. 

1. Wait for the deployment to complete before continuing.

## Get load balancer endpoint

Get the load balancer endpoint, which is required when you redeploy the chat app. 

Collect the following information from the Load balancer sample's `.env` file found in the `.azure` folder, within the named environment subfolder.

|Property|Example value|
|---|---|
|RESOURCE_GROUP_NAME| `<ENVIRONMENT-NAME>-rg`|
|CONTAINER_APP_URL|`https://<ACA-URL>.<LOCATION>.azurecontainerapps.io`|
