---
title: Install the Azure SDK for Python
description: How to install the Azure python SDK
author: sptramer
ms.author: sttramer
manager: carmonm
ms.date: 06/05/2017
ms.topic: conceptual
ms.devlang: python
ms.custom: seo-python-october2019
---

# Install the Azure SDK for Python

This article helps you install the Azure SDK for Python. You can use pip to install an older version, check you installation, and uninstall the Azure SDK for Python.

## Which Python and which version to use

There are several Python interpreters available - examples include:

* CPython - the standard and most commonly used Python interpreter
* PyPy - fast, compliant alternative implementation to CPython
* IronPython - Python interpreter that runs on .Net/CLR
* Jython - Python interpreter that runs on the Java Virtual Machine

**CPython** v2.7 or v3.4+ and PyPy 5.4.0 are tested and supported for the Python Azure SDK.

## Where to get Python?

There are several ways to get CPython:

* Directly from [Python](https://www.python.org/)
* From a reputable distro such as [Anaconda](https://www.anaconda.com/), [Enthought](https://www.enthought.com/) or [ActiveState](https://www.activestate.com/)
* Build from source!

Unless you have a specific need, we recommend the first two options.

## Installation with pip

You can install each Azure service's library individually:

```bash
pip install azure-batch          # Install the latest Batch runtime library
pip install azure-mgmt-scheduler # Install the latest Storage management library
```

Preview packages can be installed using the `--pre` flag:

```bash
pip install --pre azure-mgmt-compute # will install only the latest Compute Management library
```

You can also install a set of Azure libraries in a single line using the `azure` meta-package.

```bash
pip install azure
```

We publish a preview version of this package, which you can access using the --pre flag:

```bash
pip install --pre azure
```

## Install from GitHub

If you want to install `azure` from source:

```bash
git clone git://github.com/Azure/azure-sdk-for-python.git
cd azure-sdk-for-python
python setup.py install
```

## Install an older version with pip
You can install an older version of `azure` by specifying 'azure==3.0.0' version details.
```bash
pip install azure==3.0.0 
```
## Check SDK installation details with pip
You can check `azure` SDK installation location, version details etc.
```bash
pip show azure # Show installed version, location details etc.
pip freeze     # Output installed packages in requirements format.
pip list       # List installed packages, including editables.
```
## To uninstall with pip
You can uninstall all Azure libraries in a single line using the `azure` meta-package.
```bash
pip uninstall azure 
```
> [!NOTE]
> `pip uninstall azure`removes the `azure` meta-package but leaves the individual `azure-*` packages behind (and others, like `adal` and `msrest` ). An aspect of Python and pip is that for all packages that have dependencies, uninstalling the initial package does not uninstall the dependencies. To remove `azure-` and its supporting packages, run the command `pip freeze | grep 'azure-' | xargs pip uninstall -y` (and then perform individual uninstalls for adal, msrest, and msrestazure).

