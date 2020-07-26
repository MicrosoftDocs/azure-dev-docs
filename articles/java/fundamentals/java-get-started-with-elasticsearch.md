---
title: Getting started with Elasticsearch for Java Developers running on Azure
description: This tutorial shows how to integrate and configure Elasticsearch Service for Java Developers running on Azure.
author: Aaron Schifman (Elastic)
manager: 
ms.topic: tutorial
ms.date: 07/20/2020
ms.author: 
ms.custom: 
---

# Tutorial: Getting started with monitoriing logs and metrics using Elasticsearch Service for Java developers running on Azure

This tutorial shows you how to provision an Elasticsearch Service cluster on Microsoft Azure for analyzing and troubleshooting Azure Monitor logs and metrics. This will provide a full monitoring solution, utilizing a combination of Elasticsearch, Logstash, and Kibana for visualizations.

<!--- NEEDS MODIFICATION
This tutorial assumes you're using Log4J or Logback. These libraries are the two most widely used for logging in Java, so the tutorial should work for most applications running on Azure. If you're already using the Elastic stack to monitor your Java application, this tutorial shows you how to reconfigure to target the Logz.io endpoint.
--->

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Deploy an Elasticsearch Service cluster on Microsoft Azure.
> * Setup logs and metrics to flow from Azure Monitor.
> * Enable troubleshooting by utilizing Kibana visualizations

## Prerequisites
<!--- NEEDS MODIFICATION
* [Java Developer Kit](https://aka.ms/azure-jdks), version 8 or greater
* A Logz.io account from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/logz.logzio-elk-as-a-service-pro)
* An existing Java application that uses Log4J or Logback
--->

## Get signed up with Elasticsearch

From the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/logz.logzio-elk-as-a-service-pro), search for **Elasticsearch Service**. You will see a link to a free trial, where you will enter an email to get started.

### Create a deployment in just minutes on Microsoft Azure

Once the [Elastic Cloud(https://cloud.elastic.co) account is active, log in and click **Create Deployment** to begin. The following process should take less than 10 minutes, including the time it takes to spin up the deployment, though could take a few minutes longer depending the type of deployment, and customizations configured.

1. Enter a name for the deployment, such as **azessdemo**

2. Select **Azure** cloud platform.  

3. Select a region closest to you.

4. Notice the **Elastic Stack version**. The latest should be available, which is the recommended version. Keep in mind that updating versions is trouble free and coordinated by the Elasticsearch services.

5. Choose the type of deployment.

### Choosing the right deployment type

Deployment templates are what Elasticsearch provides you, to get up and running on the Elastic Cloud quickly and painlessly. Every deployment template includes a set of components called **instances**. These instances include Elasticsearch data, ingest, and master nodes, as well as Kibana for all deployments. There are additional included, but not enabled by default, instances such as Machine learning (ML) and an Application Performance Monitoring (APM) Server, to name but a few.

At Elastic, we understand there is never a one-size-fits all deployment type. This is why these templates, while more than adequate to get you started and even carry you into ingesting live production data, they are fully customizable, supporting literally any use case you can throw at it, providing greater flexibility, ensuring you have whatever resources you need where and when you need them.

For nearly all general use cases, the **I/O Template** is recommended, however, for log aggregation, for example, it maybe advantageous to have a **hot-warm** architecture, where the numerous logs that no longer need to be frequently queried, **time-based index creation**, are moved off to a lower cost tier, a **warm data node**. Read more about [Hot-Warm Architecture Templates](https://www.elastic.co/guide/en/cloud/current/ec-getting-started-templates-hot-warm.html).

More information about what deployment templates are, can be found here: [What are deployment templates?](https://www.elastic.co/guide/en/cloud/current/ec-getting-started-templates.html).

### Launch Kibana

### Add Sample Data

### Explore Kibana
