---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Configure the TPM quota

By default, each of the Azure OpenAI instances in the load balancer is deployed with a capacity of 30,000 tokens per minute (TPM). You can use the chat app with the confidence that it's built to scale across many users without running out of quota. Change this value when:

* You get deployment capacity errors: Lower the value.
* You need higher capacity: Raise the value.

1. Use the following command to change the value:

    ```bash
    azd env set OPENAI_CAPACITY 50
    ```

1. Redeploy the load balancer:

    ```bash
    azd up
    ```
