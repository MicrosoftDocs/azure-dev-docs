---
title: "Get started with chat private endpoints"
description: ""
ms.date: 06/03/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai, devx-track-extended-azdevcli, build-2024-intelligent-apps
# CustomerIntent: As a python developer new to Azure, I want to deploy a chat app with private access so that I understand how to secure my chat app endpoint.
---

# Get started with chat private endpoints for Python

This article shows you how to deploy and run the [Enterprise chat app sample for Python](https://github.com/Azure-Samples/azure-search-openai-demo). This sample implements a chat app using Python, Azure OpenAI Service, and [Retrieval Augmented Generation (RAG)](/azure/search/retrieval-augmented-generation-overview) in Azure AI Search to get answers about employee benefits at a fictitious company. The app is seeded with PDF files including the employee handbook, a benefits document and a list of company roles and expectations. 

By following the instructions in this article, you will:

- Deploy a chat app to Azure for public access in a web browser.
- Configure private endpoints.
- Redeploy chat app with private endpoints.
- Access chat app through a VM with Bastion.

Once you complete this procedure, you can start modifying the new project with your custom code and redeploy, knowing your chat app is accessible only through the private VM with a private endpoint.

## Architectural overview

:::image type="content" source="media/get-started-app-chat=private-endpoints/diagram-azure-bastion-private-endpoint.png" alt-text="Diagram showing network architecuture using Azure Bastion to connect to private virtual machines using the Azure portal.":::

## Prerequisites

#### [Codespaces (recommended)](#tab/github-codespaces)

#### [Visual Studio Code](#tab/visual-studio-code)

---

## Open development environment

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)


#### [Visual Studio Code](#tab/visual-studio-code)


---

## Set environment variables

## Deploy chat app to Azure with public access

## Use public chat app

## Configure private access

## Deploy chat app to Azure with private access

## Use private chat app