---
title: Overview
description: Provides an introduction to the core concepts that every developer should understand when working with the Azure SDK for Python, including design principles, error handling, retries, and response types.
ms.date: 7/31/2025
ms.topic: conceptual
ms.custom: devx-track-python
---

# Overview of Azure SDK for Python Fundamentals

The Fundamentals of the Python SDK for Azure section equips developers with the foundational concepts and core behaviors that underpin every client library in the Azure SDK for Python. These topics are considered "fundamentals" because they establish the essential building blocks for effective, idiomatic, and resilient application development across all Azure services. 

Whether you're working with HTTP retries, handling errors, understanding SDK response types, or following consistent language design guidelines, these articles provide the baseline knowledge required to confidently navigate and extend your use of the Azure SDK. Mastering these fundamentals ensures that you’re not only writing functional code but also writing code that’s maintainable, robust, and aligned with best practices across the Azure ecosystem.


| Article Title | Purpose |
|---------------|---------|
| [Handling errors produced by the Azure SDK for Python](./errors.md) | Describes the SDK's comprehensive error model, including best practices for handling specific exception types and implementing resilient error-handling strategies. |
| [HTTP pipeline and retries in the Azure SDK libraries for Python](./http-pipeline-retries.md) | Provides a deep dive into the SDK’s internal HTTP pipeline, showing how policies like retries, logging, and authentication are layered to manage requests and responses. |
| [Understanding common response types in the Azure SDK for Python](./common-types-response.md) | Explains how SDK methods return intuitive, strongly-typed Python objects, simplifying how you work with Azure responses and long-running operations. |
| [Azure SDK Language Design Guidelines for Python](./language-design-guidelines.md) | Outlines the conventions and design patterns used across the SDK to ensure consistency, usability, and alignment with Python best practices. |
