---
title: 'Quickstart: Get started using GPT-35-Turbo and GPT-4 with Azure OpenAI Service using IntelliJ'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI Service and make your first chat completions call with IntelliJ IDEA. 
services: cognitive-services
ms.service: azure-ai-openai
ms.author: jialuogan
ms.topic: include
ms.date: 12/18/2023
keywords: 
---


# Quickstart: Get started using GPT-35-Turbo and GPT-4 with Azure OpenAI Service in IntelliJ

This article shows you how to get started with Azure OpenAI Service and use the chat models such as GPT-3.5-Turbo and GPT-4 to test and experiment with different parameters and data sources in IntelliJ IDEA. 



## Prerequisites

- A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/), Ultimate or Community Edition.
- The Azure Toolkit for IntelliJ. For more information, see [Install the Azure Toolkit for IntelliJ](install-toolkit.md). You'll also need to sign in to your Azure account for the Azure Toolkit for IntelliJ. For more information, see [Sign-in instructions for the Azure Toolkit for IntelliJ](sign-in-instructions.md).
- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true).
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true). Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI Service resource with either the `gpt-35-turbo` or the `gpt-4` models deployed. For more information about model deployment, see the [resource deployment guide](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

<!-- > [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=STUDIO&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Prerequisites) -->

## Install and sign-in

The following steps walk you through the Azure sign-in process in your IntelliJ development environment.

1. If you haven't installed the plugin, see [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053).

1. To sign in to your Azure account, navigate to the left-hand **Azure Explorer** sidebar, and then click the **Azure Sign In** icon. Alternatively, you can navigate to **Tools**, expand **Azure**, and then click **Azure Sign in**.

   :::image type="content" source="media/sign-in-instructions/I01.png" alt-text="Sign in to Azure on IntelliJ.":::

1. In the **Azure Sign In** window, select **OAuth 2.0**, and then click **Sign in**. For other sign-in options, see [Sign-in instructions for the Azure Toolkit for IntelliJ](sign-in-instructions.md).

1. In the browser, sign in with your account that have access to your OpenAI resource and then go back to IntelliJ. In the **Select Subscriptions** dialog box, click on the subscription that you want to use, then click **Select**.


## Provision an Azure OpenAI resource and deploy a model

> [!TIP]
> To experiment new capabilities in the Playground, you need to create Azure OpenAI Service resources first.

1. After the sign-in workflow, right click Azure OpenAI node in Azure Explorer and select "Create Azure OpenAI Service".
1. In the **Create Azure OpenAI Service** dialog box, specify the following information and click **OK**:

      * **Name**: The name of your resource. This will also be your custom domain name in your endpoint. Your resource name can only include alphanumeric characters and hyphens, and can't start or end with a hyphen.
      * **Region**: Select the Azure region that's right for you and your customers.
      * **Sku**: The resource offers different pricing tiers to fit your needs. The pricing tier you select determines how much you will be billed each month.

1. Right click the instance created, and choose "Create New Deployment".  In the pop-up **Create Azure OpenAI Deployment** dialog box, specify the following information and click **OK**:

      * **Deployment Name**: Give your deployment a memorable name to make it easier to find later. You’ll use this name to select the deployed model in Playground or to specify the deployment in your code. 
      * **Model**: Select a provided base model to try it out or choose a custom model that’s fine-tuned to your specific use case and data.

1. The toolkit will display a status message when the deployment is complete and ready for use.


## Playground

1. Right click the Azure OpenAI Service and select "Open in AI Playground".
1. You can start exploring OpenAI capabilities with a no-code approach through the Azure OpenAI Studio Chat playground in IntelliJ IDEA.


    :::image type="content" source="media/chatgpt-intelliJ/chat-playground-overview.png" alt-text="Chat playground overview.":::

## Interact with Azure OpenAI using prompts and settings

In the Playground, you can start testing your deployments with different prompts. To start a chat session, following the steps:

1. In the chat session pane, enter the following question: "I'm interested in buying a new Surface", and select **Send**.
1. You'll receive a response similar to:
    :::image type="content" source="media/chatgpt-intelliJ/surface1.png" alt-text="Screenshot of a first question and answer in playground.":::

1. Enter a follow-up question like: "which models support GPU?"

     :::image type="content" source="media/chatgpt-intelliJ/surface2.png" alt-text="Screenshot of a second question and answer in playground.":::

1. Now that you have a basic conversation select **View code** from the panel and you'll have a replay of the code behind the entire conversation so far. You can see the code samples for Java SDK, curl, and JSON that correspond to your chat session and settings. 

     :::image type="content" source="media/chatgpt-intelliJ/viewcode.png" alt-text="Screenshot of how to view code.":::

1. If you want to embed these code samples into your application, you can click the "Copy" to continue.

## Clean up resources

   > [!NOTE]
   > Once you're done testing out the Chat playground, if you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

1. To delete your Azure OpenAI resources, navigate to the left-hand **Azure Explorer** sidebar and locate the **Azure OpenAI** item.

1. Right-click the Azure OpenAI service you'd like to delete and click **Delete**.

1. To delete your resource group, visit the [Azure portal](https://portal.azure.com) and manually delete the resources under your subscription.


## Next steps

* Learn more about how to work with the new `gpt-35-turbo` model with the [GPT-35-Turbo & GPT-4 how-to guide](https://learn.microsoft.com/azure/ai-services/openai/how-to/chatgpt?tabs=python&pivots=programming-language-chat-completions)
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
