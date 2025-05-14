---
title: Quickstart: Create AI infrastructure using extensions
description: Learn how to install and use the Azure Developer CLI AI extension to quickly create AI infrastructure.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/14/2025
ms.service: azure-dev-cli
ms.topic: quickstart
ms.custom: devx-track-azdevcli, devx-track-bicep
---
# Quickstart: Create AI infrastructure using extensions

The Azure Developer CLI (azd) supports extensions that add new capabilities to your development workflow. The AI extension for `azd` helps you select and provision and the required Azure AI resources for your app scenario directly from the CLI. This quickstart shows you how to install the AI extension and use it to create AI infrastructure in your Azure environment.

## Initialize the project

To follow the steps ahead, initialize the `hello-azd` starter template. You can also follow along using your own template.

```azdeveloper
azd init -t hello-azd
```

## Install the extension

1. Ensure that extensions are enabled in your azd configuration:

    ```azdeveloper
    azd config set alpha.extensions on
    ```

1. Install the AI extension from the official registry:

    ```azdevelopermd
    azd extension install microsoft.azd.ai.builder
    ```

1. Verify the extension is installed by listing your installed extensions:

    ```azdeveloper
    azd extension list --installed
    ```

## Use the AI extension workflow to provision resources

Once installed, the AI extension adds new commands to `azd` you can use to build out various AI workflows. The steps ahead create the required backend Azure AI resources for a Retrieval-Augmented Generation (RAG) app.

1. To begin the AI extension workflows, use the `azd ai start` command:

    ```azdeveloper
    azd ai start
    ```

1. When prompted, select the Azure subscription and resource group you want to provision resources to.

1. The AI extension workflow prompts you with questions organized by task to identify the required infrastructure for your desired scenario. Select the following options when prompted to follow along with this sample scenario:

    - Identify AI Scenario:

        - **What type of AI scenario are you building?**: Rag Application (Retrieval-Augmented Generation)
        - **Does your application require custom data?**: No

    - User interaction:

        - **How do you want users to interact with the data?**: API Backend application

    - Configure 'rag-api' Application:

        - **Which application host do you want to use?** : Container App
        - **Select an existing application or create a new one**: Create new Container App
        - **Which programming language do you want to use?**: C#

    - AI Model Selection:

        - **Lets choose a chat completion model**: I will choose model
        - **Which model do you want to use?**: gpt-4o-mini (OpenAI)

    After you answer the workflow questions, the extensions prints your choices and stages the changes for provisioning and deployment. 

1. Select whether you want to provision the project resources. If you select **Yes**, `azd` begins provisioning resources to Azure based on your choices.
1. To see the changes that were applied by the AI extension, open the `azure.yaml` file at the root of your template. The **resources** node contains new configurations `azd` uses to provision the AI infrastructure.

    ```yaml
    resources:
    ai-project:
        type: ai.project
        models:
            - name: gpt-4o-mini
              version: "2024-07-18"
              format: OpenAI
              sku:
                name: GlobalStandard
                usageName: OpenAI.GlobalStandard.gpt-4o-mini
                capacity: 10
    rag-api:
        type: host.containerapp
        uses:
            - ai-project
        port: 8080
    ```

## Related content

- [Extensions overview](overview.md)
- [Extension framework readme](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extension-framework.md)
