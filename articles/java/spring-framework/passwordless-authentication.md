---
title: Passwordless Authentication
description: Describes how to use passwordless to connect with different services.
ms.date: 03/04/2025
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Passwordless Authentication

This article describes how to use passwordless authentication to securely connect your applications to Azure services. By eliminating the need to store credentials in your application code, configuration files, or environment variables, you can improve security and streamline configuration.

## Supported Azure Services
Spring Cloud Azure now supports passwordless authentication for the following services:

- [Connect to MySQL](mysql-support.md#connect-to-azure-mysql-locally-without-password)

- [Connect to PostgreSQL](postgresql-support.md#connect-to-azure-postgresql-locally-without-password)

- [Connect to Redis](redis-support.md#connect-to-azure-cache-for-redis-with-passwordless)

- [Connect to Kafka](kafka-support.md#use-oauth-authentication)

- [Connect to Azure Service Bus JMS](spring-jms-support.md#connect-to-azure-service-bus-jms-using-passwordless)

## [Azure Identity Extensions](/java/api/overview/azure/identity-extensions-readme)

## Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples) repository on GitHub.
