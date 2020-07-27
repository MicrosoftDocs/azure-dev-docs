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

## Create a deployment in just minutes on Microsoft Azure

Once the [Elastic Cloud(https://cloud.elastic.co) account is active, log in and click **Create Deployment** to begin. The following process should take less than 10 minutes, including the time it takes to spin up the deployment, though could take a few minutes longer depending the type of deployment, and customizations configured.

1. Enter a name for the deployment, such as **azessdemo**

2. Select **Azure** cloud platform.  

3. Select a region closest to you.

4. Optionally choose an **Elastic Stack version**. 

> [!TIP]
> The latest version available is always displayed, though can be altered. Keep in mind that updating versions at a later time is trouble free and coordinated by the Elasticsearch services.

5. Choose the **I/O Template** as the type of deployment to utilize.

### Choosing the right deployment type

Deployment templates are what Elasticsearch provides you, to get up and running on the Elastic Cloud quickly and painlessly. There is no need to figure out how many nodes you need at the start, such as if you want to create two availability zones, nor how much memory, etc. Every deployment template includes a set of components called **instances** which are appropriately sized. These instances include Elasticsearch data, ingest, and master nodes, as well as Kibana for every deployments. There are additional instances one can add, at the time of deployment or later, such as Machine learning (ML) and Application Performance Monitoring (APM).

At Elastic, we understand there is never a one-size-fits all deployment type, yet we also understand how important it is to be able to customize things. We have a history of the needs of many users, therefore developed templates with appropriate sizing for you, so you can get up and running today. Don't misunderstand, these template will certainly get you started, but will easily carry you into a live production data environment. Deployments on the Elastic Cloud can support any use case you can throw at it, providing stability, consistent performance, and greater flexibility, ensuring you always have whatever resources you need, where and when you need them.

For nearly all general use cases, the **I/O Template** is recommended. There are other templates, however, which may offer some advantages when working with log aggregations for example. In that case, a **hot-warm** template may be more suitable, where the numerous logs that are no longer need to be frequently queried can take advantage of Elasticsearch's **time-based index creation**, and are moved off to a lower costing tier, the **warm data node**. Read more about [Hot-Warm Architecture Templates](https://www.elastic.co/guide/en/cloud/current/ec-getting-started-templates-hot-warm.html).

More information about deployment templates can be found here: [What are deployment templates?](https://www.elastic.co/guide/en/cloud/current/ec-getting-started-templates.html).



## Launch Kibana

## Add Sample Data

## Explore Kibana

## Add Azure Monitoring