---
title: Key Azure services for developers
description: An overview of important services that developers use when building solutions on Azure.
keywords: azure services
ms.service: azure
ms.topic: overview
ms.date: 07/29/2024
ms.custom: overview
---

# Key Azure services for developers

This is part two in a short series of 8 articles to help developers get started with Azure.

* Part 1: [Azure for developers overview](azure-developer-overview.md)
* **Part 2: Key Azure services for developers**
* Part 3: [Hosting applications on Azure](hosting-apps-on-azure.md)
* Part 4: [Connect your app to Azure services](connect-to-azure-services.md)
* Part 5: [How do I create and manage resources in Azure?](azure-developer-create-resources.md)
* Part 6: [Key concepts for building Azure apps](azure-developer-key-concepts.md)
* Part 7: [How am I billed?](azure-developer-billing.md)
* Part 8: [Versioning policy for Azure services, SDKs, and CLI tools](azure-service-sdk-tool-versioning.md)

This article introduces some of the key Azure services that are used most frequently as a developer. For a comprehensive list of all Azure services, see the [Azure documentation hub page](/azure/?product=featured#browse-azure-products).

## App hosting and compute

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/azure-app-service.png":::| [Azure App Service](/azure/app-service/) |Host .NET, Java, Node.js, and Python web applications and APIs in a fully managed Azure service.  You only need to deploy your code to Azure.  Azure takes care of all the infrastructure management like high availability, load balancing, and autoscaling.  |
|:::image type="icon" source="media/static-web-apps.png":::| [Azure Static Web Apps](/azure/static-web-apps/) |Host static web apps built using frameworks like Gatsby, Hugo, or VuePress, or modern web apps built using Angular, React, Svelte, or Vue.  Static web apps automatically build and deploy based off of code changes and feature API integration with Azure Functions.|
|:::image type="icon" source="media/azure-functions.png":::| [Azure Functions](/azure/azure-functions/) |A serverless compute platform for creating small, discrete segments of code that can be triggered from a variety of different events.  Common applications include building serverless APIs or orchestrating event-drive architectures.|
|:::image type="icon" source="media/azure-container-instances.png":::| [Azure Container Instances](/azure/container-instances/) |Run Docker containers on-demand in a managed, serverless Azure environment. Azure Container Instances is a solution for any scenario that can operate in isolated containers, without orchestration.|
|:::image type="icon" source="media/azure-kubernetes-service.png":::| [Azure Kubernetes Services](/azure/aks/) |Quickly deploy a production ready Kubernetes cluster to the cloud and offload the operational overhead to Azure. Azure handles critical tasks, like health monitoring and maintenance.  You only need to manage and maintain the agent nodes.|
|:::image type="icon" source="media/azure-spring-cloud.png":::| [Azure Spring Apps](/azure/spring-apps/) |Host Spring Boot microservice applications in Azure, no code changes required.  Azure Spring Apps provides monitoring, configuration management, service discovery, CI/CD integration and more.|
|:::image type="icon" source="media/azure-virtual-machines.png":::| [Azure Virtual Machines](/azure/virtual-machines/) |Host your app using virtual machines in Azure when you need more control over your computing environment. Azure VMs offer a flexible, scalable computing environment for both Linux and Windows virtual machines. |

## Azure AI services

[Azure AI services](/azure/ai-services/) help you create AI apps with pre-built and customizable APIs and models. Example applications include natural language processing for conversations, search, monitoring, translation, speech, vision, and decision-making.

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Service|Description|
|----|-------|-----------|
| :::image type="icon" source="media/azure-openai.png"::: | [Azure OpenAI](/azure/ai-services/openai/) | Use powerful language models including the GPT-3, Codex and Embeddings model series for content generation, summarization, semantic search, and natural language to code translation. |
| :::image type="icon" source="media/azure-speech.png"::: | [Azure AI Speech](/azure/ai-services/speech-service/) | Transcribe audible speech into readable, searchable text or convert text to lifelike speech for more natural interfaces. |
| :::image type="icon" source="media/language.png"::: | [Azure AI Language](/azure/ai-services/language-service) | Use natural language processing (NLP) to identify key phrases and conduct sentiment analysis from text. |
| :::image type="icon" source="media/text-translator.png"::: | [Azure AI Translator](/azure/ai-services/translator/) | Translate more than 100 languages and dialects. |
| :::image type="icon" source="media/computer-vision.png"::: | [Azure AI Vision](/azure/ai-services/computer-vision/) | Analyze content in images and video. |
| :::image type="icon" source="media/search.png"::: | [Azure AI Search](/azure/search) | Information retrieval at scale for traditional and conversational search applications, with security and options for AI enrichment and vectorization. |
| :::image type="icon" source="media/document-intelligence.png"::: | [Azure AI Document Intelligence](/azure/ai-services/document-intelligence) | Document extraction service that understands your forms allowing you to quickly extract text and structure from documents. |

## Data

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/azure-sql.png":::| [Azure SQL](/azure/azure-sql/) | A family of SQL Server database engine products in the cloud.|
|:::image type="icon" source="media/azure-sql-database.png":::| [Azure SQL Database](/azure/azure-sql/database/) |A fully managed, cloud-based version of SQL Server.|
|:::image type="icon" source="media/azure-cosmos-db.png":::| [Azure Cosmos DB](/azure/cosmos-db/) |A fully managed, cloud-based NoSQL database.  Azure Cosmos DB features multiple APIs, including APIs compatible [MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), [Cassandra](/azure/cosmos-db/cassandra/cassandra-introduction) and [Gremlin](/azure/cosmos-db/graph/gremlin-support).|
|:::image type="icon" source="media/azure-postgresql.png":::| [Azure Database for PostgreSQL](/azure/postgresql/) |A fully managed, cloud-based PostgreSQL database service based on PostgreSQL Community Edition. |
|:::image type="icon" source="media/azure-mysql.png":::| [Azure Database for MySQL](/azure/mysql/) |A fully managed, cloud-based MySQL database service based in the MySQL Community Edition. |
|:::image type="icon" source="media/azure-mariadb.png":::| [Azure Database for MariaDB](/azure/mariadb/) |A fully managed, cloud-based MariaDB database service based on the MariaDB community edition. |
|:::image type="icon" source="media/cache-redis.png":::| [Azure Cache for Redis](/azure/azure-cache-for-redis/) |A secure data cache and messaging broker that provides high throughput and low-latency access to data for applications.|

## Storage

[Azure Storage](/azure/storage/) products offer secure and scalable cloud and hybrid data storage services. Offerings include services for hybrid storage solutions, and services to transfer, share, and back up data.

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/azure-storage-accounts.png":::| [Azure Blob Storage](/azure/storage/blobs/) |Azure Blob Storage allows your applications to store and retrieve files in the cloud. Azure Storage is highly scalable to store massive amounts of data and data is stored redundantly to ensure high availability.|
|:::image type="icon" source="media/azure-storage-accounts.png":::| [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) |Azure Data Lake Storage is designed to support big data analytics by providing scalable, cost-effective storage for structured, semi-structured or unstructured data.|

## Messaging

These are some of the most popular services that manage sending, receiving, and routing of messages from and to apps.

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/azure-service-bus.png":::| [Azure Service Bus](/azure/service-bus-messaging/) |A fully managed enterprise message broker supporting both point to point and publish-subscribe integrations. It's ideal for building decoupled applications, queue-based load leveling, or facilitating communication between microservices.|
|:::image type="icon" source="media/event-hubs.png":::| [Azure Event Hubs](/azure/event-hubs/) |Azure Event Hubs is a managed service that can ingest and process massive data streams from websites, apps, or devices.|
|:::image type="icon" source="media/azure-storage-queues.png":::| [Azure Queue Storage](/azure/storage/queues/) |A simple and reliable queue that can handle large workloads.|

## Identity and security

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/active-directory.png":::| [Microsoft Entra ID](/entra/identity/) |Manage user identities and control access to your apps, data, and resources.|
|:::image type="icon" source="media/azure-key-vault.png":::| [Azure Key Vault](/azure/key-vault/) |Store and access application secrets like connection strings and API keys in an encrypted vault with restricted access to make sure your secrets and your application aren't compromised.|
|:::image type="icon" source="media/app-configuration.png":::| [App Configuration](/azure/azure-app-configuration/) |A fast and scalable service to centrally manage application settings and feature flags.|

## Management

|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Service|Description|
|----|-------|-----------|
|:::image type="icon" source="media/monitor.png":::| [Azure Monitor](/azure/azure-monitor/) |A comprehensive monitoring solution for collecting, analyzing, and responding to monitoring data from your cloud and on-premises environments.|
|:::image type="icon" source="media/application-insights.png":::| [Application Insights](/azure/azure-monitor/app/app-insights-overview) |This feature of Azure Monitor provides Application Performance Management (APM) for enhancing the performance, reliability, and quality of your live web applications.|

> [!div class="nextstepaction"]
> [Continue to part 3: Hosting applications on Azure](hosting-apps-on-azure.md)
