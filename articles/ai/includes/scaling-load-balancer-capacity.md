---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

## Configure the tokens per minute quota (TPM)

By default, each of the OpenAI instances in the load balancer will be deployed with 30,000 TPM (tokens per minute) capacity. You can use the chat app with the confidence that it's built to scale across many users without running out of quota. Change this value when:

* You get deployment capacity errors: lower that value. 
* Planning higher capacity, raise the value.

1. Use the following command to change the value.

    ```bash
    azd env set OPENAI_CAPACITY 50
    ```

1. Redeploy the load balancer.

    ```bash
    azd up
    ```
