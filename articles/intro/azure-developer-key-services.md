---
title: Key Azure services for developers
description: An overview of important services that developers use when building solutions on Azure.
keywords: azure billing, azure portal
ms.prod: azure
ms.topic: overview
ms.date: 09/16/2021
ms.custom: overview
---

# Key Azure services for developers

While Azure contains over 100 services, this article outlines the Azure services you will use most frequently as a developer.

For a comprehensive list of all Azure services, see the [Azure documentation hub page](/azure/?product=featured#browse-azure-products).

## App hosting and compute

|Icon|Service|Description|
|----|-------|-----------|
|![Azure App Service logo](media/azure-app-service.png)| [Azure App Service](/azure/app-service/) |Host .NET, Java, Node.js, and Python web applications and APIs in a fully-managed Azure service.  You only need to deploy your code to Azure.  Azure takes care of all the infrastructure management like high availability, load balancing, and autoscaling.  |
|![Azure Static Web Apps Logo](media/static-web-apps.png)| [Azure Static Web Apps](/azure/static-web-apps/) |Host static web apps built using frameworks like Gatsby, Hugo, or VuePress, or modern web apps built using Angular, React, Svelte, or Vue.  Static web apps automatically build and deploy based off of code changes and feature API integration with Azure Functions.|
|![Azure Functions logo](media/azure-functions.png)| [Azure Functions](/azure/azure-functions/) |A serverless compute platform for creating small, discrete segments of code that can be triggered from a variety of different events.  Common applications include building serverless APIs or orchestrating event-drive architectures.|
|![Azure Container Instances logo](media/azure-container-instances.png)| [Azure Container Instances](/azure/container-instances/) |Run Docker containers on-demand in a managed, serverless Azure environment. Azure Container Instances is a solution for any scenario that can operate in isolated containers, without orchestration.|
|![Azure Kubernetes Services logo](media/azure-kubernetes-service.png)| [Azure Kubernetes Services](/azure/aks/) |Quickly deploy a production ready Kubernetes cluster to the cloud and offload the operational overhead to Azure. Azure handles critical tasks, like health monitoring and maintenance.  You only need to manage and maintain the agent nodes.|
|![Azure Spring Cloud logo](media/azure-spring-cloud.png)| [Azure Spring Cloud](/azure/spring-cloud/) |Host Spring Boot microservice applications in Azure, no code changes required.  Azure Spring Cloud provides monitoring, configuration management, service discovery, CI/CD integration and more.|
|![Azure Virtual Machines logo](media/azure-virtual-machines.png)| [Azure Virtual Machines](/azure/virtual-machines/) |Host your app using virtual machines in Azure when you need more control over your computing environment. Azure VMs offer a flexible, scalable computing environment for both Linux and Windows virtual machines. |

## Data

|Icon|Service|Description|
|----|-------|-----------|
|![Azure SQL logo](media/azure-sql.png)| [Azure SQL](/azure/azure-sql/database/) |A fully managed, cloud-based version of SQL Server.|
|![Azure Cosmos DB logo](media/azure-cosmos-db.png)| [Azure Cosmos DB](/azure/cosmos-db/) |A fully managed, cloud-based NoSQL database.  Azure Cosmos DB features multiple APIs, including APIs compatible [MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction), [Cassandra](/cosmos-db/cassandra/cassandra-introduction) and [Gremlin](/azure/cosmos-db/graph/gremlin-support).|
|![Azure Database for PostgreSQL logo](media/azure-postgresql.png)| [Azure Database for PostgreSQL](/azure/postgresql/) |A fully managed, cloud-based PostreSQL database service based on PostgreSQL Community Edition. |
|![Azure Database for MySQL logo](media/azure-mysql.png)| [Azure Database for MySQL](/azure/mysql/) |A fully managed, cloud-based MySQL database service based in the MySQL Community Edition. |
|![Azure Database for MariaDB logo](media/azure-mariadb.png)| [Azure Database for MariaDB](/azure/mariadb/) |A fully managed, cloud-based MariaDB database service based on the MariaDB community edition. |

## Storage

Azure Blob Storage is a popular service that manages the storage, retrieval, and security of non-structured BLOB data.

|Icon|Service|Description|
|----|-------|-----------|
|![Azure Blob Storage logo](media/azure-storage-accounts.png)| [Azure Blob Storage](/azure/storage/blobs/) |Azure Blob Storage allows your applications to store and retrieve files in the cloud. Azure Storage is highly scalable to store massive amounts of data and data is stored redundantly to ensure high availability.|
|![Azure Data Lake Storage logo](media/azure-data-lake-storage.png)| [Azure Data Lake Storage](/azure/storage/blobs/data-lake-storage-introduction) |Azure Data Lake Storage is designed to support big data analytics by providing scalable, cost-effective storage for structured, semi-structured or unstructured data.|

## Messaging

Here's a list of the most popular services that manage sending, receiving, and routing of messages from and to apps.

|Icon|Service|Description|
|----|-------|-----------|
|![Azure Service Bus logo](media/azure-service-bus.png)| [Azure Service Bus](/azure/service-bus-messaging/) |A fully managed enterprise message broker supporting both point to point and publish-subscribe integrations. It is ideal for building decoupled applications, queue-based load leveling, or facilitating communication between microservices.|
|![Azure Event Hubs logo](media/event-hubs.png)| [Azure Event Hubs](/azure/event-hubs/) |Azure Event Hubs is a managed service that can ingest and process massive data streams from websites, apps, or devices.|
|![Azure Queue Storage logo](media/azure-storage-queues.png)| [Azure Queue Storage](/azure/storage/queues/) |A simple and reliable queue that can handle large workloads.|

## Cognitive Services

Azure Cognitive Services is a collection of cloud-based services that allow you to add AI-based capabilities to your application. Here's a list of popular Cognitive Services.

|Icon|Service|Description|
|----|-------|-----------|
|![Speech logo](media/azure-speech.png)| [Speech](/azure/cognitive-services/speech-service/) |Transcribe audible speech into readable, searchable text or convert text to lifelike speech for more natural interfaces.|
|![Form Recognizer logo](media/form-recognizer.png)| [Form Recognizer](/azure/applied-ai-services/form-recognizer/) |Document extraction service that understands your forms allowing you to quickly extract text and structure from documents.|
|![Text Analysis logo](media/text-analytics.png)| [Cognitive Service for Language](/azure/cognitive-services/language-service/) |Use natural language processing (NLP) to identify key phrases and conduct sentiment analysis from text.|
|![QnA Maker logo](media/qna-maker.png)| [QnA Maker](/azure/cognitive-services/qnamaker/) |Build a chat bot experience by distilling information into easy-to-navigate questions and answers.|
|![Translator logo](media/text-translator.png)| [Translator](/azure/cognitive-services/translator/) |Translate more than 100 languages and dialects.|
|![Computer Vision logo](media/computer-vision.png)| [Computer Vision](/azure/cognitive-services/computer-vision/) |Analyze content in images and video.|
|![Anomaly Detector logo](media/anomaly-detector.png)| [Anomaly Detector](/azure/cognitive-services/anomaly-detector/) |Identify potential problems early on.|
|![Personalizer logo](media/personalizer.png)| [Personalizer](/azure/cognitive-services/personalizer/) |Create rich, personalized experiences for every user.|

## Other

And finally, here's a list of popular services that support a wide range of workflows, methodologies, functionalities, and industries.

|Icon|Service|Description|
|----|-------|-----------|
|![Azure Key Vault logo](media/azure-key-vault.png)| [Azure Key Vault](/azure/key-vault/) |Every application has application secrets like connection strings and API keys it must store. Azure Key Vault helps you store and access those secrets securely, in an encrypted vault with restricted access to make sure your secrets and your application are not compromised.|
|![Application Insights Logo](media/application-insights.png)| [Application Insights](/azure/azure-monitor/app/app-insights-overview) |A comprehensive solution for application monitoring, alerting, and log analysis for your applications.|
