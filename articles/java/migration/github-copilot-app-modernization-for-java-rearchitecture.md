---
title: Re-architect Projects by Using GitHub Copilot Modernization
titleSuffix: Azure
description: Learn how to use the re-architecture feature in GitHub Copilot modernization to rewrite projects from legacy frameworks to modern architectures.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: overview
ms.date: 04/17/2026
ms.custom: devx-track-java
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ai-usage: ai-generated
---

# Re-architect projects by using GitHub Copilot modernization

This article describes how to use the re-architecture feature in GitHub Copilot modernization to rewrite projects from legacy frameworks to modern architectures, such as from Struts to Spring MVC.

> [!IMPORTANT]
> The re-architecture feature is currently in preview. Preview features might have limited capabilities and aren't recommended for production use.

## Overview

The re-architecture feature enables you to transform an entire project from a legacy framework to a modern architecture by using an AI-powered multi-agent workflow. Instead of manual, file-by-file migration, you can describe the desired transformation in natural language, and the modernization agents handle analysis, planning, and code generation.

Common re-architecture scenarios include:

- Struts to Spring MVC
- JSP to Thymeleaf
- EJB to Spring Boot
- Legacy servlet-based applications to modern Spring-based architectures

## Prerequisites

- Visual Studio Code with the [GitHub Copilot modernization](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure) extension installed.
- A GitHub Copilot subscription. For more information, see [Copilot plans](https://github.com/features/copilot/plans?ref_product=copilot).
- (Optional) [Python](https://www.python.org/downloads/) 3.7 or later for building a knowledge graph, which gives the agent a clearer understanding of your project structure during the rewriting process. If Python isn't available, the knowledge graph step is skipped.
- (Optional) [Node.js](https://nodejs.org/) 18 or later for running Playwright tests as part of runtime validation. If Node.js isn't available, the Playwright test step is skipped.
- (Optional) [Docker Desktop](https://www.docker.com/products/docker-desktop/) for runtime validation. If Docker isn't available, the runtime validation step is skipped.

## Enable the re-architecture feature

The re-architecture feature is in preview, so you need to activate it manually in Visual Studio Code.

Use the following steps to enable the feature:

1. In Visual Studio Code, open the **Settings** editor by selecting **File** > **Preferences** > **Settings** (or **Code** > **Preferences** > **Settings** on macOS).

1. Search for `appmod.experimental.task.rearchitecture`.

1. Select the checkbox to enable the re-architecture feature.

Alternatively, add the following entry to your `settings.json` file:

```json
{
  "appmod.experimental.task.rearchitecture": true
}
```

## Use the re-architecture agent

After you enable the feature, use the re-architecture agent in the GitHub Copilot Chat panel.

Use the following steps to re-architect a project:

1. Open your project in Visual Studio Code.

1. Open the **GitHub Copilot Chat** panel.

1. Select the **modernize-rearchitecture** agent from the agent list.

1. Describe the transformation you want to perform. For example:

   ```prompt
   Rewrite the entire project from Struts to Spring MVC
   ```

The agent coordinates a multi-agent team that performs the following steps:

1. **Analysis** - Examines the existing codebase, identifying framework patterns, dependencies, and module boundaries.
1. **Planning** - Generates a structured implementation plan with ordered tasks and requirement traceability.
1. **Execution** - Applies code transformations following the plan, with validation checks at each step.

### Provide more context

You can improve the transformation results by providing additional context in your prompt:

- Specify target framework versions, for example, "Use Spring Boot 3.2 and Java 21."
- Reference documentation links or migration guides.
- Describe organization-specific patterns or conventions.
- Indicate which modules or packages to prioritize.

For example:

```prompt
Rewrite the entire project from Struts to Spring MVC using Spring Boot 3.2.
Refer to the Spring MVC migration guide at https://docs.spring.io/spring-framework/reference/web/webmvc.html.
Keep the existing backend business logic unchanged.
```

## Limitations

Because this feature is in preview, the following limitations apply:

- Complex projects with deeply coupled legacy frameworks might require multiple iterations.
- You should review generated code carefully before committing changes.

## Provide feedback

If you have any feedback about the re-architecture feature, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot modernization feedback form](https://aka.ms/ghcp-appmod/feedback).
