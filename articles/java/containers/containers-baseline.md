---
title: Establishing a baseline for containerized Java applications
description: This guide describes how to establish a basedline for containerized Java applications
ms.author: manriem
ms.topic: conceptual
ms.date: 02/10/2022
ms.custom: devx-track-java
recommendations: false
---

# Establishing a base line

Establishing a base line is important as it will allow you to understand what your application is really doing. E.g. if you do not know how much memory or how many vCPU cores your Java application needs, it can negatively impact the performance of your application. Creating a base line will allow you to experiment with different settings and then determine their impact.

To establish a mininal base line you can use Application Insights, or your own APM solution.

## Use Application Insights to establish a base line

See [Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](/azure/azure-monitor/app/java-in-process-agent)
which will walk you through setting up Application Insights.

## What is your Azure target platform?

Now that you have Application Insights configured for your application the next step is to review the recommendations for the target platform.

1. [Azure Kubernetes Service](containers-aks.md)
