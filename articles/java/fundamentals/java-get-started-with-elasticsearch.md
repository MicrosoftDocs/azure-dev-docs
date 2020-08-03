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

# Tutorial: Getting Started with Elasticsearch Service for Java developers running on Azure

This tutorial shows you how to provision an Elasticsearch Service cluster on Microsoft Azure. Additionally, this tutorial identifies and articulates various benefits applicable for Java developers by providing details around the various solutions to the deployment, such as specific observability components and how a Java developer can benefit from using Kibana for visualization and analysis.

<!--- SECTION NEEDS DETAILS
This tutorial assumes you're…
--->

## Overview

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Deploy an Elasticsearch Service cluster on Microsoft Azure.
> * Deploy an Elasticsearch APM Server for monitoring Java metrics.
> * Setup an APM Java Agent to capture a Java development environment.
> * Utiliz Kibana for visualizing relevant Java metrics.

## Prerequisites
<!--- SECTION NEEDS DETAILS
* [Java Developer Kit](https://aka.ms/azure-jdks), version 8 or greater.
* A Microsoft Azure account with valid subscription or trial.
* Optionally a Java development environment to work with live data.
--->

## Getting signed up with the Elasticsearch Service

From the [Azure Marketplace](https://azuremarketplace.microsoft.com) https://portal.azure.com/#blade/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/homehttps://azuremarketplace.microsoft.com/marketplace/apps/logz.logzio-elk-as-a-service-pro), search for **Elasticsearch**. You will see a link to Elasticsearch (Self-Managed). Click on this and you will be taken to an Overview page where there are two options for deploying Elasticsearch - either Self-Managed or using Elasticsearch Service on Azure. Click the link for Elasticsearch Service on Azure and start a free trial, where you will enter an email to get started. In this tutorial you will be using Elasticsearch Service rather than self-managed as this is the quickest way of spinning up an Elasticsearch cluster.

## Create a deployment in just minutes on Microsoft Azure

Once the [Elastic Cloud](https://cloud.elastic.co) account is active, log in and click **Create Deployment** to begin. The following process should take less than 10 minutes, including the time it takes to spin up the deployment, though could take a few minutes longer depending on the type of deployment, and customizations configured.

1. Enter a name for the deployment, such as **azessdemo**

2. Select **Azure** cloud platform.  

3. Select a region closest to you.

4. Optionally choose an **Elastic Stack version**.

> [!TIP]
> The latest version available is always displayed, though can be altered. Keep in mind that updating versions at a later time is trouble free, zero downtime, and coordinated by the Elasticsearch services.

5. Choose the **I/O Template** as the type of deployment to utilize.

### Choosing the right deployment type

Deployment templates are what Elasticsearch provides you, to get up and running on the Elastic Cloud quickly and painlessly. There is no need to figure out how many nodes you need at the start, how much memory and storage each should have, whether you need two or three availability zones, nor whether you need a dedicated master node, which by the way, is automatically added based on the type of deployment you have.

Every deployment template includes a set of components called **instances** which are appropriately sized based on the template selected. These instances include Elasticsearch data, ingest, as well as Kibana for every deployment, but there are additional instances one can include, at the time of deployment or later, such as a Machine learning (ML) node, dedicated monitoring nodes, an Application Performance Monitoring (APM) server, or when ingesting data from a very large environment, a coordinating node which helps route incoming ingest pipelines.

At Elastic, we understand there is never a one-size-fits all deployment type, and know how important it is to be able to customize things. We have a history listening to the needs of our users, therefore have developed templates with you in mind so you can get up and running as fast and painlessly as possible. These templates will certainly get you started, and will easily carry you into a live production data environment. Deployments on the Elastic Cloud provide stability, consistent performance, and greater flexibility, ensuring you always have whatever resources you need, where and when you need them.

For nearly all general use cases, the **I/O Template** is recommended, however, for other more specific uses cases, such when performing heavy log aggregations, . There are other templates, however, which may offer some advantages when working with log aggregations for example. In that case, a **hot-warm** template may be more suitable. The Hot-Warm Architecture template ensures the numerous logs that no longer need to be frequently queried get moved to the **warm data node** based on Elasticsearch's **time-based index creation** protocols. Read more about [Hot-Warm Architecture Templates](https://www.elastic.co/guide/en/cloud/current/ec-getting-started-templates-hot-warm.html).

More information about deployment templates can be found here: [What are deployment templates?](https://www.elastic.co/guide/en/cloud/current/ec-getting-started-templates.html). If you want to gain more detailed information about deployments, click here: [Create your deployment](https://www.elastic.co/guide/en/cloud/current/ec-create-deployment.html).

## The APM Server
Since the I/O Optimized template will get you up and running, serving a multitude of use cases, it has been selected. But what about ensuring the deployment is ready for what a Java developer can get out of it? From an observability perspective, Java developers can take advantage of a number of out-of-the-box tools. Things like centralized monitoring of performance metrics across any number of servers, setting up Machine Learning (ML) alerts in order to detect anomalies in a Java application, such as looking for higher than normal memory usage per container or rare log messages, all while gaining insightful information about the end-user experience. Observability is not just for the development perspective, observability drives business decisions. APM can get you navigating down to the exact line of code, such as determining the root cause for a transaction timing out, simply because a server has run out of cache. How many logs would need to be read, on how many servers, simply because an eCommerce customer cannot get their item added to their cart without these tools? [Read more about Elastic’s APM system](https://www.elastic.co/guide/en/apm/get-started/7.8/overview.html).

The I/O Optimized template comes with the APM server active, so there is absolutely nothing we need to change or customize with this template, but please explore your options by clicking **Customize deployment**, and remember to click the **Learn more** links if you are unsure about anything. At Elastic, giving you access to the information you need is a top priority, and that includes the information pertinent getting your deployments rolled out smoothly.

6. Click Create deployment

## Launch Kibana

## Add Sample Data

## Explore Kibana

## Add Azure Monitoring
