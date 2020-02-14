---
title: Install the Azure SDK for Python
description: How to install the Azure SDK for Python using pip or GitHub. The Azure SDK can be installed as individual libraries or as a complete package.
ms.date: 10/31/2019
ms.topic: conceptual
ms.custom: seo-python-october2019
---

# Install the Azure SDK for Python

The Azure SDK for Python provides an API through which you can interact with Azure from Python code. You can install individual libraries from the SDK depending on your needs, or you can install the complete set of libraries together.

The Azure SDK for Python is tested and supported with CPython versions 2.7 and 3.5.3+, and with PyPy 5.4+. Developers also use the SDK with other interpreters such as IronPython and Jython, but you may encounter isolated issues and incompatibilities. If you need a Python interpreter, install the latest version from [python.org/downloads](https://www.python.org/downloads).

## Install SDK libraries using pip

The Azure SDK for Python is composed of a number of individual libraries that each provision or work with specific Azure services. You can install each one using `pip install <library>`. Refer to the [SDK release page](https://azure.github.io/azure-sdk/releases/latest/python.html) for specific instructions and documentation for each library.

For example, if you're using Azure Storage, you might install the `azure-storage-file`, `azure-storage-blob`, or `azure-storage-queue` library. If you're using Azure Cosmos DB tables, install `azure-cosmosdb-table`. Azure Functions is supported through the `azure-functions` library, and so on. Those libraries that begin with `azure-mgmt-` provide you with the API for provisioning Azure resources.

### Install specific library versions

If you need to install a specific version of a library, specify the version on the command line:

```bash
pip install azure-storage-blob==12.0.0
```

> [!NOTE]
> On Linux systems, the SDK doesn't support using `sudo pip install` to install a library for all users. Each user must use `pip install` separately. 

### Install preview packages

Microsoft regularly releases preview SDK libraries that support upcoming features. To install the latest preview of a library, include the `--pre` flag on the command line. 

```bash
# Install all preview versions of the Azure SDK for Python
pip install --pre azure

# Install the preview version for azure-storage-blob only.
pip install --pre azure-storage-blob
```

## Verify SDK installation details with pip

Use the `pip show <library>` command to verify that a library has been installed. If the library is install, the command displays version and other summary information. If the library is not installed, the command displays nothing.

```bash
# Check installation of the Azure SDK for Python
pip show azure

# Check installation of a specific library
pip show azure-storage-blob
```

You can also use `pip freeze` or `pip list` to see all the libraries that are installed in your current Python environment.

## Uninstall Azure SDK for Python libraries

To uninstall an individual library, use `pip uninstall <library>`.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to use the SDK](python-sdk-azure-get-started.yml)
