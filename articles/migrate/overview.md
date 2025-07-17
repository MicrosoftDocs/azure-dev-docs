---
title: Migrate applications to Azure
description: Provides an overview of GitHub Copilot App Modernization.
author: KarlErickson
ms.author: karler
ms.topic: upgrade-and-migration-article
ms.date: 07/16/2025
---

# Migration overview

Modernizing applications and migrating to the cloud is typically a complex, labor-intensive, and fragmented process. GitHub Copilot App Modernization is a powerful solution designed to simplify and accelerate your journey to the cloud. App Modernization and upgrade offers an intelligent, guided approach that automates Java version upgrade and repetitive tasks and improves consistency — saving time, reducing risks, and accelerating time-to-cloud.

GitHub Copilot App Modernization and upgrade is in public preview and offered in a single extension pack, available in the [VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-app-mod-pack).

## Six value pillars

The GitHub Copilot App Modernization provides six distinct value pillars, each specifically tailored to address particular challenges encountered during the application modernization process.

:::image type="content" source="media/overview/value-pillars.png" alt-text="Diagram of the six value pillars with heading GitHub Copilot App Modernization, Smarter Upgrades, Rapid Migration to the cloud." lightbox"media/overview/value-pillars.png":::

### 1. Intelligent issue analysis and recommendations

Modernization starts with insight. Whether you're upgrading a runtime or migrating to Azure, modernization starts with understanding your code.

GitHub Copilot App Modernization analyzes your project's current state and generates a modernization plan, offering context-aware fixes and actionable recommendations from Azure Migrate Application Code Assessment Tool (AppCAT), so you spend less time diagnosing and more time modernizing.

AppCAT is also available as a stand-alone CLI tool that you can run independently from the App Modernization VS Code extension. See AppCAT to learn more.

### 2. Expert-led code transformation

Once plan is generated, GitHub Copilot App Modernization is a powerful code transformation engine that combines expert-led migration strategies and automated upgrade. Whether you're moving to a later language version or replatforming for Azure services, Copilot applies structured changes with precision.

For modernization scenarios, GitHub Copilot App Modernization offers predefined AI-powered formulas that encode proven migration strategies, applying expert knowledge to common Azure migration scenarios with high accuracy. Currently, app modernization offers predefined formulas that cover common migration scenarios including secret management, message queue integration, Identity and more. See predefined formulas for complete list of formulas available.

For upgrades, GitHub Copilot App Modernization uses tools like OpenRewrite to perform refactoring, including API replacements and dependency updates, while GitHub Copilot addresses any remaining issues.

### 3. Automation through learning

Beyond predefined formulas or strategies, developers can capture migration logic into reusable formulas, by converting Git commits into reusable migration patterns, or custom formulas, allowing Copilot to apply learned remediations across multiple codebases with consistency and precision.

Custom formulas can be created from one or more commits, provided they accurately reflect the intended coding behaviors. The example below combines previous code changes from local file to Azure Blob and RabbitMQ to Azure Service Bus into one powerful, all-encompassing formula, and executes it against my current project.

Whether you're applying a fix in the upgrade or ensuring Azure migration consistency across teams, GitHub Copilot uses these learned patterns to accelerate transformation with precision and repeatability.

### 4. Build issue resolution

Modernization isn't complete until your application successfully builds. GitHub Copilot App Modernization helps resolve issues automatically and performs test validations, ensuring error-free transformations and keeping your production pipelines running smoothly.

### 5. Automatic patching for CVEs

The GitHub Copilot App Modernization scans for CVE vulnerabilities after the upgrade process is completed. When CVE issues are detected, the tool automatically fixes the issues within the Agent Mode, allowing the user to review the fixes. This improves the application's security posture and ensures compliance with organizational guidelines.

### 6. Automated deployment to Azure

When you're ready, GitHub Copilot for Azure helps facilitate automated deployment to Azure, completing the app modernization process. When the Copilot agent is requested to deploy your application, it creates the required Infrastructure as Code files, deploys the application, addresses any deployment errors encountered, and sets up CI/CD pipelines. GitHub Copilot for Azure is a separate extension today and efforts are underway to integrate it with GitHub Copilot App Modernization.

## Get started today

- [Modernize your first app](https://aka.ms/AM4JGetStarted)
- [Upgrade your first app](https://aka.ms/ghcp-appmod/java-upgrade-docs)
- [Deploy your app to Azure](https://aka.ms/copilot-agent-deploy)
- [Self-paced workshop](https://aka.ms/AM4JWorkshop)
- [Provide feedback](https://aka.ms/AM4JFeedback)
