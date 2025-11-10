---
title: Integration Between Estate Tools and GitHub Copilot App Modernization
titleSuffix: Azure
description: Introduce on the integration Between Estate Tools and GitHub Copilot App Modernization
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: overview
ms.date: 09/23/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Integration Between Estate Tools and GitHub Copilot App Modernization

In today’s fast-evolving cloud landscape, modernizing legacy applications is a key priority for organizations seeking agility, scalability, and operational efficiency. Estate tools play a crucial role in assessing and managing large portfolios of applications, while modern AI-powered tools like GitHub Copilot App Modernization streamline the process of application transformation. This document introduces the integration support between estate tools and GitHub Copilot App Modernization, providing an end-to-end workflow for application modernization.
What Is an Estate Tool?
An estate tool is a solution designed to discover, assess, and manage the entire portfolio of applications and workloads within an organization’s IT environment. These tools help organizations evaluate their application landscape, identify migration candidates, and plan modernization strategies. 
## Azure Migrate
Azure Migrate is the estate tool published by Microsoft. Azure Migrate offers a unified platform to discover, assess, and migrate on-premises applications, infrastructure, and data to Azure. It provides comprehensive portfolio assessment capabilities, including application dependency mapping, performance analysis, and migration readiness evaluation. For more details, refer to Azure Migrate documentation.
## Dr.Migrate
Dr.Migrate is another widely adopted estate tool that automates the assessment and migration of applications to the cloud. Dr.Migrate helps organizations quickly identify migration candidates, assess application compatibility, and generate detailed reports for modernization planning. For more information, visit Dr.Migrate official documentation.
Integration with GitHub Copilot App Modernization
We now offer seamless integration between estate tools’ portfolio assessment features and GitHub Copilot App Modernization. This integration enables organizations to cover the complete application modernization journey—from discovery and assessment to code remediation—using AI-powered tools. 
## General Integration Flow
The integration between estate tools and GitHub Copilot App Modernization follows a structured flow:
1.	Portfolio Assessment: Using an estate tool such as Azure Migrate or Dr.Migrate, organizations can scan their environment to detect all applications and identify candidates for migration and modernization.
2.	Application Assessment: For each candidate application, an app assessment can be triggered directly from the estate tool to be performed by GitHub Copilot App Modernization. The resulting assessment report, detailing modernization opportunities and technical recommendations, is made available there as well for centralized review by architects.
3.	Architect Review and Developer Assignment: Architects review the generated application assessment reports to determine modernization priorities and application migration waves. Developers are then assigned applications for code remediation and modernization, leveraging the AI-driven capabilities of GitHub Copilot App Modernization to accelerate the process.
   
To understand the detailed integration flow and best practices, refer to the following documentation:
1. [Azure Migrate Documentation](https://aka.ms/azure-migrate-doc)
1. [Dr.Migrate Documentation](https://aka.ms/dr-migrate-doc)
By leveraging the integration between estate tools and GitHub Copilot App Modernization, organizations can streamline their end-to-end application modernization journey, from discovery and assessment through to remediation and deployment.
