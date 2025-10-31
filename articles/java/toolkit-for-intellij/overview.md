---
title: Azure Toolkit for IntelliJ Overview
description: Learn about the Azure Toolkit for IntelliJ and its features for developing, configuring, testing, and deploying Java applications to Azure.
author: KarlErickson
ms.author: karler
ms.date: 10/24/2025
ms.topic: overview
ms.custom: devx-track-java
ai-usage: ai-assisted
---

# What is Azure Toolkit for IntelliJ?

The Azure Toolkit for IntelliJ enables you to easily develop, configure, test, and deploy highly available and scalable Java applications to Azure from IntelliJ on all supported platforms.

## Supported Azure services

The plugin supports the following Azure services:

- Azure App Service
- Azure Functions
- Azure Spring Apps
- Azure Kubernetes
- Azure Container Apps
- Azure Virtual Machines
- Azure Database for MySQL
- Azure Cosmos DB
- SQL Server
- Azure Storage
- Application Insights

The plugin also supports Azure Synapse data engineers, Azure HDInsight developers, and Apache Spark on SQL Server users to create, test, and submit Apache Spark/Hadoop jobs to Azure.

## AI integration

The toolkit provides integration with Azure OpenAI Service, enabling you to experiment with chat models directly from IntelliJ IDEA. For more information, see [What is Azure OpenAI Service](/azure/ai-services/openai/overview) and [Get started using GPT-35-Turbo and GPT-4 with Azure OpenAI Service in IntelliJ](chatgpt-intellij.md).

The plugin supports the Azure MCP Server, which adds smart, context-aware AI tools inside GitHub Copilot for IntelliJ IDEA to help you work more efficiently with Azure resources. The Azure MCP Server provides your agents with Azure context across all the popular Azure services. For more information, see [the Azure MCP Server documentation](/azure/developer/azure-mcp-server/overview).

> [!NOTE]
> The Azure MCP Server is available with the Azure Toolkit for IntelliJ and is automatically installed when you have GitHub Copilot for IntelliJ (version 1.5.50 or later) installed. If GitHub Copilot isn't installed, the Azure MCP Server isn't installed automatically when you install the plugin. GitHub Copilot for Azure isn't available for IntelliJ.

## Key features

The Azure Toolkit for IntelliJ provides the following features and workflows:

- **Azure Web App Workflow**: Run your web applications on Azure Web App and view logs.
- **Azure Functions Workflow**: Scaffold, run, debug your Functions App locally and deploy it on Azure.
- **Azure Spring Apps Workflow**: Run your Spring microservices applications on Azure Spring Apps and view logs.
- **Azure Container Apps Workflow**: Dockerize and run applications on Azure Container Apps and view logs.
- **Azure Kubernetes Support**: Create and manage your Kubernetes Services directly in Azure Explorer.
- **Getting Started Guide**: Follow the steps in the getting started guide to deploy an application within minutes.
- **Azure Explorer**: View and manage your cloud resources on Azure with the embedded Azure Explorer.
- **Azure Resource Management template**: Create and update your Azure resource deployments with ARM template support.
- **Azure Synapse**: List workspaces and Apache Spark Pools, compose an Apache Spark project, and author and submit Apache Spark jobs to Azure Synapse Spark pools.
- **Azure HDInsight**: Create an Apache Spark project and author and submit Apache Spark jobs to HDInsight clusters. Monitor and debug Apache Spark jobs easily. Support HDInsight ESP cluster MFA Authentication.
- **SQL Server Big Data Cluster**: Link to SQL Server Big Data Cluster. Create an Apache Spark project and author and submit Apache Spark jobs to the cluster. Monitor and debug Apache Spark jobs easily.

## See also

- [Install the Azure Toolkit for IntelliJ](install-toolkit.md)
- [Sign in to your Azure account](sign-in-instructions.md)
