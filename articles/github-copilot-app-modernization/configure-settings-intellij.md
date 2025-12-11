---
title: Configure Settings to Optimize GitHub Copilot App Modernization for IntelliJ
description: Learn how to configure GitHub Copilot app modernization to optimize the experience for IntelliJ.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: how-to
ms.date: 10/28/2025
ms.custom: devx-track-java
---

# Configure settings for GitHub Copilot app modernization to optimize the experience for IntelliJ

This article shows you how to configure GitHub Copilot app modernization on IntelliJ to optimize the experience. Because app modernization relies on Model Context Protocol (MCP) tools, these adjustments are useful to ensure smoother execution.

## Enable auto-approve in MCP sampling

Enabling auto-approve helps prevent repeated approval prompts during the upgrade process. Use the following steps:

1. In IntelliJ, go to **GitHub Copilot > Model Context Protocol (MCP)**. Then, under **Auto Approve for Sampling**, select **Configure**.

   :::image type="content" source="media/configure-settings-intellij/auto-approve-configure.png" alt-text="Screenshot of IntelliJ that shows the MCP settings." lightbox="media/configure-settings-intellij/auto-approve-configure.png":::

1. Locate **java-upgrade** and then select **Auto Approve**.

   :::image type="content" source="media/configure-settings-intellij/auto-approve.png" alt-text="Screenshot of IntelliJ that shows the MCP Sampling Auto-approval settings." lightbox="media/configure-settings-intellij/auto-approve.png":::

## Enable Claude Sonnet 4 model access in MCP sampling

For optimal upgrade results, we recommend enabling access to the **Claude Sonnet 4** model (or newer). Use the following steps to configure model access:

1. In the chat window, select **Configure tools**.

   :::image type="content" source="media/configure-settings-intellij/model-tools.png" alt-text="Screenshot of IntelliJ showing Agent Mode, model selector, and tool selector." lightbox="media/configure-settings-intellij/model-tools.png":::

1. Find **java-upgrade** and then select **Configure Model Access**.

   :::image type="content" source="media/configure-settings-intellij/configure-model-access.png" alt-text="Screenshot of IntelliJ configuring tools" lightbox="media/configure-settings-intellij/configure-model-access.png":::

1. Ensure that **Claude Sonnet 4** (or a newer model) is selected.

   :::image type="content" source="media/configure-settings-intellij/select-models.png" alt-text="Screenshot of IntelliJ selecting models" lightbox="media/configure-settings-intellij/select-models.png":::

## Increase maximum requests to 100

Because app modernization tasks can be long-running, it's best to increase the **maximum requests per turn** in Agent Mode from the default of 25 to **100**. You can adjust this setting directly in the **GitHub Copilot settings**.

:::image type="content" source="media/configure-settings-intellij/max-request.png" alt-text="Screenshot of IntelliJ showing GitHub Copilot settings with max request configuration" lightbox="media/configure-settings-intellij/max-request.png":::
