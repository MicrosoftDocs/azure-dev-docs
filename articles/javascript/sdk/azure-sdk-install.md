---
title: Install JavaScript Azure SDK library packages
description: How to install, uninstall, and verify Azure SDK for JavaScript libraries using npm. Includes details on installing specific versions and preview packages.
ms.date: 05/24/2021
ms.topic: conceptual
ms.custom: devx-track-js
adobe-target: true
---

# How to install Azure library packages for JavaScript

The Azure SDK for JavaScript is composed solely of many individual libraries that can be installed in standard JavaScript environments.

Libraries for standard JavaScript environments are listed in the [package index](../azure-sdk-library-package-index.md). Azure packages have names that begin with the `@azure` scope.

With these Azure libraries you can provision and manage resources on Azure services (using the management libraries, whose names begin with `@azure/arm-`) and connect with those resources from app code.

## Install the latest version of a library

# [npm](#tab/npm-install)

```cmd
npm install <library>
```

`npm install` retrieves the latest version of a library in your current JavaScript environment.

You can use any package name listed in the [package index](../azure-sdk-library-package-index.md).

# [yarn](#tab/yarn-install)

```cmd
yarn add <library>
```

`yarn add` retrieves the latest version of a library in your current JavaScript environment.

You can use any package name listed in the [package index](../azure-sdk-library-package-index.md).

---

## Install specific library versions

# [npm](#tab/npm-install-version)


```cmd
npm install <library>@<version-number>
```

You can use any package name listed in the [package index](../azure-sdk-library-package-index.md).

# [yarn](#tab/yarn-install-version)

```cmd
yarn add <library>@<version-number>
```

You can use any package name listed in the [package index](../azure-sdk-library-package-index.md).

---

## Verify a library installation

# [npm](#tab/npm-list)

```cmd
npm list <library>
```

You can use any package name listed in the [package index](../azure-sdk-library-package-index.md).

# [yarn](#tab/yarn-list)

```cmd
yarn list <library>
```

You can use any package name listed in the [package index](../azure-sdk-library-package-index.md).

---

## Uninstall a library

# [npm](#tab/npm-uninstall)

```cmd
npm uninstall <library>
```

You can use any package name listed in the [package index](../azure-sdk-library-package-index.md).

# [yarn](#tab/yarn-uninstall)

```cmd
yarn remove <library>
```

You can use any package name listed in the [package index](../azure-sdk-library-package-index.md).

---
