---
title: Integrate Portfolio Assessment with GitHub Copilot App Modernization
titleSuffix: Azure
description: Introduces the integration of Portfolio Assessment tools and GitHub Copilot app modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: overview
ms.date: 11/18/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Integrate Portfolio Assessment with GitHub Copilot app modernization

In today's fast-evolving cloud landscape, modernizing legacy applications is a key priority for organizations seeking agility, scalability, and operational efficiency. Portfolio Assessment tools play a crucial role in assessing and managing large portfolios of applications, while modern AI-powered tools like GitHub Copilot app modernization streamline the process of application transformation. This document introduces the integration support between Portfolio Assessment tools and GitHub Copilot app modernization, providing an end-to-end workflow for application modernization.

## What Is Portfolio Assessment?

A Portfolio Assessment tool is a solution designed to discover, assess, and manage the entire portfolio of applications and workloads within an organization's IT environment. These tools help organizations evaluate their application landscape, identify migration candidates, and plan modernization strategies. 

### Azure Migrate

Azure Migrate is the Portfolio Assessment tool published by Microsoft. Azure Migrate offers a unified platform to discover, assess, and migrate on-premises applications, infrastructure, and data to Azure. It provides comprehensive portfolio assessment capabilities, including application dependency mapping, performance analysis, and migration readiness evaluation. For more details, refer to [Azure Migrate documentation](/azure/migrate/index).

### Dr. Migrate

Dr. Migrate is another widely adopted Portfolio Assessment tool that automates the assessment and migration of applications to the cloud. Dr. Migrate helps organizations quickly identify migration candidates, assess application compatibility, and generate detailed reports for modernization planning. For more information, visit [Dr. Migrate official documentation](https://docs.altra.cloud/docs/overview/).

## Integration with GitHub Copilot app modernization

We now offer seamless integration between Portfolio Assessment tools' portfolio assessment features and GitHub Copilot app modernization. This integration enables organizations to cover the complete application modernization journey—from discovery and assessment to code remediation—using AI-powered tools. 

### General integration flow

The integration between Portfolio Assessment tools and GitHub Copilot app modernization follows a structured flow:

1. Portfolio Assessment: Using a Portfolio Assessment tool such as Azure Migrate or Dr. Migrate, organizations can scan their environment to detect all applications and identify candidates for migration and modernization.

1. Application Assessment: For each candidate application, an app assessment can be triggered directly from the Portfolio Assessment tool to be performed by GitHub Copilot app modernization. The resulting assessment report, detailing modernization opportunities and technical recommendations, is made available there as well for centralized review by architects.

1. Architect Review and Developer Assignment: Architects review the generated application assessment reports to determine modernization priorities and application migration waves. Developers are then assigned applications for code remediation and modernization, leveraging the AI-driven capabilities of GitHub Copilot app modernization to accelerate the process.

To understand the detailed integration flow and best practices, refer to the following documentation:

- [Azure Migrate Documentation](https://aka.ms/azure-migrate-doc)
- [Dr. Migrate Documentation](https://aka.ms/dr-migrate-doc)

By leveraging the integration between Portfolio Assessment tools and GitHub Copilot app modernization, organizations can streamline their end-to-end application modernization journey, from discovery and assessment through to remediation and deployment.
