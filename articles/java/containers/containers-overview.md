---
title: Containerizing your Java applications
description: This topic provides an overview of recommended strategies for containerizing your Java applications.
ms.author: manriem
ms.topic: conceptual
ms.date: 02/10/2022
ms.custom: devx-track-java
recommendations: false
---

# Containerizing your Java applications

This topic provides an overview of recommended strategies for containerizing Java applications.

## What type of application?

1. New application
1. Existing (on premises) application

## New application

As your application does not have a baseline yet you will need to start your application and use an application like `jconsole` or configure Application Insights to see how much memory the application is using under load.

## Using jconsole

TODO

## Using Application Insights

TODO

## Existing (on premises) application 

If you already have your application running on premises or on a VM in the cloud then our recommendation is to start your containerization with:

1. the same amount of CPU / memory as the application currently has access to.
1. the same JVM parameters as currently in use.

## What is your Azure target service?

The next step is to determine which Azure service you are going to use your container on and read up on what specific recommendations there are for the specific Azure sevice.

1. [Azure Kubernetes Service](containers-aks.ms)
