---
title: Optimize GitHub Copilot Modernization Settings for IntelliJ
description: Learn how to configure GitHub Copilot modernization to optimize the experience for IntelliJ.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: how-to
ms.date: 06/02/2026
ms.custom: devx-track-java
---

# Configure settings for GitHub Copilot modernization to optimize the experience for IntelliJ

This article shows you how to configure GitHub Copilot modernization on IntelliJ to optimize the experience. Because GitHub Copilot modernization relies on Model Context Protocol (MCP) tools, these adjustments help ensure smoother execution.

## Increase maximum requests per turn to 100

Because GitHub Copilot modernization tasks can be long-running, increase the **maximum requests per turn** in Agent Mode from the default of 25 to **100**. Adjust this setting directly in the **GitHub Copilot settings**.

:::image type="content" source="media/configure-settings-intellij/max-request.png" alt-text="Screenshot of IntelliJ that shows the GitHub Copilot settings pane with the Max Requests settings highlighted." lightbox="media/configure-settings-intellij/max-request.png":::
