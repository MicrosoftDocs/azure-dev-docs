---
title: Analyze Applications and Migrate to Azure by using GitHub Copilot App Modernization
description: Provides an overview of GitHub Copilot app modernization.
author: KarlErickson
ms.author: karler
ms.topic: upgrade-and-migration-article
ai-usage: ai-assisted
ms.date: 09/17/2025
---

# GitHub Copilot app modernization

GitHub Copilot app modernization provides AI-powered agents that analyze and upgrade Java and .NET applications, and migrate them to Azure. These agents handle complex, time-consuming tasks like version upgrades, dependency analysis, and cloud-platform-specific code transformations. You can modernize applications efficiently while maintaining code quality and build integrity.

## Current availability

The following GitHub Copilot app modernization capabilities are currently available:

- **General availability:** Language and framework upgrades for .NET and Java
- **General availability:** App modernization – migration scenarios for Java
- **Public preview:** App modernization – migration scenarios for .NET

<!--

<br>

> [!VIDEO https://www.youtube.com/embed/] <-- need actual sizzling video YouTube ID

-->

## Key benefits

### Accelerate language framework upgrades**

- **Analyze codebase and map dependencies**: Automatically scan your application to identify runtime versions, libraries, and interdependencies.
- **Detect breaking changes and propose migration paths**: Use AI to surface potential upgrade blockers and recommend safe, guided migration strategies.
- **Automatically fix build errors and unit test issues**: Resolve common build failures and test regressions with AI-generated code fixes.
- **Validate changes to ensure build integrity**: Confirm successful upgrades by verifying builds and running automated validations.
- **Scan for and remediate Common Vulnerabilities and Exposures (CVEs)**: Identify known security vulnerabilities and apply recommended patches or updates.

### Streamline end-to-end application migration

- **Assess application with recommended priorities**: Automatically analyze the codebase to identify dependencies, issues, and modernization opportunities—prioritized by criticality to guide remediation efforts.
- **Rewrite platform-specific code for Azure-native services**: Refactor application logic to target services like Azure App Service, Azure Container Apps, Azure Kubernetes Service (AKS), and AKS Automatic.
- **Update core service integrations**: Modernize key components including queuing systems, authentication, storage access, configuration, database connections, logging, and secrets management—following cloud best practices.
- **Apply code transformations aligned with organizational standards**: Ensure consistency with internal coding guidelines while preserving version history and traceability.
- **Customize tasks for automated code changes and modernization**: Define and tailor automation rules to apply targeted code updates, refactoring patterns, and modernization actions based on your app's architecture and business requirements.

### Modernize applications to be cloud and AI ready

- **Generate deployment files for Azure environments**: Automatically create infrastructure-as-code templates and configuration files optimized for Azure services.
- **Containerize applications post-modernization**: Package updated applications into containers for scalable, cloud-native deployment.
- **Resolve cloud compatibility issues**: Identify and fix platform-specific blockers to ensure smooth operation in Azure environments.
- **Reduce technical debt and strengthen security**: Modernize legacy code, eliminate outdated dependencies, and remediate known vulnerabilities.
- **Unlock Azure managed services**: Enable seamless integration with services like Azure App Service, Azure Container Apps, Azure Kubernetes Service (AKS), and AKS Automatic to support cloud-native and AI-driven workloads.

## Key capabilities and workflow

- **Application assessment and planning**: GitHub Copilot analyzes your codebase, configuration files, and dependencies to identify modernization opportunities. It provides a detailed assessment report that outlines required tasks, highlights critical issues, and recommends priorities to guide your planning.
- **Code transformations**: GitHub Copilot suggests and applies targeted code changes to support upgrade and migration scenarios, including runtime updates, framework transitions, platform-specific refactoring, and dependency remediation. It proposes changes that you can review, validate, and customize to ensure they align with your application architecture, coding standards, and business requirements.
- **Build, patching and tests**: GitHub Copilot verifies that your project builds successfully after remediation and applies automated fixes when needed. It performs CVE scans to identify security vulnerabilities and generates unit tests to validate modernization outcomes. You can confirm build integrity and refine test coverage as necessary.
- **Containerization and deployment**: GitHub Copilot automatically generates Dockerfiles and deployment artifacts tailored for Azure environments. You can customize deployment configurations and integrate them into your CI/CD workflows for production readiness.

## Get started

Use the following link to begin modernizing applications with GitHub Copilot:

- [GitHub Copilot app modernization for Java](../java/migration/migrate-github-copilot-app-modernization-for-java.md?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json)
- [GitHub Copilot app modernization for .NET](/dotnet/azure/migration/appmod/overview?toc=/azure/developer/github-copilot-app-modernization/toc.json&bc=/azure/developer/github-copilot-app-modernization/breadcrumb/toc.json)

After you modernize on Azure, applications can integrate with Azure AI capabilities and services:

- **Azure AI Foundry**: Access to over 11,000 AI models
- **AI agent services**: Built-in capabilities for intelligent application features
- **Observe performance**: Real-time insights into AI-powered application performance
- **Ensure content safety**: Responsible AI implementation at scale
- **App Service**: Fully managed platform for hosting web applications and APIs
- **Azure Container Apps**: Serverless container platform for microservices and containerized applications
- **Azure Kubernetes Service**: Managed Kubernetes service for orchestrating containerized workloads
- **AKS Automatic**: Simplified Kubernetes experience with automated cluster management
