---
title: Getting started with data solutions for Python apps on Azure
description: Index of getting started material in the Azure documentation for data solutions for Python apps.
ms.date: 06/02/2025
ms.topic: get-started
ms.custom: devx-track-python, py-fresh-zinc
---

# Data solutions for Python apps on Azure

Azure offers a wide range of fully managed database and storage solutions, including relational, NoSQL, and in-memory databases, with support for both proprietary and open-source technologies. You can also choose from object, block, and file storage services. The following articles can help you get started using these options with Python on Azure.

## Databases

- **PostgreSQL**: Build scalable, secure, and fully managed enterprise apps using open-source PostgreSQL. You can scale single-node PostgreSQL for high performance or migrate existing PostgreSQL and Oracle workloads to the cloud.

  - [Quickstart: Use Python to connect and query data in Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/connect-python)
  - [Quickstart: Use Python to connect and query data in Azure Database for PostgreSQL - Single Server](/azure/postgresql/single-server/connect-python)
  - [Deploy a Python (Django or Flask) web app with PostgreSQL in Azure App Service](/azure/app-service/tutorial-python-postgresql-app?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)

- **MySQL**: Build scalable applications using a fully managed, intelligent MySQL database in the cloud.
  - [Quickstart: Use Python to connect and query data in Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/connect-python)
  - [Quickstart: Use Python to connect and query data in Azure Database for MySQL](/azure/mysql/single-server/connect-python)

- **Azure SQL**: Build scalable applications with a fully managed and intelligent SQL database platform in the cloud.
  - [Quickstart: Use Python to query a database  in Azure SQL Database or Azure SQL Managed Instance](/azure/azure-sql/database/connect-query-python)

## NoSQL, blobs, tables, files, graphs, and caches

- **Cosmos DB**: Build low-latency, high-availability apps at global scale, or migrate Cassandra, MongoDB, and other NoSQL workloads to the cloud.
  - [Quickstart: Azure Cosmos DB for NoSQL client library for Python](/azure/cosmos-db/nosql/quickstart-python)
  - [Quickstart: Azure Cosmos DB for MongoDB for Python with MongoDB driver](/azure/cosmos-db/mongodb/quickstart-python)
  - [Quickstart: Build a Cassandra app with Python SDK and Azure Cosmos DB](/azure/cosmos-db/cassandra/manage-data-python)
  - [Quickstart: Build an API for Table app with Python SDK and Azure Cosmos DB](/azure/cosmos-db/table/quickstart-python)
  - [Quickstart: Azure Cosmos DB for Apache Gremlin library for Python](/azure/cosmos-db/gremlin/quickstart-python)

- **Blob storage**: Secure, massively scalable object storage for cloud-native apps, data lakes, archives, high-performance computing (HPC), and machine learning.
  - [Quickstart: Azure Blob Storage client library for Python](/azure/storage/blobs/storage-quickstart-blobs-python)
  - [Azure Storage samples using v12 Python client libraries](/azure/storage/common/storage-samples-python)

- **Azure Data Lake Storage Gen2**: Scalable, secure data lake optimized for high-performance analytics.
  - [Use Python to manage directories and files in Azure Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-directory-file-acl-python)
  - [Use Python to manage ACLs in Azure Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-acl-python)

- **File storage**: Simple, secure, and serverless enterprise-grade cloud file shares.
  - [Develop for Azure Files with Python](/azure/storage/files/storage-python-how-to-use-file-storage)

- **Redis Cache**: Accelerate application performance with a scalable, in-memory data store compatible with open source.
  - [Quickstart: Use Azure Cache for Redis in Python](/azure/azure-cache-for-redis/cache-python-get-started)

## Big data and analytics

- **Azure Data Lake analytics**: Fully managed, pay-per-job analytics service that delivers powerful parallel data processing with built-in enterprise-grade security, auditing, and support.
  - [Manage Azure Data Lake Analytics using Python](/azure/data-lake-analytics/data-lake-analytics-manage-use-python-sdk)
  - [Develop U-SQL with Python for Azure Data Lake Analytics in Visual Studio Code](/azure/data-lake-analytics/data-lake-analytics-u-sql-develop-with-python-r-csharp-in-vscode)

- **Azure Data Factory**: A fully managed data integration service that lets you visually build, orchestrate, and automate data movement and transformation across various data sources.
  - [Quickstart: Create a data factory and pipeline using Python](/azure/data-factory/quickstart-create-data-factory-python)
  - [Transform data by running a Python activity in Azure Databricks](/azure/data-factory/transform-data-databricks-python)

- **Azure Event Hubs**: A fully managed, hyper-scale telemetry ingestion service designed to collect, transform, and store millions of events per second from connected devices and applications.
  - [Send events to or receive events from event hubs by using Python](/azure/event-hubs/event-hubs-python-get-started-send)
  - [Capture Event Hubs data in Azure Storage and read it by using Python (azure-eventhub)](/azure/event-hubs/event-hubs-capture-python)

- **HDInsight**: A fully managed cloud service that runs popular open-source frameworks like Hadoop and Spark, backed by a 99.9% SLA for enterprise-grade big data analytics.
  - [Use Spark & Hive Tools for Visual Studio Code](/azure/hdinsight/hdinsight-for-vscode)

- **Azure Databricks**: A fully managed, fast, easy and collaborative Apache® Spark™ based analytics platform optimized for big data and AI workloads on Azure.
  - [Connect to Azure Databricks from Excel, Python, or R](/azure/databricks/scenarios/connect-databricks-excel-python-r)
  - [Get Started with Azure Databricks](/azure/databricks/getting-started/)
  - [Tutorial: Azure Data Lake Storage Gen2, Azure Databricks & Spark](/azure/storage/blobs/data-lake-storage-use-databricks-spark)

- **Azure Synapse Analytics**: A fully managed analytics service that unifies data integration, enterprise data warehousing, and big data analytics into a single platform.
  - [Quickstart: Use Python to query a database in Azure SQL Database or Azure SQL Managed Instance (includes Azure Synapse Analytics)](/azure/azure-sql/database/connect-query-python)
