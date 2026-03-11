---
title: Analyze Applications and Migrate to Azure by using GitHub Copilot Modernization
titleSuffix: Azure
description: Learn how GitHub Copilot modernization simplifies application assessment, framework upgrades, and Azure migration for Java and .NET projects.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: upgrade-and-migration-article
ai-usage: ai-assisted
ms.date: 03/11/2026
---

# GitHub Copilot modernization

GitHub Copilot modernization is an agentic, end-to-end solution that analyzes, upgrades, and migrates Java and .NET applications to Azure.

The modernization experience is delivered through two complementary layers. The modernization agent, delivered via the Modernize CLI, enables architects and application owners to orchestrate assessment, migration planning, and framework upgrade automation across multiple applications simultaneously, then seamlessly hand off plans to developers. In the IDE, developers can use GitHub Copilot modernization to execute transformations: migrating dependencies to Azure services, containerizing applications, generating infrastructure-as-code, and deploying directly to Azure.

Humans remain in the loop throughout, with every recommendation transparent, every change reviewable, and every step validated.


## Current availability

The following GitHub Copilot modernization capabilities are currently available:

- **General availability**: IDE experience - language and framework upgrades for .NET and Java.
- **General availability**: IDE experience - migration scenarios for .NET and Java.
- **Public preview**: Modernization agent - CLI experience for application assessment and planning. For more information, see [Modernization agent overview](modernization-agent/overview.md).

<br>

> [!VIDEO https://www.youtube.com/embed/Olt5getqPoo]

## Key capabilities

- **Application assessment and planning**: Analyze code, configuration, and dependencies.

  Modernization starts with a comprehensive codebase analysis. GitHub Copilot modernization analyzes your project's current state and generates modernization plans. The tool identifies dependencies, outdated libraries, and potential migration problems. It provides actionable strategies to remediate problems.

- **Code transformations**: Upgrade Java or .NET runtime and framework, and migrate to Azure.

  Uses tools like `OpenRewrite` to upgrade code, including API replacements and dependency updates. AI-powered predefined tasks encode expert knowledge for common Azure migration scenarios, including secret management, message queue integration, and identity services. The system can capture and reuse migration patterns. You can convert Git commits into reusable migration patterns through custom tasks. The system learns from existing code changes and applies similar fixes across multiple codebases. Migration patterns are applied uniformly across teams and projects to ensure consistency.

- **Modernize and secure**: Ensure successful build, migrate unit tests, and address Common Vulnerabilities and Exposures (CVEs).

  Modernization includes comprehensive build validation. The tool automatically resolves build problems that arise during transformation. It performs test validations to ensure error-free changes. The modernization process maintains production pipeline integrity.

  Security vulnerability management is integrated into the modernization process. The system scans for CVEs after upgrades. It automatically applies security fixes in Agent Mode. You can review all security-related changes. This process improves your security posture while maintaining compliance requirements.

- **Containerization and deployment**: Generate assets for app containerization and deployment.

  The tool creates Infrastructure as Code files for Azure deployment. It addresses deployment problems automatically. CI/CD pipelines are set up for continuous integration. This task completes the modernization workflow from analysis to production.

## Get started

Use the following links to begin modernizing applications with GitHub Copilot:

- [GitHub Copilot modernization for Java](../java/migration/migrate-github-copilot-app-modernization-for-java.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json)
- [GitHub Copilot modernization for .NET](/dotnet/core/porting/github-copilot-app-modernization-overview?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json)
- [Modernization Agent](modernization-agent/overview.md)

After you modernize on Azure, applications can integrate with Azure AI capabilities and services:

- **Microsoft Foundry**: Access to over 11,000 AI models.
- **AI agent services**: Built-in capabilities for intelligent application features.
- **Observe performance**: Real-time insights into AI-powered application performance.
- **Ensure content safety**: Responsible AI implementation at scale.
- **App Service**: Fully managed platform for hosting web applications and APIs.
- **Azure Container Apps**: Serverless container platform for microservices and containerized applications.
- **Azure Kubernetes Service**: Managed Kubernetes service for orchestrating containerized workloads.
- **AKS Automatic**: Simplified Kubernetes experience with automated cluster management.

## Privacy statement

GitHub Copilot modernization uses GitHub Copilot the same way you use GitHub Copilot to modify code. This process doesn't retain code snippets beyond the immediate session. The process doesn't collect, transmit, or store your custom skills either. For more information, see the [Microsoft privacy statement](https://www.microsoft.com/en-us/privacy/privacystatement).
