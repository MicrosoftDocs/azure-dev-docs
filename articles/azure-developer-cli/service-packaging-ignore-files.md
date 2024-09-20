---
title: Resource Group Scoped Deployments
description: How to deploy templates that target resource group scope instead of subscription scope with the Azure Developer CLI (azd)
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/18/2022
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Configure service packaging file inclusions and exclusions

The Azure Developer CLI (`azd`) enables you to specify files and directories that should be excluded from the deployment package for App Service and Function Apps, providing fine-grained control at the service level. In this article, you learn how to configure specialized ignore files to gain more control over the packaging process.

## Understand service packaging ignore files

There are two different types of ignore files you can use to influence the packaging process:

- `.webappignore` influences packaging exclusions for Azure App Service deployments.
- `.funcignore` influences  packaging exclusions for Azure Functions deployments.

Both types of packaging ignore files follow these standards and rules:

- `.webappignore` or `.funcignore` files should be placed in the root folder of the desired service in your `azd` template.
- If a `.webappignore` or `.funcignore` file exists in a service directory, the packaging process follows its rules, allowing granular control over which files are included or excluded in the service's zip archive. These ignore files ensure that users can independently customize file exclusions while packaging for App Services and Azure Functions.
- If no `.webappignore` or `.funcignore` file is present, default exclusions apply for Python (`__pycache__`, `.venv`) and Node.js (`node_modules`).

## Exclusion examples

The following examples demonstrate how to include or excludes files from the packaging process using `.webappignore` or `.funcignore` files.

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
