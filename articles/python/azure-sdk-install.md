---
title: How to install Azure SDK library packages for Python
description: How to install, uninstall, and verify Azure SDK or Python libraries using pip. Includes details on installing specific versions and preview packages.
ms.date: 05/26/2020
ms.topic: conceptual
---

# How to install Azure library packages for Python

The Azure SDK for Python is composed solely of many individual libraries that are listed on the [Azure SDK for Python index page](https://azure.github.io/azure-sdk/releases/latest/all/python.html). You install the specific library packages you need for a project using `pip install`.

With these libraries you can provision and manage resources on Azure services (using the management libraries, which have `-mgmt` in their names) and connect with those resources from app code (using the client libraries).

## Install the latest version of a library

```cmd
pip install azure-storage-blob
```

```cmd
pip install azure-mgmt-storage
```

`pip install` retrieves the latest version of a library in your current Python environment.

On Linux systems, you must install a library for each user separately. Installing libraries for all users with `sudo pip install` isn't supported.

## Install specific library versions

```cmd
pip install azure-storage-blob==12.0.0
```

```cmd
pip install azure-mgmt-storage==10.0.0
```

Specify the desired version on the command line with `pip install`.

## Install preview packages

```cmd
pip install --pre azure-storage-blob
```

```cmd
pip install --pre azure-mgmt-storage
```

To install the latest preview of a library, include the `--pre` flag on the command line.

Microsoft periodically releases preview library packages that support upcoming features, with the caveat that the library is subject to change and must not be used in production projects.

## Verify a library installation

```cmd
pip show azure-storage-blob
```

```cmd
pip show azure-mgmt-storage
```

Use `pip show <library>` to verify that a library is installed. If the library is installed, the command displays version and other summary information, otherwise the command displays nothing.

You can also use `pip freeze` or `pip list` to see all the libraries that are installed in your current Python environment.

## Uninstall a library

```cmd
pip uninstall azure-storage-blob
```

To uninstall a library, use `pip uninstall <library>`.
