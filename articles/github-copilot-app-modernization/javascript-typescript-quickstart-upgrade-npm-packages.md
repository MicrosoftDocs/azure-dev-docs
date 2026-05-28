---
title: Upgrade npm Packages in a JavaScript or TypeScript Project by Using GitHub Copilot modernization
description: Learn how to upgrade npm packages in a JavaScript or TypeScript project using GitHub Copilot modernization in Visual Studio Code.
author: KarlErickson
ms.author: karler
ms.reviewer: yangtony
ms.topic: quickstart
ms.date: 05/26/2026
ms.custom: devx-javascript, devx-typescript
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Quickstart: Upgrade npm packages in a JavaScript or TypeScript project by using GitHub Copilot modernization

This quickstart shows you how to use GitHub Copilot modernization to upgrade npm packages in a JavaScript or TypeScript project. GitHub Copilot modernization for JavaScript/TypeScript analyzes your project, suggests an upgrade plan, automatically upgrades packages, and helps you apply any necessary code changes.

## Prerequisites

- [Node.js and npm](https://nodejs.org/).
- [Visual Studio Code](https://code.visualstudio.com/Download).
- [GitHub Copilot](https://github.com/features/copilot). Sign in to your GitHub account in Visual Studio Code.
- [GitHub Copilot modernization extension](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure).

## Open the project

Open your JavaScript or TypeScript project folder in Visual Studio Code. The project must contain a `package.json` file for the tool to detect it.

## Start the upgrade

To start the npm package upgrade process, use the following steps:

1. In Visual Studio Code, open the **GitHub Copilot modernization** panel from the Activity Bar on the left side of the window.

1. In the panel, select the **Upgrade npm Packages** button. This button only appears if the tool detects a `package.json` file in your project.

1. The Copilot Chat window opens automatically. Copilot analyzes your project and proposes an upgrade plan. Review the plan in the chat window.

1. Follow the prompts in Copilot Chat. Copilot asks questions and requests confirmations as it walks you through each stage of the upgrade. The tool is interactive, so answer questions in the chat as they appear.

1. Copilot upgrades your `package.json` file, runs `npm install` or `npm update`, and suggests code changes if any breaking changes or API updates require modifications.

Behind the scenes, the tool operates in an iterative loop: it analyzes the project, makes changes, verifies the build or checks for issues, and repeats as necessary. This process runs in Copilot's agent mode to provide intelligent, context-aware assistance. The tool creates a dedicated branch for the upgrade session and commits changes to that branch automatically as it works.

## Review changes and create a pull request

When the upgrade session completes, review what the tool did and decide whether to merge the work:

1. Open `summary.md` under `<project>/.github/modernize/code-migration/<timestamp>/` for an overview of what the upgrade session changed.

1. Use the Visual Studio Code source control panel to review the commits the tool made on the upgrade branch.

1. Run your project's build and test scripts to verify the upgraded project behaves as expected.

1. When you're satisfied with the changes, create a pull request from the upgrade branch into your main branch using your preferred Git workflow.

## Next steps

- [Overview](javascript-typescript-overview.md)
- [FAQ](javascript-typescript-faq.yml)
- [GitHub Copilot modernization overview](overview.md)
