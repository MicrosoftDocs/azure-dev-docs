---
title: Install the Azure SDK for Python
description: How to install the Azure SDK for Python using pip or GitHub. The Azure SDK can be installed as individual libraries or as a complete package.
author: kraigb
ms.author: kraigb
manager: barbkess
ms.service: multiple
ms.date: 10/18/2019
ms.topic: conceptual
ms.devlang: python
ms.custom: seo-python-october2019
---

# Install the Azure SDK for Python

The Azure SDK for Python provides an API through which you can interact with Azure from Python code. You can install individual libraries from the SDK depending on your needs, or you can install the complete set of libraries together.

The Azure SDK for Python is tested and supported with CPython versions 2.7 and 3.5.3+, and with PyPy 5.4+. Developers also use the SDK with other interpreters such as IronPython and Jython, but you may encounter isolated issues and incompatibilities. If you need a Python interpreter, install the latest version from [python.org/downloads](https://www.python.org/downloads).

## Install the complete SDK using pip

The Azure SDK for Python is available through pip as a single meta-package, `azure`. Use the following command to install the whole SDK and its dependencies:

```bash
pip install azure
```

Because the Azure SDK meta-package installs many other individual packages and their dependencies, we highly recommend installing the SDK in a virtual environment rather than installing globally. Using a virtual environment makes it easy to uninstall the SDK by deleting the virtual environment.

## Install individual SDK libraries using pip

The Azure SDK for Python is composed of a number of individual libraries that each provision or work with specific Azure services. If you have need for only a specific set of these libraries, you can install them using `pip install <library>` with the names shown in the [SDK library list](https://github.com/Azure/azure-sdk-for-python/blob/master/packages.md). (That list provides links to helpful README files for each library.)

For example, if you're primarily using Azure Storage, you might install only the `azure-storage-file`, `azure-storage-blob`, or `azure-storage-queue` library. If you're using Azure Cosmos DB tables, install `azure-cosmosdb-table`. Azure Functions is supported through the `azure-functions` library, and so on. Those libraries that begin with `azure-mgmt-` provide you with the API for provisioning Azure resources.

### Install specific library versions

If you need to install a specific version of a library, specify the version on the command line:

```bash
pip install azure-storage-blob==1.3
```

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

## Uninstall the Azure SDK for Python

To uninstall an individual library, use `pip uninstall <library>`.

The `pip uninstall azure` command removes only the `azure` meta-package but leaves all other individual Azure SDK packages in place. This behavior avoids problems with down-level dependencies that are installed when installing the meta-package.

To remove all `azure-` libraries and their dependencies, run the command `pip freeze | grep 'azure-' | xargs pip uninstall -y`. You must then use `pip uninstall` with each of the following individual library names unless you are using them elsewhere: `isodate`, `oauthlib`, `requests-oauthlib`, `msrest`, `PyJWT`, `adal`, and `msrestazure`.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to use the SDK](python-sdk-azure-get-started.yml)
