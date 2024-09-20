---
title: Configure service packaging file inclusions and exclusions
description: How to configure service packaging file inclusions and exclusions for Azure Developer CLI templates
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/20/2024
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Configure service packaging file inclusions and exclusions

The Azure Developer CLI (`azd`) allows you to include ignore files in your templates that specify files and directories to exclude from the deployment package for App Service and Function Apps. This features provides granular control at the service level over which files are included in the packaging process.

## Understand service packaging ignore files

There are two different types of ignore files you can use to influence the packaging process:

- `.webappignore` influences packaging exclusions for Azure App Service deployments.
- `.funcignore` influences  packaging exclusions for Azure Functions deployments.

Both types of packaging ignore files follow these standards and rules:

- `.webappignore` or `.funcignore` files should be placed in the root folder of the desired service in your `azd` template.
- If a `.webappignore` or `.funcignore` file exists in a service directory, the packaging process follows its rules, allowing granular control over which files are included or excluded in the service's zip archive.
- These ignore files are applied based on the targeted deployment service, ensuring users can independently customize file exclusions while packaging for App Services and Azure Functions.
- If no `.webappignore` or `.funcignore` file is present, default exclusions apply for Python (`__pycache__`, `.venv`) and Node.js (`node_modules`).

## Exclusion examples

In your `azd` template, add a `.webappignore` or `.funcignore` file to the root folder of the service you intend to deploy to Azure App Service or Azure Functions. Update the content of those ignore files to include or exclude files using the following patterns:

# [Node.js](#tab/nodejs)

Exclude a folder or a specific file:

```text
logs/*
testfile.js
```

Include folders or files that are ignored by default using the `!` character:

```text
logs/*
testfile.js
!src/**/node_modules/
```

# [Python](#tab/python)

Exclude a folder or a specific file:

```text
logs/*
testfile.js
```

Include folders or files that are ignored by default using the `!` character:

```text
!src/**/node_modules/
logs/log.txt
testfile.js
```

---
