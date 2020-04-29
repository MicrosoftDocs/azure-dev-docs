---
title: Install Azure SDK for Python libraries
description: How to install, uninstall, and verify Azure SDK or Python libraries using pip. Includes details on installing specific versions and preview packages.
ms.date: 04/29/2020
ms.topic: conceptual
---

# Install Azure SDK for Python libraries

The Azure SDK for Python provides an API through which you can interact with Azure from Python code. The names of all current libraries is on the [Azure SDK for Python index page](https://azure.github.io/azure-sdk/releases/latest/all/python.html).

Libraries whose names begin with `azure-mgmt` are *management* libraries, which you use to provision and manage Azure resources like you would through the [Azure portal](https://portal.azure.com) or by using the [Azure CLI](/cli/azure/install-azure-cli). For example, to provision and manage Azure Storage resources you use the `azure-mgmt-storage` library.

All other libraries in the SDK are *client* libraries that you use from application code to work with already-provisioned resources. For example, to work with Azure Storage blobs from application code you use the `azure-storage-blob` library.

## Install the latest version of a library

Running `pip install` installs the latest version of a library in your current Python environment:

```bash
pip install azure-storage-blob
```

On Linux systems, the SDK doesn't support using `sudo pip install` to install a library for all users. Each user must use `pip install` separately.

## Install specific library versions

If you need to install a specific version of a library, specify the version on the command line:

```bash
pip install azure-storage-blob==12.0.0
```

## Install preview packages

Microsoft regularly releases preview SDK libraries that support upcoming features, with the caveat that the library is subject to change and must not be used in production projects.

To install the latest preview of a library, include the `--pre` flag on the command line.

```bash
pip install --pre azure-storage-blob
```

## Verify a library installation

Use `pip show <library>` to verify that a library is installed. If the library is installed, the command displays version and other summary information, otherwise the command displays nothing.

```bash
pip show azure-storage-blob
```

You can also use `pip freeze` or `pip list` to see all the libraries that are installed in your current Python environment.

## Uninstall a library

To uninstall a library, use `pip uninstall <library>`.

## Next steps

You're completely ready now to write and run some code, which you can do using any of the following examples:

> [!div class="nextstepaction"]
> [Example: Use Azure Storage >>>](azure-sdk-example-storage.md)
