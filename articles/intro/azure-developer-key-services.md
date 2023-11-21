---
title: Key Azure services for developers
description: An overview of important services that developers use when building solutions on Azure.
keywords: azure services
ms.service: azure
ms.topic: overview
ms.date: 11/20/2023
ms.custom: overview
---

# Key Azure services for developers

While Azure contains over 100 services, this article outlines the Azure services you'll use most frequently as a developer. For a comprehensive list of all Azure services, see the [Azure documentation hub page](/azure/?product=featured#browse-azure-products).

## App hosting and compute

|&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/azure-app-service.png":::| [Azure App Service](/azure/app-service/) |Host .NET, Java, Node.js, and Python web applications and APIs in a fully managed Azure service.  You only need to deploy your code to Azure.  Azure takes care of all the infrastructure management like high availability, load balancing, and autoscaling.  |
|:::image type="icon" source="media/static-web-apps.png":::| [Azure Static Web Apps](/azure/static-web-apps/) |Host static web apps built using frameworks like Gatsby, Hugo, or VuePress, or modern web apps built using Angular, React, Svelte, or Vue.  Static web apps automatically build and deploy based off of code changes and feature API integration with Azure Functions.|
|:::image type="icon" source="media/azure-functions.png":::| [Azure Functions](/azure/azure-functions/) |A serverless compute platform for creating small, discrete segments of code that can be triggered from a variety of different events.  Common applications include building serverless APIs or orchestrating event-drive architectures.|
|:::image type="icon" source="media/azure-container-instances.png":::| [Azure Container Instances](/azure/container-instances/) |Run Docker containers on-demand in a managed, serverless Azure environment. Azure Container Instances is a solution for any scenario that can operate in isolated containers, without orchestration.|
|:::image type="icon" source="media/azure-kubernetes-service.png":::| [Azure Kubernetes Services](/azure/aks/) |Quickly deploy a production ready Kubernetes cluster to the cloud and offload the operational overhead to Azure. Azure handles critical tasks, like health monitoring and maintenance.  You only need to manage and maintain the agent nodes.|
|:::image type="icon" source="media/azure-spring-cloud.png":::| [Azure Spring Apps](/azure/spring-apps/) |Host Spring Boot microservice applications in Azure, no code changes required.  Azure Spring Apps provides monitoring, configuration management, service discovery, CI/CD integration and more.|
|:::image type="icon" source="media/azure-virtual-machines.png":::| [Azure Virtual Machines](/azure/virtual-machines/) |Host your app using virtual machines in Azure when you need more control over your computing environment. Azure VMs offer a flexible, scalable computing environment for both Linux and Windows virtual machines. |

## Azure AI services

[Azure AI services](/azure/ai-services/) help you create intelligent, applications with pre-built and customizable APIs and models. Example applications include natural language processing for conversations, search, monitoring, translation, speech, vision, and decision-making.

|&nbsp;|Service|Description|
|----|-------|-----------|
| :::image type="icon" source="media/azure-openai.png"::: | [Azure OpenAI](/azure/ai-services/openai/) | Use powerful language models including the GPT-3, Codex and Embeddings model series for content generation, summarization, semantic search, and natural language to code translation. |
| :::image type="icon" source="media/speech.png"::: | [Azure AI Speech](/azure/ai-services/speech-service/) | Transcribe audible speech into readable, searchable text or convert text to lifelike speech for more natural interfaces. |
| :::image type="icon" source="media/language.png"::: | [Azure AI Language](/azure/ai-services/language-service) | Use natural language processing (NLP) to identify key phrases and conduct sentiment analysis from text. |
| :::image type="icon" source="media/translator.png"::: | [Azure AI Translator](/azure/ai-services/translator/) | Translate more than 100 languages and dialects. |
| :::image type="icon" source="media/vision.png"::: | [Azure AI Vision](/azure/ai-services/computer-vision/) | Analyze content in images and video. |
| :::image type="icon" source="media/search.png"::: | [Azure AI Search](/azure/search) | Information retrieval at scale for traditional and conversational search applications, with security and options for AI enrichment and vectorization. |
| :::image type="icon" source="media/document-intelligence.png"::: | [Azure AI Document Intelligence](/azure/ai-services/document-intelligence) | Document extraction service that understands your forms allowing you to quickly extract text and structure from documents. |

## Data

|&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/azure-sql.png":::| [Azure SQL](/azure/azure-sql/database/) |A fully managed, cloud-based version of SQL Server.|
|:::image type="icon" source="media/azure-cosmos-db.png":::| [Azure Cosmos DB](/azure/cosmos-db/) |A fully managed, cloud-based NoSQL database.  Azure Cosmos DB features multiple APIs, including APIs compatible [MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), [Cassandra](/azure/cosmos-db/cassandra/cassandra-introduction) and [Gremlin](/azure/cosmos-db/graph/gremlin-support).|
|:::image type="icon" source="media/azure-postgresql.png":::| [Azure Database for PostgreSQL](/azure/postgresql/) |A fully managed, cloud-based PostgreSQL database service based on PostgreSQL Community Edition. |
|:::image type="icon" source="media/azure-mysql.png":::| [Azure Database for MySQL](/azure/mysql/) |A fully managed, cloud-based MySQL database service based in the MySQL Community Edition. |
|:::image type="icon" source="media/azure-mariadb.png":::| [Azure Database for MariaDB](/azure/mariadb/) |A fully managed, cloud-based MariaDB database service based on the MariaDB community edition. |

## Storage

Azure Blob Storage is a popular service that manages the storage, retrieval, and security of non-structured BLOB data.

|&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/azure-storage-accounts.png":::| [Azure Blob Storage](/azure/storage/blobs/) |Azure Blob Storage allows your applications to store and retrieve files in the cloud. Azure Storage is highly scalable to store massive amounts of data and data is stored redundantly to ensure high availability.|
|:::image type="icon" source="media/azure-data-lake-storage.png":::| [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) |Azure Data Lake Storage is designed to support big data analytics by providing scalable, cost-effective storage for structured, semi-structured or unstructured data.|

## Messaging

Here's a list of the most popular services that manage sending, receiving, and routing of messages from and to apps.

|&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/azure-service-bus.png":::| [Azure Service Bus](/azure/service-bus-messaging/) |A fully managed enterprise message broker supporting both point to point and publish-subscribe integrations. It's ideal for building decoupled applications, queue-based load leveling, or facilitating communication between microservices.|
|:::image type="icon" source="media/event-hubs.png":::| [Azure Event Hubs](/azure/event-hubs/) |Azure Event Hubs is a managed service that can ingest and process massive data streams from websites, apps, or devices.|
|:::image type="icon" source="media/azure-storage-queues.png":::| [Azure Queue Storage](/azure/storage/queues/) |A simple and reliable queue that can handle large workloads.|

## Other

And finally, here's a list of popular services that support a wide range of workflows, methodologies, functionalities, and industries.

|&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/azure-key-vault.png":::| [Azure Key Vault](/azure/key-vault/) |Every application has application secrets like connection strings and API keys it must store. Azure Key Vault helps you store and access those secrets securely, in an encrypted vault with restricted access to make sure your secrets and your application aren't compromised.|
|:::image type="icon" source="media/application-insights.png":::| [Application Insights](/azure/azure-monitor/app/app-insights-overview) |A comprehensive solution for application monitoring, alerting, and log analysis for your applications.|
