---
title: Integrate Portfolio Assessment with GitHub Copilot App Modernization
titleSuffix: Azure
description: Introduces the integration of portfolio assessment tools and GitHub Copilot app modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: overview
ms.date: 01/13/2026
ms.custom: devx-track-java
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Integrate portfolio assessment with GitHub Copilot app modernization

This article introduces the integration support between portfolio assessment tools and GitHub Copilot app modernization, providing an end-to-end workflow for application modernization.

In today's fast-evolving cloud landscape, modernizing legacy applications is a key priority for organizations seeking agility, scalability, and operational efficiency. Portfolio assessment tools play a crucial role in assessing and managing large portfolios of applications, while modern AI-powered tools like GitHub Copilot app modernization streamline the process of application transformation.

## What is portfolio assessment?

A portfolio assessment tool is a solution designed to discover, assess, and manage the entire portfolio of applications and workloads within an organization's IT environment. These tools help organizations evaluate their application landscape, identify migration candidates, and plan modernization strategies.

### Azure Migrate

Azure Migrate is the portfolio assessment tool published by Microsoft. Azure Migrate offers a unified platform to discover, assess, and migrate on-premises applications, infrastructure, and data to Azure. It provides comprehensive portfolio assessment capabilities, including application dependency mapping, performance analysis, and migration readiness evaluation. For more information, see the [Azure Migrate documentation](/azure/migrate/index).

### Dr. Migrate

Dr. Migrate is another widely adopted portfolio assessment tool that automates the assessment and migration of applications to the cloud. Dr. Migrate helps organizations quickly identify migration candidates, assess application compatibility, and generate detailed reports for modernization planning. For more information, see the [Dr. Migrate official documentation](https://docs.altra.cloud/docs/overview/).

## Integration with GitHub Copilot app modernization

We now offer seamless integration between the portfolio assessment features of these tools and GitHub Copilot app modernization. This integration enables organizations to cover the complete application modernization journey - from discovery and assessment to code remediation - using AI-powered tools.

### General integration flow

The integration between portfolio assessment tools and GitHub Copilot app modernization follows a structured flow:

1. Portfolio assessment: Using a portfolio assessment tool such as Azure Migrate or Dr. Migrate, organizations can scan their environment to detect all applications and identify candidates for migration and modernization.

1. Application assessment: For each candidate application, you can trigger an app assessment directly from the portfolio assessment tool. GitHub Copilot app modernization then performs the assessment. The resulting assessment report - which details modernization opportunities and technical recommendations - is made available there as well for centralized review by architects.

1. Architect review and developer assignment: Architects review the generated application assessment reports to determine modernization priorities and application migration waves. Developers are then assigned applications for code remediation and modernization using the AI-driven capabilities of GitHub Copilot app modernization to accelerate the process.

To understand the detailed integration flow and best practices, see the following articles:

- [Azure Migrate documentation](https://aka.ms/azure-migrate-doc)
- [Dr. Migrate documentation](https://aka.ms/dr-migrate-doc)

Organizations that use the integration between portfolio assessment tools and GitHub Copilot app modernization can streamline their end-to-end application modernization journey, from discovery and assessment through to remediation and deployment.

## See also

To learn more about GitHub Copilot app modernization, see [GitHub Copilot app modernization documentation](../../github-copilot-app-modernization/index.yml).
