---
title: GitHub Copilot App Modernization Java Utilities
titleSuffix: Azure
description: Describes Java-focused tools available in GitHub Copilot app modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: reference
ms.date: 09/23/2025
ms.custom: devx-track-java
---

# GitHub Copilot app modernization Java utilities

This article describes several Java-focused tools that are now available using GitHub Copilot app modernization. These tools provide more flexibility for day-to-day development and code maintenance.

## Validation

- `validate_cves_for_java`

  Scans your project for known Java-related Common Vulnerabilities and Exposures (CVEs) and validates that critical vulnerabilities are addressed.

  **Sample prompt:**

  ```prompt
  Check if there's any CVE issues in this Java project using #validate_cves_for_java
  ```

  :::image type="content" source="media/general/common-vulnerabilities-exposures.png" alt-text="Screenshot of Visual Studio Code that shows Copilot checking for CVE issues." lightbox="media/general/common-vulnerabilities-exposures.png":::

## Unit testing

- `run_tests_for_java`

  Executes your project's unit test suite and reports the results.

  **Sample prompt:**

  ```prompt
  Run unit tests for this Java project using #run_tests_for_java
  ```

- `generate_tests_for_java`

  Automatically generates unit tests for your Java code using AI-based code understanding.

  **Sample prompt:**

  ```prompt
  Generate unit test for this Java project using #generate_tests_for_java
  ```

For more information on test generation, see the relevant documentation or article.

These tools help streamline the Java development lifecycle, making it easier to adopt best practices for upgrades, testing, and security validation regardless of whether you're in an upgrade session.

## See also

[GitHub Copilot app modernization](/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java?toc=/java/upgrade/toc.json&bc=/java/upgrade/breadcrumb/toc.json)
