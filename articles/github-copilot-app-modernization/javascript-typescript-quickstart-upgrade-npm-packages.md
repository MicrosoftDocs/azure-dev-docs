---
title: Upgrade npm Packages in a JavaScript or TypeScript Project by Using GitHub Copilot modernization
description: Learn how to upgrade npm packages in a JavaScript or TypeScript project using GitHub Copilot modernization in Visual Studio Code or Visual Studio.
author: KarlErickson
ms.author: karler
ms.reviewer: yangtony
ms.topic: quickstart
ms.date: 06/02/2026
ms.custom: devx-track-js, devx-track-ts
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ai-usage: ai-assisted
---

# Quickstart: Upgrade npm packages in a JavaScript or TypeScript project by using GitHub Copilot modernization

This quickstart shows you how to use GitHub Copilot modernization to upgrade npm packages in a JavaScript or TypeScript project. GitHub Copilot modernization for JavaScript/TypeScript analyzes your project, suggests an upgrade plan, automatically upgrades packages, and helps you apply any necessary code changes.

## Prerequisites

- [Node.js and npm](https://nodejs.org/).
- [GitHub Copilot](https://github.com/features/copilot). Sign in to your GitHub account in your IDE.
- One of the following development environments:
  - [Visual Studio Code](https://code.visualstudio.com/Download) with the [GitHub Copilot modernization extension](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure).
  - [Visual Studio](https://visualstudio.microsoft.com/downloads/) 2026 version 18.8.1 or later, which includes GitHub Copilot modernization for JavaScript/TypeScript.

## Open the project

Open your JavaScript or TypeScript project in Visual Studio Code or Visual Studio. The project must contain a `package.json` file for the tool to detect it.

## Start the upgrade

To start the npm package upgrade process, follow the guidance for your IDE:

# [Visual Studio Code](#tab/visual-studio-code)

Start an upgrade session in one of the following ways:

- Open the **GitHub Copilot modernization** view from the **Activity Bar** on the left side of the window. In the view, select the **Upgrade npm Packages** button. This button appears only when the tool detects a `package.json` file in your project. The Copilot Chat window then opens automatically.
- Open **Copilot Chat**, select agent mode, and enter a prompt that describes what you want to do, such as *"Upgrade the npm packages in my TypeScript project."*

# [Visual Studio](#tab/visual-studio)

In **Solution Explorer**, right-click a project and then select **Modernize**. Or, open **GitHub Copilot Chat** and type *"@modernize"* followed by a prompt that describes what you want to do, such as *"Upgrade the npm packages in my TypeScript project."*

---

After you start a session, Copilot analyzes your project and proposes an upgrade plan. Continue with the following steps:

1. Review the plan in the Copilot Chat window.

1. Follow the prompts in Copilot Chat. Copilot asks questions and requests confirmations as it walks you through each stage of the upgrade. The tool is interactive, so answer questions in the chat as they appear.

1. Copilot upgrades your `package.json` file, runs the appropriate package-manager commands for your project (such as `npm install`, `npm update`, `pnpm install`, or `yarn install`), and suggests code changes if any breaking changes or API updates require modifications.

Behind the scenes, the tool operates in an iterative loop: it analyzes the project, makes changes, verifies the build or checks for issues, and repeats as necessary. This process runs in Copilot's agent mode to provide intelligent, context-aware assistance. The tool creates a dedicated branch for the upgrade session and commits changes to that branch automatically as it works.

> [!TIP]
> Beyond npm package upgrades, GitHub Copilot modernization for JavaScript/TypeScript can help with related modernization tasks through natural-language prompts in Copilot Chat. For example, you can ask it to upgrade the TypeScript compiler version in your project.

## Review changes and create a pull request

When the upgrade session completes, review what the tool did and decide whether to merge the work:

1. Open `summary.md` under `<project>/.github/modernize/code-migration/<timestamp>/` for an overview of what the upgrade session changed.

1. Use your IDE's source control tools to review the commits the tool made on the upgrade branch.

1. Run your project's build and test scripts to verify the upgraded project behaves as expected.

1. When you're satisfied with the changes, create a pull request from the upgrade branch into your main branch using your preferred Git workflow.

## Next steps

- [Overview](javascript-typescript-overview.md)
- [FAQ](javascript-typescript-faq.yml)
- [GitHub Copilot modernization overview](overview.md)
