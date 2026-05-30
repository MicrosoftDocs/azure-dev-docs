---
title: GitHub Copilot Modernization Java Utilities
description: Learn about Java-focused tools available in GitHub Copilot modernization that help with CVE validation, unit testing, and code maintenance.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: reference
ms.date: 06/02/2026
ms.custom: devx-track-java
---

# GitHub Copilot modernization Java utilities

This article describes several Java-focused tools that are available through GitHub Copilot modernization. These tools provide more flexibility for day-to-day development and code maintenance. You can invoke them directly in Copilot Chat using the `#` prefix.

## Validation

- `#appmod-validate-cves-for-java`

  Scans your project for known Java-related Common Vulnerabilities and Exposures (CVEs) and validates that critical vulnerabilities are addressed.

  **Sample prompt:**

  ```prompt
  Check if there's any CVE issues in this Java project using #appmod-validate-cves-for-java
  ```

  :::image type="content" source="media/general/common-vulnerabilities-exposures.png" alt-text="Screenshot of Visual Studio Code that shows Copilot checking for CVE issues." lightbox="media/general/common-vulnerabilities-exposures.png":::

## Unit testing

- `#appmod-generate-tests-for-java`

  Uses AI-based code understanding to automatically create unit tests for your Java code.

  **Sample prompt:**

  ```prompt
  Generate unit tests for this Java project using #appmod-generate-tests-for-java
  ```

These tools help streamline the Java development lifecycle. They make it easier to adopt best practices for upgrades, testing, and security validation, regardless of whether you're in an upgrade session.

## See also

[GitHub Copilot modernization](/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java?toc=/java/upgrade/toc.json&bc=/java/upgrade/breadcrumb/toc.json)
