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

> [!IMPORTANT]
> After the analysis and planning phases complete, the agent pauses and asks for your confirmation before it begins code generation. Review the plan carefully at this point. You can request changes to the plan, adjust priorities, or add constraints before the agent proceeds with the implementation.

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

## Troubleshoot common issues

During the re-architecture process, the agent generates artifacts in the `.github/modernize/` directory of your project. Use these artifacts to diagnose issues when they arise.

### Review generated artifacts

The `.github/modernize/` directory contains the following key resources:

- `board.md` - The task board that tracks every phase and its status. Check this file to see which tasks passed, failed, or required iterations.
- `artifacts/` - Detailed reports from each task. Files follow a naming convention such as `t21-tester-report.md` for the initial test report, or `t21.2-tester-report.md` for a retry iteration.
- `learn.md` - A cumulative knowledge base of discoveries, bug findings, and techniques logged by each role during task execution. Check this file for insights into issues the agent encountered and how it resolved them.
- `team/` - Role-specific charters that define each agent's responsibilities.

When a quality gate fails, the agent creates iteration artifacts (for example, `t21.1`, `t21.2`) that document the fix attempts. Look for these numbered iterations to understand how an issue was detected and resolved.

### Review the analysis and plan

Before the agent starts writing code, it produces analysis and planning artifacts that you should review. These artifacts give you visibility into what the agent understood about your project and what it intends to build.

The analysis artifacts include:

- **Architecture summary**: An overview of the existing tech stack, project structure, data model, and integration points. Check this to verify the agent correctly identified your project's key components. Look for files such as `artifacts/t2-architect-architecture-summary.md`, `artifacts/t2-architect-tech-stack.md`, and `artifacts/t2-architect-data-model.md`.
- **Feature inventory**: A catalog of all features in the original application, each assigned a requirement ID (for example, `REQ-001`). Verify that this list is complete and accurate. Look for `artifacts/t3-pm-spec.md`.
- **Target architecture design**: The proposed API contracts, module structure, and technology choices for the new application. Look for files such as `artifacts/t5-architect-api-contracts.md` and `artifacts/t5-architect-integration.md`.

The planning artifacts include:

- **Implementation plan**: An ordered list of tasks with dependencies, grouped into phases. Each task maps back to one or more requirements from the feature inventory. Look for `artifacts/t7-teamlead-plan.md`.
- **Testing strategy**: The planned approach for unit tests, integration tests, and end-to-end tests. Look for `artifacts/t7-teamlead-testing-strategy.md`.

The agent pauses after generating these artifacts and waits for your confirmation. Use this opportunity to:

- Verify that no features are missing from the inventory.
- Check that the target architecture matches your expectations.
- Adjust task priorities or add constraints before implementation begins.

Careful review at this stage helps avoid costly rework during the implementation and validation phases.

### Build and startup failures

If the transformed application fails to compile or start, use the following approach:

1. Check the tester report artifact (for example, `t21-tester-report.md`) for build output and stack traces.
1. Search for the exception type or error message in the artifact to identify the root cause.
1. If the agent created fix iterations (for example, `t21.1`, `t21.3`), review those artifacts to see what changes were attempted.

Common root causes include naming collisions between legacy and newly generated classes, incorrect Spring profile configurations, and missing or conflicting dependencies in `pom.xml`. For example, if legacy and modern controllers share the same class name, Spring throws a `ConflictingBeanDefinitionException` at startup.

### Runtime errors

If the application starts but API calls return errors (such as 500 or 400 responses), use the following approach:

1. Check the tester report artifact for which endpoints failed and the associated error messages.
1. Review the security findings artifact (for example, `t20-security-findings.md`) for configuration issues.
1. Inspect the generated entity classes and controller code for mismatches between the database schema and the ORM mappings.

Common root causes include database reserved keyword conflicts in `@Column` annotations, mismatches between DTO field types and entity field types, and missing validation annotations on request objects.

### Quality gate failures and iterations

The agent enforces several quality gates during the re-architecture process. When a gate fails, the agent automatically creates fix tasks and retries validation. Common gate failures include:

- **Architecture review**: The agent checks that the implementation matches the designed API contracts, DTO structures, and endpoint mappings. Failures typically involve missing endpoints, renamed fields, or missing validation annotations. Review the architect report artifact (for example, `t19-architect-review.md`) for specific findings.
- **Conformance review**: The agent verifies that the implementation meets all principles defined in the initial constitution. A common failure is missing browser-level end-to-end tests when the constitution requires them. Review the team lead review artifact (for example, `t22-teamlead-review.md`) to identify which principles weren't satisfied.
- **Feature parity sign-off**: The agent verifies that all cataloged requirements are implemented. A partial sign-off means specific features are incomplete, for example, missing cross-field validation such as ensuring `fromDate` is before `toDate`. Review the PM sign-off artifact (for example, `t23-pm-signoff.md`) for the requirement-by-requirement breakdown.

If the agent reaches its iteration limit without resolving all issues, review the latest artifact files to understand remaining gaps and apply manual fixes.

### Runtime validation prerequisites

The agent performs optional runtime validation steps that depend on external tools. If a tool isn't available, the corresponding step is skipped:

- **Python not installed**: The knowledge graph step is skipped. The agent can still perform the re-architecture, but might have less context about your project structure. Install Python 3.7 or later and ensure `python3` is available in your PATH.
- **Node.js not installed**: Playwright browser-level end-to-end tests are skipped. The agent still runs integration tests through Maven. Install Node.js 18 or later to enable browser testing.
- **Docker not available**: Runtime validation (starting the application in a container and verifying it serves requests) is skipped. The agent relies on unit and integration tests instead. Install and start Docker Desktop to enable this step.

## Limitations

Because this feature is in preview, the following limitations apply:

- Complex projects with deeply coupled legacy frameworks might require multiple iterations.
- You should review generated code carefully before committing changes.

## Provide feedback

If you have any feedback about the re-architecture feature, [create an issue at the github-copilot-appmod repository](https://github.com/microsoft/github-copilot-appmod/issues/new?template=feedback-template.yml) or use the [GitHub Copilot modernization feedback form](https://aka.ms/ghcp-appmod/feedback).
