---
title: Upgrade a Java Framework or Third-Party Dependency by Using GitHub Copilot App Modernization
description: Shows you how to use GitHub Copilot app modernization to upgrade a framework or third-party dependency without requiring a JDK runtime upgrade.
author: KarlErickson
ms.author: karler
ms.reviewer: xinrzhu
ms.topic: how-to
ms.date: 09/23/2025
ms.custom: devx-track-java
---

# Upgrade a Java framework or third-party dependency by using GitHub Copilot app modernization

This article shows you how to use GitHub Copilot app modernization to upgrade a Java framework or third-party dependency without requiring a JDK runtime upgrade.

## Initiate a framework upgrade

To initiate this type of upgrade, you can start a prompt in agent mode. For example:

```prompt
upgrade this Java project to Spring Boot 3.2
```

:::image type="content" source="media/framework-upgrade/upgrade-spring-boot-only.png" alt-text="Screenshot of Visual Studio Code that shows Copilot trying to upgrade to Spring Boot 3.2 only." lightbox="media/framework-upgrade/upgrade-spring-boot-only.png":::

## Handle compatibility

If your current JDK version is compatible with the specified Spring Boot version - for example, JDK 17+ for Spring Boot 3.2 - the tool performs a framework-only upgrade. Both the source and target JDK versions remain the same and the target Spring Boot version is set according to your initial prompt.

If your current JDK version isn't compatible with the target framework version - for example, when upgrading from JDK 8 to Spring Boot 3.2 - the tool automatically upgrades the JDK to the minimum supported version required by the framework - in this case, JDK 17 - in addition to performing the framework upgrade.

## Upgrade third-party libraries

You can also use a similar prompt to upgrade a third-party library. For example:

```prompt
use the java upgrade tools to upgrade "com.google.inject.guice" to 6.0.0 in this java project
```

:::image type="content" source="media/framework-upgrade/upgrade-library-only.png" alt-text="Screenshot of Visual Studio Code that shows Copilot trying to upgrade a Google library to a newer version." lightbox="media/framework-upgrade/upgrade-library-only.png":::

When you initiate a prompt to upgrade a specific third-party library - for example, `Upgrade com.google.inject.guide to version 3.17.0` - GitHub Copilot analyzes the current project and generates an upgrade plan focused solely on updating the requested dependency.

## What Copilot does during the upgrade

As part of this process, Copilot might perform the following tasks:

- Modify code or configuration files to ensure compatibility with the new library version.
- Perform build validation to confirm the project compiles successfully.
- Run CVE checks to detect and surface any security issues.
- Execute test validation to ensure no new test failures are introduced.

This *targeted upgrade flow* enables you to modernize dependencies with transparency and control.

## See also

[GitHub Copilot app modernization](/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java?toc=/java/upgrade/toc.json&bc=/java/upgrade/breadcrumb/toc.json)
