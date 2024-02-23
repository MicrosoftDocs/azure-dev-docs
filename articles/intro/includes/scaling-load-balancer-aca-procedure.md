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

* With GitHub Codespaces in a browser
* Clone the repo to your local machine and open dev container with Visual Studio Code

1. Open the dev container for the load balancer.
1. Sign in to Azure Developer CLI

    ```bash
    azd auth login --use-device-code
    ```

1. Finish the sign in instructions.
1. Deploy the load balancer app.

    ```bash
    azd up
    ```