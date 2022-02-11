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

## Establishing a base line

To determine what your application really needs it is important to establish a base line. If you do not know how much memory your Java application needs or how much CPU your Java application uses you can negatively impact the performance of your application when you containerize it. 

Note - If you already have been running your Java application in production you have an implied base line. 

Establish a base line for:

1. [A new application](#new-application)
1. [An existing (on premises) application](#existing-on-premises-application)

## New application

As your application is new you first need to establish a JVM heap memory base line. For that you can use something like Application Insights, `jconsole` or your own APM solution.

### Establish memory baseline using Application Insights

TODO

### Establish memory baseline using jconsole

TODO

### Determine which GC to use

TODO

## Existing (on premises) application 

If you already have your application running on premises or on a VM in the cloud then our recommendation is to start your containerization journey with:

1. the same amount of CPU / memory as the application currently has access to.
1. the same JVM parameters as currently in use.

## What is your Azure target service?

The next step is to determine which Azure service you are going to use your container on and read up on what specific recommendations there are for the specific Azure sevice.

1. [Azure Kubernetes Service](containers-aks.md)
1. [Azure PaaS services](containers-paas.md)
