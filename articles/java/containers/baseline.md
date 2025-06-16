---
title: Establish a Baseline for Containerized Java Applications
description: This article describes how to establish a baseline for containerized Java applications
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.topic: article
ms.date: 04/13/2022
ms.custom: devx-track-java, devx-track-extended-java
recommendations: false
---

# Establish a baseline for containerized Java applications

This article describes how to establish a baseline for containerized Java applications.

It's important to establish a baseline to understand what your application is really doing and how much memory and how many CPU cores it needs. An under-provisioned environment might affect the overall performance of your containerized application, while an over-provisioned environment might increase your costs.

The process of establishing a baseline enables you to experiment with different settings and then determine their impact and the right balanced amount of resources needed.

To establish a baseline, you can use Azure Application Insights or an APM solution of your choice.

## Use Azure Application Insights

For information on setting up Application Insights, see [Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](/azure/azure-monitor/app/java-in-process-agent).

## Next steps

Now that you configured Azure Application Insights for your application, the next step is to review the recommendations for the target platform.

* [Containerize your Java applications for Kubernetes](kubernetes.md)
