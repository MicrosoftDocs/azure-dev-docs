---
title: Modernization Agent Overview
description: Learn about the GitHub Copilot modernization agent, its key capabilities, and how it enables end-to-end application modernization.
author: KarlErickson
ms.author: karler
ms.topic: overview
ai-usage: ai-assisted
ms.date: 03/11/2026
keywords: modernize cli, modernization agent
---

# Modernization agent overview

This overview describes the GitHub Copilot modernization agent, which is currently in public preview.

> [!TIP]
> **Want to try it now?** To install the CLI and modernize your first application, see the [quickstart guide](quickstart.md).

Organizations modernizing multiple applications need consistency, repeatability, and the ability to define standards that apply across every dev team and repository. The modernization agent is built for these requirements.

Delivered through the Modernize CLI, the modernization agent enables **agentic, end-to-end application modernization** through intelligent workflow orchestration. It provides architects and app owners with a platform to define modernization standards once - via customizable, reusable skills - and apply them consistently across multiple applications and repositories. It offers a unified CLI and TUI experience for hands-on modernization of individual applications.

The modernization agent supports the full modernization lifecycle through an **Assess → Plan → Execute** model that ensures every application follows the same governed, repeatable path to cloud readiness:

- **Multi-repo assessment**: Assess multiple applications and repositories simultaneously to identify modernization opportunities, map dependencies, and generate cloud readiness scores.
- **Upgrades and migrations**: Perform framework upgrades, language version migrations, containerization, and cloud service integrations through structured, repeatable workflows.
- **Customizable skills**: Define organization-specific migration patterns, internal library usage, and coding standards as reusable custom skills. These skills enable consistent modernization across your organization while using proprietary knowledge.
- **Structured planning**: Generate reviewable modernization plans with ordered tasks and success criteria, aligned to organizational goals.
- **Autonomous execution**: Apply code transformations, dependency upgrades, and validation checks automatically, with version-controlled traceability at each step.
- **Batch operations**: Run modernization workflows across multiple applications in non-interactive mode, with support for CI/CD pipeline integration.

## What is the Modernize CLI?

The Modernize CLI is the command-line experience within **GitHub Copilot modernization**. It orchestrates modernization workflows by combining deterministic automation with AI-powered intelligence.

It provides a flexible execution substrate for both local and scaled modernization scenarios.

### Core capabilities

- **Deterministic automation**: Enables orchestration, business workflow, and platform integrations.
- **AI-powered intelligence**: Provides context-aware code analysis, modernization plan generation, and guided transformations via GitHub Copilot.

### Flexible execution modes

- **Interactive workflows (TUI)**: Designed for complex, decision-intensive scenarios requiring human oversight.
- **Non-interactive workflows**: Automated execution optimized for CI/CD pipelines and large-scale modernization.

## Key capabilities

### 1. Application assessment

The Modernize CLI assesses applications and repositories to determine modernization readiness:

- **Automated scanning**:  Evaluates code, configuration, and dependencies by using built-in tools and AI capabilities.
- **Single or multi-repository assessment**: Assesses individual applications or multiple repositories simultaneously.
- **Rich aggregated reports**: Delivers comprehensive insights with cross-repository analysis, dependency mapping, and cloud readiness scores.
- **GitHub integration**: Optionally publishes assessment summaries directly to GitHub issues.

### 2. Intelligent planning

Generate detailed modernization plans aligned to enterprise intent:

- **AI-driven contextual analysis**: Interprets modernization goals, such as upgrade, migrate, and deploy, in the context of your codebase.
- **Diverse modernization scenarios**: Supports upgrades, framework migrations (Spring Boot), containerization, and Azure service integrations.
- **Extensible customization via skills**: Plug in organization-specific skills to encode enterprise standards and patterns.
- **Structured task breakdown**: Converts complex modernization efforts into ordered, executable steps with success criteria.
- **Editable plans**: Review, refine, and approve plans before execution.

### 3. Autonomous execution

Execute modernization plans with validation at every stage:

- **Code transformations**: Automated dependency upgrades, API replacements, and framework updates.
- **Build and validation checks**: Ensure successful compilation and integrity after each step.
- **Security scanning**: Identify and address Common Vulnerabilities and Exposures (CVEs).
- **Version control integration**: Create branches and commits with traceable change history.
- **Cloud alignment**: Support containerization and deployment workflows as part of execution.

You can also delegate assessment, upgrade, and execution tasks to GitHub Copilot Coding Agent for enhanced tracking and collaboration.

### 4. Multi-repo and batch modernization

This solution is designed for enterprise-scale modernization across large portfolios:

- **Parallel processing**: Assess and upgrade multiple repositories simultaneously.
- **Batch operations**: Execute modernization workflows across entire estates.
- **CI/CD integration**: Run headless in automated pipelines.
- **Progress tracking**: Monitor modernization status across applications.

## Get started

Ready to modernize your applications? Follow these steps:

1. **[Install and try the Modernize CLI](quickstart.md)**: Get started in minutes with the interactive quickstart.
2. **[Learn the CLI commands](cli-commands.md)**: Explore all available commands and options.
3. **[Scale to multiple repos](batch-assess.md)**: Assess and upgrade applications at enterprise scale.

> [!NOTE]
> New users should start with the [quickstart guide](quickstart.md) to experience the full workflow on a sample application.

## When to use the modernization agent

Use the modernization agent when you need:

- **Agentic modernization**: Autonomous execution of complex upgrades and migrations.
- **Enterprise-scale operations**: Batch modernization across multiple repositories.
- **CI/CD integration**: Embedding modernization into automated delivery workflows.
- **Consistent enterprise patterns**: Applying standardized modernization approaches through reusable skills.
- **Hybrid execution modes**: Switching between interactive and fully automated modes.
- **Custom migrations**: Using organization-specific patterns through custom skills.

## Next steps

**Get started:**
- [**Quickstart: Install and try the CLI**](quickstart.md): Best place to start! Modernize your first app in 5-10 minutes.

**Learn more:**
- [CLI command reference](cli-commands.md)
- [Batch assessment: Assess multiple applications](batch-assess.md)
- [Batch upgrade: Upgrade multiple applications](batch-upgrade.md)
- [Customization with skills](customization.md)

## Provide feedback

We value your input! If you have any feedback about the Modernization Agent, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot modernization feedback form](https://aka.ms/ghcp-appmod/feedback).
