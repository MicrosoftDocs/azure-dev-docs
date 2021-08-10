---
title: include file
description: include file
author: duffney
ms.topic: include
ms.date: 08/10/2021
ms.author: jduffney
---

Using your Azure authentication information, set the appropriate environment variables so that your code can authenticate to Azure.

#### [Bash](#tab/bash)

1. Edit the `~/.bashrc` file by adding the following environment variables. Replace the placeholders with the appropriate values from the previous section.

    ```bash
    export ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
    export ARM_TENANT_ID="<active_directory_tenant_id"
    export ARM_CLIENT_ID="<service_principal_appid>"
    export ARM_CLIENT_SECRET="<service_principal_password>"
    ```

1. To execute the `~/.bashrc` script, run `source ~/.bashrc` (or its abbreviated equivalent `. ~/.bashrc`).

    ```bash
    . ~/.bashrc
    ```

1. Once the environment variables have been set, you can verify their values as follows:

    ```bash
    printenv | grep ^ARM*
    ```

#### [Windows](#tab/windows)

Add the following environment variables to your Windows system with their appropriate values from the previous section.

- ARM_SUBSCRIPTION_ID
- ARM_TENANT_ID
- ARM_CLIENT_ID
- ARM_CLIENT_SECRET

----
