---
title: "AI Chat: JavaScript frontend + Python backend"
description: Steps to integrate the JavaScript frontend with the Python backend in the enterprise Azure OpenAI Chat App.
ms.date: 05/17/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-js, devx-track-python, devx-track-js-ai, devx-track-python-ai, build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As a multilanguage developer new to Azure OpenAI, I want use the JavaScript frontend with a different language backend from the reference templates.
---

# Update the Chat app to use the JavaScript frontend with the Python backend

The Chat app is a reference application that demonstrates how to use the Azure OpenAI service. Each programming language reference architecture provides slightly different functionality. This article describes how to use the JavaScript frontend with the Python backend.

By mixing and matching the frontend and backend, you can create a multilanguage application that uses the best of both worlds. 

* [Demo](https://aka.ms/azai/js.py/video) - Configure JavaScript frontend with Python backend video

This article is part of a collection of articles that show you how to build a chat app using Azure OpenAI Service and Azure AI Search. Other articles in the collection include: 

* [.NET](/dotnet/ai/get-started-app-chat-template)
* [Java](../java/quickstarts/get-started-app-chat-template.md)
* [Python](../python/get-started-app-chat-template.md)

> [!NOTE]
> This article uses one or more [AI app templates](../ai/intelligent-app-templates.md) as the basis for the examples and guidance in the article. AI app templates provide you with well-maintained, easy to deploy reference implementations that help to ensure a high-quality starting point for your AI apps.

## Prerequisites

Deploy the 2 reference architectures using the following articles. Make sure to use the same subscription and region for both deployments. The deployment may take up to 20 minutes. Leave the deployments up; don't complete the _Clean up resources_ section until you're done with this article.

* Deploy the JavaScript chat app using this [article](/azure/developer/javascript/get-started-app-chat-template)
* Deploy the Python chat app using this [article](/azure/developer/python/get-started-app-chat-template)

## Get the URLs for the frontend and backend

After deploying the two reference architectures, you have two full-stack apps deployed. To use the JavaScript frontend with the Python backend, you need to get the URLs for the JS frontend and the PY backend and configure them in the other app.

You should have each repo in a separate development environment, either locally on in Codespaces.

### Set JavaScript front-end URL in Python backend

1. In the JavaScript development environment, get the URL for the JavaScript frontend by running the following command:

    ```bash
    azd env get-values | grep WEBAPP_URI
    ```

    This command gets all the cloud environment variables and filters for the `WEBAPP_URI` variable. Make sure the URL doesn't end with a slash, `/`.

1. Copy the URL.
1. In the Python development environment, set the URL for the JavaScript frontend by running the following command:

    ```bash
    azd env set ALLOWED_ORIGIN <FRONTEND-URL>
    ```

1. In the Python development environment, redeploy the Python backend by running the following command:

    ```bash
    azd up
    ```
### Set Python backend URL in JavaScript frontend

1. In the Python development environment, get the URL for the Python backend by running the following command:

    ```bash
    azd env get-values | grep BACKEND_URI
    ```
    
    This command gets all the cloud environment variables and filters for the `BACKEND_URI` variable. Make sure the URL doesn't end with a slash, `/`.

1. Copy the URL.
1. In the JavaScript development environment, set the URL for the Python backend by running the following command:

    ```bash
    azd env set BACKEND_URI <BACKEND_URI>
    ```

1. In the Python development environment, redeploy the Python backend by running the following command in the Python development environment:

    ```bash
    azd up
    ```

## Use the JavaScript frontend with the Python backend

The Python app uses an HR benefits subject area while the JavaScript app uses a real estate subject area. Now that the apps are connected, you can use the front-end to ask about HR benefits. Suggested questions include: 

* What is included in my Northwind Health Plus plan that isn't standard? 
* What happens in a performance review? 
* What does a Product Manager do? 

## Clean up resources

When you're done with the apps, you can delete the resources to avoid incurring more charges.

* Delete the JavaScript app with [these instructions](/azure/developer/javascript/get-started-app-chat-template#clean-up-resources)
* Delete the Python app with [these instructions](/azure/developer/python/get-started-app-chat-template#clean-up-resources)

## Troubleshooting

* If you get an error, review the URLs you entered in the environment. Make sure they don't end with a slash, `/`.

## Next steps

* [Build a chat app with Azure OpenAI](https://aka.ms/azai/chat) best practice solution architecture
* [Access control in Generative AI Apps with Azure AI Search](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408)
* [Build an Enterprise ready OpenAI solution with Azure API Management](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-an-enterprise-ready-azure-openai-solution-with-azure-api/bc-p/3935407)
* [Outperforming vector search with hybrid retrieval and ranking capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167)
