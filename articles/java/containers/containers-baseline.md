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

It is important to establish a base line to understand what your application is really doing, and what resources are really needed. If you do not know how much memory or how many CPU cores your Java application actually needs, an underprovisioned environment may impact the overall performance of your containerized application, while an overprovisioned environment may increase your costs.

This process also requires good understanding of the overall consumption and distribution of computing resources and how they are split on a per instance basis. Lesser resources per application instance may suggest more instances overall, but with each instance being starved of resources.

The process of establishing a base line will allow you to experiment with different settings and then determine their impact and the right balanced amount of resources needed.

To establish a base line, you can use Azure Application Insights, or your APM solution of choice.

## Use Application Insights to establish a base line

See [Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](/azure/azure-monitor/app/java-in-process-agent)
which will walk you through setting up Application Insights.

## What is your Azure target platform?

Now that you have Azure Application Insights configured for your application, the next step is to review the recommendations for the target platform.

1. [Azure Kubernetes Service](containers-aks.md)
