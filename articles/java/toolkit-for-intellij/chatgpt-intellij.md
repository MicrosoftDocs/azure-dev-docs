---
title: "Quickstart: Get started using GPT-35-Turbo and GPT-4 with Azure OpenAI Service using IntelliJ"
description: Shows you how to get started with Azure OpenAI Service and make your first chat completions call with IntelliJ IDEA.
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jialuogan
ms.topic: quickstart
ms.date: 01/26/2024
ms.collection: ce-skilling-ai-copilot
---

# Quickstart: Get started using GPT-35-Turbo and GPT-4 with Azure OpenAI Service in IntelliJ

This article shows you how to get started with Azure OpenAI Service in IntelliJ IDEA. It shows you how to use chat models such as GPT-3.5-Turbo and GPT-4 to test and experiment with different parameters and data sources.

## Prerequisites

- A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/), Ultimate or Community Edition.
- The Azure Toolkit for IntelliJ. For more information, see [Install the Azure Toolkit for IntelliJ](install-toolkit.md). You also need to sign in to your Azure account for the Azure Toolkit for IntelliJ. For more information, see [Sign-in instructions for the Azure Toolkit for IntelliJ](sign-in-instructions.md).
- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true).
- Access granted to Azure OpenAI in the desired Azure subscription.

  Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at [Request Access to Azure OpenAI Service](https://aka.ms/oai/access?azure-portal=true).

- An Azure OpenAI Service resource with either the `gpt-35-turbo` or the `gpt-4` models deployed. For more information about model deployment, see [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource).

## Install and sign-in

The following steps walk you through the Azure sign-in process in your IntelliJ development environment:

1. If you don't have the plugin installed, see [Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053).

1. To sign in to your Azure account, navigate to the left-hand **Azure Explorer** sidebar, and then select the **Azure Sign In** icon. Alternatively, you can navigate to **Tools**, expand **Azure**, and then select **Azure Sign in**.

   :::image type="content" source="media/sign-in-instructions/I01.png" alt-text="Screenshot of the IntelliJ IDEA with the Azure Sign In button highlighted." lightbox="media/sign-in-instructions/I01.png":::

1. In the **Azure Sign In** window, select **OAuth 2.0**, and then select **Sign in**. For other sign-in options, see [Sign-in instructions for the Azure Toolkit for IntelliJ](sign-in-instructions.md).

1. In the browser, sign in with your account that has access to your OpenAI resource and then go back to IntelliJ. In the **Select Subscriptions** dialog box, select the subscription that you want to use, then select **Select**.

## Create and deploy an Azure OpenAI Service resource

1. After the sign-in workflow, right-click the Azure OpenAI item in Azure Explorer and select **Create Azure OpenAI Service**.
1. In the **Create Azure OpenAI Service** dialog box, specify the following information and then select **OK**:

   - **Name**: A descriptive name for your Azure OpenAI Service resource, such as **MyOpenAIResource**. This name is also your custom domain name in your endpoint. Your resource name can only include alphanumeric characters and hyphens, and can't start or end with a hyphen.
   - **Region**: The location of your instance. Certain models are only available in specific regions. For more information, see [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models).
   - **Sku**: Standard Azure OpenAI resources are billed based on token usage. For more information, see [Azure OpenAI Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/).

1. Before you can use chat completions, you need to deploy a model. Right-click your Azure OpenAI instance, and select **Create New Deployment**. In the pop-up **Create Azure OpenAI Deployment** dialog box, specify the following information and then select **OK**:

   - **Deployment Name**: Choose a name carefully. The deployment name is used in your code to call the model by using the client libraries and the REST APIs.
   - **Model**: Select a model. Model availability varies by region. For a list of available models per region, see the [Model summary table and region availability](/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability) section of [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models).

The toolkit displays a status message when the deployment is complete and ready for use.

## Interact with Azure OpenAI using prompts and settings

1. Right-click your Azure OpenAI resource and then select **Open in AI Playground**.
1. You can start exploring OpenAI capabilities through the Azure OpenAI Studio Chat playground in IntelliJ IDEA.

   :::image type="content" source="media/chatgpt-intellij/chat-playground-overview.png" alt-text="Screenshot of the IntelliJ IDEA that shows the Chat playground overview window." lightbox="media/chatgpt-intellij/chat-playground-overview.png":::

To trigger the completion, you can input some text as a prompt. The model generates the completion and attempts to match your context or pattern.

To start a chat session, follow these steps:

1. In the chat session pane, you can start with a simple prompt like this one: "I'm interested in buying a new Surface." After you type the prompt, select **Send**. You receive a response similar to the following example:

   ```output
   Great! Which Surface model are you interested in? There are several options available such as the Surface Pro, Surface Laptop, Surface Book, Surface Go, and Surface Studio. Each one has its own unique features and specifications, so it's important to choose the one that best fits your needs.
   ```

   :::image type="content" source="media/chatgpt-intellij/surface-chat.png" alt-text="Screenshot of the IntelliJ IDEA that shows the playground window with a first question and answer." lightbox="media/chatgpt-intellij/surface-chat.png":::

1. Enter a follow-up question like: "Which models support GPU?" and select **Send**. You receive a response similar to the following example:

   ```output
   Most Surface models come with an integrated GPU (Graphics Processing Unit), which is sufficient for basic graphics tasks such as video playback and casual gaming. However, if you're looking for more powerful graphics performance, the Surface Book 3 and the Surface Studio 2 come with dedicated GPUs. The Surface Book 3 has an NVIDIA GeForce GTX GPU, while the Surface Studio 2 has an NVIDIA GeForce GTX 1060 or 1070 GPU, depending on the configuration.
   ```

   :::image type="content" source="media/chatgpt-intelliJ/surface-chat-more.png" alt-text="Screenshot of the IntelliJ IDEA that shows the playground window with a first and second question and answer." lightbox="media/chatgpt-intelliJ/surface-chat-more.png":::

1. Now that you have a basic conversation, select **View code** from the pane, and you have a replay of the code behind the entire conversation so far. You can see the code samples based on Java SDK, curl, and JSON that correspond to your chat session and settings, as shown in the following screenshot:

   :::image type="content" source="media/chatgpt-intelliJ/view-code.png" alt-text="Screenshot of the IntelliJ IDEA that shows the Sample Code window." lightbox="media/chatgpt-intelliJ/view-code.png":::

1. You can then select **Copy** to take this code and write an application to complete the same task you're currently performing with the playground.

## Settings

You can select the **Configuration** tab to set the following parameters:

| Name              | Description                                                                                                                                                                                                                                                                                                                   |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Max response      | Sets a limit on the number of tokens per model response. The API supports a maximum of 4096 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly four characters for typical English text.                                   |
| Temperature       | Controls randomness. Lowering the temperature means that the model produces more repetitive and deterministic responses. Increasing the temperature results in more unexpected or creative responses. Try adjusting temperature or Top probabilities, but not both.                                                           |
| Top probabilities | Similar to temperature, controls randomness but uses a different method. Lowering the Top probabilities value narrows the model's token selection to likelier tokens. Increasing the value lets the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top probabilities, but not both. |
| Stop sequences    | Makes the model end its response at a desired point. The model response ends before the specified sequence, so it doesn't contain the stop sequence text. For GPT-35-Turbo, using `<|im_end|>` ensures that the model response doesn't generate a follow-up user query. You can include as many as four stop sequences.       |
| Frequency penalty | Reduces the chance of repeating a token proportionally based on how often it appears in the text so far. This action decreases the likelihood of repeating the exact same text in a response.                                                                                                                                 |
| Presence penalty  | Reduces the chance of repeating any token that appears in the text at all so far. This increases the likelihood of introducing new topics in a response.                                                                                                                                                                      |

## Clean up resources

After you're done testing out the chat playground, if you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Use the following steps to clean up resources:

1. To delete your Azure OpenAI resources, navigate to the left-hand **Azure Explorer** sidebar and locate the **Azure OpenAI** item.

1. Right-click the Azure OpenAI service you'd like to delete and then select **Delete**.

1. To delete your resource group, visit the [Azure portal](https://portal.azure.com) and manually delete the resources under your subscription.

## Next steps

For more information, see [Learn how to work with the GPT-35-Turbo and GPT-4 models](/azure/ai-services/openai/how-to/chatgpt?pivots=programming-language-chat-completions).

For more examples, check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure-Samples/openai).
