---
title: Install JavaScript Azure SDK library packages
description: How to install, uninstall, and verify Azure SDK for JavaScript libraries using npm. Includes details on installing specific versions and preview packages.
ms.date: 03/04/2025
ms.topic: install-set-up-deploy
ms.custom: devx-track-js
adobe-target: true
---

# How to install Azure library packages for JavaScript


The Azure SDK for JavaScript is composed of many independently versioned libraries that can be installed in standard JavaScript environments. This modular approach allows you to install only the packages you need and manage them individually for better control over dependencies and updates.

[!INCLUDE [javascript-sdk-libraries](../includes/libraries.md)]

## Prerequisites

- [Node.js LTS](https://nodejs.org/).  
  Learn more about [Node.js compatibility for Azure](../choose-nodejs-version.md).  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/).  
  Ensure that your package manager is up-to-date to avoid installation issues.

If you run into problems while installing packages, refer to our [troubleshooting guide](#troubleshooting).

## Install the latest version of a library

When you install a library without specifying a version, the package manager retrieves the latest version available from the package index.

### [npm](#tab/npm-install)

```cmd
npm install <library>
```

### [yarn](#tab/yarn-install)

```cmd
yarn add <library>
```

---

## Install specific library versions

Sometimes you may need to install a particular version or a preview version of a library for compatibility testing or to gain early access to new features. When you install a specific version, you are **pinning** your dependency, which means that your project will continue using that version and will not automatically receive updates or fixes. While pinning can be useful in certain scenarios, we generally recommend using the latest version whenever possible to benefit from ongoing improvements and security updates.


### [npm](#tab/npm-install-version)

```cmd
npm install <library>@<version-number>
```

### [yarn](#tab/yarn-install-version)

```cmd
yarn add <library>@<version-number>
```

---

## Preview packages

When installing preview packages, look for prerelease tags. These packages provide early access to new features but might not be as stable as general releases. For example:

- `next`: This tag is used for the current beta version of the upcoming release.
- `dev`: This tag is used for the current alpha version of the upcoming release.

## Verify a library installation

After installation, you can verify that the correct version of the library is installed.

### [npm](#tab/npm-list)

```cmd
npm list <library>
```

### [yarn](#tab/yarn-list)

```cmd
yarn list <library>
```

---

## Uninstall a library

### [npm](#tab/npm-uninstall)

```cmd
npm uninstall <library>
```

### [yarn](#tab/yarn-uninstall)

```cmd
yarn remove <library>
```

---

## Troubleshooting

- **Installation errors**: Ensure that Node.js and your package manager (npm or yarn) are up-to-date.
- **Version conflicts**: Check that the version specified is available in the package index.
- **Network issues**: Verify your internet connection and proxy settings if package downloads are slow or failing.

## Additional resources

- Azure SDK Library Index  [Browse available packages](../azure-sdk-library-package-index.md).
- Node.js Compatibility for Azure – [Learn about supported Node.js versions](../choose-nodejs-version.md).
- Troubleshooting [npm](https://docs.npmjs.com/common-errors) and [yarn](https://yarnpkg.com/advanced/error-codes) issues – Common error troubleshooting guidelines.
- [Azure SDK GitHub repository](https://github.com/Azure/azure-sdk-for-js) – For reporting issues and contributing.
