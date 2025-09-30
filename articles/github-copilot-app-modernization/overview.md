---
title: Analyze Applications and Migrate to Azure by using GitHub Copilot App Modernization
titleSuffix: Azure
description: Provides an overview of GitHub Copilot app modernization.
author: KarlErickson
ms.author: karler
ms.topic: upgrade-and-migration-article
ai-usage: ai-assisted
ms.date: 09/23/2025
---

# GitHub Copilot app modernization

GitHub Copilot app modernization provides AI-powered agents that analyze and upgrade Java and .NET applications, and migrate them to Azure. These agents handle complex, time-consuming tasks like version upgrades, dependency analysis, and cloud-platform-specific code transformations. You can modernize applications efficiently while maintaining code quality and build integrity.

## Current availability

The following GitHub Copilot app modernization capabilities are currently available:

- **General availability**: Language and framework upgrades for .NET and Java
- **General availability**: App modernization – migration scenarios for Java
- **Public preview**: App modernization – migration scenarios for .NET

<br>

> [!VIDEO https://www.youtube.com/embed/Olt5getqPoo]

## Key capabilities

- **Application assessment and planning**: Analyze code, configuration, and dependencies.

  Modernization begins with comprehensive codebase analysis. GitHub Copilot app modernization analyzes your project's current state and generates modernization plans. The tool identifies dependencies, outdated libraries, and potential migration issues. It provides actionable strategies to remediate problems.

- **Code transformations**: Upgrade Java or .NET runtime and framework, and migrate to Azure.

  Uses tools like `OpenRewrite` to upgrade code, including API replacements and dependency updates. AI-powered predefined tasks encode expert knowledge for common Azure migration scenarios including secret management, message queue integration, and identity services. The system can capture and reuse migration patterns. You can convert Git commits into reusable migration patterns through custom tasks. The system learns from existing code changes and applies similar fixes across multiple codebases. Migration patterns are applied uniformly across teams and projects to ensure consistency.

- **Modernize and secure**: Ensure successful build, migrate unit tests, and address Common Vulnerabilities and Exposures (CVEs).

  Modernization includes comprehensive build validation. The tool automatically resolves build issues that arise during transformation. It performs test validations to ensure error-free changes. Production pipeline integrity is maintained throughout the modernization process.

  Security vulnerability management is integrated into the modernization process. The system scans for CVEs after upgrades. It automatically applies security fixes in Agent Mode. You can review all security-related changes. This process improves your security posture while maintaining compliance requirements.

- **Containerization and deployment**: Generate assets for app containerization and deployment.

  The tool creates Infrastructure as Code files for Azure deployment. It addresses deployment errors automatically. CI/CD pipelines are set up for continuous integration. This task completes the modernization workflow from analysis to production.

## Get started

Use the following link to begin modernizing applications with GitHub Copilot:

- [GitHub Copilot app modernization for Java](../java/migration/migrate-github-copilot-app-modernization-for-java.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json)
- [GitHub Copilot app modernization for .NET](/dotnet/core/porting/github-copilot-app-modernization-overview?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json)

After you modernize on Azure, applications can integrate with Azure AI capabilities and services:

- **Azure AI Foundry**: Access to over 11,000 AI models
- **AI agent services**: Built-in capabilities for intelligent application features
- **Observe performance**: Real-time insights into AI-powered application performance
- **Ensure content safety**: Responsible AI implementation at scale
- **App Service**: Fully managed platform for hosting web applications and APIs
- **Azure Container Apps**: Serverless container platform for microservices and containerized applications
- **Azure Kubernetes Service**: Managed Kubernetes service for orchestrating containerized workloads
- **AKS Automatic**: Simplified Kubernetes experience with automated cluster management
