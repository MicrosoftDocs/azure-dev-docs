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

Establishing a base line is important as it will allow you to determine what your application is really doing. E.g. if you do not know how much memory your Java application actually needs or how much CPU your Java application uses it can negatively impact the performance of your application. And it will also allow you to experiment with different settings and then determine what impact they had.

To establish a mininal base line you can use something like Application Insights, or your own APM solution.

## Use Application Insights to establish a base line

TODO

## What is your Azure target service?

The next step is to determine which Azure service you are going to use your container on and read up on what specific recommendations there are for the specific Azure services.

1. [Azure Kubernetes Service](containers-aks.md)
1. [Azure PaaS services](containers-paas.md)
