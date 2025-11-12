---
title: Modernizing Java Apps Using GitHub Copilot App Modernization in Copilot CLI
titleSuffix: Azure
description: Provides an overview of how Java developers can modernize applications using GitHub Copilot App Modernization in the Copilot CLI.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: overview
ms.date: 11/11/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Modernizing Java Apps Using GitHub Copilot App Modernization in the Copilot CLI

## Overview

This article provides an overview of how Java developers can modernize their applications using **GitHub Copilot App Modernization** within the [**Copilot CLI**](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli), enabling them to modernize applications wherever they code. It delivers a seamless, end-to-end experience—from upgrade and migration to deployment — helping teams accelerate transformation, boost productivity, and confidently move their applications to modern platforms. It’s currently in public preview — give it a try and let us know if any [feedback](https://aka.ms/ghcp-appmod/feedback).

>[!NOTE]
>GitHub Copilot CLI is available with the GitHub Copilot Pro, GitHub Copilot Pro+, GitHub Copilot Business and GitHub Copilot Enterprise plans.
>If you receive Copilot from an organization, the Copilot CLI policy must be enabled in the organization's settings.

## Why Use Copilot CLI with App Modernization
- Run modernization tasks directly from the terminal — no need to switch to an IDE  
- Supports both interactive (human-in-the-loop) and batch workflows

## Supported Scenarios
- [Upgrade your Java application](/java/upgrade/quickstart-upgrade)
- [Migrate your Java application to Azure](migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate.md)
- [Deploy your Java application to Azure](migrate-github-copilot-app-modernization-for-java-quickstart-deploy-to-azure.md)

## Prerequisites
- [Install Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli)
- A GitHub Copilot subscription, See [Copilot plans](https://github.com/features/copilot/plans?ref_product=copilot)
- Node.js version 22 or later
- npm version 10 or later

## Getting Started
1. In your terminal, navigate to the Java project folder containing the code you want to work on.
2. Enter `copilot` to start Copilot CLI.
   Copilot will ask you to confirm that you trust the files in this folder. Refer to [Using Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#trusted-directories)
   Choose one of the options:
    1. Yes, proceed: Copilot can work with the files in this location for this session only.
    2. Yes, and remember this folder for future sessions: You trust the files in this folder for this and future sessions. You won't be asked again when you start Copilot CLI from this folder. Only choose this option if you are sure that it will always be safe for Copilot to work with files in this location.
    3. No, exit (Esc): End your Copilot CLI session.
3. You can add MCP servers by running `mcp add` in Copilot CLI according to the configuration below, or by manually updating the `~/.config/mcp-config.json` file with the following info. Refer to [Add an MCP server](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#add-an-mcp-server)
```
{
  "mcpServers": {
    // for executing Java upgrade tasks
    "java-upgrade": {
      "type": "local",
      "tools": [
        "*"
      ],
      "command": "npx",
      "args": [
        "-y",
        "vscode-java-upgrade" // TODO: update to actual package name
      ]
    }
    //TODO: java migration
    //TODO: java deployment
  }
}
```
## Running App Modernization Tasks
### Upgrade your Java Application
### Migrate your Java Application to Azure
### Deploy your Java Application to Azure

## Feedback
If you have any feedback about GitHub Copilot CLI, please let us know your [feedback](https://aka.ms/ghcp-appmod/feedback).

## Reference
- [Using GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli#using-copilot-cli).