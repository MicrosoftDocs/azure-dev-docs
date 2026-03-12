---
title: GitHub Copilot Modernization for Java Developers
titleSuffix: Azure
description: Provides an overview of GitHub Copilot modernization for Java developers.
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

# GitHub Copilot modernization for Java developers

This article describes GitHub Copilot modernization, which is an AI assistant that delivers end-to-end support for application modernization.

Enterprises often deal with technical debt throughout their development cycles, and upgrading Java runtimes, frameworks, and dependencies is a common but resource-intensive task. At the same time, many organizations aim to migrate and modernize their application estate to the cloud, which involves:

- Assessing the current state of code, configuration, and dependencies
- Planning Azure resources
- Remediating issues to enable successful migration

Built on **GitHub Copilot agent mode**, GitHub Copilot modernization offers predefined tasks for common upgrade and migration scenarios while incorporating industry best practices for running applications on Azure. At the same time, it enables teams to infuse their own coding standards, organizational policies, and existing practices into the modernization process.

## Key capabilities at a glance

- **Application assessment and planning**: Analyzes code, configuration, and dependencies. Helps you visualize every task in the modernization process, from assessment to deployment.
- **Code transformations**: Suggests and applies code remediation for upgrade and migration scenarios.
- **Build, patching, and tests**: Verifies that the project builds successfully after remediation, and applies fixes when needed. Performs Common Vulnerabilities and Exposures (CVE) checks to reduce exposure to security vulnerabilities. Migrates existing and generates new unit tests to validate modernization outcomes and improve test coverage.
- **Containerization and deployment**: Generates Dockerfiles for app containerization and other artifacts to automate deployment to Azure.

GitHub Copilot modernization integrates GitHub Copilot's AI-powered capabilities with open-source tools like `OpenRewrite` to automate complex upgrade steps. It supports both Maven and Gradle projects and targets upgrades between Java versions 8, 11, 17, and 21. The tool has a particular focus on modernizing applications that use the Spring Boot framework. The upgrade process keeps you in control and ensures transparency by displaying all logs and outputs.

Start your migration journey with **App Assessments** to get an overview of cloud readiness migration issues, including:

- Instructions for setting up Azure resources
- Recommendations on following best practices
- Recommendations for changing your application code

In scenarios where code changes are required, GitHub Copilot modernization guides you through the remediation step. At this stage, you can use predefined tasks for common issues, such as:

- Switching from password-based authentication to managed identities
- Moving from Amazon Web Services (AWS) S3 to Azure Blob Storage

To learn more about predefined tasks available in GitHub Copilot modernization today, see [Predefined tasks](migrate-github-copilot-app-modernization-for-java-predefined-tasks.md).

When it comes to development, enterprises often have strict processes and controls, which is where custom skills come in. For more information, see [Quickstart: create and apply your own skills for GitHub Copilot modernization](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md)

Custom skills can reference the code commits from previously migrated applications. These skills serve as remediation guides for similar issues in other apps, enabling Copilot to apply proven patterns across multiple codebases. With each successful migration, the knowledge base expands, accelerating future remediations and reducing manual effort.

GitHub Copilot modernization also includes specialized agents to:

- Verify your app builds successfully
- Reduce technical debt by addressing CVEs
- Validate behavioral integrity with unit tests

For more information, see [GitHub Copilot modernization Java utilities](/java/upgrade/tools).

Modernization isn't just about upgrading code, it's about preparing your applications for the cloud. Whether you're targeting Azure App Service, Azure Container Apps, Azure Kubernetes Service (AKS), or AKS Automatic, Copilot helps you get there faster and with confidence.

## See also

[GitHub Copilot modernization FAQ](migrate-github-copilot-app-modernization-for-java-faq.yml).
