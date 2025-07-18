---
title: Migrate Applications to Azure by using GitHub Copilot App Modernization
description: Provides an overview of GitHub Copilot App Modernization.
author: KarlErickson
ms.author: karler
ms.topic: upgrade-and-migration-article
ms.date: 07/16/2025
---

# Migrate applications to Azure by using GitHub Copilot App Modernization

Modernizing applications and migrating to the cloud is typically a complex, labor-intensive, and fragmented process. GitHub Copilot App Modernization is designed to simplify and accelerate your journey to the cloud. App modernization and upgrade offers an intelligent, guided approach that automates repetitive tasks and improves consistency - saving time, reducing risks, and accelerating time-to-cloud.

## Six value pillars

GitHub Copilot App Modernization provides six distinct value pillars, each specifically tailored to address particular challenges encountered during the application modernization process.

:::image type="content" source="media/overview/value-pillars.png" alt-text="Diagram of the six value pillars with heading GitHub Copilot App Modernization, Smarter Upgrades, Rapid Migration to the cloud." lightbox="media/overview/value-pillars.png":::

### 1. Intelligent issue analysis and recommendations

Modernization starts with insight. Whether you're upgrading a runtime or migrating to Azure, modernization starts with understanding your code.

GitHub Copilot App Modernization analyzes your project's current state and generates a modernization plan, offering context-aware fixes and actionable recommendations from Azure Migrate Application Code Assessment Tool (AppCAT), so you spend less time diagnosing and more time modernizing.

AppCAT is also available as a stand-alone CLI tool that you can run independently from the App Modernization VS Code extension. For more information, see [Azure Migrate application and code assessment](/azure/migrate/appcat).

### 2. Expert-led code transformation

After a plan is generated, GitHub Copilot App Modernization is a powerful code transformation engine that combines expert-led migration strategies. Copilot applies structured changes with precision.

For modernization scenarios, GitHub Copilot App Modernization offers predefined AI-powered formulas that encode proven migration strategies, applying expert knowledge to common Azure migration scenarios with high accuracy. Currently, app modernization offers predefined formulas that cover common migration scenarios including secret management, message queue integration, identity, and more.

For upgrades, GitHub Copilot App Modernization uses tools like OpenRewrite to perform refactoring, including API replacements and dependency updates, while GitHub Copilot addresses any remaining issues.

### 3. Automation through learning

Beyond predefined formulas or strategies, you can capture migration logic into reusable formulas by converting Git commits into reusable migration patterns, or custom formulas. These custom formulas enable Copilot to apply learned remediations across multiple codebases with consistency and precision.

Whether you're applying a fix in the upgrade or ensuring Azure migration consistency across teams, GitHub Copilot uses these learned patterns to accelerate transformation with precision and repeatability.

### 4. Build issue resolution

Modernization isn't complete until your application successfully builds. GitHub Copilot App Modernization helps resolve issues automatically and performs test validations, ensuring error-free transformations and keeping your production pipelines running smoothly.

### 5. Automatic patching for CVEs

GitHub Copilot App Modernization scans for Common Vulnerabilities and Exposures (CVEs) after the upgrade process is completed. When CVE issues are detected, the tool automatically fixes the issues within the Agent Mode, enabling you to review the fixes. This improves the application's security posture and ensures compliance with organizational guidelines.

### 6. Automated deployment to Azure

When you're ready, GitHub Copilot for Azure helps facilitate automated deployment to Azure, completing the app modernization process. When you ask the Copilot agent to deploy your application, it creates the required Infrastructure as Code files, deploys the application, addresses any deployment errors encountered, and sets up CI/CD pipelines. GitHub Copilot for Azure is a separate extension today and efforts are underway to integrate it with GitHub Copilot App Modernization.

## Get started today

Use the following links to get started with GitHub Copilot App Modernization using the language of your choice:

- [GitHub Copilot App Modernization for Java](../java/migration/migrate-github-copilot-app-modernization-for-java.md?toc=/azure/developer/migrate/toc.json&bc=/azure/developer/migrate/breadcrumb/toc.json)
- [GitHub Copilot App Modernization for .NET (preview)](/dotnet/azure/migration/appmod/overview?toc=/azure/developer/migrate/toc.json&bc=/azure/developer/migrate/breadcrumb/toc.json)
