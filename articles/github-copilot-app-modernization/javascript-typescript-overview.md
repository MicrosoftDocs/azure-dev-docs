---
title: GitHub Copilot Modernization for JavaScript/TypeScript Developers
description: Learn about GitHub Copilot modernization for JavaScript and TypeScript developers, an AI-assisted tool for upgrading npm packages.
author: KarlErickson
ms.author: karler
ms.reviewer: yangtony
ms.topic: overview
ms.date: 05/26/2026
ms.custom: devx-track-js, devx-track-ts
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# GitHub Copilot modernization for JavaScript/TypeScript developers

This article describes GitHub Copilot modernization for JavaScript and TypeScript developers, an AI-assisted tool that helps you upgrade npm packages in your projects.

GitHub Copilot modernization for JavaScript/TypeScript is available as part of the GitHub Copilot modernization extension for Visual Studio Code. Built on GitHub Copilot agent mode, this tool analyzes your project, suggests an upgrade plan, and automatically upgrades npm packages to their latest versions. It also helps you apply necessary code changes to accommodate breaking changes or new APIs.

## Key capabilities

- **Project analysis**: Analyzes files like `package.json` to understand your project's current state and dependencies.
- **Upgrade planning**: Suggests an upgrade plan and provides transparent recommendations before making changes.
- **Package upgrades**: Automatically upgrades npm packages to their latest versions by modifying `package.json` and running the appropriate package-manager commands for your project (such as `npm install`, `npm update`, `pnpm install`, or `yarn install`).
- **Code remediation**: Helps apply code changes needed for breaking changes or new APIs introduced in upgraded packages.
- **Interactive experience**: Works through an interactive Copilot Chat experience in Visual Studio Code, walking you through changes with questions and confirmations.

The tool uses GitHub Copilot under the hood to provide intelligent, context-aware assistance throughout the upgrade process. Behind the scenes, it operates through an iterative loop: analyze, change, verify (build and check), then repeat as needed.

## Limitations

The tool is currently optimized for single-project scenarios:

- **One project at a time**: For monorepos or workspaces with multiple `package.json` files, only the first detected project is targeted. To upgrade multiple projects, open each project folder separately.
- **Visual Studio Code only**: Currently available only in Visual Studio Code through the GitHub Copilot modernization extension.

## Get started

To begin upgrading your JavaScript or TypeScript project with GitHub Copilot modernization, see [Quickstart: Upgrade npm packages in a JavaScript or TypeScript project by using GitHub Copilot modernization](javascript-typescript-quickstart-upgrade-npm-packages.md).

For answers to common questions, see [GitHub Copilot modernization for JavaScript/TypeScript FAQ](javascript-typescript-faq.yml).

## Next steps

- [Quickstart: Upgrade npm packages](javascript-typescript-quickstart-upgrade-npm-packages.md)
- [FAQ](javascript-typescript-faq.yml)
- [GitHub Copilot modernization overview](overview.md)
