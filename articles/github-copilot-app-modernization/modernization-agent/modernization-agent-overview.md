---
title: Modernization Agent Overview
description: Learn about the GitHub Copilot modernization agent, its key capabilities, and how it enables end-to-end application modernization.
author: KarlErickson
ms.author: karler
ms.topic: overview
ai-usage: ai-assisted
ms.date: 02/26/2026
keywords: modernize cli, modernization agent
---

# Modernization Agent Overview

The **modernization agent**, part of **GitHub Copilot modernization**, is currently in public preview.

> [!TIP]
> **Want to try it now?** Skip to the [quickstart guide](modernization-agent-quickstart.md) to install the CLI and modernize your first application.

Delivered through the Modernize CLI, the modernization agent enables **agentic, end-to-end application modernization** through intelligent workflow orchestration. It provides a unified CLI and TUI experience for assessing applications and repositories for cloud readiness, aligned to enterprise modernization intent.

The modernization agent guides applications from legacy states to cloud-ready architectures by:

- Analyzing codebases and repository structures  
- Identifying modernization opportunities  
- Generating structured modernization plans  
- Executing and orchestrating modernization tasks  
- Validating changes and supporting containerization and deployment workflows  

## What is the Modernize CLI?

The Modernize CLI is the command-line experience within **GitHub Copilot modernization**. It orchestrates modernization workflows by combining deterministic automation with AI-powered intelligence.

It provides a flexible execution substrate for both local and scaled modernization scenarios.

### Core capabilities

- **Deterministic automation** — Enablee orchestration, business workflow and platform integrations  
- **AI-powered intelligence** — Context-aware code analysis, modernization plan generation, and guided transformations via GitHub Copilot  

### Flexible execution modes

- **Interactive workflows (TUI)** — Designed for complex, decision-intensive scenarios requiring human oversight  
- **Non-interactive workflows** — Automated execution optimized for CI/CD pipelines and large-scale modernization  

## Key capabilities

### 1. Application assessment

Assess applications and repositories to determine modernization readiness:

- **Automated scanning**:  Evaluate code, configuration, and dependencies using built-in tools and AI capabilities
- **Single or multi-repository assessment**: Assess individual applications or multiple repositories simultaneously
- **Rich aggregated reports**: Delivers comprehensive insights with cross-repository analysis, dependency mapping, and cloud readiness scores
- **GitHub integration**: Optionally publish assessment summaries directly to GitHub issues

### 2. Intelligent planning

Generate detailed modernization plans aligned to enterprise intent:

- **AI-driven contextual analysis** — Interprets modernization goals (upgrade, migrate, deploy) in the context of your codebase  
- **Diverse modernization scenarios** — Supports upgrades, framework migrations (Spring Boot), containerization, and Azure service integrations  
- **Extensible customization via skills** — Plug in organization-specific skills to encode enterprise standards and patterns  
- **Structured task breakdown** — Converts complex modernization efforts into ordered, executable steps with success criteria  
- **Editable plans** — Review, refine, and approve plans before execution  

### 3. Autonomous execution

Execute modernization plans with validation at every stage:

- **Code transformations** — Automated dependency upgrades, API replacements, and framework updates  
- **Build and validation checks** — Ensure successful compilation and integrity after each step  
- **Security scanning** — Identify and address Common Vulnerabilities and Exposures (CVEs)  
- **Version control integration** — Create branches and commits with traceable change history  
- **Cloud alignment** — Support containerization and deployment workflows as part of execution  

Assessment, upgrade, and execution tasks can also be delegated to GitHub Copilot Coding Agent for enhanced tracking and collaboration.

### 4. Multi-repo and batch modernization

Designed for enterprise-scale modernization across large portfolios:

- **Parallel processing** — Assess and upgrade multiple repositories simultaneously  
- **Batch operations** — Execute modernization workflows across entire estates  
- **CI/CD integration** — Run headless in automated pipelines  
- **Progress tracking** — Monitor modernization status across applications 

## End-to-end modernization workflow

The modernization agent supports a complete lifecycle:

1. **Assess** — Analyze applications to understand current state and identify modernization opportunities  
2. **Plan** — Generate structured, reviewable modernization plans aligned to enterprise goals  
3. **Execute** — Apply changes autonomously with validation, containerization, and deployment support  

This Assess → Plan → Execute model enables consistent, repeatable modernization at scale.

## Get started

Ready to modernize your applications? Follow these steps:

1. **[Install and try the Modernize CLI](modernization-agent-quickstart.md)** — Get started in minutes with our interactive quickstart
2. **[Learn the CLI commands](modernization-agent-cli-commands.md)** — Explore all available commands and options
3. **[Scale to multiple repos](modernization-agent-batch-assess.md)** — Assess and upgrade applications at enterprise scale

> [!NOTE]
> New users should start with the [quickstart guide](modernization-agent-quickstart.md) to experience the full workflow on a sample application.

## When to use the modernization agent

Use the modernization agent when you need:

- **Agentic modernization** — Autonomous execution of complex upgrades and migrations  
- **Enterprise-scale operations** — Batch modernization across multiple repositories  
- **CI/CD integration** — Embedding modernization into automated delivery workflows  
- **Consistent enterprise patterns** — Applying standardized modernization approaches through reusable skills  
- **Hybrid execution modes** — Switching between interactive and fully automated modes  
- **Custom migrations** — Leveraging organization-specific patterns through custom skills

## Next steps

**Get started:**
- 🚀 [**Quickstart: Install and try the CLI**](modernization-agent-quickstart.md) — Best place to start! Modernize your first app in 5-10 minutes

**Learn more:**
- [CLI command reference](modernization-agent-cli-commands.md)
- [Batch assessment: Assess multiple applications](modernization-agent-batch-assess.md)
- [Batch upgrade: Upgrade multiple applications](modernization-agent-batch-upgrade.md)
- [Customization with skills](modernization-agent-customization.md)

## Provide feedback

We value your input! If you have any feedback about the Modernization Agent, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot app modernization feedback form](https://aka.ms/ghcp-appmod/feedback).
