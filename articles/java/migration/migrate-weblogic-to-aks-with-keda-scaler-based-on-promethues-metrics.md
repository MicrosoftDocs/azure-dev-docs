---
title: "Tutorial: Migrate Oracle WebLogic Server to AKS with KEDA scaler based on Prometheus Metrics"
description: Shows how to deploy WebLogic Server to AKS and enable autoscaling with KEDA scaler based on Prometheus Metrics.
author: KarlErickson
ms.author: haiche
ms.topic: tutorial
ms.date: 03/11/2024
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, migration-java
---

# Tutorial: Migrate Oracle WebLogic Server to AKS with KEDA scaler based on Prometheus Metrics

This tutorial shows you how to migrate Oracle WebLogic Server and configure automatic horizontal scaling based on Prometheus Metrics.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - What WebLogic application metrics can be exported using WebLogic Monitoring Exporter?
> - Deploy and run WebLogic applciation on AKS using Azure marketplace offer.
> - Enable Prometheus Metrics.
> - Enable Kubernetes Event-driven Autoscaling (KEDA).
> - Create KEDA scaler that is based on Prometheus Metrics.
> - Validate the scaler configuration.

## Overview

The following diagram illustrates the architecture you build:

<!-- Diagram source -->
:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/weblogic-aks-autoscaling-architecture.png" alt-text="Diagram of the solution architecture of WLS on AKS with KEDA scaler based on Prometheus Metrics." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/weblogic-aks-autoscaling-architecture.png" border="false":::


In this articles, metrics that will be exported by [WebLoigc Monitoring Exporter](https://github.com/oracle/weblogic-monitoring-exporter), which is a Prometheus-compatible exporter. Available metrices are listed in the following picture. If you want to customize the exporter, see [WebLoigc Monitoring Exporter Configuration](https://github.com/oracle/weblogic-monitoring-exporter?tab=readme-ov-file#configuration).

<!-- Diagram source -->
:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/weblogic-metrics.png" alt-text="WebLogic Metrics." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/weblogic-metrics.png" border="false":::

## Prerequisites

## Prepare sample application

### Sample application

### Create an Azure Storage account and upload the application

## Deploy WLS on AKS using Azure Marketplace Offer

### [Enable KEDA using Marketplace Offer](#tab/offer)

UI

### [Enable KEDA Manually](#tab/manual)

UI

---

## Enable Prometheus Metrics

### [Enable KEDA using Marketplace Offer](#tab/offer)

This step is already performed for you when you use the VM base image.

### [Enable KEDA Manually](#tab/manual)

Steps.

---

## Enable KEDA

### [Enable KEDA using Marketplace Offer](#tab/offer)

This step is already performed for you when you use the VM base image.

### [Enable KEDA Manually](#tab/manual)

Steps.

---

## Create KEDA scaler

### [Enable KEDA using Marketplace Offer](#tab/offer)

This step is already performed for you when you use the VM base image.

### [Enable KEDA Manually](#tab/manual)

Steps

---

## Test autoscaling

## Clean up resources
