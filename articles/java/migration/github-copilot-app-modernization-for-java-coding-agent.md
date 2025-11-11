---
title: Modernizing Java Apps Using GitHub Copilot App Modernization in Coding Agent
titleSuffix: Azure
description: Provides an overview of how Java developers can modernize applications using GitHub Copilot App Modernization in Copilot Coding Agent.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: overview
ms.date: 11/11/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Modernizing Java Apps Using GitHub Copilot App Modernization in Coding Agent

## Overview

This article provides an overview of how Java developers can modernize their applications using **GitHub Copilot App Modernization** within the [**Copilot Coding Agent**](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent). The agent can work independently in the background to complete modernization tasks—just like a human developer. Developers can delegate tasks via issues or pull requests, and the agent executes them in the cloud, helping teams complete the entire modernization journey efficiently.  

## Prerequisites
- [**Copilot Coding Agent**](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) installed and configured  
- Ensure you have GitHub Copilot Pro, Pro+, Business, or Enterprise plan

## Getting Started
1. Open your IDE or terminal with Copilot Coding Agent enabled.  
2. Connect the agent to your project repository.  
3. Configure MCP (Managed Copilot Package) if you want advanced modernization features.  
4. Initiate a modernization session, for example:  
   ```text
   Modernize this Java web application to Spring Boot 3 and deploy to Azure App Service
