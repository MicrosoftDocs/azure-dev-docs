---
title: Getting started with Elasticsearch for Java Developers running on Azure
description: This tutorial shows how to integrate and configure Elasticsearch Service for Java Developers running on Azure.
author: Aaron Schifman and Lizzie Wann (Elastic)
manager:
ms.topic: tutorial
ms.date: 07/20/2020
ms.author:
ms.custom:
---

# Tutorial: Getting Started with Elasticsearch Service for Java developers running on Azure

This tutorial shows you how to provision an Elasticsearch Service cluster on Microsoft Azure. We have chosen to walk you through deploying a hosted Elasticsearch Service on Azure, rather than deploying a self-managed environment, as it is the quickest way of spinning up an Elasticsearch cluster.

If you are already familiar with deploying an Elasticsearch cluster, this tutorial still covers very useful information to even more experienced users. It identifies and articulates various benefits applicable for Java developers. At various times, details around the various out-of-the-box solutions are discussed, such as the APM Java Agent, and how Kibana can provide insight into the environment both during development and at run-time..

## Audience

This tutorial is focused for those who wish to deploy Elasticsearch clusters on a hosted platform on Microsoft Azure. This document’s intentions are to assist both Java developers and general practitioners with some of the out-of-the-box tools they can take advantage of with little additional configuration.

This article is focused on how a Java developer can get started with Elasticsearch on Microsoft Azure, but is by no means restricted to just that audience. In addition, the following discussion points are meant to provide guidance to a Java developer, so they can start looking at what matters rather quickly. This document is in no way meant to be exhaustive to what possibilities exist by utilizing the Elasticsearch SaaS hosted on Microsoft Azure.

## Overview

In this tutorial, you'll learn how to:

> * Deploy an Elasticsearch Service cluster on Microsoft Azure.
> * Deploy an Elasticsearch APM Server for monitoring Java metrics.
> * Setup an APM Java Agent to capture a Java development environment.
> * Utiliz Kibana for visualizing relevant Java metrics.

<!--- SECTION NEEDS DETAILS BEFORE INCLUDING - IF APPLICABLE
## Prerequisites
*
* Optionally a Java development environment to work with live data.
--->

## Getting Started

From the [Azure Marketplace](https://azuremarketplace.microsoft.com), search for and click on **Elasticsearch Service**. You will see a link to sign up with a free Elasticsearch Service trial along being able to read about the usefulness, depicted under the **Key Features** section. It is a great starting point for those wishing to embark on the Elasticsearch journey.

## Create a deployment in just minutes on Microsoft Azure

Once an [Elastic Cloud](https://cloud.elastic.co) account is active, log in and click **Create Deployment** to begin. The following process should take just minutes, including the deployment time.

1. Enter a name for the deployment, such as **azessdemo**

2. Select **Azure** cloud platform.  

3. Select a region closest to you.

4. Optionally choose an **Elastic Stack version**.

> [!TIP]
> The latest version available is always displayed, though can be altered. Keep in mind that updating versions at a later time is trouble free, with little to no downtime and is coordinated by the Elasticsearch services.

5. Choose the **I/O Template** as the type of deployment to utilize.

### Choosing the right deployment type

Deployment templates are what Elasticsearch provides you, to get up and running on the Elastic Cloud quickly. To get started, there is no need to figure out how many nodes are needed, nore how much memory or storage each should have.

Every deployment template includes a set of components called **instances** which are appropriately sized based on the type of template selected. These instances include Elasticsearch data, ingest, as well as Kibana for every deployment, but there are additional instances one can include at the time of deployment, or later, such as a Machine learning (ML) node, dedicated monitoring nodes, an Application Performance Monitoring (APM) server, or when ingesting data from an expansive environment, a coordinating node. Instance configurations map to [Azure instance types](https://www.elastic.co/guide/en/cloud/current/ec-reference-hardware.html#ec_azure).

At Elastic, we understand there is never a one-size-fits all deployment type, and that is why we provide various templates which have customization options, if you should choose. The Elasticsearch Service on Microsoft Azure provides stability, consistent performance, and greater flexibility, ensuring you always have whatever resources you need, where and when you need them.

For nearly all general use cases, the **I/O Template** is recommended, however, for other more specific uses cases, such as logging use cases, a **hot-warm** template may be more suitable. The [Hot-Warm Architecture template](https://www.elastic.co/guide/en/cloud/current/ec-getting-started-templates-hot-warm.html) helps ensure the numerous logs that no longer need to be frequently queried get moved to the **warm data node** based on Elasticsearch's Index Lifecycle Management policies. Hot data nodes are optimized for balanced RAM/vCPU/Disk ratios and performance and warm nodes are optimized for cost effective storage.

> [!div class="nextstepaction"]
> [Read more about deployment templates](https://www.elastic.co/guide/en/cloud/current/ec-getting-started-templates.html)

## Elastic Observability
The **I/O Optimized** template provisions, by default, Elastic APM, an application performance monitoring system. This makes it an ideal deployment template for Java developers. Elastic APM is one service making up the [Elastic Observability](https://www.elastic.co/observability) solution of apps. Others include Elastic Logs, Elastic Metrics and Elastic Uptime.

Elastic Observability is not just for the development perspective, the services are capable of driving intelligent operational decisions, such as by utilizing machine learning to detect anomalies in memory usage, an unusual number of site or application access requests, or if there is a rare entry to a log file.

The APM Server ingests data from the APM Java Agent, which can help Java developers navigate down to the exact line of code which is seen to be causing the most problems. In no time at all, a Java developer can determine the root cause for a transaction timing out, perhaps simply because a server has run out of cache. This is because Elasticsearch brings together the relevant logs and metrics, into one centralized location.

> [!div class="nextstepaction"]
> [Read more about Elastic’s APM system](https://www.elastic.co/guide/en/apm/get-started/7.8/overview.html)



> [!TIP]
> Optionally explore additional customization options by clicking **Customize deployment**, and remember to click the **Learn more** links if you are unsure about anything.

6. Click Create deployment

## Launch Kibana

Kibana is [Your window into the Elastic Stack](https://www.elastic.co/kibana) where
building and exploring dashboards gives you the ability, and freedom, to bring insights into the hands who need. Remember the age old saying, “a picture says a thousand things?” Well, Kibana is that same picture, “worth a thousand log lines.”

Getting started is simple by clicking the **Try our sample data**. This option is great to get familiar with, and have an opportunity to immediately see the power of Kibana, where everyone is welcome to join in creating, customizing and utilizing all the amazing real world data based dashboards containing histograms, graphs, pie charts, maps and more!

Check out this great [Getting Started with Kibana](https://www.elastic.co/webinars/getting-started-kibana) video.

There is also a second option, and that is what we will be further discussing - ingesting your own data.

## Ingesting your data into Kibana

Assuming you had taken the advice and watched the Getting Started with Kibana video, we can get you looking at your own data. What kind of data matters to you? Are you looking for performance metrics, and are you more interested on the application, host, container, or cloud platform side? Do you need to analyze thousands of lines of log files from many different kinds of sources, all in one location? Where are your apps failing or spending the most time computing?

> [!TIP]
> It helps to have specific goals in mind when setting up Elasticsearch, and start with some of the basics. Since deploying the **I/O Template** comes with the [Elastic APM](https://www.elastic.co/guide/en/apm/get-started/7.8/index.html) app, you can take advantage of it for your Java development environment.

For a Java developer, there is nothing easier than utilizing the [Elastic APM Java Agent](https://www.elastic.co/guide/en/apm/agent/java/1.x/index.html) to get relevant data into Kibana. The APM Java Agent is an out-of-the-box bytecode instrumentation tool leveraging the JVM to automatically measure the performance of applications, including support for popular frameworks such as Servlet API, Spring MVC, and Spring Boot. There is also an API enabling an unlimited number of custom instrumentations.

Going from nothing to seeing relevant data begins by installing the APM Java Agent through the Kibana interface.

From the Home screen, simply click **Add APM** where you will see a number of APM Agents available.

> [!NOTE]
> If you had selected a different template where the APM Server was not enabled by default, there will be a note explaining what to do, which is simply to enable it in the deployment settings, i.e. edit the deployment where you created it originally and where you launched Kibana from.

Select the **Java** agent tab.

Deploying agents through Kibana meanest that you have all the necessary instructions, making the deployment straightforward and simple.

The instructions are to download the agent jar from Maven Central, and then start it with a properties script that looks similar to what is depicted below. Replace the service name **my-application** and the application package location **org.example**.

> [!TIP]
> There are helpful links throughout the interface providing more information should you need.

```Agent configuration example
java -javaagent:/path/to/elastic-apm-agent-<version>.jar \
-Delastic.apm.service_name=my-application \
-Delastic.apm.server_urls=https://ffca87c25.apm.eastus2.azure.elastic-cloud.com:443 \
-Delastic.apm.secret_token=yHWPquEpa3x0bruhqP \
-Delastic.apm.application_packages=org.example \
-jar my-application.jar
```  
> [!NOTE]
> The connectivity url and token have already been added for you, so all you need to do is point it to what you want the agent monitoring.

Once that agent has been started, click **Load Kibana objects** and then **Launch APM**.

##

## Enable some useful troubleshooting graphs and logs in Kibana

## Add Azure Monitoring - Setup logs and metrics to flow from Azure Monitor
