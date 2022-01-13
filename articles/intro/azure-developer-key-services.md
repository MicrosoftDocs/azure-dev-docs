---
title: Key Azure services for developers
description: An overview of important services that developers use when building solutions on Azure.
keywords: azure billing, azure portal
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
|![Azure App Service logo](media/app-services.png)|**Azure App Service**|Azure App Service is a fully managed platform for hosting web applications and APIs in Azure. It features automatic load balancing and autoscaling in a highly available environment. You pay only for the compute resources you use and free tiers are available.|
|![Azure Functions logo](media/functions.png)|**Azure Functions**|Azure Functions is a serverless compute service that lets you write small, discrete segments of code that can be executed in a scalable and cost-effective manner, all without managing any servers or runtimes. Functions can be invoked by a variety of different events and easily integrate with other Azure services by using input and output bindings.|


|![Azure Container Instances logo](media/container-instances.png)|**Azure Container Instances**|Azure Container Instances is one of several containerization services available.  Azure Container Instances allow you to simple deploy your application in a container to the cloud.|
|![Azure Kubernetes Services logo](media/aks.png)|**Azure Kubernetes Services**|Azure Kubernetes Services (AKS) is a fully managed version of Kubernetes. It simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure.|

## Data

|Icon|Service|Description|
|----|-------|-----------|
|![Azure SQL logo](media/sql-database.png)|**Azure SQL**|Azure SQL is a fully managed cloud-based version of SQL Server. Azure automatically performs traditional administrative tasks like patching and backups for you and features built-in high availability.|
|![Azure Cosmos DB logo](media/cosmosdb.png)|**Azure Cosmos DB**|Azure Cosmos DB is a fully managed NoSQL database with single digit millisecond response times, automatic scaling, high-availability, and automatic backups.  Cosmos DB offers multiple APIs, including SQL, MongoDB, Cassandra and Gremlin .|
|![Azure Database for PostgreSQL logo](media/postgresql.png)|**Azure Database for PostgreSQL**|A fully managed PostreSQL database service based on PostgrSQL Community Edition.  Azure Database for PostgreSQL features built-in high availability, automatic backups, predictable performance, and elastic scaling within seconds.|
|![Azure Database for MySQL logo](media/mysql.png)|**Azure Database for MySQL**|A fully managed MySQL database service based in the MySQL Community Edition.  Azure Database for MySQL delivers zone redundancy and same zone high availability, automatic backups, predictable performance, and elastic scaling within seconds, all with almost no administration required.|
|![Azure Database for MariaDB logo](media/mariadb.png)|**Azure Database for MariaDB**|A fully managed MariaDB database service based on the MariaDB community edition.  Azure database for Maria DB provides built in high-availability, automatic backups and point-in-time restore for up to 35 days, predictable performance, and scaling within seconds, all with almost no administration required.|

## Storage

Azure Blob Storage is a popular service that manages the storage, retrieval, and security of non-structured BLOB data.

|Icon|Service|Description|
|----|-------|-----------|
|![Azure Blob Storage logo](media/storage.png)|**Azure Blob Storage**|Azure Blob Storage allows your applications to store and retrieve files in the cloud. Azure Storage is highly scalable to store massive amounts of data and data is stored redundantly to ensure high availability.|

## Messaging

Here's a list of the most popular services that manage sending, receiving, and routing of messages from and to apps.

|Icon|Service|Description|
|----|-------|-----------|
|![Azure Service Bus logo](media/servicebus.png)|**Azure Service Bus**|Azure Service Bus is a fully managed enterprise message broker supporting both point to point and publish-subscribe integrations. It is ideal for building decoupled applications, queue-based load leveling, or facilitating communication between microservices.|
|![Azure Event Hubs logo](media/event-hubs.png)|**Azure Event Hubs**|Azure Event Hubs is a managed service that can ingest and process massive data streams from websites, apps, or devices.|
|![Azure Queue Storage logo](media/queue.png)|**Azure Queue Storage**|Azure Queue Storage is a simple and reliable queue that can handle large workloads.|

## Cognitive Services

Azure Cognitive Services is a collection of cloud-based services that allow you to add AI-based capabilities to your application. Here's a list of popular Cognitive Services.

|Icon|Service|Description|
|----|-------|-----------|
|![Text to Speech logo](media/speech.png)|**Text to Speech**|Transcribe audible speech into readable, searchable text.|
|![Speech to Text logo](media/speech.png)|**Speech to Text**|Convert text to lifelike speech for more natural interfaces.|
|![Form Recognizer logo](media/form-recognizer.png)|**Form Recognizer**|Document extraction service that understands your forms allowing you to quickly extract text and structure from documents.|
|![Sentiment Analysis logo](media/analysis-update.png)|**Sentiment Analysis**|Automatically detect sentiments and opinions from text.|
|![QnA Maker logo](media/qna.png)|**QnA Maker**|Build a chat bot experience by distilling information into easy-to-navigate questions and answers.|
|![Translator logo](media/translator.png)|**Translator**|Translate more than 100 languages and dialects.|
|![Computer Vision logo](media/computer-vision.png)|**Computer Vision**|Analyze content in images and video.|
|![Anomaly Detector logo](media/anomaly-detector.png)|**Anomaly Detector**|Identify potential problems early on.|
|![Personalizer logo](media/personalizer.png)|**Personalizer**|Create rich, personalized experiences for every user.|

## Other

And finally, here's a list of popular services that support a wide range of workflows, methodologies, functionalities, and industries.

|Icon|Service|Description|
|----|-------|-----------|
|![Azure Key Vault logo](media/keyvault.png)|**Azure Key Vault**|Every application has application secrets like connection strings and API keys it must store. Azure Key Vault helps you store and access those secrets securely, in an encrypted vault with restricted access to make sure your secrets and your application are not compromised.|
|![Azure Monitor logo](media/monitor.png)|**Azure Monitor**|A comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. Developers integrate **Application Insights** into their applications -- an application logging, performance monitoring, and alerting SDK based on Azure Monitor.|
